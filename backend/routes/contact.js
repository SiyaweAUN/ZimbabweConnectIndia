/**
 * Contact Routes
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { ContactMessage } = require('../models/Scholarship');

const router = express.Router();

// POST /api/contact - Submit contact message
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[\d\s\-()]{7,20}$/)
    .withMessage('Valid phone number required'),
  body('category').optional().isIn(['general', 'scholarship', 'application', 'visa', 'university', 'other']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validation failed', details: errors.array() });
  }

  try {
    const msg = await ContactMessage.create({
      ...req.body,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
      id: msg._id,
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
