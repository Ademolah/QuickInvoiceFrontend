/* eslint-disable no-unused-vars */
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FileText, Search, ReceiptText } from "lucide-react";
// import { useCurrency } from "../context/CurrencyContext";
// // import LoadingState from "../components/LoadingState";
// import { motion } from "framer-motion";
// // import api from "../utils/api";

// // const brandBlue = "#0046A5";
// // const brandGreen = "#00B86B";


// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function Receipts() {
//   const [loading, setLoading] = useState(true);
//   const [invoices, setInvoices] = useState([]);
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API}/api/invoices`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // Only PAID invoices are receipt-ready
//         setInvoices(res.data.filter((i) => i.status === "paid"));
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const { code, } = useCurrency(); // 👈 get currency settings
    
//       // helper to format currency
//       const formatCurrency = (amount) =>
//         new Intl.NumberFormat('en', {
//           style: 'currency',
//           currency: code,
//         }).format(amount);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return invoices.slice(0, 10);
//     return invoices
//       .filter(
//         (i) =>
//           i.clientName?.toLowerCase().includes(q) ||
//           i.clientEmail?.toLowerCase().includes(q) ||
//           i._id?.toLowerCase().includes(q)
//       )
//       .slice(0, 10);
//   }, [invoices, query]);

  
//   // if(loading){
//   //   return <LoadingState title="Fetching your receipts..."/>
//   // }
//   if (loading) {
//       return (
//         <div className="flex items-center justify-center h-[70vh]">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             className="flex flex-col items-center"
//           >
//             <div className="w-14 h-14 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
//             <p className="mt-4 text-[#0046A5] font-semibold">
//               Fetching your receipts...
//             </p>
//           </motion.div>
//         </div>
//       );
//     }

//   return (
//     <div className="p-6 md:p-10 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white px-3 py-2 rounded-lg">
//             <ReceiptText size={20} />
//           </div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">
//             Receipts
//           </h1>
//         </div>

//         <div className="relative w-full max-w-xs">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by client or Receipt #"
//             className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 font-semibold text-gray-600">Receipt #</th>
//                 <th className="px-4 py-3 font-semibold text-gray-600">Client</th>
//                 <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
//                 <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
//                 <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-6 py-6 text-center text-[#0046A5] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg shadow-sm"
//                   >
//                     <span className="inline-block px-4 py-2 bg-[#0046A5]/10 text-[#0046A5] font-medium rounded-md">
//                       Receipts will be generated when you mark invoice as 
//                       <span className="text-[#00B86B] font-semibold"> "Paid"</span>
//                     </span>
//                   </td>

//                 </tr>
//               )}
//               {filtered.map((inv) => (
//                 <tr key={inv._id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3">{inv._id.slice(-6).toUpperCase()}</td>
//                   <td className="px-4 py-3">{inv.clientName}</td>
//                   <td className="px-4 py-3">{formatCurrency(Number(inv.total)).toLocaleString()}</td>
//                   <td className="px-4 py-3">
//                     {new Date(inv.createdAt).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => navigate(`/receipts/${inv._id}`)}
//                       className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0028AE] to-[#00A6FA] hover:opacity-90 transition"
//                     >
//                       <FileText size={16} />
//                       View Receipt
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer hint */}
//         <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
//           Showing up to 10 receipts. Use search to find more.
//         </div>
//       </div>

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
// }





import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Search, Receipt, ArrowRight, Wallet, Filter } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Receipts() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Only PAID invoices are receipt-ready
        setInvoices(res.data.filter((i) => i.status === "paid"));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices.slice(0, 10);
    return invoices
      .filter(
        (i) =>
          i.clientName?.toLowerCase().includes(q) ||
          i.clientEmail?.toLowerCase().includes(q) ||
          i._id?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [invoices, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
          <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Receipts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#0028AE]/10 p-2 rounded-xl">
              <Receipt size={24} className="text-[#0028AE]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Receipts
            </h1>
          </div>
          <p className="text-slate-500 font-medium">History of cleared transactions</p>
        </div>

        {/* Search Bar - Premium Styled */}
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-[#0028AE] transition-colors" size={20} />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client or Receipt #"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-[#0028AE]/5 focus:border-[#0028AE] transition-all font-bold text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-2xl shadow-slate-200/50"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Receipts Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">
              Only invoices marked as <span className="text-emerald-500 font-bold">Paid</span> will appear here for receipt generation.
            </p>
            <button 
              onClick={() => navigate("/invoices")}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0028AE] transition-colors"
            >
              Check Unpaid Invoices
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipt #</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Paid</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filtered.map((inv, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={inv._id} 
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-8 py-6 font-bold text-slate-400 font-mono">
                          #{inv._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-800">{inv.clientName}</p>
                          <p className="text-xs text-slate-400 font-medium">{inv.clientEmail || 'No Email'}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="font-black text-slate-900 text-lg">
                            {formatCurrency(Number(inv.total))}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-700 text-sm">
                               {new Date(inv.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                               })}
                             </span>
                             <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Fully Paid
                             </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => navigate(`/receipts/${inv._id}`)}
                            className="bg-[#0028AE] text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all group"
                          >
                            <FileText size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-8 py-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Showing top results. Search to filter deep records.
              </p>
              <div className="flex gap-2">
                <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                  {invoices.length} Total Receipts
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Premium Q Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-3xl hover:scale-110 active:scale-90 transition-all z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <span className="text-xl font-black">Q</span>
      </button>
    </div>
  );
}

