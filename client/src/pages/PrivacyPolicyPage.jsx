import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
              <Lock className="w-6 h-6 text-cobalt-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Institutional Privacy Policy
              </h1>
              <p className="text-xs text-slate-500">
                CampusCare Grievance Redressal Portal • Effective Academic Year 2026-2027
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Scope and Applicability</h2>
              <p>
                This Privacy Policy applies to all students, faculty members, and administrative staff using the CampusCare grievance redressal system. The portal operates strictly under college governance regulations to record, investigate, and resolve facility and academic issues.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <p className="mb-2">
                When you register and use CampusCare, we collect and store:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Student identification data: Full name, institutional email address, academic department/branch, and current semester.</li>
                <li>Grievance details: Complaint title, selected category, issue description, attached photographs, and timestamps.</li>
                <li>Administrative records: Assigned department, priority weighting, progress status, and official administrative remarks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. How Your Information is Used</h2>
              <p className="mb-2">
                All data collected is used solely for legitimate institutional purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Routing tickets to the appropriate engineering, IT, hostel, or academic officers.</li>
                <li>Sending direct notifications regarding ticket status changes and resolution notes.</li>
                <li>Generating anonymized aggregate metrics for campus infrastructure improvement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Confidentiality and Protection</h2>
              <p>
                Student grievances are treated with strict confidentiality. Only the designated Grievance Redressal Committee and relevant maintenance officers can view ticket specifics. Your password is encrypted with cryptographic hashing, and your records are never shared with external commercial third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention</h2>
              <p>
                Complaint records are retained for the duration of the student's active enrollment and an additional audit period of two years in accordance with higher education regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">6. Contact and Inquiries</h2>
              <p>
                For questions regarding grievance privacy or to request data correction, contact the Data Protection Officer at <span className="font-semibold text-cobalt-600">privacy@campuscare.edu</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
