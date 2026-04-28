import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Trash2, Download, 
  CheckCircle,
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WorkSummaryPDF from './WorkSummaryPDF';

const WorkSummaryStudio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice } = location.state || {}; // Passed from the list page

  // 1. Initial State - Pre-filling from Invoice
  const [formData, setFormData] = useState({
    projectTitle: '',
    clientName: invoice?.clientName || '',
    workDescription: '',
    keyDeliverables: [''],
    completionDate: new Date().toISOString().split('T')[0],
    optionalNotes: '',
    linkedInvoice: invoice?._id || ''
  });

  const [activeTab, setActiveTab] = useState('edit'); // For mobile toggle

  // 2. Logic: Handle Dynamic Deliverables
  const handleAddDeliverable = () => {
    setFormData({ ...formData, keyDeliverables: [...formData.keyDeliverables, ''] });
  };

  const handleRemoveDeliverable = (index) => {
    const newList = formData.keyDeliverables.filter((_, i) => i !== index);
    setFormData({ ...formData, keyDeliverables: newList });
  };

  const updateDeliverable = (index, value) => {
    const newList = [...formData.keyDeliverables];
    newList[index] = value;
    setFormData({ ...formData, keyDeliverables: newList });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Invoices
        </button>

        {/* MOBILE TAB TOGGLE (Visible only on mobile/tablet) */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl">
            <button 
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-[#0028AE]' : 'text-slate-400'}`}
            >
            Edit
            </button>
            <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-[#0028AE]' : 'text-slate-400'}`}
            >
            Preview
            </button>
        </div>

        <div className="flex gap-3">
         <PDFDownloadLink 
            document={<WorkSummaryPDF data={formData} invoice={invoice} />}
            fileName={`${formData.clientName.replace(/\s+/g, '_')}_Work_Summary.pdf`}
        >
            {({ blob, url, loading, error }) => (
            <button 
                disabled={loading}
                className="px-6 py-2.5 bg-[#001325] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#0028AE] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
            >
                <Download size={18} /> 
                {loading ? 'Preparing Document...' : 'Download Summary'}
            </button>
            )}
        </PDFDownloadLink>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-73px)]">
        
        {/* LEFT PANE: THE EDITOR */}
        <div className={`p-8 overflow-y-auto border-r border-slate-200 bg-white ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="max-w-xl mx-auto">
            <header className="mb-10">
              <h2 className="text-2xl font-black text-slate-900">Summary Details</h2>
              <p className="text-slate-500 font-medium">Outline the value delivered for <span className="text-[#0028AE]">{formData.clientName}</span></p>
            </header>

            <div className="space-y-8">
              {/* Project Title */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project / Job Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Q2 Performance Marketing Overhaul"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#0028AE] outline-none"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                />
              </div>

              {/* Work Description */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Scope Summary</label>
                <textarea 
                  rows="4"
                  placeholder="Briefly describe the primary objective achieved..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-900 focus:ring-2 focus:ring-[#0028AE] outline-none resize-none"
                  value={formData.workDescription}
                  onChange={(e) => setFormData({...formData, workDescription: e.target.value})}
                />
              </div>

              {/* Key Deliverables */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Key Deliverables</label>
                <div className="space-y-3">
                  {formData.keyDeliverables.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. Optimized Landing Page"
                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0028AE] outline-none"
                        value={item}
                        onChange={(e) => updateDeliverable(index, e.target.value)}
                      />
                      <button onClick={() => handleRemoveDeliverable(index)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddDeliverable}
                    className="flex items-center gap-2 text-[#0028AE] font-bold text-sm py-2 hover:opacity-70 transition-all"
                  >
                    <Plus size={18} /> Add Deliverable
                  </button>
                </div>
              </div>

              {/* Date Picker */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Completion Date</label>
                   <input 
                    type="date"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#0028AE] outline-none"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                   />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: THE EXECUTIVE PREVIEW */}
        <div className={`p-12 overflow-y-auto flex justify-center bg-slate-100 ${activeTab === 'edit' ? 'hidden lg:flex' : 'flex'}`}>
          {/* THE DIGITAL SHEET */}
          <div className="w-full max-w-[595px] min-h-[842px] bg-white shadow-2xl rounded-sm p-16 flex flex-col">
            
            {/* Header Branding */}
            <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-10">
               <div>
                 <div className="bg-[#001325] text-white p-2 rounded-lg inline-block mb-4">
                    <CheckCircle size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-[#001325] tracking-tight">Summary of Work</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Ref: SOW-{invoice?._id.slice(-4)}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm font-black text-slate-900">QuickInvoice</p>
                 <p className="text-[10px] font-medium text-slate-400">Project Closure Department</p>
               </div>
            </div>

            {/* Document Content */}
            <div className="flex-1">
              <div className="mb-10">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Prepared For</p>
                <h4 className="text-xl font-bold text-slate-900">{formData.clientName || 'Valued Client'}</h4>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-black text-[#0028AE] mb-4 leading-tight">
                  {formData.projectTitle || 'Untitled Project Execution'}
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {formData.workDescription || 'Summarize your achievements here...'}
                </p>
              </div>

              {/* Deliverables Grid in Preview */}
              <div className="mb-12">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-6">Execution Deliverables</p>
                <div className="space-y-4">
                  {formData.keyDeliverables.map((item, i) => (
                    item && (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="h-2 w-2 rounded-full bg-[#0028AE]" />
                        <p className="text-sm font-bold text-slate-800">{item}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Linked Invoice Reference */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Linked Statement</p>
                <p className="text-xs font-bold text-slate-900">Invoice: {invoice?._id.slice(-6) || 'INV-000'}</p>
                <p className="text-xs font-medium text-[#0028AE]">Amount: ₦{invoice?.total.toLocaleString() || '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400">Closure Date</p>
                <p className="text-xs font-bold text-slate-900">{new Date(formData.completionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSummaryStudio;