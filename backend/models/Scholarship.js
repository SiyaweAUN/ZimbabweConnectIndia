/**
 * Scholarship Model
 */

const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scholarship name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  university: {
    type: String,
    required: [true, 'University is required'],
    trim: true,
  },
  coveragePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  coverageType: {
    type: String,
    enum: ['tuition_only', 'tuition_and_accommodation', 'full_scholarship', 'partial'],
    required: true,
  },
  eligibilityCriteria: [{
    type: String,
    trim: true,
  }],
  requiredDocuments: [{
    type: String,
    trim: true,
  }],
  courses: [{
    type: String,
    trim: true,
  }],
  degreeLevel: [{
    type: String,
    enum: ['bachelor', 'master', 'phd', 'diploma', 'all'],
  }],
  availableSlots: {
    type: Number,
    default: 0,
  },
  filledSlots: {
    type: Number,
    default: 0,
  },
  deadline: { type: Date },
  startDate: { type: Date },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  applicationCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

scholarshipSchema.virtual('availableSlotCount').get(function () {
  return Math.max(0, this.availableSlots - this.filledSlots);
});

scholarshipSchema.virtual('isExpired').get(function () {
  return this.deadline ? new Date() > this.deadline : false;
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * ContactMessage Model
 */

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    enum: ['general', 'scholarship', 'application', 'visa', 'university', 'other'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
    index: true,
  },
  adminReply: {
    message: { type: String },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    repliedAt: { type: Date },
  },
  ipAddress: { type: String },
}, {
  timestamps: true,
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = { Scholarship, ContactMessage };
