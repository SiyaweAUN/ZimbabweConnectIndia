/**
 * User Model
 * Handles both students and admins
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Never return password in queries
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },

  // Student-specific fields
  dateOfBirth: { type: Date },
  nationality: { type: String, default: 'Zimbabwean' },
  passportNumber: { type: String, trim: true },
  highSchool: { type: String, trim: true },
  highSchoolGrade: { type: String, trim: true },
  preferredCourse: { type: String, trim: true },
  preferredUniversity: { type: String, trim: true },
  englishProficiency: {
    type: String,
    enum: ['native', 'fluent', 'intermediate', 'basic', ''],
    default: '',
  },

  // Documents (file paths)
  documents: {
    passport: { type: String },
    transcripts: { type: String },
    certificates: { type: String },
    photo: { type: String },
    statementOfPurpose: { type: String },
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },

  // Avatar
  avatar: { type: String, default: '' },

  // Timestamps
  lastLogin: { type: Date },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual: applications (reverse populate)
userSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'student',
});

// Pre-save: hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: get public profile (no sensitive fields)
userSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
