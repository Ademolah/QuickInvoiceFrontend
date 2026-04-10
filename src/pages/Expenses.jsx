/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */




import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Plus, FileText, Calendar, Wallet, PieChart, 
  ArrowLeft, X, TrendingDown, MoreHorizontal, Trash2, ShieldCheck,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useAlert } from "../context/AlertContext";

// import toast from "react-hot-toast"; // Add this for premium feedback

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Expenses() {
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const token = localStorage.getItem("token");

  // State
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showAlert } = useAlert();

  // const [form, setForm] = useState({
  //   title: "", category: "Others", amount: "", paymentMethod: "transfer", expenseDate: new Date().toISOString().split('T')[0], note: "",
  // });

  const categories = ["Rent", "Utilities", "Internet", "Transport", "Supplies", "Salary", "Marketing", "Maintenance", "Others"];

  //new intelligence feature 

  const [user, setUser] = useState(null); // Added for Pro check

  const [form, setForm] = useState({
    title: "", 
    category: "Others", 
    amount: "", 
    paymentMethod: "transfer", 
    expenseDate: new Date().toISOString().split('T')[0], 
    note: "",
    isRecurring: false, // NEW: Recurring Logic
    isTaxDeductible: false // NEW: Tax Logic
  });

  // NEW: Fetch user for Pro validation
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);
  
  
  
  const fetchExpenses = async (selectedMonth = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/expenses${selectedMonth ? `?month=${selectedMonth}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(month); }, [month]);

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post(`${API}/api/expenses`, { ...form, amount: Number(form.amount) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: "", category: "Others", amount: "", paymentMethod: "transfer", expenseDate: new Date().toISOString().split('T')[0], note: "" });
      setIsModalOpen(false);
      fetchExpenses(month);
    } catch (error) {
      alert("Failed to add expense");
    } finally {
      setIsSaving(false);
    }
  };



const exportExpensesPDF = async () => {
  setExporting(true);
  try {

    // PRO GUARD: Only Pro users can export the Expenditure Statement
    if (user?.plan !== 'pro' && user?.plan !== 'enterprise') {
  // Replace the locked toast with a high-conversion Premium Modal
  showAlert(
    "Premium Feature: Monthly Statements are reserved for our Pro and Enterprise users. Upgrade your plan to unlock deep business insights.", 
    "warning"
  );
  return;
}

    setExporting(true);
    
    const element = printRef.current;
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true,
      logging: false,
      width: 800,       // Explicitly capture 800px
      windowWidth: 800  // Force virtual window to 800px
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Expenses-Statement-${month}.pdf`);
  } catch (err) {
    alert("Export failed");
  } finally {
    setExporting(false);
  }
};


  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-slate-600" />
               </button>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expenses</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">Control your business burn rate</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="month" 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)} 
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0028AE] w-full"
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0028AE] text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
            >
                <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* Summary Analytics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 bg-gradient-to-br from-[#0028AE] to-[#00A6FA] rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
                <TrendingDown className="absolute -right-4 -bottom-4 text-white/10" size={180} />
                <div>
                    <p className="text-white/80 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Monthly Spend</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-1">{formatCurrency(totalExpenses)}</h2>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Wallet size={14} />
                        <span>Aggregated from {expenses.length} records</span>
                    </div>
                </div>
                <button 
                    onClick={exportExpensesPDF}
                    disabled={exporting || expenses.length === 0}
                    className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold py-3 px-6 rounded-2xl w-fit hover:bg-white/30 transition-all flex items-center gap-2"
                >
                    <FileText size={16} /> 
                    {exporting ? "Generating..." : "Download Report"}
                    {/* Add this small indicator if you have user state */}
                    {user?.plan !== 'pro' && user?.plan !== 'enterprise' && (
                      <span className="ml-1 text-[8px] bg-[#0028AE]/10 text-[#0028AE] px-1.5 py-0.5 rounded-full font-black border border-[#0028AE]/20">
                        PRO
                      </span>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <PieChart className="text-[#0028AE]" size={28} />
                </div>
                <h3 className="text-slate-900 font-black text-lg">Insights</h3>
                <p className="text-slate-400 text-sm font-medium mt-1 leading-relaxed">Most of your money went to <span className="text-slate-900 font-bold uppercase text-[10px] tracking-wider">{expenses[0]?.category || '...'}</span> this month.</p>
            </div>
        </div>

        {/* Expense Timeline/List */}
        <div className="space-y-4">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em] ml-2">Timeline</h3>
            {loading ? (
                <div className="py-20 text-center opacity-40">
                    <div className="w-8 h-8 border-4 border-[#0028AE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-bold text-xs uppercase tracking-widest">Syncing Records...</p>
                </div>
            ) : expenses.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No expenses logged for this period.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {expenses.map((e) => (
                        <motion.div 
                            key={e._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    e.paymentMethod === 'cash' ? 'bg-amber-50 text-amber-600' : 
                                    e.paymentMethod === 'card' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    <TrendingDown size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 leading-tight">{e.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">{e.category}</span>
                                        <span className="text-slate-300 text-xs">•</span>
                                        <span className="text-slate-400 text-[11px] font-medium">{new Date(e.expenseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-lg font-black text-slate-900">{formatCurrency(e.amount)}</p>
                                <div className="flex items-center gap-2">
                                    {e.isTaxDeductible && <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Taxable</span>}
                                    {e.isRecurring && (
                                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                                            Monthly
                                        </span>
                                    )}
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{e.paymentMethod}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Slide-up Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[101] p-8 max-w-2xl mx-auto shadow-2xl"
            >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Expense</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Title</label>
                             <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Office Rent" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]" />
                        </div>
                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Amount</label>
                             <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]" />
                        </div>
                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Category</label>
                             <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        </div>

                        {/* PREMIUM TOGGLES Row */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-3 mt-2">
                           <button 
                            type="button"
                            onClick={() => setForm({...form, isRecurring: !form.isRecurring})}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${form.isRecurring ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                           >
                             <span className="text-[10px] font-black uppercase tracking-widest">Monthly</span>
                             <Calendar size={16} className={form.isRecurring ? 'text-blue-600' : 'text-slate-300'} />
                           </button>

                           <button 
                            type="button"
                            onClick={() => setForm({...form, isTaxDeductible: !form.isTaxDeductible})}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${form.isTaxDeductible ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                           >
                             <span className="text-[10px] font-black uppercase tracking-widest">Taxable</span>
                             <PieChart size={16} className={form.isTaxDeductible ? 'text-emerald-600' : 'text-slate-300'} />
                           </button>
                        </div>

                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Method</label>
                             <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]">
                                <option value="transfer">Bank Transfer</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                             </select>
                        </div>
                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Date</label>
                             <input type="date" required value={form.expenseDate} onChange={e => setForm({...form, expenseDate: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]" />
                        </div>
                    </div>
                    <button disabled={isSaving} className="w-full py-5 bg-[#0028AE] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 mt-4 active:scale-95 transition-all">
                        {isSaving ? "Syncing..." : "Add Expense Record"}
                    </button>
                </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Back (Consistency) */}
      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-full shadow-2xl z-40 font-black text-xl">Q</button>

      {/* HIDDEN PRINT STATEMENT (Premium Corporate Style) */}
<div style={{ position: "absolute", left: "-9999px", top: 0 }}>
  <div 
    ref={printRef} 
    className="bg-white p-16 text-slate-900" 
    style={{ width: "800px", display: "block" }}
  >
    {/* Header */}
    <div className="flex justify-between items-end border-b-8 border-slate-900 pb-8 mb-12">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-3">
          Expenditure<br/>Statement
        </h1>
        {/* NEW: Business Name Insertion */}
        <p className="text-xl font-black text-[#0028AE] uppercase tracking-tight mb-3">
           {user?.businessName || "Your Business"}
        </p>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">
          Period: {new Date(month + "-02").toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="text-right">
        <p className="font-black text-2xl uppercase tracking-widest text-[#0028AE] mb-1">QuickInvoice</p>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Verified Digital Audit</p>
      </div>
    </div>

    {/* Table - Using table-fixed and defined widths to prevent cutoff */}
    <table className="w-full mb-12 table-fixed border-collapse">
      <thead>
        <tr className="bg-slate-900 text-white">
          <th className="p-4 text-left text-[11px] font-black uppercase tracking-wider w-[30%]">Title</th>
          <th className="p-4 text-left text-[11px] font-black uppercase tracking-wider w-[20%]">Category</th>
          <th className="p-4 text-left text-[11px] font-black uppercase tracking-wider w-[15%]">Method</th>
          <th className="p-4 text-right text-[11px] font-black uppercase tracking-wider w-[20%]">Status</th>
          <th className="p-4 text-right text-[11px] font-black uppercase tracking-wider w-[20%]">Amount</th>
          <th className="p-4 text-right text-[11px] font-black uppercase tracking-wider w-[15%]">Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e._id} className="border-b border-slate-100">
            <td className="p-4 font-bold text-sm truncate">{e.title}</td>
            <td className="p-4 text-xs font-semibold text-slate-500 uppercase">{e.category}</td>
            <td className="p-4 text-[10px] uppercase font-black text-slate-400 tracking-tighter">{e.paymentMethod}</td>
            {/* NEW COLUMN CONTENT */}
            <td className="p-4 text-[9px] font-bold">
                {e.isTaxDeductible ? <span className="text-emerald-600">TAXABLE</span> : "-"}
                {e.isRecurring && <span className="text-blue-600 ml-1">• RECURRING</span>}
            </td>
            <td className="p-4 text-right font-black text-sm">{formatCurrency(e.amount)}</td>
            <td className="p-4 text-right text-[11px] font-medium text-slate-500">
                {new Date(e.expenseDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Summary Section */}
    <div className="flex justify-end">
      <div className="w-72 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 text-right">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Monthly Spend</p>
        <p className="text-3xl font-black text-[#0028AE]">{formatCurrency(totalExpenses)}</p>
      </div>
    </div>
    
    {/* Footer */}
    <div className="mt-24 pt-8 border-t border-dashed border-slate-200 text-center">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
        Official Financial Document • Generated on {new Date().toLocaleDateString()}
      </p>
    </div>
  </div>
</div>
    </div>
  );
}
