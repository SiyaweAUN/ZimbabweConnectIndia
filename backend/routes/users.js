/**
 * Users Routes - Student profile management
 */
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

// GET /api/users/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res) => {
  try {
    const allowed = [
      'firstName', 'lastName', 'phone', 'dateOfBirth', 'passportNumber',
      'highSchool', 'highSchoolGrade', 'preferredCourse', 'preferredUniversity', 'englishProficiency',
    ];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
