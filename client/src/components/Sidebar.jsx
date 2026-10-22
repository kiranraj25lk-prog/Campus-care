import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  ShieldCheck,
  Building2,
  Users,
  BarChart3,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen, onOpenAssignModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStudent = user?.role === 'student';

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'New Complaint', path: '/student/new-complaint', icon: PlusCircle },
    { name: 'My Complaints', path: '/student/complaints', icon: FileText },
    { name: 'Profile', path: '/student/profile', icon: User }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
    {
      name: 'Assign Complaint',
      path: '/admin/complaints?action=assign',
      icon: UserCheck,
      onClick: () => {
        if (onOpenAssignModal) onOpenAssignModal();
      }
    },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 }
  ];

  const links = isStudent ? studentLinks : adminLinks;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-navy-900 text-white select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cobalt-600 flex items-center justify-center text-white shadow-soft">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-tight">
              CampusCare
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400 block">
              {isStudent ? 'Student Portal' : 'Admin Console'}
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Role Pill */}
      <div className="px-6 py-4">
        <div className="px-3.5 py-2.5 rounded-lg bg-navy-800/80 border border-navy-700/60 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Authorized User'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {isStudent ? (user?.branch || 'Student') : 'Chief Grievance Officer'}
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cobalt-600 text-white">
            {user?.role || 'User'}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={(e) => {
                if (item.onClick) {
                  item.onClick();
                }
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={({ isActive }) => {
                // If it's a specific query param like ?action=assign, check window.location
                const matches = isActive && (!item.path.includes('?') || window.location.search.includes('action=assign'));
                return `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  matches
                    ? 'bg-cobalt-600 text-white shadow-soft font-semibold'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`;
              }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-navy-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-900/40 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-navy-800 z-30">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-full h-full z-10">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
