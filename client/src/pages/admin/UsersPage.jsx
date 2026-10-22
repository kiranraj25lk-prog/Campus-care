import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  Shield,
  Mail,
  BookOpen,
  Calendar,
  FileText
} from 'lucide-react';
import { api } from '../../api/client';

export default function UsersPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');

  const branches = [
    'All',
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Information Science & Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Administration'
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (roleFilter !== 'All') queryParams.append('role', roleFilter);
      if (branchFilter !== 'All') queryParams.append('branch', branchFilter);

      const data = await api.get(`/users?${queryParams.toString()}`);
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, branchFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Campus Users Directory"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Registered Students & Grievance Staff
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus identities, departmental affiliations, and grievance activity records
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-cobalt-600 outline-none"
                  />
                </form>
              </div>

              <div className="md:col-span-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="student">Students</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 outline-none"
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Registered Users: {users.length}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Loading user accounts...
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No users found matching query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Name</th>
                      <th className="py-3 px-4 sm:px-6">Institutional Email</th>
                      <th className="py-3 px-4 sm:px-6">Role</th>
                      <th className="py-3 px-4 sm:px-6">Department / Branch</th>
                      <th className="py-3 px-4 sm:px-6">Semester</th>
                      <th className="py-3 px-4 sm:px-6">Filed</th>
                      <th className="py-3 px-4 sm:px-6">Resolved</th>
                      <th className="py-3 px-4 sm:px-6">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                          {u.name}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-slate-600">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-navy-900 text-white'
                                : 'bg-blue-50 text-cobalt-700 border border-blue-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-700 whitespace-nowrap">
                          {u.branch || 'General'}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-500">
                          {u.semester || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                          {u.total_complaints || 0}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-700">
                          {u.resolved_complaints || 0}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-400 text-xs whitespace-nowrap">
                          {u.created_at}
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
    </div>
  );
}
