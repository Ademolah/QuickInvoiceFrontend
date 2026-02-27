/* eslint-disable no-unused-vars */
// // src/pages/Billing.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { CreditCard, CheckCircle,  Clock } from "lucide-react";
// // import api from "../utils/api";

// // const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function Billing() {
//   const [user, setUser] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [upgradeLoading, setUpgradeLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchUserAndHistory = async () => {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Not authenticated. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch user profile
//         const res = await axios.get(`${API}/api/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // accept either { user: {...}} or {...}
//         const userData = res.data.user || res.data;
//         setUser(userData);

//         // Optional: fetch payment history if route exists
//         try {
//           const h = await axios.get(`${API}/api/payments/history`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setHistory(h.data.history || h.data || []);
//         } catch (err) {
//           // ignore if not present (404) or log
//           if (err.response && err.response.status !== 404) {
//             console.warn("Payment history fetch failed:", err.message);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError(err.response?.data?.message || err.message || "Failed to fetch user");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAndHistory();
//   }, []);

//   const isPro = user?.plan === "pro";
//   const proExpires = user?.proExpires ? new Date(user.proExpires) : null;

//   const handleUpgrade = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("You must be logged in to upgrade.");
//       return;
//     }

//     try {
//       setUpgradeLoading(true);
//       const init = await axios.post(
//         `${API}/api/payments/initialize`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Paystack returns structure under data.data
//       const checkoutUrl = init.data?.data?.authorization_url || init.data?.authorization_url;
//       if (!checkoutUrl) {
//         throw new Error("Payment initialization failed (missing checkout URL).");
//       }
//       // Redirect user to Paystack checkout
//       window.location.href = checkoutUrl;
//     } catch (err) {
//       console.error("Payment init error:", err);
//       alert(err.response?.data?.message || err.message || "Failed to start payment.");
//     } finally {
//       setUpgradeLoading(false);
//     }
//   };

//   // Loading & error UI
//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
//   //       <div className="text-center">
//   //         <Loader2 className="mx-auto animate-spin text-[#0046A5]" />
//   //         <p className="mt-3 text-[#0046A5] font-semibold">Loading billing...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }
//   if (loading) {
//           return (
//             <div className="flex items-center justify-center h-[70vh]">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="flex flex-col items-center"
//               >
//                 <div className="w-14 h-14 border-4 border-[#0046A5] border-t-[#00B86B] rounded-full animate-spin" />
//                 <p className="mt-4 text-[#0046A5] font-semibold">
//                   Loading billing...
//                 </p>
//               </motion.div>
//             </div>
//           );
//         }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
//         <div className="max-w-lg p-6 bg-white rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-[#0046A5]">Billing</h3>
//           <p className="mt-3 text-sm text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 md:p-12 bg-[#F9FAFB]">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="flex items-center justify-between mb-8"
//         >
//           <div>
//             <h1 className="text-3xl font-bold text-[#0046A5] font-poppins">Billing & Subscription</h1>
//             <p className="mt-1 text-gray-600">Manage your plan, view usage and payment history.</p>
//           </div>

//           <div className="text-right">
//             <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm ${
//               isPro ? "bg-[#00B86B]/10 text-[#00B86B]" : "bg-[#0046A5]/10 text-[#0046A5]"
//             }`}>
//               <CreditCard className={`${isPro ? "text-[#00B86B]" : "text-[#0046A5]"}`} />
//               {isPro ? "PRO" : "FREE"}
//             </span>
//           </div>
//         </motion.div>

//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           {/* Plan card */}
//           <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-[#0046A5]">Current Plan</h3>
//                   <p className="mt-1 text-sm text-gray-500">Your active subscription</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xl font-bold text-[#0046A5]">{(user?.plan || "Free").toUpperCase()}</p>
//                   {proExpires && <p className="text-xs text-gray-500 mt-1">Expires {proExpires.toLocaleString()}</p>}
//                 </div>
//               </div>

//               <div className="mt-6">
//                 {!isPro ? (
//                   <button
//                     onClick={handleUpgrade}
//                     disabled={upgradeLoading}
//                     className="w-full bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white py-3 rounded-xl font-semibold shadow hover:opacity-95 disabled:opacity-60"
//                   >
//                     {upgradeLoading ? "Redirecting..." : "Upgrade to Pro (₦3,000 / month)"}
//                   </button>
//                 ) : (
//                   <div className="flex items-center gap-2 text-green-600 font-medium">
//                     <CheckCircle /> You have Pro
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>

//           {/* Usage card */}
//           <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//             {user?.plan === "free" && (
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-[#0046A5]">Usage This Month</h3>
//                 <Clock className="text-gray-400" />
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Invoices issued</p>
//                   <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//                     <div
//                       className="h-3 bg-[#0046A5]"
//                       style={{
//                         width: `${Math.min(100, ((user?.usage?.invoicesThisMonth || 0) / 15) * 100)}%`,
//                       }}
//                     />
//                   </div>
//                   <p className="mt-2 text-sm text-gray-600">
//                     {user?.usage?.invoicesThisMonth || 0} / 15 (free limit)
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">Receipts issued</p>
//                   <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//                     <div
//                       className="h-3 bg-[#00B86B]"
//                       style={{
//                         width: `${Math.min(100, ((user?.usage?.receiptsThisMonth || 0) / 15) * 100)}%`,
//                       }}
//                     />
//                   </div>
//                   <p className="mt-2 text-sm text-gray-600">
//                     {user?.usage?.receiptsThisMonth || 0} / 15 (free limit)
//                   </p>
//                 </div>
//               </div>
//             </div>)}
//           </motion.div>

//           {/* Account details */}
//           <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
//               <h3 className="text-lg font-semibold text-[#0046A5]">Account Details</h3>
//               <p className="mt-3 text-sm text-gray-700">
//                 <span className="font-medium">{user?.accountDetails?.accountName || "-"}</span>
//               </p>
//               <p className="text-sm text-gray-500">
//                 {user?.accountDetails?.bankName || "-"} • {user?.accountDetails?.accountNumber || "-"}
//               </p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Payment history */}
//         <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//             <h3 className="text-lg font-semibold text-[#0046A5]">Payment History</h3>

//             {history.length === 0 ? (
//               <p className="mt-4 text-gray-600">Coming soon...</p>
//             ) : (
//               <div className="mt-4 overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="text-xs text-gray-500">
//                       <th className="py-2">Date</th>
//                       <th className="py-2">Reference</th>
//                       <th className="py-2">Amount</th>
//                       <th className="py-2">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {history.map((h, i) => (
//                       <tr key={i} className="border-t">
//                         <td className="py-2 text-sm text-gray-700">{new Date(h.createdAt || h.paidAt || h.date).toLocaleString()}</td>
//                         <td className="py-2 text-sm text-gray-700">{h.reference || h.transaction || "-"}</td>
//                         <td className="py-2 text-sm text-gray-700">₦{((h.amount || 0) / 100).toLocaleString()}</td>
//                         <td className="py-2 text-sm">
//                           <span className={`px-2 py-1 rounded-full text-xs ${h.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
//                             {h.status || h.paymentStatus || "unknown"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </motion.div>
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
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
//         >
//           Q
//         </button>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, CheckCircle, Clock, Zap, 
  ArrowLeft, ShieldCheck, Landmark, Receipt, 
  FileText, TrendingUp 
} from "lucide-react";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Billing() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user || res.data);

        const h = await axios.get(`${API}/api/payments/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(h.data.history || h.data || []);
      } catch (err) {
        console.error("Billing fetch error:", err);
        setError("Unable to sync billing data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndHistory();
  }, []);

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    try {
      setUpgradeLoading(true);
      const init = await axios.post(`${API}/api/payments/initialize`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const checkoutUrl = init.data?.data?.authorization_url || init.data?.authorization_url;
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      alert("Payment gateway is temporarily unavailable.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const isPro = user?.plan === "pro";
  const invoiceUsage = user?.usage?.invoicesThisMonth || 0;
  const receiptUsage = user?.usage?.receiptsThisMonth || 0;
  const LIMIT = 15;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0028AE] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Securing Connection...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billing</h1>
          </div>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border font-black text-[10px] uppercase tracking-[0.15em] ${
            isPro ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <ShieldCheck size={14} />
            {isPro ? "Pro Member" : "Standard Plan"}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Plan Card */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               {isPro && <Zap className="absolute -right-6 -top-6 text-emerald-50" size={150} />}
               
               <div className="relative z-10">
                 <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Active Subscription</h2>
                 <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="text-4xl font-black text-slate-900">{isPro ? "Premium Pro" : "Free Starter"}</h3>
                    <span className="text-slate-400 font-bold text-sm">/ monthly</span>
                 </div>

                 {!isPro ? (
                   <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                     <p className="text-slate-700 font-bold text-sm mb-4">Why upgrade to Pro?</p>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {[ "Unlimited Invoices", "Unlimited Receipts", "Expense Analytics", "Premium PDF Templates", "Priority Support", "Custom Branding" ].map((feature) => (
                         <li key={feature} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                           <CheckCircle size={14} className="text-[#0028AE]" /> {feature}
                         </li>
                       ))}
                     </ul>
                   </div>
                 ) : (
                   <div className="mb-8 py-4 px-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <CheckCircle size={20} />
                     </div>
                     <div>
                       <p className="text-emerald-900 font-black text-sm">All Pro features unlocked</p>
                       {user?.proExpires && <p className="text-emerald-600 text-[10px] font-bold">Next renewal: {new Date(user.proExpires).toLocaleDateString()}</p>}
                     </div>
                   </div>
                 )}

                 {!isPro && (
                   <button 
                     onClick={handleUpgrade}
                     disabled={upgradeLoading}
                     className="w-full py-5 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     {upgradeLoading ? "Preparing Secure Gateway..." : "Upgrade to Pro — ₦3,000 / month"}
                   </button>
                 )}
               </div>
            </section>

            {/* Payment History */}
            <section>
              <h2 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em] ml-2 mb-4">Transaction History</h2>
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-12 text-center">
                    <Clock size={32} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 font-bold text-sm">No recent transactions found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {history.map((h, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{h.reference || "Subscription"}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {new Date(h.createdAt || h.paidAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-sm">₦{((h.amount || 0) / 100).toLocaleString()}</p>
                          <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">{h.status || "Success"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Usage Stats */}
            {!isPro && (
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-[#0028AE]" />
                  <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">Monthly Usage</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                      <span>Invoices</span>
                      <span>{invoiceUsage}/{LIMIT}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(invoiceUsage/LIMIT)*100}%` }} 
                        className={`h-full rounded-full ${invoiceUsage >= LIMIT ? 'bg-rose-500' : 'bg-[#0028AE]'}`} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                      <span>Receipts</span>
                      <span>{receiptUsage}/{LIMIT}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(receiptUsage/LIMIT)*100}%` }} 
                        className={`h-full rounded-full ${receiptUsage >= LIMIT ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      />
                    </div>
                  </div>
                </div>
                
                <p className="mt-6 text-[11px] text-slate-400 font-medium leading-relaxed">
                  Resetting in <span className="text-slate-900 font-bold">12 days</span>. Upgrade for unlimited access.
                </p>
              </div>
            )}

            {/* Account Details */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <Landmark className="absolute -right-4 -bottom-4 text-white/5" size={120} />
              <h3 className="text-white/50 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Payout Account</h3>
              <p className="text-lg font-black mb-1">{user?.accountDetails?.accountName || "No Name Set"}</p>
              <p className="text-white/60 font-medium text-sm mb-6">{user?.accountDetails?.bankName || "Not Connected"}</p>
              
              <div className="inline-block py-2 px-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-xs font-mono tracking-widest">
                {user?.accountDetails?.accountNumber || "••••••••••"}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Q */}
      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-[#0028AE] text-white flex items-center justify-center rounded-full shadow-2xl z-50 font-black text-xl active:scale-90 transition-transform">Q</button>
    </div>
  );
}