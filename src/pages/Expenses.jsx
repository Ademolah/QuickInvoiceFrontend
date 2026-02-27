/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";


// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function Expenses() {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [month, setMonth] = useState("");
//   const [addExpense, setAddExpense] = useState(false)
//   const navigate = useNavigate()

//   const printRef = useRef(null)
//   const [exporting, setExporting] = useState(false)

//   const exportExpensesPDF = async () => {
//   try {
//     setExporting(true);
//     const element = printRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       windowWidth: 794,
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = 210;
//     const pageHeight = 297;
//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//     while (heightLeft > 0) {
//       position -= pageHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }
//     pdf.save(`Expenses-${month}.pdf`);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to export expenses");
//   } finally {
//     setExporting(false);
//   }
// };


//   const [form, setForm] = useState({
//     title: "",
//     category: "Others",
//     amount: "",
//     paymentMethod: "cash",
//     expenseDate: "",
//     note: "",
//   });

//   const token = localStorage.getItem("token");

//   const fetchExpenses = async (selectedMonth = "") => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API}/api/expenses${selectedMonth ? `?month=${selectedMonth}` : ""}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setExpenses(res.data.expenses);
//     } catch (err) {
//       alert("Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses(month);
//   }, [month]);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setAddExpense(true)
//     await axios.post(
//       `${API}/api/expenses`,
//       {
//         ...form,
//         amount: Number(form.amount),
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     setForm({
//       title: "",
//       category: "Others",
//       amount: "",
//       paymentMethod: "cash",
//       expenseDate: "",
//       note: "",
//     });
//     fetchExpenses(month);
//   } catch (error) {
//     console.error(error);
//     alert("Failed to add expense");
//   } finally {
//     setAddExpense(false)
//   }
// };


//   const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

//   if (loading) {
//       return (
//         <div className="flex items-center justify-center h-[70vh]">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             className="flex flex-col items-center"
//           >
//             <div className="w-14 h-14 border-4 border-[#0046A5] border-t-[#00A6FA] rounded-full animate-spin" />
//             <p className="mt-4 text-[#0046A5] font-semibold">
//               Preparing your Expenses…
//             </p>
//           </motion.div>
//         </div>
//       );
//     }

//   return (
//     <div className="p-4 sm:p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-[#0028AE]">Expenses</h1>
//         <p className="text-gray-500 text-sm">
//           Track and manage your business spending
//         </p>
//       </div>

//       {/* Controls */}
//      <div className="flex flex-col gap-1 w-full sm:w-auto mb-6">
//         <label className="text-sm font-medium text-gray-700">
//           Expense Month
//         </label>
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="border rounded-lg px-3 py-2 w-full sm:w-[220px]"
//         />
//       </div>

//       <div className="flex gap-3">
//       <button
//         onClick={exportExpensesPDF}
//         disabled={exporting || expenses.length === 0}
//         className="bg-[#0028AE] hover:bg-[#00A6FA] text-white px-4 py-2 rounded-lg text-sm font-medium shadow disabled:opacity-50 w-full sm:w-auto"
//       >
//         {exporting ? "Preparing PDF..." : "Print Expenses (PDF)"}
//       </button>
//     </div>


//       {/* Add Expense */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//       >
//         <input
//           placeholder="Expense title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="border rounded-lg px-3 py-2"
//           required
//         />
//         <select
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//           className="border rounded-lg px-3 py-2"
//         >
//           <option>Rent</option>
//           <option>Utilities</option>
//           <option>Internet</option>
//           <option>Transport</option>
//           <option>Supplies</option>
//           <option>Salary</option>
//           <option>Marketing</option>
//           <option>Maintenance</option>
//           <option>Others</option>
//         </select>
//         <input
//           type="number"
//           placeholder="Amount"
//           value={form.amount}
//           onChange={(e) => setForm({ ...form, amount: e.target.value })}
//           className="border rounded-lg px-3 py-2"
//           required
//         />
//         <select
//           value={form.paymentMethod}
//           onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
//           className="border rounded-lg px-3 py-2"
//         >
//           <option value="cash">Cash</option>
//           <option value="transfer">Transfer</option>
//           <option value="card">Card</option>
//         </select>


//         {/* date */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium text-gray-700">
//             Expense Date
//           </label>
//           <input
//             type="date"
//             value={form.expenseDate}
//             onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
//             className="border rounded-lg px-3 py-2"
//             required
//           />
//         </div>

        
//         <button
//           type="submit"
//           className="bg-[#0028AE] hover:bg-[#00A6FA] text-white rounded-lg px-4 py-2 font-medium"
//         >
//           {addExpense ? "Adding...": "Add Expense"}
//         </button>
//       </form>

//       {/* Expense List */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-3 text-left">Title</th>
//               <th className="p-3 text-right">Amount</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.map((e) => (
//               <tr key={e._id} className="border-b">
//                 <td className="p-3">{e.title}</td>
//                 <td className="p-3 text-right font-medium">
//                   ₦{e.amount.toLocaleString()}
//                 </td>
//                 <td className="p-3">{e.category}</td>
//                 <td className="p-3">
//                   {new Date(e.expenseDate).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Summary */}
//       <div className="mt-6 text-right">
//         <p className="text-sm text-gray-500">Total Expenses</p>
//         <p className="text-2xl font-bold text-[#0028AE]">
//           ₦{totalExpenses.toLocaleString()}
//         </p>
//       </div>


//       {/* printable statement */}

//       <div className="absolute left-[-9999px] top-0">
//   <div
//     ref={printRef}
//     className="bg-white p-8 text-gray-800"
//     style={{ width: "794px" }} // A4 width
//   >
//     {/* Header */}
//     <div className="flex justify-between items-start mb-6">
//       <div>
//         <h1 className="text-2xl font-bold text-[#0028AE]">
//           Expenses Statement
//         </h1>
//         <p className="text-sm text-gray-500">Period: {month}</p>
//       </div>
//       <div className="text-right">
//         <h2 className="font-semibold text-lg">QuickInvoice</h2>
//         <p className="text-xs text-gray-500">
//           Professional Expense Report
//         </p>
//       </div>
//     </div>
//     {/* Table */}
//     <table className="w-full border-collapse text-sm">
//       <thead className="bg-gray-100">
//         <tr>
//           <th className="p-2 text-left">Title</th>
//           <th className="p-2 text-left">Category</th>
//           <th className="p-2 text-left">Payment</th>
//           <th className="p-2 text-right">Amount</th>
//           <th className="p-2 text-left">Date</th>
//         </tr>
//       </thead>
//       <tbody>
//         {expenses.map((e) => (
//           <tr key={e._id} className="border-b">
//             <td className="p-2">{e.title}</td>
//             <td className="p-2">{e.category}</td>
//             <td className="p-2 capitalize">{e.paymentMethod}</td>
//             <td className="p-2 text-right font-medium">
//               ₦{e.amount.toLocaleString()}
//             </td>
//             <td className="p-2">
//               {new Date(e.expenseDate).toLocaleDateString()}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     {/* Summary */}
//     <div className="mt-6 flex justify-end">
//       <div className="w-1/2 border rounded-lg p-4 bg-gray-50">
//         <div className="flex justify-between text-sm">
//           <span>Total Expenses</span>
//           <span className="font-semibold">
//             ₦{totalExpenses.toLocaleString()}
//           </span>
//         </div>
//       </div>
//     </div>
//     {/* Footer */}
//     <div className="mt-8 text-center text-xs text-gray-400">
//       Generated by QuickInvoice • Smart Business Tools
//     </div>
//   </div>
// </div>

//     {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
//         >
//           Q
//         </button>


//     </div>
//   );
// }




import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Plus, FileText, Calendar, Wallet, PieChart, 
  ArrowLeft, X, TrendingDown, MoreHorizontal, Trash2
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

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

  const [form, setForm] = useState({
    title: "", category: "Others", amount: "", paymentMethod: "transfer", expenseDate: new Date().toISOString().split('T')[0], note: "",
  });

  const categories = ["Rent", "Utilities", "Internet", "Transport", "Supplies", "Salary", "Marketing", "Maintenance", "Others"];

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
                    <FileText size={16} /> {exporting ? "Generating..." : "Download Report"}
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
                            <div className="text-right">
                                <p className="text-lg font-black text-slate-900">{formatCurrency(e.amount)}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{e.paymentMethod}</p>
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
                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Payment Method</label>
                             <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0028AE]">
                                <option value="transfer">Bank Transfer</option>
                                <option value="cash">Cash</option>
                                <option value="card">Credit/Debit Card</option>
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


