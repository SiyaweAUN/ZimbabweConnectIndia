// src/pages/Home.js
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, Star, Users, BookOpen,
  Award, Globe, CheckCircle, ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import { useState } from 'react';

const stats = [
  { icon: Users, value: '500+', label: 'Students Placed', color: 'text-brand-500' },
  { icon: GraduationCap, value: '20+', label: 'Partner Universities', color: 'text-accent-500' },
  { icon: Award, value: '75%', label: 'Max Scholarship', color: 'text-yellow-500' },
  { icon: Globe, value: '5+', label: 'Years Experience', color: 'text-blue-500' },
];

const benefits = [
  {
    icon: '🎓',
    title: 'World-Class Education',
    desc: 'Access top-ranked Indian universities recognized globally with cutting-edge curricula and research facilities.',
  },
  {
    icon: '💰',
    title: 'Up to 75% Scholarships',
    desc: 'Our exclusive partnerships unlock merit-based scholarships that dramatically reduce your tuition costs.',
  },
  {
    icon: '🌐',
    title: 'Cultural Diversity',
    desc: 'India\'s rich culture and diverse student community creates a transformative international study experience.',
  },
  {
    icon: '📈',
    title: 'Career Prospects',
    desc: 'Graduates from Indian universities are highly sought by multinational companies across Africa and Asia.',
  },
  {
    icon: '🏠',
    title: 'Affordable Living',
    desc: 'India\'s cost of living makes it one of the most affordable international study destinations in the world.',
  },
  {
    icon: '🤝',
    title: 'Full Support',
    desc: 'From application to arrival — visa guidance, accommodation support, and on-ground assistance included.',
  },
];

const universities = [
  { name: 'Amity University', logo: '🏛️', location: 'Noida', rank: '#1 Private' },
  { name: 'Manipal University', logo: '🎓', location: 'Manipal', rank: 'Top 10' },
  { name: 'SRM Institute', logo: '🔬', location: 'Chennai', rank: 'Top 15' },
  { name: 'VIT University', logo: '⚡', location: 'Vellore', rank: 'Top 20' },
  { name: 'Symbiosis', logo: '📚', location: 'Pune', rank: 'Top 25' },
  { name: 'Lovely Professional', logo: '🌟', location: 'Punjab', rank: 'Top 30' },
];

const steps = [
  { n: '01', title: 'Register Online', desc: 'Create your free account and fill in your academic profile.' },
  { n: '02', title: 'Choose University', desc: 'Browse partner universities and select your preferred program.' },
  { n: '03', title: 'Apply for Scholarship', desc: 'Submit your scholarship application with our guided support.' },
  { n: '04', title: 'Get Admitted', desc: 'Receive your offer letter and prepare for your India journey!' },
];

export default function Home() {
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    api.get('/scholarships?featured=true').then(r => setFeaturedScholarships(r.data.scholarships?.slice(0, 3) || [])).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />

        {/* Flag strips at top */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-zim-green" />
          <div className="flex-1 bg-zim-yellow" />
          <div className="flex-1 bg-zim-red" />
          <div className="flex-1 bg-india-saffron" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-india-green" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" />
              🇿🇼 Zimbabwe × India 🇮🇳 Education Bridge
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up animation-delay-100">
              Study in India with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-400">
                Up to 75%
              </span>{' '}
              Scholarship
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-8 animate-fade-up animation-delay-200 max-w-xl">
              ZimbabweConnectIndia opens doors to premier Indian universities for Zimbabwean students — with exclusive scholarship access, end-to-end support, and a pathway to a global career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-lg shadow-brand-500/25">
                Apply for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/scholarships" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all">
                View Scholarships <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Micro trust signals */}
            <div className="flex flex-wrap items-center gap-4 mt-8 animate-fade-up animation-delay-400">
              {['Free to apply', 'Expert guidance', 'Fast processing'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-accent-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stats card */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up animation-delay-200">
            {stats.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="card bg-gray-800/60 dark:bg-gray-800/60 border-gray-700/50 p-6 text-center hover:-translate-y-1 transition-transform">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                <p className="font-display font-bold text-3xl text-white mb-1">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-white dark:fill-gray-950">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS (mobile) ──────────────────────────────────────────────────── */}
      <section className="lg:hidden py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-4">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="card p-5 text-center">
              <Icon className={`w-7 h-7 mx-auto mb-2 ${color}`} />
              <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-3">Why India?</span>
            <h2 className="section-title">Benefits of Studying in India</h2>
            <p className="section-subtitle mx-auto text-center">
              India is home to 900+ universities and offers an unmatched combination of quality, affordability, and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon, title, desc }, i) => (
              <div key={title} className="card p-6 hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto text-center">
              Four simple steps to begin your Indian education journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="card p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold font-mono mx-auto mb-4 shadow-md shadow-brand-500/30">
                    {n}
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER UNIVERSITIES ────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Partner Universities</h2>
            <p className="section-subtitle mx-auto text-center">Exclusive partnerships with India's leading institutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.map(({ name, logo, location, rank }) => (
              <div key={name} className="card p-4 text-center hover:-translate-y-1 transition-transform cursor-default">
                <div className="text-3xl mb-2">{logo}</div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{location}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">{rank}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 text-brand-200 mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of Zimbabwean students already studying in India. Registration is free and takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-brand-600 hover:bg-brand-50 transition-colors shadow-lg">
              Register Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
