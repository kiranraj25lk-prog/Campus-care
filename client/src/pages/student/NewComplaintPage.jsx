import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import {
  PlusCircle,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function NewComplaintPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    'Classroom',
    'Hostel',
    'Wi-Fi/Network',
    'Canteen',
    'Electrical',
    'Plumbing',
    'Academic/Faculty',
    'Other'
  ];

  const priorities = [
    { label: 'Low', desc: 'Non-urgent maintenance request' },
    { label: 'Medium', desc: 'Standard issue affecting daily convenience' },
    { label: 'High', desc: 'Critical safety hazard or disruption' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5 MB.');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a descriptive title for your complaint.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide detailed information describing the issue.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('priority', priority);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await api.post('/complaints', formData);
      showToast(`Complaint ${res.complaint.id} logged successfully!`, 'success');
      navigate('/student/complaints');
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setMobileOpen(true)}
          pageTitle="Submit New Complaint"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-soft">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Lodge a Campus Concern
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in the details below. Our Grievance Redressal team will route the request to the designated department.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Complaint Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken LCD Projector in Room 402"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors bg-white text-slate-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Select the most appropriate division for your report.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Provide precise location (Block, Floor, Room number) and describe the exact problem observed..."
                  required
                  className="w-full px-4 py-3 text-sm rounded-lg border border-slate-300 focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600 outline-none transition-colors resize-y"
                />
              </div>

              {/* Priority Radio Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {priorities.map((p) => {
                    const isSelected = priority === p.label;
                    let activeBorder = 'border-slate-200 bg-white';
                    let dotColor = 'bg-slate-300';

                    if (isSelected) {
                      if (p.label === 'High') {
                        activeBorder = 'border-rose-400 bg-rose-50/40 text-rose-900';
                        dotColor = 'bg-rose-600';
                      } else if (p.label === 'Medium') {
                        activeBorder = 'border-amber-400 bg-amber-50/40 text-amber-900';
                        dotColor = 'bg-amber-600';
                      } else {
                        activeBorder = 'border-cobalt-400 bg-cobalt-50/40 text-cobalt-900';
                        dotColor = 'bg-cobalt-600';
                      }
                    }

                    return (
                      <label
                        key={p.label}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${activeBorder}`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.label}
                          checked={isSelected}
                          onChange={() => setPriority(p.label)}
                          className="mt-1 accent-cobalt-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <span className="text-sm font-bold text-slate-900">
                              {p.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            {p.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Optional Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Optional Photograph Evidence
                </label>
                {!filePreview ? (
                  <label className="border-2 border-dashed border-slate-300 hover:border-cobalt-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-cobalt-600">
                      Click to upload an image
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, or WebP up to 5 MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 truncate">
                        <ImageIcon className="w-4 h-4 text-cobalt-600 shrink-0" />
                        <span className="truncate">{selectedFile?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-contain mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/student/dashboard')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cobalt-600 hover:bg-cobalt-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  {submitting ? 'Submitting Grievance...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
