/**
 * Applications Routes
 * Student application management
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const { protect, restrict } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─── GET /api/applications ─── List student's own applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('scholarship', 'name coveragePercentage university')
      .sort({ createdAt: -1 });

    res.json({ applications, total: applications.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// ─── POST /api/applications ─── Create new application
router.post('/', [
  body('targetUniversity').trim().notEmpty().withMessage('University is required'),
  body('targetCourse').trim().notEmpty().withMessage('Course is required'),
  body('targetDegree').isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
    .withMessage('Valid degree level required'),
  body('intakeYear').isInt({ min: new Date().getFullYear() }).withMessage('Valid intake year required'),
  body('intakeSemester').isIn(['spring', 'summer', 'fall', 'winter']).withMessage('Valid semester required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validation failed', details: errors.array() });
  }

  try {
    // Check for duplicate pending application
    const existing = await Application.findOne({
      student: req.user._id,
      targetUniversity: req.body.targetUniversity,
      targetCourse: req.body.targetCourse,
      status: { $in: ['draft', 'submitted', 'under_review'] },
    });

    if (existing) {
      return res.status(409).json({
        error: 'You already have an active application for this university and course.',
      });
    }

    const application = await Application.create({
      student: req.user._id,
      ...req.body,
    });

    res.status(201).json({ message: 'Application created.', application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application.' });
  }
});

// ─── GET /api/applications/:id ─── Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      ...(req.user.role !== 'admin' && { student: req.user._id }),
    }).populate('scholarship').populate('student', 'firstName lastName email phone');

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    res.json({ application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application.' });
  }
});

// ─── PUT /api/applications/:id ─── Update application (student, only if draft)
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!application) return res.status(404).json({ error: 'Application not found.' });
    if (!['draft', 'documents_required'].includes(application.status)) {
      return res.status(400).json({ error: 'Cannot edit application in current status.' });
    }

    const allowedUpdates = [
      'targetUniversity', 'targetCourse', 'targetDegree',
      'intakeYear', 'intakeSemester', 'studentNotes', 'scholarship',
    ];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) application[field] = req.body[field];
    });

    await application.save();
    res.json({ message: 'Application updated.', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

// ─── POST /api/applications/:id/submit ─── Submit application
router.post('/:id/submit', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!application) return res.status(404).json({ error: 'Application not found.' });
    if (application.status !== 'draft') {
      return res.status(400).json({ error: 'Application already submitted.' });
    }

    application.status = 'submitted';
    application.submittedAt = new Date();
    await application.save();

    res.json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// ─── DELETE /api/applications/:id ─── Delete draft application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: 'draft',
    });

    if (!application) {
      return res.status(404).json({ error: 'Draft application not found.' });
    }

    await application.deleteOne();
    res.json({ message: 'Application deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application.' });
  }
});

module.exports = router;
