// src/pages/AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Users, FileText, Award, MessageSquare, BarChart2,
  Check, X, Eye, RefreshCw, Loader2, ChevronDown,
  AlertCircle, Search, Plus, Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const statusOptions = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'documents_required', label: 'Documents Required' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'enrolled', label: 'Enrolled' },
];

const statusColors = {
  draft: 'status-draft', submitted: 'status-submitted', under_review: 'status-under_review',
  approved: 'status-approved', rejected: 'status-rejected', shortlisted: 'status-shortlisted',
  enrolled: 'status-enrolled', waitlisted: 'status-waitlisted', documents_required: 'status-documents_required',
};

const adminTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'scholarships', label: 'Scholarships', icon: Award },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);

  const { register: scholReg, handleSubmit: scholSubmit, reset: scholReset } = useForm();

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch { toast.error('Failed to load stats'); }
  }, []);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/admin/applications?${params}`);
      setApplications(res.data.applications || []);
    } catch { toast.error('Failed to load applications'); } finally { setLoading(false); }
  }, [statusFilter]);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students?search=${search}`);
      setStudents(res.data.students || []);
    } catch { } finally { setLoading(false); }
  }, [search]);

  const loadScholarships = useCallback(async () => {
    try {
      const res = await api.get('/admin/scholarships');
      setScholarships(res.data.scholarships || []);
    } catch { }
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data.messages || []);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'students') loadStudents();
    if (activeTab === 'scholarships') loadScholarships();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab, loadApplications, loadStudents, loadScholarships, loadMessages]);

  const updateAppStatus = async (appId, status, note = '') => {
    setUpdatingStatus(appId);
    try {
      await api.patch(`/admin/applications/${appId}/status`, { status, note });
      toast.success('Status updated!');
      loadApplications();
      loadStats();
      setSelectedApp(null);
    } catch { toast.error('Failed to update'); } finally { setUpdatingStatus(null); }
  };

  const markMessageRead = async (id) => {
    try {
      await api.patch(`/admin/messages/${id}/status`, { status: 'read' });
      loadMessages();
    } catch { }
  };

  const createScholarship = async (data) => {
    try {
      await api.post('/admin/scholarships', {
        ...data,
        coveragePercentage: Number(data.coveragePercentage),
        availableSlots: Number(data.availableSlots || 0),
        eligibilityCriteria: data.eligibilityCriteria?.split('\n').filter(Boolean) || [],
        courses: data.courses?.split(',').map(s => s.trim()).filter(Boolean) || [],
      });
      toast.success('Scholarship created!');
      setShowScholarshipForm(false);
      scholReset();
      loadScholarships();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create'); }
  };

  const deleteScholarship = async (id) => {
    if (!window.confirm('Delete this scholarship?')) return;
    try {
      await api.delete(`/admin/scholarships/${id}`);
      toast.success('Deleted');
      loadScholarships();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">ZimbabweConnectIndia Management</p>
            </div>
          </div>
          <div className="flex gap-1 mt-5 overflow-x-auto">
            {adminTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === id ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                <Icon className="w-4 h-4" /> {label}
                {id === 'messages' && stats?.stats?.unreadMessages > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {stats.stats.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats && [
                { label: 'Students', value: stats.stats.totalStudents, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Applications', value: stats.stats.totalApplications, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
                { label: 'Pending', value: stats.stats.pendingApplications, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                { label: 'Approved', value: stats.stats.approvedApplications, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                { label: 'Scholarships', value: stats.stats.totalScholarships, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { label: 'New Messages', value: stats.stats.unreadMessages, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="card p-4 text-center">
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h3>
              {stats?.recentApplications?.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {stats?.recentApplications?.map(app => (
                    <div key={app._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {app.student?.firstName} {app.student?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{app.student?.email} · {app.applicationNumber}</p>
                      </div>
                      <span className={`badge ${statusColors[app.status] || 'status-draft'}`}>
                        {app.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white flex-1">Applications</h2>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="input-field w-auto text-sm py-2">
                <option value="">All Status</option>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={loadApplications} className="btn-outline text-sm py-2">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {app.student?.firstName} {app.student?.lastName}
                          </p>
                          <span className={`badge ${statusColors[app.status] || 'status-draft'}`}>
                            {app.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{app.student?.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {app.targetUniversity} · {app.targetCourse} · {app.targetDegree}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">#{app.applicationNumber} · {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                          className="btn-outline text-xs py-1.5 px-3">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline status update */}
                    {selectedApp?._id === app._id && (
                      <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map(opt => (
                            <button key={opt.value}
                              disabled={updatingStatus === app._id || app.status === opt.value}
                              onClick={() => updateAppStatus(app._id, opt.value)}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                                app.status === opt.value
                                  ? 'bg-brand-500 text-white border-brand-500'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              } disabled:opacity-50`}>
                              {updatingStatus === app._id ? '...' : opt.label}
                            </button>
                          ))}
                        </div>
                        {app.adminNotes?.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <p className="font-medium mb-1">Admin Notes:</p>
                            {app.adminNotes.map((n, i) => (
                              <p key={i} className="bg-white dark:bg-gray-900 rounded p-2 mb-1">{n.note}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="card p-12 text-center text-gray-500">No applications found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white flex-1">Students</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="input-field pl-9 text-sm py-2 w-48" placeholder="Search..."
                  value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadStudents()} />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {['Student', 'Email', 'Phone', 'Preferred Course', 'Joined'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {students.map(s => (
                        <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                                {s.firstName?.[0]}{s.lastName?.[0]}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{s.firstName} {s.lastName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{s.email}</td>
                          <td className="px-4 py-3 text-gray-500">{s.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{s.preferredCourse || '—'}</td>
                          <td className="px-4 py-3 text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No students found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Scholarships</h2>
              <button onClick={() => setShowScholarshipForm(f => !f)} className="btn-primary text-sm py-2.5">
                <Plus className="w-4 h-4" /> Add Scholarship
              </button>
            </div>

            {showScholarshipForm && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-5">New Scholarship</h3>
                <form onSubmit={scholSubmit(createScholarship)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input className="input-field" {...scholReg('name', { required: true })} placeholder="Scholarship name" />
                  </div>
                  <div>
                    <label className="label">University *</label>
                    <input className="input-field" {...scholReg('university', { required: true })} placeholder="University name" />
                  </div>
                  <div>
                    <label className="label">Coverage % *</label>
                    <input className="input-field" type="number" min="0" max="100" {...scholReg('coveragePercentage', { required: true })} placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label className="label">Coverage Type *</label>
                    <select className="input-field" {...scholReg('coverageType', { required: true })}>
                      <option value="">Select</option>
                      <option value="tuition_only">Tuition Only</option>
                      <option value="tuition_and_accommodation">Tuition + Accommodation</option>
                      <option value="full_scholarship">Full Scholarship</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Description *</label>
                    <textarea className="input-field" rows="2" {...scholReg('description', { required: true })} placeholder="Scholarship description..." />
                  </div>
                  <div>
                    <label className="label">Available Slots</label>
                    <input className="input-field" type="number" {...scholReg('availableSlots')} placeholder="0" />
                  </div>
                  <div>
                    <label className="label">Deadline</label>
                    <input className="input-field" type="date" {...scholReg('deadline')} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Eligibility Criteria (one per line)</label>
                    <textarea className="input-field" rows="2" {...scholReg('eligibilityCriteria')} placeholder="Grade 12 with 70%&#10;Age 17-25" />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowScholarshipForm(false)} className="btn-outline text-sm">Cancel</button>
                    <button type="submit" className="btn-primary text-sm">Create Scholarship</button>
                  </div>
                </form>
              </div>
            )}

            {scholarships.map(s => (
              <div key={s._id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                      {s.isFeatured && <span className="badge bg-yellow-100 text-yellow-700">Featured</span>}
                      <span className={`badge ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{s.university} · {s.coveragePercentage}% Coverage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.description}</p>
                  </div>
                  <button onClick={() => deleteScholarship(s._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Contact Messages</h2>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
            ) : messages.length === 0 ? (
              <div className="card p-12 text-center text-gray-500">No messages yet</div>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className={`card p-5 ${msg.status === 'new' ? 'border-brand-200 dark:border-brand-800' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white">{msg.name}</p>
                        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{msg.category}</span>
                        {msg.status === 'new' && <span className="badge bg-red-100 text-red-600">New</span>}
                        {msg.status === 'replied' && <span className="badge bg-green-100 text-green-700">Replied</span>}
                      </div>
                      <p className="text-sm text-gray-500">{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{msg.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                      {msg.adminReply?.message && (
                        <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-sm text-green-700 dark:text-green-300">
                          <p className="font-medium text-xs mb-1">Your reply:</p>
                          {msg.adminReply.message}
                        </div>
                      )}
                    </div>
                    {msg.status === 'new' && (
                      <button onClick={() => markMessageRead(msg._id)}
                        className="btn-outline text-xs py-1.5 px-3 flex-shrink-0">
                        Mark Read
                      </button>
                    )}
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
