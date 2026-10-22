import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Modal from '../../components/Modal';
import {
  Building2,
  PlusCircle,
  Mail,
  User,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  Check
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function DepartmentsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New Department Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headName, setHeadName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/departments');
      setDepartments(data || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/departments', {
        name: name.trim(),
        description: description.trim(),
        head_name: headName.trim(),
        contact_email: contactEmail.trim()
      });
      showToast('Department added successfully!', 'success');
      setModalOpen(false);
      setName('');
      setDescription('');
      setHeadName('');
      setContactEmail('');
      fetchDepartments();
    } catch (err) {
      showToast(err.message || 'Failed to add department.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Campus Departments"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Institutional Units & Maintenance Divisions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage operational divisions and monitor workload distribution across campus
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-cobalt-500" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      DEP-0{dept.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {dept.description || 'Campus facilities and technical services unit.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-5">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Head: <strong className="text-slate-800">{dept.head_name || 'Designated Lead'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dept.contact_email || 'dept-desk@campuscare.edu'}</span>
                    </div>
                  </div>
                </div>

                {/* Workload Stats */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{dept.total_complaints || 0}</span>
                  </div>
                  <div className="p-2 rounded bg-amber-50/70">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending</span>
                    <span className="font-bold text-amber-800 text-sm mt-0.5 block">
                      {(dept.pending_count || 0) + (dept.in_progress_count || 0)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-emerald-50/70">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Resolved</span>
                    <span className="font-bold text-emerald-800 text-sm mt-0.5 block">{dept.resolved_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Campus Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sports & Gymnasium Facilities"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational responsibilities and physical zones covered..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department Head
              </label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="e.g. Dr. K. Narayanan"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. sports@campuscare.edu"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
