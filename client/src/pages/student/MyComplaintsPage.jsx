import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import {
  FileText,
  Search,
  PlusCircle,
  Eye,
  Trash2,
  Building2,
  Calendar,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function MyComplaintsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { showToast } = useToast();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.get('/complaints');
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenDetail = async (id) => {
    try {
      const full = await api.get(`/complaints/${id}`);
      setSelectedComplaint(full);
      setDetailModalOpen(true);
    } catch (err) {
      showToast('Could not load complaint details.', 'error');
    }
  };

  const handleDeletePending = async (id) => {
    if (!window.confirm(`Are you sure you want to withdraw complaint ${id}?`)) return;
    try {
      await api.delete(`/complaints/${id}`);
      showToast(`Complaint ${id} withdrawn.`, 'info');
      setComplaints(prev => prev.filter(c => c.id !== id));
      if (selectedComplaint?.id === id) {
        setDetailModalOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to withdraw complaint.', 'error');
    }
  };

  // Filter complaints based on tab & search query
  const filteredComplaints = complaints.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = !searchQuery.trim() ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === 'Pending').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  const tabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="My Complaints"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                My Grievance History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and monitor tickets submitted by your account
              </p>
            </div>
            <Link
              to="/student/new-complaint"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              New Complaint
            </Link>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-navy-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isActive
                          ? 'bg-navy-800 text-slate-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tabCounts[tab] || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Complaints Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Loading complaints...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-800">No complaints found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery ? 'No complaints matched your search filter.' : 'You have not submitted complaints under this category.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">ID</th>
                      <th className="py-3 px-4 sm:px-6">Title</th>
                      <th className="py-3 px-4 sm:px-6">Category</th>
                      <th className="py-3 px-4 sm:px-6">Priority</th>
                      <th className="py-3 px-4 sm:px-6">Logged Date</th>
                      <th className="py-3 px-4 sm:px-6">Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-navy-900">
                          {c.id}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 max-w-xs truncate">
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
                        <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                          {c.created_at}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleOpenDetail(c.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cobalt-600 hover:text-white hover:bg-cobalt-600 rounded-md border border-cobalt-200 hover:border-transparent transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            {c.status === 'Pending' && (
                              <button
                                onClick={() => handleDeletePending(c.id)}
                                className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                title="Withdraw complaint"
                                aria-label="Withdraw complaint"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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

      {/* Complaint Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedComplaint ? `Complaint Details: ${selectedComplaint.id}` : 'Complaint'}
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-cobalt-600 block">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="text-slate-800 font-bold mt-0.5 block">{selectedComplaint.category}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Assigned Department</span>
                <span className="text-slate-800 font-bold mt-0.5 block">
                  {selectedComplaint.department_name || 'Pending Assignment'}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Logged Date</span>
                <span className="text-slate-800 font-bold mt-0.5 block">{selectedComplaint.created_at}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Description
              </h4>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedComplaint.description}
              </div>
            </div>

            {selectedComplaint.image_path && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Attached Photo Evidence
                </h4>
                <div className="rounded-lg overflow-hidden border border-slate-200 max-h-64 bg-slate-950 flex items-center justify-center">
                  <img
                    src={selectedComplaint.image_path}
                    alt="Complaint Evidence"
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Status Timeline
              </h4>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 text-xs">
                <div className="pl-5 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                  <span className="font-bold text-slate-900 block">Submitted</span>
                  <span className="text-slate-500">Logged on {selectedComplaint.created_at}</span>
                </div>

                <div className="pl-5 relative">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                    selectedComplaint.status !== 'Pending' ? 'bg-emerald-500' : 'bg-slate-300'
                  } border-2 border-white`} />
                  <span className="font-bold text-slate-900 block">Under Review / Routing</span>
                  <span className="text-slate-500">
                    {selectedComplaint.department_name
                      ? `Routed to ${selectedComplaint.department_name}`
                      : 'Pending review by Grievance Redressal Committee'}
                  </span>
                </div>

                <div className="pl-5 relative">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                    selectedComplaint.status === 'Resolved' ? 'bg-emerald-500' : (selectedComplaint.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300')
                  } border-2 border-white`} />
                  <span className="font-bold text-slate-900 block">Resolution Action</span>
                  <span className="text-slate-500">
                    {selectedComplaint.status === 'Resolved'
                      ? 'Field resolution completed and verified'
                      : (selectedComplaint.status === 'In Progress' ? 'Technicians currently attending to issue' : 'Awaiting technician dispatch')}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Remarks Box */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-2 mb-1 text-cobalt-700 font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                Official Administration Remarks
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedComplaint.admin_remarks || 'No official remarks added yet. Administration will update remarks once inspection commences.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
