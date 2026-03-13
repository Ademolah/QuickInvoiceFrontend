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
  FileText, TrendingUp, Building, Sparkles, X, Palette, Layout, Check, Shield
} from "lucide-react";
import toast from "react-hot-toast";

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
      // 1. Fetch User Profile
      const userRes = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user || userRes.data);

      // 2. Fetch the New Subscription History (Updated Route)
      const historyRes = await axios.get(`${API}/api/users/subscription-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mapping history based on the { success: true, data: history } structure
      setHistory(historyRes.data.data || []);

    } catch (err) {
      console.error("Billing fetch error:", err);
      setError("Unable to sync billing data.");
    } finally {
      setLoading(false);
    }
  };

  fetchUserAndHistory();
}, []);


  const handleUpgrade = async (planType = 'pro') => {
  const token = localStorage.getItem("token");
  
  // 1. Safety check
  if (!token) {
    toast.error("Please log in to continue");
    return;
  }

  try {
    setUpgradeLoading(true);
    
    // 2. Clear visual feedback
    const planName = planType === 'enterprise' ? 'Enterprise' : 'Pro';
    toast.loading(`Preparing ${planName} Checkout...`, { id: 'payment-loading' });

    // 3. API Call with the plan payload
    const response = await axios.post(
      `${API}/api/payments/initialize`, 
      { plan: planType }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 4. Handle Paystack Redirection
    // We check both nested and flat data structures to be safe
    const checkoutUrl = response.data?.data?.authorization_url || response.data?.authorization_url;

    if (checkoutUrl) {
      toast.success("Redirecting to Secure Gateway...", { id: 'payment-loading' });
      // Small delay so user can see the success state before redirecting
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 800);
    } else {
      throw new Error("Invalid response from payment server");
    }

  } catch (err) {
    console.error("Payment init error:", err);
    toast.error(
      err.response?.data?.message || "Payment gateway unavailable. Please try again.", 
      { id: 'payment-loading' }
    );
  } finally {
    setUpgradeLoading(false);
  }
};

  const isPro = user?.plan === "pro";
  const isEnterprise = user?.plan === "enterprise";
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
  <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billing & Plans</h1>
      </div>
      <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border font-black text-[10px] uppercase tracking-[0.15em] shadow-sm ${
        isEnterprise ? "bg-purple-50 border-purple-100 text-purple-600" : isPro ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-500"
      }`}>
        <ShieldCheck size={14} />
        {isEnterprise ? "Enterprise Member" : isPro ? "Pro Member" : "Standard Plan"}
      </div>
    </div>
  </div>

  <div className="max-w-6xl mx-auto px-6 mt-10">
    {/* CURRENT SUBSCRIPTION STATUS BAR */}
    {(isPro || isEnterprise) && (
      <div className={`mb-10 p-6 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-4 ${isEnterprise ? 'bg-[#1A0B2E] text-white border-purple-500/30' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isEnterprise ? 'bg-purple-500 shadow-lg shadow-purple-500/40' : 'bg-emerald-500 shadow-lg shadow-emerald-500/40'} text-white`}>
            {isEnterprise ? <Sparkles size={24} /> : <Zap size={24} />}
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isEnterprise ? 'text-purple-300' : 'text-slate-400'}`}>Active Subscription</p>
            <h2 className="text-xl font-black">{isEnterprise ? "Enterprise Sovereign Suite" : "Premium Pro Member"}</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className={`text-[10px] font-black uppercase tracking-widest ${isEnterprise ? 'text-purple-300' : 'text-slate-400'}`}>Next Renewal</p>
            <p className="font-bold">{user?.proExpires ? new Date(user.proExpires).toLocaleDateString() : 'N/A'}</p>
          </div>
          {isPro && !isEnterprise && (
            <button 
              onClick={() => handleUpgrade('enterprise')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20"
            >
              Upgrade to Enterprise
            </button>
          )}
        </div>
      </div>
    )}

    {/* PLAN CARDS GRID - Only show if not Enterprise */}
    {!isEnterprise && (
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Select Your Power Level</h2>
          <p className="text-slate-500 font-medium text-sm">Everything you need to manage your business at scale.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* PRO CARD */}
          <div className={`bg-white rounded-[3rem] p-10 border-2 transition-all relative overflow-hidden flex flex-col ${isPro ? 'border-emerald-500 shadow-2xl' : 'border-slate-100 hover:border-blue-200 shadow-sm'}`}>
            {isPro && <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</div>}
            <div className="mb-8">
              <h3 className="text-slate-900 font-black text-2xl mb-1">Premium Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">₦3,000</span>
                <span className="text-slate-400 font-bold text-sm">/ month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {["Unlimited Invoices & Receipts", "Expense Analytics", "Premium PDF Templates", "Custom Branding", "Priority Support"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade('pro')}
              disabled={isPro || upgradeLoading}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isPro ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-[#0028AE] text-white shadow-xl shadow-blue-200 hover:scale-[1.02]'}`}
            >
              {isPro ? "Current Plan" : upgradeLoading ? "Processing..." : "Select Pro"}
            </button>
          </div>

          {/* ENTERPRISE CARD */}
          <div className="bg-[#1A0B2E] rounded-[3rem] p-10 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 relative overflow-hidden flex flex-col group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 border border-purple-400/30">
                <Sparkles size={10} /> Ultimate Power
              </div>
              <h3 className="text-white font-black text-2xl mb-1">Enterprise Suite</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₦10,000</span>
                <span className="text-purple-300/50 font-bold text-sm">/ month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow relative z-10">
              {[
                {t: "5 Managed Businesses", d: "4 extra accounts included"},
                {t: "Advanced CSS Branding", d: "Full control over identity"},
                {t: "Unified Dashboard", d: "Toggle businesses instantly"},
                {t: "Team Collaboration", d: "Coming soon"}
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center shrink-0"><Check size={12} strokeWidth={4} /></div>
                  <div>
                    <p className="text-xs font-black text-white">{f.t}</p>
                    <p className="text-[10px] text-purple-300/50 font-medium">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade('enterprise')}
              disabled={upgradeLoading}
              className="w-full py-5 bg-white text-purple-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-purple-50 transition-all relative z-10"
            >
              {upgradeLoading ? "Processing..." : "Go Enterprise"}
            </button>
          </div>

        </div>
      </div>
    )}

    {/* BOTTOM SECTION: HISTORY & STATS */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* History */}
      <div className="lg:col-span-2">
  <div className="flex items-center justify-between ml-2 mb-6">
    <h2 className="text-slate-900 font-black text-xs uppercase tracking-[0.25em]">Transaction History</h2>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{history.length} Records Found</span>
  </div>

  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm transition-all duration-500">
    {history.length === 0 ? (
      <div className="p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Clock size={24} className="text-slate-200" />
        </div>
        <p className="text-slate-400 font-bold text-sm">No billing records found.</p>
        <p className="text-slate-300 text-[10px] mt-1 uppercase tracking-tighter">Your premium history will appear here</p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto custom-billing-scroll">
        {history.map((h, i) => (
          <div key={i} className="group p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all duration-300">
            <div className="flex items-center gap-5">
              {/* Dynamic Icon Color based on Plan */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                h.plan === 'enterprise' ? 'bg-[#0028AE]/10 text-[#0028AE]' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {h.plan === 'enterprise' ? <Shield size={22} strokeWidth={2.5} /> : <CreditCard size={22} strokeWidth={2.5} />}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-slate-900 text-[15px] tracking-tight lowercase first-letter:uppercase">
                    {h.plan} Membership
                  </p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    h.plan === 'enterprise' 
                    ? 'bg-[#0028AE]/5 border-[#0028AE]/20 text-[#0028AE]' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    Monthly
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  {new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  <span className="text-slate-200">•</span>
                  <span className="font-medium text-slate-300">ID: {h.reference?.slice(-8).toUpperCase()}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-black text-slate-900 text-base tracking-tighter">
                ₦{(h.amount || 0).toLocaleString()}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.1em]">Confirmed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        {/* Usage Stats - Only show for Free users */}
        {!isPro && !isEnterprise && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-6">Current Usage</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                  <span>Invoices</span>
                  <span className="text-slate-900">{invoiceUsage}/{LIMIT}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(invoiceUsage/LIMIT)*100}%` }} className={`h-full rounded-full ${invoiceUsage >= LIMIT ? 'bg-rose-500' : 'bg-blue-600'}`} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                  <span>Receipts</span>
                  <span className="text-slate-900">{receiptUsage}/{LIMIT}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(receiptUsage/LIMIT)*100}%` }} className={`h-full rounded-full ${receiptUsage >= LIMIT ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payout Details */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <Landmark className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-700" size={140} />
          <h3 className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em] mb-6">Payout Settlement Account</h3>
          <p className="text-xl font-black mb-1 leading-none">{user?.activeContext?.name || "Active Business"}</p>
          <p className="text-white/60 font-medium text-xs mb-8">{user?.activeContext?.accountDetails?.accountName || user?.accountDetails?.accountName || "Settlement Not Set"}</p>
          <p className="text-white/60 font-medium text-xs mb-8">
            {user?.activeContext?.accountDetails?.bankName || user?.accountDetails?.bankName || "Connect a bank in settings"}
          </p>
          <div className="inline-flex py-2.5 px-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-[11px] font-mono tracking-[0.2em]">
            {user?.activeContext?.accountDetails?.accountNumber || user?.accountDetails?.accountNumber || "••••••••••"}
          </div>
        </div>
      </div>
    </div>
  </div>

  <button onClick={() => navigate("/dashboard")} className="fixed bottom-8 right-8 w-16 h-16 bg-[#0028AE] text-white flex items-center justify-center rounded-2xl shadow-2xl z-50 font-black text-2xl hover:scale-110 active:scale-90 transition-all">Q</button>
</div>
  );
}