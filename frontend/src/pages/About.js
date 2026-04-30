// src/pages/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Users, Globe, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

const team = [
  { name: 'Dr. Chipo Ndlovu', role: 'Founder & Director', emoji: '👩🏿‍💼', location: 'Harare, ZW' },
  { name: 'Rajesh Kumar', role: 'India Operations', emoji: '👨🏽‍💼', location: 'New Delhi, IN' },
  { name: 'Tatenda Moyo', role: 'Student Advisor', emoji: '👩🏿‍🎓', location: 'Harare, ZW' },
  { name: 'Priya Sharma', role: 'University Liaison', emoji: '👩🏽‍💼', location: 'Mumbai, IN' },
];

const process = [
  { step: 1, title: 'Online Registration', desc: 'Create your free student account and fill out your academic background.', icon: '📝' },
  { step: 2, title: 'Profile Assessment', desc: 'Our advisors review your profile and recommend suitable universities and scholarships.', icon: '🔍' },
  { step: 3, title: 'University Matching', desc: 'We match you with partner universities based on your goals and eligibility.', icon: '🎯' },
  { step: 4, title: 'Application Support', desc: 'Get guided through the application process with document preparation help.', icon: '📋' },
  { step: 5, title: 'Scholarship Application', desc: 'We help you apply for available scholarships to minimize tuition costs.', icon: '💰' },
  { step: 6, title: 'Visa & Travel', desc: 'Complete visa guidance, pre-departure orientation, and arrival support in India.', icon: '✈️' },
];

const partners = [
  { name: 'Amity University', location: 'Noida, UP', programs: '300+ Programs', emoji: '🏛️' },
  { name: 'Manipal University', location: 'Manipal, Karnataka', programs: '250+ Programs', emoji: '🎓' },
  { name: 'SRM Institute', location: 'Chennai, Tamil Nadu', programs: '200+ Programs', emoji: '🔬' },
  { name: 'VIT University', location: 'Vellore, Tamil Nadu', programs: '180+ Programs', emoji: '⚡' },
  { name: 'Symbiosis International', location: 'Pune, Maharashtra', programs: '150+ Programs', emoji: '📚' },
  { name: 'Lovely Professional University', location: 'Phagwara, Punjab', programs: '400+ Programs', emoji: '🌟' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold mb-4 tracking-wider uppercase">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Connecting Zimbabwe to the World Through Education
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            ZimbabweConnectIndia was founded with a single mission: make quality higher education in India accessible to every Zimbabwean student, regardless of financial background.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { Icon: Target, title: 'Our Mission', color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30', desc: 'To be the premier bridge between Zimbabwean students and Indian universities, offering guidance, scholarships, and full support through every step of the journey.' },
              { Icon: Heart, title: 'Our Values', color: 'text-red-500 bg-red-50 dark:bg-red-900/30', desc: 'Integrity, accessibility, and student success drive everything we do. We believe education should not be limited by geography or financial resources.' },
              { Icon: Globe, title: 'Our Vision', color: 'text-accent-500 bg-accent-50 dark:bg-accent-900/30', desc: 'A world where every talented Zimbabwean student can access a world-class education and return to build a better Zimbabwe.' },
            ].map(({ Icon, title, color, desc }) => (
              <div key={title} className="card p-8">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Application Process</h2>
            <p className="section-subtitle mx-auto text-center">From registration to enrollment — here's how we guide you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map(({ step, title, desc, icon }) => (
              <div key={step} className="card p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl opacity-10 font-bold text-gray-900 dark:text-white font-mono">
                  {String(step).padStart(2, '0')}
                </div>
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Universities */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Partner Universities</h2>
            <p className="section-subtitle mx-auto text-center">Accredited, globally-recognized Indian universities ready to welcome Zimbabwean students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map(({ name, location, programs, emoji }) => (
              <div key={name} className="card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="text-3xl">{emoji}</div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{location}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium">{programs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle mx-auto text-center">Dedicated professionals on both sides of the world, working for your success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, emoji, location }) => (
              <div key={name} className="card p-6 text-center">
                <div className="text-5xl mb-3">{emoji}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{name}</h4>
                <p className="text-xs text-brand-500 mt-0.5 font-medium">{role}</p>
                <p className="text-xs text-gray-400 mt-1">{location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Begin?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Your dream university in India is just an application away.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-4">
            Start Your Application <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
