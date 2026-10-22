import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldAlert, FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cobalt-600 hover:text-cobalt-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-cobalt-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Terms and Conditions of Use
              </h1>
              <p className="text-xs text-slate-500">
                CampusCare Grievance Redressal Portal • Rules of Responsible Conduct
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or submitting tickets through the CampusCare portal, you agree to comply with all student code of conduct bylaws established by the university administration and the University Grants Commission guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Acceptable Use Policy</h2>
              <p className="mb-2">
                Users agree to use the platform exclusively for genuine campus-related grievances:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Providing accurate and truthful information regarding the location and nature of the issue.</li>
                <li>Refraining from submitting frivolous, malicious, defamatory, or duplicate tickets.</li>
                <li>Uploading only photographic evidence directly relevant to the reported maintenance or academic issue.</li>
                <li>Treating campus maintenance staff and department personnel with professional courtesy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Disciplinary Action for False Reporting</h2>
              <p>
                Deliberately lodging false complaints or attempting to harass faculty, staff, or fellow students through the grievance mechanism constitutes a violation of student disciplinary conduct and may be referred to the Proctorial Board.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Resolution Timelines and Service Level Commitments</h2>
              <p>
                The college administration commits to reviewing submitted issues within published working hours. While every effort is made to adhere to standard resolution intervals (24 hours for emergencies, 2 to 4 days for regular maintenance), resolution timelines may vary depending on procurement, spare part availability, and technical complexity.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Administrative Decisions</h2>
              <p>
                The Grievance Redressal Committee retains the authority to classify ticket priorities, reassign departments, and record final closure remarks upon verification of field repairs.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
