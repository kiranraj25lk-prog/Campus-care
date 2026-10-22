import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-cobalt-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CampusCare
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official institutional portal for logging, tracking, and resolving student grievances across all campus departments.
            </p>
            <div className="text-xs text-slate-400 font-mono pt-1">
              Domain: <span className="text-cobalt-100">campuscare.edu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-white transition-colors">
                  Redressal Committee
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Departments */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Key Divisions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Infrastructure and Maintenance</li>
              <li>IT and Campus Network Services</li>
              <li>Campus Living and Mess Dining</li>
              <li>Academic and Examination Affairs</li>
              <li>Security and Emergency Response</li>
            </ul>
          </div>

          {/* Grievance Desk Contacts */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Grievance Cell
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5" />
                <span>Administrative Block, Room 108, Main Campus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cobalt-500 shrink-0" />
                <a href="mailto:grievance@campuscare.edu" className="hover:text-white transition-colors">
                  grievance@campuscare.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cobalt-500 shrink-0" />
                <span>+91 (080) 2845-6789</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; 2026 CampusCare. All rights reserved. Institutional Governance System.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
            <span className="text-slate-400">
              College Grievance Code: UGC-MHRD-2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
