import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);
      showToast(`Welcome back, ${data.user.name}!`, 'success');

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setEmail('admin@campuscare.edu');
      setPassword('Admin@123');
    } else {
      setEmail('kiran@student.college.edu');
      setPassword('Student@123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-page py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center text-white shadow-soft group-hover:bg-cobalt-600 transition-colors">
            <ShieldCheck className="w-6 h-6 text-cobalt-500 group-hover:text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-navy-900">
            CampusCare
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sign In to Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your institutional credentials to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl border border-slate-200 shadow-soft">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu or admin@campuscare.edu"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Fill Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Quick Demo Fill (Instant Access)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('student')}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-cobalt-600" />
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-navy-900" />
                Admin Demo
              </button>
            </div>
            <div className="mt-2.5 text-[11px] text-slate-400 text-center">
              Student: <span className="font-mono text-slate-600">Student@123</span> • Admin: <span className="font-mono text-slate-600">Admin@123</span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-cobalt-600 hover:text-cobalt-700">
              Register as Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
