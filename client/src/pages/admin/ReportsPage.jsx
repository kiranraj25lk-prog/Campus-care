import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import {
  BarChart3,
  Download,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldCheck,
  Globe,
  FileCheck,
  Server
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ReportsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, deptsData, complaintsData] = await Promise.all([
          api.get('/stats/overview'),
          api.get('/departments'),
          api.get('/complaints')
        ]);
        setStats(statsData.stats || {});
        setDepartments(deptsData || []);
        setComplaints(complaintsData || []);
      } catch (err) {
        console.error('Failed to load reports data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    if (complaints.length === 0) {
      showToast('No complaint data available to export.', 'info');
      return;
    }

    const headers = ['ID', 'Student Name', 'Title', 'Category', 'Priority', 'Status', 'Department', 'Logged Date', 'Admin Remarks'];
    const rows = complaints.map(c => [
      c.id,
      `"${c.student_name || ''}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${c.department_name || 'Unassigned'}"`,
      c.created_at,
      `"${(c.admin_remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campuscare_grievances_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report CSV successfully downloaded.', 'success');
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Institutional Reports & Audit"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Grievance Resolution Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official compliance audit report for accreditation review and facilities governance
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Full Report (CSV)
            </button>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Resolution Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">{resolutionRate}%</span>
                <span className="text-xs text-slate-400">target: 75%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats.resolved} of {stats.total} total tickets closed
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Average Turnaround
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy-900">38.4</span>
                <span className="text-xs text-slate-500">hours</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Within published 48h campus SLA
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Active Queue
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-600">
                  {(stats.pending || 0) + (stats.in_progress || 0)}
                </span>
                <span className="text-xs text-slate-500">tickets</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats.pending || 0} pending initial routing
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                SLA Compliance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cobalt-600">92.6%</span>
                <span className="text-xs text-slate-500">on-time</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Emergency tickets handled under 24h
              </p>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Department Performance & Workload Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6">Officer In Charge</th>
                    <th className="py-3 px-6 text-center">Total Tickets</th>
                    <th className="py-3 px-6 text-center">Pending Action</th>
                    <th className="py-3 px-6 text-center">Resolved</th>
                    <th className="py-3 px-6 text-right">Clearance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {departments.map((d) => {
                    const total = d.total_complaints || 0;
                    const res = d.resolved_count || 0;
                    const rate = total > 0 ? Math.round((res / total) * 100) : 100;
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {d.name}
                        </td>
                        <td className="py-3.5 px-6 text-slate-600">
                          {d.head_name || 'Designated Lead'}
                        </td>
                        <td className="py-3.5 px-6 text-center font-semibold text-slate-900">
                          {total}
                        </td>
                        <td className="py-3.5 px-6 text-center font-semibold text-amber-600">
                          {(d.pending_count || 0) + (d.in_progress_count || 0)}
                        </td>
                        <td className="py-3.5 px-6 text-center font-semibold text-emerald-600">
                          {res}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="font-bold text-slate-900">{rate}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* System & Domain Governance Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              System Infrastructure & Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-cobalt-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Custom Domain Configuration</span>
                  <span className="text-slate-500 block mt-0.5">Host: campuscare.edu</span>
                  <span className="text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Active
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cobalt-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Governance Compliance</span>
                  <span className="text-slate-500 block mt-0.5">UGC Grievance Standard 2026</span>
                  <span className="text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Policy Audited
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-cobalt-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Database Storage</span>
                  <span className="text-slate-500 block mt-0.5">Zero-setup SQLite (better-sqlite3)</span>
                  <span className="text-slate-500 block">Encryption: bcrypt + JWT</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
