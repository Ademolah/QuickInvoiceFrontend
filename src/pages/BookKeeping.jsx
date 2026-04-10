/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  TrendingUp, 
  Search,
  ArrowLeft,
  X,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRef } from 'react'; 
import { useAlert } from '../context/AlertContext';

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Bookkeeping() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const reportRef = useRef(); 
  const [isExporting, setIsExporting] = useState(false);
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: 'General',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });



const handleExport = async () => {
  const element = reportRef.current;
  if (!element) return;

  setIsExporting(true);
  toast.loading("Polishing your financial report...");

  setTimeout(async () => {
    try {
      // THE FIX: We force html2canvas to render at a desktop-scale width
      // even if the user is on a small phone screen.
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#F8FAFC",
        // These properties force the "virtual" window size
        windowWidth: 1200, 
        width: 1200,
        onclone: (clonedDoc) => {
          // This ensures the cloned element in the virtual window 
          // doesn't have mobile padding/constraints
          const clonedElement = clonedDoc.querySelector('[ref="reportRef"]') || clonedDoc.body.querySelector('.p-8');
          if (clonedElement) {
            clonedElement.style.width = "1200px";
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.height / imgProps.width;
      const finalImgHeight = pdfWidth * ratio;

      // Center the image if it's smaller than the page, or fit to width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalImgHeight);
      
      pdf.save(`QuickInvoice_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.dismiss();
      toast.success("Executive Report Downloaded");
    } catch (error) {
      // toast.error("Export failed");
      showAlert("We couldn't export your report at this time. Please try again later.", "error");
    } finally {
      setIsExporting(false);
    }
  }, 500); // Increased timeout slightly to allow the virtual render to settle
};

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API}/api/bookkeeping`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        setTransactions(data.data);
        setStats(data.stats);
      }
    } catch (e) {
      toast.error("Failed to sync financial ledger");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/bookkeeping`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Transaction recorded");
      setShowModal(false);
      setFormData({ type: 'EXPENSE', amount: '', category: 'General', description: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (e) {
      // toast.error("Error saving transaction");
      showAlert("We couldn't save your transaction. Please check your inputs and try again.", "error");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* NAVIGATION & HEADER */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Real-time Business Intelligence</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Export P&L
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#0028AE] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} /> Record Expense
          </button>
        </div>
      </div>

      {/* STATS CARDS */}

    <div ref={reportRef} className={`p-8 rounded-3xl ${isExporting ? 'bg-[#F8FAFC]' : ''}`}>
  
  {/* PREMIUM REPORT HEADER - Only visible during export */}
  {isExporting && (
    <div className="mb-10 flex justify-between items-end border-b-2 border-[#0028AE] pb-6">
      <div>
        <h2 className="text-2xl font-black text-[#0028AE] tracking-tighter">
          QuickInvoice Intelligence
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Official Financial Statement
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase">Report Period</p>
        <p className="text-xs font-bold text-slate-800">{new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  )}

  {/* STATS CARDS */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <StatCard title="Total Revenue" amount={stats.totalIncome} icon={<ArrowUpRight className="text-emerald-600" />} color="bg-emerald-50" />
    <StatCard title="Total Expenses" amount={stats.totalExpense} icon={<ArrowDownLeft className="text-rose-600" />} color="bg-rose-50" />
    <StatCard title="Net Profit" amount={stats.netProfit} icon={<TrendingUp className="text-blue-600" />} color="bg-blue-50" isMain={true} />
  </div>

  {/* TABLE */}
  <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Recent Transactions</h3>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <input type="text" placeholder="Search ledger..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Date</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Description</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Category</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-xs font-bold text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="text-sm font-black text-slate-800">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Ref: {tx.referenceId || 'Manual Entry'}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-600 uppercase">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-black ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  {/* PREMIUM FOOTER - Only visible during export */}
  {isExporting && (
    <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        Generated by QuickInvoice Intelligence Suite
      </p>
      <p className="text-[9px] font-medium text-slate-300">
        Authentic Document ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </p>
    </div>
  )}
</div>
</div>

      {/* RECORD EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Record Expense</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl font-black text-lg focus:ring-2 focus:ring-[#0028AE]"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#0028AE]"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Rent</option>
                    <option>Utilities</option>
                    <option>Salary</option>
                    <option>Marketing</option>
                    <option>Software</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#0028AE]"
                    placeholder="e.g. Monthly Rent"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-[#0028AE] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all mt-4"
                >
                  Save Transaction
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// function StatCard({ title, amount, icon, color, isMain }) {
//   return (
//     <div className={`p-8 rounded-[2rem] border border-slate-100 shadow-sm ${isMain ? 'bg-[#0028AE] text-white shadow-blue-900/20' : 'bg-white text-slate-900'}`}>
//       <div className="flex justify-between items-start mb-4">
//         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMain ? 'bg-white/10 text-white' : color}`}>
//           {icon}
//         </div>
//       </div>
//       <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isMain ? 'text-blue-100' : 'text-slate-400'}`}>
//         {title}
//       </p>
//       <h2 className="text-3xl font-black">${Number(amount || 0).toLocaleString()}</h2>
//     </div>
//   );
// }

function StatCard({ title, amount, icon, color, isMain }) {
  return (
    <div className={`p-8 rounded-[2rem] border border-slate-100 shadow-sm ${isMain ? 'bg-[#0028AE] text-white shadow-blue-900/20' : 'bg-white text-slate-900'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMain ? 'bg-white/10 text-white' : color}`}>
          {icon}
        </div>
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isMain ? 'text-blue-100' : 'text-slate-400'}`}>
        {title}
      </p>
      {/* ₦ Symbol added with proper number formatting */}
      <h2 className="text-3xl font-black">
        ₦{Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}
      </h2>
    </div>
  );
}