/**
 * Database Seed Script
 * Run: node config/seed.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { Scholarship } = require('../models/Scholarship');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zimbabwe_connect_india';

const scholarships = [
  {
    name: 'ICCR Excellence Scholarship',
    description: 'Indian Council for Cultural Relations scholarship for outstanding Zimbabwean students pursuing undergraduate degrees in India.',
    university: 'Multiple Partner Universities',
    coveragePercentage: 50,
    coverageType: 'tuition_and_accommodation',
    eligibilityCriteria: ['Grade 12 with minimum 70%', 'Age 17-25', 'Zimbabwean citizen', 'No existing scholarship'],
    requiredDocuments: ['Passport', 'Academic transcripts', 'Statement of Purpose', 'Recommendation letters'],
    courses: ['Engineering', 'Medicine', 'Business', 'Arts', 'Sciences'],
    degreeLevel: ['bachelor'],
    availableSlots: 30,
    isFeatured: true,
    isActive: true,
    deadline: new Date('2025-03-31'),
  },
  {
    name: 'Amity University Merit Award',
    description: 'Merit-based scholarship for international students joining Amity University programs in technology and business.',
    university: 'Amity University',
    coveragePercentage: 40,
    coverageType: 'tuition_only',
    eligibilityCriteria: ['Grade 12 with minimum 65%', 'Strong academic record', 'English proficiency'],
    requiredDocuments: ['Passport', 'Transcripts', 'English test scores'],
    courses: ['Computer Science', 'MBA', 'Biotechnology', 'Law'],
    degreeLevel: ['bachelor', 'master'],
    availableSlots: 20,
    isFeatured: true,
    isActive: true,
    deadline: new Date('2025-04-30'),
  },
  {
    name: 'Manipal Global Scholarship',
    description: 'Comprehensive scholarship program for African students at Manipal University covering tuition fees up to 35%.',
    university: 'Manipal University',
    coveragePercentage: 35,
    coverageType: 'tuition_only',
    eligibilityCriteria: ['Minimum 60% in high school', 'Zimbabwean national'],
    requiredDocuments: ['Passport', 'Academic certificates', 'Photo'],
    courses: ['Medicine', 'Dentistry', 'Engineering', 'Pharmacy'],
    degreeLevel: ['bachelor'],
    availableSlots: 15,
    isFeatured: false,
    isActive: true,
    deadline: new Date('2025-05-15'),
  },
  {
    name: 'SRM Africa Scholarship',
    description: 'Special scholarship for African students pursuing postgraduate studies at SRM Institute.',
    university: 'SRM Institute of Science and Technology',
    coveragePercentage: 50,
    coverageType: 'full_scholarship',
    eligibilityCriteria: ["Bachelor's degree with min 60%", 'Strong research background', 'Under 30 years'],
    requiredDocuments: ['Passport', 'Bachelor degree', 'Research proposal', 'References'],
    courses: ['MSc Computer Science', 'MBA', 'MTech', 'PhD Programs'],
    degreeLevel: ['master', 'phd'],
    availableSlots: 10,
    isFeatured: true,
    isActive: true,
    deadline: new Date('2025-06-30'),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Scholarship.deleteMany({});
    await User.deleteMany({ email: { $in: ['admin@zimbabweconnectindia.com', 'student@test.com'] } });

    // Create scholarships
    await Scholarship.insertMany(scholarships);
    console.log(`✅ Created ${scholarships.length} scholarships`);

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'ZCI',
      email: 'admin@zimbabweconnectindia.com',
      password: 'Admin@1234',
      role: 'admin',
      isVerified: true,
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create test student
    const student = await User.create({
      firstName: 'Takudzwa',
      lastName: 'Moyo',
      email: 'student@test.com',
      password: 'Student@1234',
      role: 'student',
      phone: '+263771234567',
      nationality: 'Zimbabwean',
      highSchool: 'Harare High School',
      highSchoolGrade: 'A Level - 3As',
      preferredCourse: 'Computer Science',
      preferredUniversity: 'Amity University',
    });
    console.log(`✅ Test student created: ${student.email}`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Admin credentials:');
    console.log('  Email: admin@zimbabweconnectindia.com');
    console.log('  Password: Admin@1234\n');
    console.log('Student credentials:');
    console.log('  Email: student@test.com');
    console.log('  Password: Student@1234\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
