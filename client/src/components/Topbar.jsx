import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Topbar({ onToggleMobileSidebar, pageTitle = 'Dashboard' }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20s poll
    return () => clearInterval(interval);
  }, []);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const isStudent = user?.role === 'student';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Notifications & User Chip */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-card border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !item.is_read && handleMarkOneRead(item.id)}
                      className={`px-4 py-3 text-xs cursor-pointer transition-colors ${
                        item.is_read === 0 ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${item.is_read === 0 ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                          {item.message}
                        </p>
                        {item.is_read === 0 && (
                          <span className="w-2 h-2 rounded-full bg-cobalt-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {item.created_at}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user?.name ? user.name.slice(0, 2) : 'CC'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || 'Authorized User'}
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              {isStudent ? (
                `${user?.branch || 'General'} • ${user?.semester || 'Semester'}`
              ) : (
                'Administration Desk'
              )}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
