// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  User, FileText, Award, Bell, Edit3, Save, X,
  Plus, ChevronRight, Clock, CheckCircle, XCircle,
  AlertCircle, Loader2, GraduationCap, BookOpen, BarChart2
} from 'lucide-react';

const statusConfig = {
  draft:              { label: 'Draft',              color: 'status-draft',               icon: FileText },
  submitted:          { label: 'Submitted',           color: 'status-submitted',           icon: Clock },
  under_review:       { label: 'Under Review',        color: 'status-under_review',        icon: AlertCircle },
  documents_required: { label: 'Docs Required',       color: 'status-documents_required',  icon: AlertCircle },
  shortlisted:        { label: 'Shortlisted',         color: 'status-shortlisted',         icon: CheckCircle },
  approved:           { label: 'Approved',            color: 'status-approved',            icon: CheckCircle },
  rejected:           { label: 'Rejected',            color: 'status-rejected',            icon: XCircle },
  waitlisted:         { label: 'Waitlisted',          color: 'status-waitlisted',          icon: Clock },
  enrolled:           { label: 'Enrolled',            color: 'status-enrolled',            icon: GraduationCap },
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'scholarships', label: 'Scholarships', icon: Award },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      highSchool: user?.highSchool,
      highSchoolGrade: user?.highSchoolGrade,
      preferredCourse: user?.preferredCourse,
      preferredUniversity: user?.preferredUniversity,
      englishProficiency: user?.englishProficiency,
    },
  });

  const { register: appReg, handleSubmit: appSubmit, reset: appReset, formState: { errors: appErrors } } = useForm();

  const loadData = useCallback(async () => {
    setLoadingApps(true);
    try {
      const [appsRes, scholRes] = await Promise.all([
        api.get('/applications'),
        api.get('/scholarships'),
      ]);
      setApplications(appsRes.data.applications || []);
      setScholarships(scholRes.data.scholarships || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', data);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditingProfile(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const createApplication = async (data) => {
    setSubmittingApp(true);
    try {
      await api.post('/applications', { ...data, intakeYear: Number(data.intakeYear) });
      toast.success('Application created!');
      setShowNewAppForm(false);
      appReset();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create application');
    } finally {
      setSubmittingApp(false);
    }
  };

  const submitApplication = async (appId) => {
    try {
      await api.post(`/applications/${appId}/submit`);
      toast.success('Application submitted!');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit');
    }
  };

  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const pendingCount = applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand-500/20">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email} · Student Dashboard</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === id
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
                { label: 'Approved', value: approvedCount, icon: CheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
                { label: 'Scholarships Available', value: scholarships.length, icon: Award, color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/20' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
                <button onClick={() => setActiveTab('applications')} className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {loadingApps ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
              ) : applications.length === 0 ? (
                <div className="text-center py-10">
                  <GraduationCap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No applications yet</p>
                  <button onClick={() => setActiveTab('applications')} className="btn-primary mt-4 text-sm py-2.5">
                    <Plus className="w-4 h-4" /> Start Application
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map(app => {
                    const cfg = statusConfig[app.status] || statusConfig.draft;
                    return (
                      <div key={app._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{app.targetUniversity}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{app.targetCourse} · {app.applicationNumber}</p>
                        </div>
                        <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile completeness */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Profile Completeness</h3>
              {(() => {
                const fields = [user?.phone, user?.highSchool, user?.highSchoolGrade, user?.preferredCourse, user?.preferredUniversity];
                const filled = fields.filter(Boolean).length;
                const pct = Math.round((filled / fields.length) * 100);
                return (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Profile strength</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    {pct < 100 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Complete your profile to strengthen your applications.{' '}
                        <button onClick={() => setActiveTab('profile')} className="text-brand-600 dark:text-brand-400 hover:underline">Update now</button>
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === 'profile' && (
          <div className="card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="btn-secondary text-sm py-2 px-4">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingProfile(false); reset(); }} className="btn-outline text-sm py-2 px-4">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSubmit(saveProfile)} disabled={savingProfile} className="btn-primary text-sm py-2 px-4">
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input className="input-field" disabled={!editingProfile}
                    {...register('firstName', { required: true })} />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input-field" disabled={!editingProfile}
                    {...register('lastName', { required: true })} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input-field opacity-60" value={user?.email} disabled readOnly />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input-field" disabled={!editingProfile} placeholder="+263 78 906 0918" {...register('phone')} />
              </div>
              <div>
                <label className="label">High School</label>
                <input className="input-field" disabled={!editingProfile} placeholder="e.g. Harare High School" {...register('highSchool')} />
              </div>
              <div>
                <label className="label">High School Grade / Results</label>
                <input className="input-field" disabled={!editingProfile} placeholder="e.g. A Level - 3As 2Bs" {...register('highSchoolGrade')} />
              </div>
              <div>
                <label className="label">Preferred Course</label>
                <input className="input-field" disabled={!editingProfile} placeholder="e.g. Computer Science" {...register('preferredCourse')} />
              </div>
              <div>
                <label className="label">Preferred University</label>
                <input className="input-field" disabled={!editingProfile} placeholder="e.g. Amity University" {...register('preferredUniversity')} />
              </div>
              <div>
                <label className="label">English Proficiency</label>
                <select className="input-field" disabled={!editingProfile} {...register('englishProficiency')}>
                  <option value="">Select level</option>
                  <option value="native">Native</option>
                  <option value="fluent">Fluent</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
            </form>
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">My Applications</h2>
              <button onClick={() => setShowNewAppForm(true)} className="btn-primary text-sm py-2.5">
                <Plus className="w-4 h-4" /> New Application
              </button>
            </div>

            {/* New Application Form */}
            {showNewAppForm && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white">New Application</h3>
                  <button onClick={() => setShowNewAppForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <form onSubmit={appSubmit(createApplication)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Target University *</label>
                    <input className="input-field" placeholder="e.g. Amity University"
                      {...appReg('targetUniversity', { required: 'Required' })} />
                    {appErrors.targetUniversity && <p className="text-xs text-red-500 mt-1">{appErrors.targetUniversity.message}</p>}
                  </div>
                  <div>
                    <label className="label">Target Course *</label>
                    <input className="input-field" placeholder="e.g. Computer Science"
                      {...appReg('targetCourse', { required: 'Required' })} />
                    {appErrors.targetCourse && <p className="text-xs text-red-500 mt-1">{appErrors.targetCourse.message}</p>}
                  </div>
                  <div>
                    <label className="label">Degree Level *</label>
                    <select className="input-field" {...appReg('targetDegree', { required: 'Required' })}>
                      <option value="">Select</option>
                      <option value="bachelor">Bachelor's</option>
                      <option value="master">Master's</option>
                      <option value="phd">PhD</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Intake Year *</label>
                    <select className="input-field" {...appReg('intakeYear', { required: 'Required' })}>
                      <option value="">Select</option>
                      {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Semester *</label>
                    <select className="input-field" {...appReg('intakeSemester', { required: 'Required' })}>
                      <option value="">Select</option>
                      <option value="spring">Spring</option>
                      <option value="fall">Fall</option>
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Notes (optional)</label>
                    <input className="input-field" placeholder="Any additional info..." {...appReg('studentNotes')} />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowNewAppForm(false)} className="btn-outline text-sm">Cancel</button>
                    <button type="submit" disabled={submittingApp} className="btn-primary text-sm">
                      {submittingApp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Application List */}
            {loadingApps ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
            ) : applications.length === 0 ? (
              <div className="card p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No applications yet. Start your first application!</p>
              </div>
            ) : (
              applications.map(app => {
                const cfg = statusConfig[app.status] || statusConfig.draft;
                const Icon = cfg.icon;
                return (
                  <div key={app._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{app.targetUniversity}</h3>
                          <span className={`badge ${cfg.color}`}><Icon className="w-3 h-3 mr-1" />{cfg.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {app.targetCourse} · {app.targetDegree} · {app.intakeSemester} {app.intakeYear}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">#{app.applicationNumber}</p>
                        {app.scholarshipPercentage > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                            <Award className="w-3 h-3" /> {app.scholarshipPercentage}% Scholarship
                          </div>
                        )}
                      </div>
                      {app.status === 'draft' && (
                        <button onClick={() => submitApplication(app._id)} className="btn-primary text-xs py-2 px-3 flex-shrink-0">
                          Submit
                        </button>
                      )}
                    </div>
                    {app.adminNotes?.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium text-xs mb-1">Latest note from advisor:</p>
                        {app.adminNotes[app.adminNotes.length - 1].note}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── SCHOLARSHIPS ── */}
        {activeTab === 'scholarships' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Available Scholarships</h2>
            {scholarships.length === 0 ? (
              <div className="card p-12 text-center">
                <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No scholarships available right now</p>
              </div>
            ) : (
              scholarships.map(s => (
                <div key={s._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                        {s.isFeatured && <span className="badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">⭐ Featured</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{s.university}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{s.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          💰 {s.coveragePercentage}% Coverage
                        </span>
                        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          {s.coverageType?.replace(/_/g, ' ')}
                        </span>
                        {s.deadline && (
                          <span className="badge bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            Deadline: {new Date(s.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <span className="text-white font-bold text-lg">{s.coveragePercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
