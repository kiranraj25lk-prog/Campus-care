import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FileText,
  Search,
  Zap,
  Building,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      title: 'Submit Complaint',
      desc: 'Log grievances across classrooms, hostels, network, electrical, plumbing, and faculty affairs with optional photo evidence.',
      icon: FileText
    },
    {
      title: 'Track Status',
      desc: 'Follow the progress of your complaint in real time from submission through department inspection and final closure.',
      icon: Search
    },
    {
      title: 'Quick Resolution',
      desc: 'Automated routing directly to authorized department heads ensures prompt investigation and official remarks on every ticket.',
      icon: Zap
    },
    {
      title: 'Better Campus',
      desc: 'Institutional analytics give administration clear oversight to fix recurring infrastructure bottlenecks and improve campus life.',
      icon: Building
    }
  ];

  const faqs = [
    {
      q: 'Who has access to view my submitted complaints?',
      a: 'Complaints are visible to you, the college grievance redressal cell, and the assigned department head handling the resolution.'
    },
    {
      q: 'What is the standard resolution timeline?',
      a: 'High priority emergencies (such as safety hazards or water outages) are reviewed within 24 hours. General maintenance requests are resolved within 2 to 4 working days.'
    },
    {
      q: 'Can I attach photographic documentation?',
      a: 'Yes, you can upload clear photos (JPG, PNG, WebP) directly from your phone or laptop while creating the complaint.'
    },
    {
      q: 'What should I do if an urgent safety issue arises outside office hours?',
      a: 'For urgent hazards requiring immediate campus security or medical intervention, use the 24/7 campus security helpline (+91 080 2845-6799) in addition to lodging an emergency ticket.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-navy-900 text-white overflow-hidden py-20 lg:py-28 border-b border-navy-800">
        {/* Subtle geometric campus background pattern without purple gradient */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#1D63E9 1.5px, transparent 1.5px), radial-gradient(#102A4E 1.5px, #0B1F3A 1.5px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Dark Navy Overlay for optimal contrast */}
        <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-[1px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-navy-800 border border-navy-700/80 text-cobalt-100 text-xs font-semibold uppercase tracking-wider mb-8">
            <Shield className="w-3.5 h-3.5 text-cobalt-500" />
            Official University Grievance Redressal System
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Raise Your Concern, Make a Better Campus
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A transparent and accountable grievance portal connecting students directly with campus maintenance, IT services, hostel administration, and academic departments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 rounded-lg shadow-md transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-200 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-lg transition-colors"
            >
              Learn More
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero paper paperwork</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct department routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official timestamped remarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-8 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-cobalt-50 text-cobalt-600 border border-cobalt-100 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-cobalt-600 flex items-center gap-1">
                  Feature 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cobalt-600 block mb-2">
                Campus Redressal Standard
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Built to Ensure Accountability and Timely Action
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                CampusCare replaces fragmented email chains and verbal complaints with a centralized, auditable system. Every ticket receives an official identification number, priority weighting, and department ownership.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student Logs Grievance</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Submit exact location, category, description, and photo evidence.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Administrative Assignment</h4>
                    <p className="text-xs text-slate-600 mt-0.5">The Grievance Officer inspects the request and assigns it to the designated department.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Field Resolution and Notification</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Technicians complete the physical repair, add resolution notes, and the ticket is marked resolved.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-page rounded-xl p-8 border border-slate-200">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Resolution SLA</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Standard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-xl font-bold text-slate-900">24 Hours</div>
                      <div className="text-xs text-slate-500">High priority safety issues</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">48-72 Hours</div>
                      <div className="text-xs text-slate-500">Classroom and IT repairs</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-soft">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Participating Units</h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li>• Civil, Electrical, and Plumbing Maintenance</li>
                    <li>• Campus IT, High-Speed Wi-Fi, and AV Units</li>
                    <li>• Student Hostels and Food Safety Inspection</li>
                    <li>• Academic Office and Examination Cell</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-cobalt-600 block mb-2">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cobalt-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-cobalt-600 block mb-2">
              Official Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Campus Grievance Redressal Committee
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-page rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Physical Office</h4>
              <p className="text-xs text-slate-600 mt-1">
                Room 108, Ground Floor, Administrative Building, College Campus
              </p>
            </div>

            <div className="bg-page rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Electronic Mail</h4>
              <p className="text-xs text-slate-600 mt-1">
                grievance@campuscare.edu
              </p>
            </div>

            <div className="bg-page rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Helpline Hours</h4>
              <p className="text-xs text-slate-600 mt-1">
                Monday to Saturday, 9:00 AM to 5:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
