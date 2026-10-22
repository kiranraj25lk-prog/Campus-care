import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  Eye,
  ArrowRight,
  AlertTriangle,
  Building2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/stats/overview');
      setStats(data.stats || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      setRecentComplaints(data.recentComplaints || []);
    } catch (err) {
      console.error('Error fetching student dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenDetail = async (complaintId) => {
    try {
      const full = await api.get(`/complaints/${complaintId}`);
      setSelectedComplaint(full);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to load complaint details:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Student Dashboard"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user?.name || 'Student'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Track status updates on your reported campus concerns or submit a new grievance.
              </p>
            </div>
            <Link
              to="/student/new-complaint"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Submit New Complaint
            </Link>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Complaints"
              value={stats.total}
              icon={FileText}
              color="blue"
              subtext="Submitted by you"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              color="amber"
              subtext="Awaiting review"
            />
            <StatCard
              title="In Progress"
              value={stats.in_progress}
              icon={RefreshCw}
              color="indigo"
              subtext="Under active repair"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              color="emerald"
              subtext="Resolved tickets"
            />
          </div>

          {/* Recent Complaints Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Complaints
                </h3>
                <p className="text-xs text-slate-500">
                  Your most recently logged campus issues
                </p>
              </div>
              <Link
                to="/student/complaints"
                className="text-xs font-semibold text-cobalt-600 hover:text-cobalt-700 inline-flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Loading complaints...
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-800">No complaints registered yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Have an issue in your classroom, hostel, Wi-Fi or lab? Lodge a complaint to notify administration.
                </p>
                <Link
                  to="/student/new-complaint"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 rounded-lg shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Log First Grievance
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Complaint ID</th>
                      <th className="py-3 px-4 sm:px-6">Title</th>
                      <th className="py-3 px-4 sm:px-6">Category</th>
                      <th className="py-3 px-4 sm:px-6">Logged Date</th>
                      <th className="py-3 px-4 sm:px-6">Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentComplaints.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-navy-900">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-500">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => handleOpenDetail(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cobalt-600 hover:text-white hover:bg-cobalt-600 rounded-md border border-cobalt-200 hover:border-transparent transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
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

      {/* Complaint Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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
                <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60">
                  <img
                    src={selectedComplaint.image_path}
                    alt="Complaint Evidence"
                    className="w-full h-auto object-cover"
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
                  <span className="text-slate-500">Ticket logged on {selectedComplaint.created_at}</span>
                </div>

                <div className="pl-5 relative">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                    selectedComplaint.status !== 'Pending' ? 'bg-emerald-500' : 'bg-slate-300'
                  } border-2 border-white`} />
                  <span className="font-bold text-slate-900 block">Under Review / Routing</span>
                  <span className="text-slate-500">
                    {selectedComplaint.department_name
                      ? `Assigned to ${selectedComplaint.department_name}`
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
                      ? 'Action verified and closed'
                      : (selectedComplaint.status === 'In Progress' ? 'Technicians currently attending to issue' : 'Awaiting technician dispatch')}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Remarks Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
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
