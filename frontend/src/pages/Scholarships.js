// src/pages/Scholarships.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Award, Search, Filter, Loader2, Calendar,
  Users, BookOpen, ChevronRight, Star, ArrowRight
} from 'lucide-react';

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    api.get('/scholarships')
      .then(r => {
        setScholarships(r.data.scholarships || []);
        setFiltered(r.data.scholarships || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...scholarships];
    if (search) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.university.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (degreeFilter) {
      result = result.filter(s => s.degreeLevel?.includes(degreeFilter) || s.degreeLevel?.includes('all'));
    }
    if (sortBy === 'featured') result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    if (sortBy === 'coverage') result.sort((a, b) => b.coveragePercentage - a.coveragePercentage);
    if (sortBy === 'deadline') result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setFiltered(result);
  }, [search, degreeFilter, sortBy, scholarships]);

  const coverageLabel = {
    tuition_only: 'Tuition Only',
    tuition_and_accommodation: 'Tuition + Accommodation',
    full_scholarship: 'Full Scholarship',
    partial: 'Partial',
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30 mx-auto mb-5">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Scholarship Opportunities
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Exclusive merit-based scholarships for Zimbabwean students — covering up to 50% of tuition fees at India's best universities.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {[
              { label: `${scholarships.length} Scholarships`, icon: '🎓' },
              { label: 'Up to 50% Coverage', icon: '💰' },
              { label: '20+ Universities', icon: '🏛️' },
            ].map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-field pl-10 text-sm"
                placeholder="Search by name, university, or course..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input-field w-auto text-sm" value={degreeFilter} onChange={e => setDegreeFilter(e.target.value)}>
              <option value="">All Degree Levels</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
              <option value="diploma">Diploma</option>
            </select>
            <select className="input-field w-auto text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured First</option>
              <option value="coverage">Highest Coverage</option>
              <option value="deadline">Earliest Deadline</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {loading ? 'Loading...' : `${filtered.length} scholarship${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No scholarships match your search.</p>
              <button onClick={() => { setSearch(''); setDegreeFilter(''); }} className="btn-secondary mt-4 text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
                <div key={s._id} className={`card p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 ${s.isFeatured ? 'ring-2 ring-brand-500/30' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      {s.isFeatured && (
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold mb-1.5">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </div>
                      )}
                      <h3 className="font-display font-semibold text-gray-900 dark:text-white leading-tight">{s.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.university}</p>
                    </div>
                    {/* Coverage badge */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex flex-col items-center justify-center shadow-lg shadow-brand-500/20">
                      <span className="text-white font-bold text-xl leading-none">{s.coveragePercentage}%</span>
                      <span className="text-brand-100 text-xs leading-none mt-0.5">off</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                    {s.description.length > 120 ? s.description.slice(0, 120) + '…' : s.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      {coverageLabel[s.coverageType] || s.coverageType}
                    </div>
                    {s.degreeLevel?.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Award className="w-3.5 h-3.5 flex-shrink-0" />
                        {s.degreeLevel.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                      </div>
                    )}
                    {s.availableSlots > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="w-3.5 h-3.5 flex-shrink-0" />
                        {s.availableSlots - (s.filledSlots || 0)} slots remaining
                      </div>
                    )}
                    {s.deadline && (
                      <div className={`flex items-center gap-2 text-xs font-medium ${new Date(s.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        Deadline: {new Date(s.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Eligibility Pills */}
                  {s.eligibilityCriteria?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {s.eligibilityCriteria.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
                          {c}
                        </span>
                      ))}
                      {s.eligibilityCriteria.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">
                          +{s.eligibilityCriteria.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <Link to="/register" className="btn-primary text-sm py-2.5 justify-center mt-auto">
                    Apply for Scholarship <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Not Sure Which Scholarship Fits You?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Register for a free consultation and our advisors will match you with the best scholarships for your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3.5">
              Get Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-secondary px-8 py-3.5">
              Contact an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
