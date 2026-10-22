import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import {
  FileText,
  Search,
  Filter,
  UserCheck,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  Building2,
  User,
  Mail,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Save,
  Check
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AllComplaintsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Edit State inside modal
  const [editStatus, setEditStatus] = useState('Pending');
  const [editDeptId, setEditDeptId] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  // Quick Assign form state
  const [assignComplaintId, setAssignComplaintId] = useState('');
  const [quickDeptId, setQuickDeptId] = useState('');
  const [quickRemarks, setQuickRemarks] = useState('');

  const { showToast } = useToast();

  const categories = [
    'All',
    'Classroom',
    'Hostel',
    'Wi-Fi/Network',
    'Canteen',
    'Electrical',
    'Plumbing',
    'Academic/Faculty',
    'Other'
  ];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (categoryFilter !== 'All') queryParams.append('category', categoryFilter);
      if (priorityFilter !== 'All') queryParams.append('priority', priorityFilter);
      if (deptFilter !== 'All') queryParams.append('department_id', deptFilter);

      const data = await api.get(`/complaints?${queryParams.toString()}`);
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const depts = await api.get('/departments');
      setDepartments(depts || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, priorityFilter, deptFilter]);

  // Handle URL params for direct opening (e.g. ?id=C1002 or ?action=assign)
  useEffect(() => {
    const directId = searchParams.get('id');
    const action = searchParams.get('action');

    if (directId) {
      handleOpenManage(directId);
    } else if (action === 'assign') {
      setAssignModalOpen(true);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleOpenManage = async (id) => {
    try {
      const full = await api.get(`/complaints/${id}`);
      setSelectedComplaint(full);
      setEditStatus(full.status);
      setEditDeptId(full.department_id ? String(full.department_id) : '');
      setEditRemarks(full.admin_remarks || '');
      setModalOpen(true);
    } catch (err) {
      showToast('Could not load complaint details.', 'error');
    }
  };

  const handleSaveComplaint = async () => {
    if (!selectedComplaint) return;
    setSaving(true);
    try {
      // 1. Update status and remarks
      await api.put(`/complaints/${selectedComplaint.id}/status`, {
        status: editStatus,
        admin_remarks: editRemarks
      });

      // 2. If department changed or assigned
      if (editDeptId && Number(editDeptId) !== selectedComplaint.department_id) {
        await api.put(`/complaints/${selectedComplaint.id}/assign`, {
          department_id: Number(editDeptId),
          status: editStatus,
          admin_remarks: editRemarks
        });
      }

      showToast(`Complaint ${selectedComplaint.id} updated successfully!`, 'success');
      setModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to update complaint.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignComplaintId) {
      showToast('Please select a complaint to assign.', 'error');
      return;
    }
    if (!quickDeptId) {
      showToast('Please select a target department.', 'error');
      return;
    }

    try {
      await api.put(`/complaints/${assignComplaintId}/assign`, {
        department_id: Number(quickDeptId),
        admin_remarks: quickRemarks || 'Assigned to department for immediate inspection.'
      });
      showToast(`Complaint ${assignComplaintId} assigned!`, 'success');
      setAssignModalOpen(false);
      setAssignComplaintId('');
      setQuickDeptId('');
      setQuickRemarks('');
      fetchComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to assign complaint.', 'error');
    }
  };

  const unassignedComplaints = complaints.filter(c => !c.department_id || c.status === 'Pending');

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAssignModal={() => setAssignModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="All Complaints Management"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Campus Complaints Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect, categorize, reassign, and resolve reported student grievances
              </p>
            </div>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Assign Complaint
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Box */}
              <div className="md:col-span-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ID, title, or student name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none"
                  />
                </form>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-cobalt-600 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-cobalt-600 outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="md:col-span-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-cobalt-600 outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="md:col-span-2">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-cobalt-600 outline-none"
                >
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Displaying {complaints.length} Recorded Complaints
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Loading complaints records...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-800">No records found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting the filter criteria or search keyword.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">ID</th>
                      <th className="py-3 px-4 sm:px-6">Student Name</th>
                      <th className="py-3 px-4 sm:px-6">Title</th>
                      <th className="py-3 px-4 sm:px-6">Category</th>
                      <th className="py-3 px-4 sm:px-6">Priority</th>
                      <th className="py-3 px-4 sm:px-6">Status</th>
                      <th className="py-3 px-4 sm:px-6">Department</th>
                      <th className="py-3 px-4 sm:px-6">Date</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-navy-900">
                          {c.id}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                          <div>
                            <span>{c.student_name}</span>
                            <span className="block text-[11px] text-slate-400">
                              {c.student_branch || 'General'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-800 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-600 whitespace-nowrap">
                          {c.department_name ? (
                            <span>{c.department_name}</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                          {c.created_at}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenManage(c.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-cobalt-600 hover:text-white hover:bg-cobalt-600 rounded-md border border-cobalt-200 hover:border-transparent transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Admin Complaint Management Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedComplaint ? `Manage Complaint: ${selectedComplaint.id}` : 'Complaint'}
        maxWidth="max-w-3xl"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-cobalt-600">
                  {selectedComplaint.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={selectedComplaint.priority} />
                <StatusBadge status={selectedComplaint.status} />
              </div>
            </div>

            {/* Student & Complaint metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Student</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedComplaint.student_name}</span>
                <span className="text-slate-500 block">{selectedComplaint.student_email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Academic Division</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedComplaint.student_branch}</span>
                <span className="text-slate-500 block">{selectedComplaint.student_semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Logged Date</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedComplaint.created_at}</span>
                <span className="text-slate-500 block">Category: {selectedComplaint.category}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Description
              </h4>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedComplaint.description}
              </div>
            </div>

            {/* Optional Photo Attachment */}
            {selectedComplaint.image_path && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Attached Photo Evidence
                </h4>
                <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60 bg-slate-950 flex items-center justify-center">
                  <img
                    src={selectedComplaint.image_path}
                    alt="Evidence"
                    className="max-h-60 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Administrative Controls: Status, Assign Dept, Remarks */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                Grievance Action & Status Update
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Update Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none bg-white font-medium"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assign To Department
                  </label>
                  <select
                    value={editDeptId}
                    onChange={(e) => setEditDeptId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none bg-white font-medium"
                  >
                    <option value="">Unassigned</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Administrative Remarks
                </label>
                <textarea
                  rows={3}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Enter remarks visible to the student regarding dispatch, repair details, or resolution status..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveComplaint}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Quick Assign Complaint Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Complaint to Department"
      >
        <form onSubmit={handleQuickAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Complaint
            </label>
            <select
              value={assignComplaintId}
              onChange={(e) => setAssignComplaintId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none bg-white"
            >
              <option value="">-- Choose a Complaint --</option>
              {unassignedComplaints.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.title} ({c.student_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Designated Department
            </label>
            <select
              value={quickDeptId}
              onChange={(e) => setQuickDeptId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none bg-white"
            >
              <option value="">-- Choose Department --</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Routing Note / Remarks
            </label>
            <textarea
              rows={3}
              value={quickRemarks}
              onChange={(e) => setQuickRemarks(e.target.value)}
              placeholder="e.g. Assigned to IT team for network switch troubleshooting..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 rounded-lg shadow-sm"
            >
              <Check className="w-4 h-4" />
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
