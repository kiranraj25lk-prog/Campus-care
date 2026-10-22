import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { User, Mail, BookOpen, Layers, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export default function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [saving, setSaving] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const { showToast } = useToast();

  const branches = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Information Science & Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Artificial Intelligence & Data Science'
  ];

  const semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester'
  ];

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then(data => setUserStats(data))
        .catch(err => console.error('Error fetching user stats:', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.put('/auth/profile', { name, branch, semester });
      updateUser(data.user);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Student Profile"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-soft">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-soft">
                {user?.name ? user.name.slice(0, 2) : 'ST'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.name || 'Student Name'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.email} • {user?.branch}
                </p>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="grid grid-cols-3 gap-4 my-6 text-center">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Total Filed</span>
                <span className="text-xl font-bold text-navy-900 mt-1 block">
                  {userStats?.total_complaints || 0}
                </span>
              </div>
              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="text-xs text-amber-700 font-medium block">Pending</span>
                <span className="text-xl font-bold text-amber-800 mt-1 block">
                  {userStats?.pending_complaints || 0}
                </span>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs text-emerald-700 font-medium block">Resolved</span>
                <span className="text-xl font-bold text-emerald-800 mt-1 block">
                  {userStats?.resolved_complaints || 0}
                </span>
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Academic & Contact Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  College Email (Read Only)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none bg-white"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none bg-white"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
