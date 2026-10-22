import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  UserCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../../api/client';

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await api.get('/stats/overview');
      setStats(data.stats || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      setCategoryData(data.categoryData || []);
      setMonthlyData(data.monthlyData || []);
      setRecentComplaints(data.recentComplaints || []);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Admin Overview & Analytics"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Grievance Administration Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time campus maintenance metrics, department ticket routing, and resolution status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/complaints?action=assign"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 shadow-sm transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Assign Complaints
              </Link>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Complaints"
              value={stats.total}
              icon={FileText}
              color="blue"
              subtext="Logged college tickets"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              color="amber"
              subtext="Unassigned / awaiting review"
            />
            <StatCard
              title="In Progress"
              value={stats.in_progress}
              icon={RefreshCw}
              color="indigo"
              subtext="Assigned to department"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              color="emerald"
              subtext="Fully resolved issues"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaints by Category (Pie Chart) */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-cobalt-600 flex items-center justify-center">
                    <PieIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Complaints by Category
                    </h3>
                    <p className="text-[11px] text-slate-500">Distribution across campus divisions</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {categoryData.length} Categories
                </span>
              </div>

              <div className="h-72 w-full">
                {categoryData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [`${val} tickets`, name]}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={40}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Monthly Complaints (Bar Chart) */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-cobalt-600 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Monthly Complaints
                    </h3>
                    <p className="text-[11px] text-slate-500">Volume vs Resolved tickets trend</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  2026 Academic Term
                </span>
              </div>

              <div className="h-72 w-full">
                {monthlyData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No monthly data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                      <Bar dataKey="total" name="Total Logged" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" name="Resolved" fill="#1D63E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Recent Grievances Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Latest Campus Grievances
                </h3>
                <p className="text-xs text-slate-500">
                  Overview of recently filed student reports
                </p>
              </div>
              <Link
                to="/admin/complaints"
                className="text-xs font-semibold text-cobalt-600 hover:text-cobalt-700 inline-flex items-center gap-1"
              >
                Manage All Complaints
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">ID</th>
                    <th className="py-3 px-4 sm:px-6">Student</th>
                    <th className="py-3 px-4 sm:px-6">Title</th>
                    <th className="py-3 px-4 sm:px-6">Category</th>
                    <th className="py-3 px-4 sm:px-6">Priority</th>
                    <th className="py-3 px-4 sm:px-6">Department</th>
                    <th className="py-3 px-4 sm:px-6">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-navy-900">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                        {c.student_name}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 max-w-xs truncate font-medium text-slate-800">
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
                      <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-600 whitespace-nowrap">
                        {c.department_name || (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Link
                          to={`/admin/complaints?id=${c.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cobalt-600 hover:text-white hover:bg-cobalt-600 rounded-md border border-cobalt-200 hover:border-transparent transition-colors"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
