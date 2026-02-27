/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { Trash2,  Eye, CheckCircle } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import { useCurrency } from "../context/CurrencyContext";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// // import LoadingState from "../components/LoadingState";
// // import api from "../utils/api";

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// const InvoiceList = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();


//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API}/api/invoices`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoices(res.data);
//     } catch (err) {
//       setError("Failed to fetch invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const { code, } = useCurrency(); // 👈 get currency settings
  
//     // helper to format currency
//     const formatCurrency = (amount) =>
//       new Intl.NumberFormat('en', {
//         style: 'currency',
//         currency: code,
//       }).format(amount);

//   const deleteInvoice = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this invoice?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API}/api/invoices/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoices(invoices.filter(inv => inv._id !== id));
//     } catch (err) {
//       alert("Failed to delete invoice");
//     }
//   };

//   // const updateInvoice = async (id) => {
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     await axios.delete(`${API}/api/invoices/${id}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     setInvoices(invoices.filter(inv => inv._id !== id));
//   //   } catch (err) {
//   //     alert("Failed to delete invoice");
//   //   }
//   // };

//   const markPaid = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.patch(`${API}/api/invoices/${id}/pay`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoices(invoices.map(inv => (inv._id === id ? res.data : inv)));
//       toast.success("Receipt generated successfully!");
//     } catch (err) {
//       alert("Failed to mark as paid");
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

  
//   // if(loading) return <LoadingState title="Loading your invoices..."/>
//   if (loading) {
//         return (
//           <div className="flex items-center justify-center h-[70vh]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               className="flex flex-col items-center"
//             >
//               <div className="w-14 h-14 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
//               <p className="mt-4 text-[#0046A5] font-semibold">
//                 Fetching your Invoices...
//               </p>
//             </motion.div>
//           </div>
//         );
//       }
//   if(error) return <div className="text-center mt-20 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 md:p-10">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-[#0046A5]">Invoices</h1>
//         <button
//             onClick={() => navigate('/invoices/new')}
//             className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded shadow transition-all duration-300"
//             >
//             Create New Invoice
//             </button>
//       </div>

//       {invoices.length === 0 ? (
//         <div className="text-center text-gray-500 mt-20">No invoices found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
//             <thead className="bg-[#0046A5] text-white">
//               <tr>
//                 <th className="text-left px-4 py-3">Client</th>
//                 <th className="text-left px-4 py-3">Total</th>
//                 <th className="text-left px-4 py-3">Status</th>
//                 <th className="text-left px-4 py-3">Due Date</th>
//                 <th className="text-center px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.map((inv) => (
//                 <tr key={inv._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">
//                         <Link to={`/invoices/${inv._id}`} className="text-[#0046A5] font-semibold hover:underline">
//                             {inv.clientName}
//                         </Link>
//                     </td>
//                   <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
//                   <td className={`px-4 py-3 font-semibold ${inv.status === 'paid' ? 'text-green-600' : inv.status === 'overdue' ? 'text-red-600' : 'text-gray-700'}`}>
//                     {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
//                   </td>
//                   <td className="px-4 py-3">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
//                   <td className="px-4 py-3 flex justify-center gap-2">
//                     <button
//                       onClick={() => markPaid(inv._id)}
//                       to={`/invoices/${inv._id}`}
//                       className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition"
//                       title="Mark Paid"
//                       disabled={inv.status === 'paid'}
//                     >
//                       <CheckCircle size={18} />
//                     </button>
//                     <Link
//                       to={`/invoices/${inv._id}`}
//                       className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition"
//                       title="View"
//                     >
//                       <Eye size={18} />
//                     </Link>
//                     {/* <Link
//                       onClick={()=> updateInvoice(inv._id)}
//                       className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200 transition"
//                       title="Edit"
//                     >
//                       <Edit size={18} />
//                     </Link> */}
//                     <button
//                       onClick={() => deleteInvoice(inv._id)}
//                       className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition"
//                       title="Delete"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Back to Dashboard button */}
//       {/* <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           ⬅ Back to Dashboard
//         </button>
//       </div> */}
//       {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
//         >
//           Q
//         </button>

//     </div>
//   );
// };

// export default InvoiceList;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, Eye, CheckCircle, Search, Filter, 
  Plus, MoreVertical, Calendar, User, ArrowLeft , FileText, LayoutDashboard
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API = "https://quickinvoice-backend-1.onrender.com";

// const API = "http://localhost:4000";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { code } = useCurrency();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: code,
    }).format(amount);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
      setFilteredInvoices(res.data);
    } catch (err) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Search Logic
  useEffect(() => {
    const results = invoices.filter(inv =>
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const markPaid = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API}/api/invoices/${id}/pay`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(invoices.map(inv => (inv._id === id ? res.data : inv)));
      toast.success("Payment Verified & Receipt Generated");
    } catch (err) {
      toast.error("Payment update failed");
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Move this invoice to trash?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(invoices.filter(inv => inv._id !== id));
      toast.success("Invoice deleted");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  if (loading) return <ListSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <button onClick={() => navigate('/dashboard')} className="p-1 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
                 <ArrowLeft size={18} className="text-slate-400" />
               </button>
               <h1 className="text-2xl font-black text-[#001325] tracking-tight">Invoices</h1>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage your business billing</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0028AE]/20 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => navigate('/invoices/new')}
              className="flex items-center gap-2 bg-[#0028AE] hover:bg-[#001325] text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-700/20 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Invoice</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {filteredInvoices.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-black text-[#001325]">No invoices found</h3>
            <p className="text-slate-400 font-bold text-sm mt-1">Try changing your search or create a new one.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-5 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="col-span-1">Client</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Due Date</div>
              <div className="text-right">Manage</div>
            </div>

            {/* Invoice Rows */}
            <AnimatePresence>
              {filteredInvoices.map((inv, idx) => (
                <motion.div
                  key={inv._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-slate-100 p-5 md:px-8 md:py-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-4">
                    {/* Client Info */}
                    <div className="col-span-1 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0028AE] flex items-center justify-center font-black">
                        {inv.clientName.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/invoices/${inv._id}`} className="block text-sm font-black text-[#001325] hover:text-[#0028AE] transition-colors truncate max-w-[120px]">
                          {inv.clientName}
                        </Link>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">INV-{inv._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right md:text-left">
                      <p className="text-sm font-black text-[#001325]">{formatCurrency(inv.total)}</p>
                    </div>

                    {/* Status Pill */}
                    <div>
                      <StatusPill status={inv.status} />
                    </div>

                    {/* Due Date */}
                    <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs">
                      <Calendar size={14} />
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No date'}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 md:col-span-1 flex justify-end items-center gap-2">
                      <button
                        onClick={() => markPaid(inv._id)}
                        disabled={inv.status === 'paid'}
                        className={`p-2.5 rounded-xl transition-all ${inv.status === 'paid' ? 'bg-slate-50 text-slate-300' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <Link to={`/invoices/${inv._id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => deleteInvoice(inv._id)}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile Floating Action */}
      <button
        onClick={() => navigate("/dashboard")}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#001325] text-white px-6 py-3 rounded-full font-black text-sm shadow-2xl z-50 flex items-center gap-2 active:scale-95 transition-transform"
      >
        <LayoutDashboard size={18} />
        Dashboard
      </button>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    paid: "bg-emerald-50 text-emerald-600",
    overdue: "bg-red-50 text-red-600",
    pending: "bg-amber-50 text-amber-600",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
};

const ListSkeleton = () => (
  <div className="p-10 max-w-7xl mx-auto space-y-6">
    <div className="h-12 w-48 bg-slate-200 rounded-full animate-pulse" />
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-24 bg-white border border-slate-100 rounded-[2rem] animate-pulse" />
    ))}
  </div>
);

export default InvoiceList;
