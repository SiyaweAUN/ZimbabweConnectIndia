/**
 * Application Model
 * Tracks student university applications
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
  },

  // Application Details
  targetUniversity: {
    type: String,
    required: [true, 'Target university is required'],
    trim: true,
  },
  targetCourse: {
    type: String,
    required: [true, 'Target course is required'],
    trim: true,
  },
  targetDegree: {
    type: String,
    enum: ['bachelor', 'master', 'phd', 'diploma', 'certificate'],
    required: true,
  },
  intakeYear: {
    type: Number,
    required: true,
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 3,
  },
  intakeSemester: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter'],
    required: true,
  },

  // Status Tracking
  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'documents_required',
      'shortlisted',
      'interview_scheduled',
      'approved',
      'rejected',
      'waitlisted',
      'enrolled',
    ],
    default: 'draft',
    index: true,
  },

  // Scholarship Status
  scholarshipStatus: {
    type: String,
    enum: ['not_applied', 'applied', 'under_review', 'approved', 'rejected', 'partial'],
    default: 'not_applied',
  },
  scholarshipPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },

  // Application Documents
  documents: {
    passport: { type: String },
    transcripts: { type: String },
    certificates: { type: String },
    photo: { type: String },
    statementOfPurpose: { type: String },
    recommendationLetter: { type: String },
    englishTest: { type: String },
  },

  // Admin Notes
  adminNotes: [{
    note: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
  }],

  // Student Notes
  studentNotes: { type: String, trim: true },

  // Interview
  interviewDate: { type: Date },
  interviewLink: { type: String },

  // Timeline
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  decisionAt: { type: Date },

  // Application Number (human-readable)
  applicationNumber: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Pre-save: generate application number
applicationSchema.pre('save', async function (next) {
  if (this.isNew && !this.applicationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.applicationNumber = `ZCI-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  if (this.isModified('status') && this.status === 'submitted' && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  next();
});

// Virtual: days since submission
applicationSchema.virtual('daysSinceSubmission').get(function () {
  if (!this.submittedAt) return null;
  return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Application', applicationSchema);
