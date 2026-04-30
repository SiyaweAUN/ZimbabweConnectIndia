/**
 * Admin Routes
 * Full platform management for admin users
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Application = require('../models/Application');
const { Scholarship, ContactMessage } = require('../models/Scholarship');
const { protect, restrict } = require('../middleware/auth');

const router = express.Router();
router.use(protect, restrict('admin'));

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [
      totalStudents,
      totalApplications,
      pendingApplications,
      approvedApplications,
      totalScholarships,
      unreadMessages,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      Application.countDocuments({ status: 'approved' }),
      Scholarship.countDocuments({ isActive: true }),
      ContactMessage.countDocuments({ status: 'new' }),
      Application.find().sort({ createdAt: -1 }).limit(5)
        .populate('student', 'firstName lastName email'),
    ]);

    res.json({
      stats: {
        totalStudents,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalScholarships,
        unreadMessages,
      },
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ─── APPLICANTS / STUDENTS ────────────────────────────────────────────────────
router.get('/students', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);
    res.json({ students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

router.get('/students/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    const applications = await Application.find({ student: req.params.id })
      .populate('scholarship', 'name coveragePercentage');
    res.json({ student, applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
});

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
router.get('/applications', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let applications = Application.find(filter)
      .populate('student', 'firstName lastName email phone')
      .populate('scholarship', 'name coveragePercentage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const [results, total] = await Promise.all([
      applications,
      Application.countDocuments(filter),
    ]);

    res.json({ applications: results, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// Update application status
router.patch('/applications/:id/status', [
  body('status').isIn([
    'draft', 'submitted', 'under_review', 'documents_required',
    'shortlisted', 'interview_scheduled', 'approved', 'rejected', 'waitlisted', 'enrolled',
  ]).withMessage('Invalid status'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: 'Invalid status', details: errors.array() });

  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    application.status = req.body.status;
    if (req.body.note) {
      application.adminNotes.push({ note: req.body.note, addedBy: req.user._id });
    }
    if (req.body.scholarshipPercentage !== undefined) {
      application.scholarshipPercentage = req.body.scholarshipPercentage;
      application.scholarshipStatus = req.body.scholarshipStatus || application.scholarshipStatus;
    }
    application.decisionAt = new Date();
    await application.save();

    res.json({ message: 'Application status updated.', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

// ─── SCHOLARSHIPS ─────────────────────────────────────────────────────────────
router.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json({ scholarships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scholarships.' });
  }
});

router.post('/scholarships', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('university').trim().notEmpty().withMessage('University required'),
  body('coveragePercentage').isInt({ min: 0, max: 100 }).withMessage('Coverage 0-100'),
  body('coverageType').isIn(['tuition_only', 'tuition_and_accommodation', 'full_scholarship', 'partial']),
  body('description').trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: 'Validation failed', details: errors.array() });

  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ message: 'Scholarship created.', scholarship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create scholarship.' });
  }
});

router.put('/scholarships/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found.' });
    res.json({ message: 'Scholarship updated.', scholarship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update scholarship.' });
  }
});

router.delete('/scholarships/:id', async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scholarship deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete scholarship.' });
  }
});

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
router.get('/messages', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);

    res.json({ messages, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

router.patch('/messages/:id/reply', [
  body('replyMessage').trim().notEmpty().withMessage('Reply message required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: 'Validation failed', details: errors.array() });

  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, {
      status: 'replied',
      adminReply: {
        message: req.body.replyMessage,
        repliedBy: req.user._id,
        repliedAt: new Date(),
      },
    }, { new: true });

    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Reply saved.', contactMessage: msg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save reply.' });
  }
});

router.patch('/messages/:id/status', async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: 'Status updated.', contactMessage: msg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

module.exports = router;
