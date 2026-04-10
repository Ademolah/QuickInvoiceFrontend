/* eslint-disable no-unused-vars */


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
import { useAlert } from "../context/AlertContext";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Billing() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

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
   
    toast.dismiss('payment-loading');

    // 2. Trigger the premium alert
    const paymentErrorMessage = err.response?.data?.message || "Payment gateway is currently unavailable. Please check your internet connection or try a different payment method.";

    showAlert(paymentErrorMessage, "error");
    
  } finally {
    setUpgradeLoading(false);
  }
};

  const isPro = user?.plan === "pro";
  const isEnterprise = user?.plan === "enterprise";
  const invoiceUsage = user?.usage?.invoicesThisMonth || 0;
  const receiptUsage = user?.usage?.receiptsThisMonth || 0;
  const LIMIT = 10;

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
  
  <h3 className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em] mb-6">
    {user?.activeContext?.businessName || "Main Account"} Payout Details
  </h3>

  {/* Priority: Use activeContext details, then fallback to user global details */}
  <p className="text-xl font-black mb-1 leading-none uppercase tracking-tight">
    {user?.activeContext?.accountDetails?.accountName || user?.accountDetails?.accountName || "Settlement Not Set"}
  </p>

  <p className="text-white/60 font-medium text-xs mb-8">
    {user?.activeContext?.accountDetails?.bankName || user?.accountDetails?.bankName || "Connect a bank in settings"}
  </p>

  <div className="flex items-center justify-between">
    <div className="inline-flex py-2.5 px-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-[11px] font-mono tracking-[0.2em]">
      {user?.activeContext?.accountDetails?.accountNumber || user?.accountDetails?.accountNumber || "••••••••••"}
    </div>
    
    <div className="flex items-center gap-1.5 opacity-50">
       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
       <span className="text-[8px] font-black uppercase tracking-widest">Active Settlement</span>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>

  <button onClick={() => navigate("/dashboard")} className="fixed bottom-8 right-8 w-16 h-16 bg-[#0028AE] text-white flex items-center justify-center rounded-2xl shadow-2xl z-50 font-black text-2xl hover:scale-110 active:scale-90 transition-all">Q</button>
</div>
  );
}