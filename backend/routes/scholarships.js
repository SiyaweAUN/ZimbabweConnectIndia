/**
 * Scholarships Routes
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const { Scholarship } = require('../models/Scholarship');

const router = express.Router();

// GET /api/scholarships - Public: list active scholarships
router.get('/', async (req, res) => {
  try {
    const { university, degree, featured } = req.query;
    const filter = { isActive: true };
    if (university) filter.university = new RegExp(university, 'i');
    if (degree) filter.degreeLevel = degree;
    if (featured === 'true') filter.isFeatured = true;

    const scholarships = await Scholarship.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ scholarships, total: scholarships.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scholarships.' });
  }
});

// GET /api/scholarships/:id
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found.' });
    res.json({ scholarship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scholarship.' });
  }
});

module.exports = router;
