/* eslint-disable no-unused-vars */



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import Sidebar from "../components/Sidebar"; 
import { X, User, Bell, TrendingUp, CreditCard,Lock, Package, Clock, Menu, CheckCircle2, Check, ShieldCheck, Zap } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { fetchUser } from '../utils/getUser';
import { toast } from 'react-hot-toast';
import QuickBuddy from '../components/QuickBuddy';
import NotificationCenter from '../components/NotificationCenter';
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const API = "https://quickinvoice-backend-1.onrender.com";

// const API = "http://localhost:4000";

const Dashboard = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { formatCurrency } = useCurrency();
  const [stats, setStats] = useState({
    totalInvoicesThisMonth: 0,
    totalRevenue: 0,
    totalUnpaid: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  const navigate = useNavigate();

  // Modals state
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    nationality: "Nigeria",
    date_of_birth: "",
    residential_address: "",
    occupation: "",
  });

  const { setIsMobileMenuOpen } = useOutletContext();

  const [expenseStats, setExpenseStats] = useState({ totalAmount: 0, taxableAmount: 0 });

  const token = localStorage.getItem("token");



  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [userRes, invoiceRes] = await Promise.all([
          axios.get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/invoices`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const userData = userRes.data;
        const invoicesData = invoiceRes.data;

        // 🛡️ THE ENTERPRISE TIER GUARD (Revenue Protection)
      // If the plan has expired (not enterprise) but the user is still 
      // pointing to a secondary business (activeBusinessId is not null)
      if (userData.plan !== 'enterprise' && userData.activeBusinessId !== null) {
        console.log("⚠️ Unauthorized context detected. Resetting to Main Account...");
        
        // Silently reset them via the backend
        await axios.post(`${API}/api/enterprise/switch-context`, 
          { businessId: null }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Force a refresh to clean the state and fetch "Main Account" invoices
        window.location.reload(); 
        return; // Stop execution here
      }

        setUser(userData);
        // setBusinessName(userData.businessName || '');
        setBusinessName(userData.activeContext?.businessName || userData.businessName);

        // KYC Check
        if (!userData.nationality || !userData.date_of_birth || !userData.residential_address || !userData.occupation) {
          setShowPromptModal(true);
        }

        // Welcome Modal Check
        if (!localStorage.getItem("hasSeenWelcomeModal")) setShowWelcomeModal(true);

        // Process Stats
        const now = new Date();
        const invoicesThisMonth = invoicesData.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
        });

        setInvoices(invoicesThisMonth);
        setStats({
          totalInvoicesThisMonth: invoicesThisMonth.length,
          totalRevenue: invoicesThisMonth.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
          totalUnpaid: invoicesThisMonth.filter(inv => inv.status !== 'paid').length,
          totalSales: invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0),
          totalQuantity: invoicesThisMonth.reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + it.quantity, 0), 0),
        });

      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) initializeDashboard();
  }, [token]);

  useEffect(() => {
  const fetchProStats = async () => {
    const isPremium = user?.plan === 'pro' || user?.plan === 'enterprise';
    
    if (!token || !isPremium) return;

    try {
      const res = await axios.get(`${API}/api/expenses/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setExpenseStats(res.data.data);
      }
    } catch (err) {
      console.error("Pro Stats Load Error:", err);
      // Fallback to prevent UI break
      setExpenseStats({ totalAmount: 0, taxableAmount: 0 });
    }
  };

  fetchProStats();
}, [token, user?.plan]); // Only runs if token exists or plan status changes

  const chartData = invoices.map(inv => ({
    date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    amount: inv.total,
    status: inv.status
  }));

  // NEW UPDATED RUNWAY LOGIC
  // 1. Core Financials
const totalExpenses = expenseStats.totalAmount || 0; 
const netCash = (stats.totalRevenue || 0) - totalExpenses;

// 2. Calculate Monthly Burn
// If expenses are 0, we set monthlyBurn to 0 to avoid the "500,000 month" glitch
const monthlyBurn = totalExpenses > 0 ? (totalExpenses / 12) : 0; 

// 3. Calculate Runway with "Zero Expense" Protection
let runwayMonths;

if (netCash <= 0) {
    // No cash = No runway
    runwayMonths = "0.0";
} else if (monthlyBurn === 0) {
    // Cash exists but NO expenses = Infinite runway
    runwayMonths = "∞"; 
} else {
    // Standard calculation
    runwayMonths = (netCash / monthlyBurn).toFixed(1);
}

// 4. Runway Color Logic (Updated to handle Infinity)
const runwayColor = (runwayMonths === "∞" || Number(runwayMonths) > 3) 
    ? "text-emerald-500" 
    : Number(runwayMonths) > 1 
        ? "text-amber-500" 
        : "text-rose-500";

  if (loading) return <DashboardSkeleton />;

  return (
  /* 1. Removed 'flex' and 'ml-[280px]' to prevent the "gap" and duplicate sidebars */
  <div className="min-h-full bg-[#F8FAFC]">
    
    {/* Top Navigation Bar - Now content-focused only */}
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <div className="flex items-center gap-4">
      {/* ADD THIS BUTTON BACK: It triggers the AppLayout sidebar */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-transform"
      >
        <Menu size={20} />
      </button>
      
      <div>
        <h1 className="text-xl font-black text-[#001325] tracking-tight">
          Dashboard
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
          <NotificationCenter />
          <div className="relative w-12 h-12 rounded-full overflow-visible"> 
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm">
              {user?.activeContext?.logo ? (
                <img src={user.activeContext.logo} alt="Profile" className="w-full h-full object-cover" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0028AE]/5 text-[#0028AE]">
                  <User size={20} />
                </div>
              )}
            </div>
            {['pro', 'enterprise'].includes(user?.plan) && (
              <div className="absolute -bottom-1 -right-1 bg-[#0028AE] text-white rounded-full p-0.5 border-2 border-white shadow-lg flex items-center justify-center animate-in zoom-in duration-300">
                <ShieldCheck size={12} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

  </div>
</header>

    {/* Main Content Area */}
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-black text-[#001325] tracking-tighter">
          Welcome back, <span className="text-[#0028AE]">{businessName}</span>
        </h2>
        <p className="text-slate-500 font-medium mt-1">Here is what's happening with your business today.</p>
      </section>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Revenue (Paid)" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={TrendingUp} 
          trend="+12.5%" 
          color="bg-[#0028AE]" 
        />
        <StatCard 
          label="Pending Invoices" 
          value={stats.totalUnpaid} 
          icon={Clock} 
          trend="Attention" 
          color="bg-[#00A6FA]" 
        />
        <StatCard 
          label="Total Sales" 
          value={formatCurrency(stats.totalSales)} 
          icon={CreditCard} 
          color="bg-[#001325]" 
        />
      </div>

      {/* Runway Intelligence Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-[#001325] rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden shadow-2xl border border-white/5 min-h-[180px] flex items-center"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0028AE]/20 blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        
        {user?.plan !== "pro" && user?.plan !== "enterprise" && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center backdrop-blur-xl bg-[#001325]/60 px-4">
            <div className="text-center w-full max-w-lg animate-in fade-in zoom-in duration-500 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#0028AE] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full mb-2">
                  <Lock size={10} strokeWidth={3} /> Pro Intelligence
                </div>
                <h4 className="text-white text-lg lg:text-xl font-black tracking-tight mb-1">
                  Unlock Runway Data
                </h4>
                <p className="text-white/60 text-[10px] lg:text-xs font-medium max-w-[250px] leading-tight">
                  See exactly how many months your cash flow will sustain operations.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => navigate('/settings/billing')}
                  className="bg-white text-[#001325] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00A6FA] hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10 transition-all duration-1000 ${user?.plan !== 'pro' && user?.plan !== 'enterprise' ? 'blur-2xl grayscale opacity-50 select-none pointer-events-none' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-xl">
              <Zap className="text-[#00A6FA]" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">Liquidity Runway</p>
              <h3 className="text-white text-2xl font-black tracking-tighter">
                {user?.plan === 'pro' || user?.plan === 'enterprise' ? runwayMonths : "12.4"} 
                <span className="text-white/30 text-[10px] font-bold uppercase ml-1">Months</span>
              </h3>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden lg:block" />

          <div className="flex flex-col items-center lg:items-start">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">Taxable Offset</p>
            <div className="flex items-center gap-2">
              <p className="text-white text-lg font-black tracking-tight">
                {user?.plan === 'pro' || user?.plan === 'enterprise' 
                  ? formatCurrency(expenseStats.taxableAmount || 0) 
                  : "$2,450.00"}
              </p>
              <span className="text-[7px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-black uppercase">Deductible</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">Net Position</p>
            <p className={`text-xl font-black tracking-tighter ${
              (user?.plan === 'pro' || user?.plan === 'enterprise') && netCash < 0 
                ? 'text-rose-400' 
                : 'text-emerald-400'
            }`}>
              {user?.plan === 'pro' || user?.plan === 'enterprise' 
                ? formatCurrency(netCash) 
                : "$18,200.00"}
            </p>
          </div>

          <div className="hidden xl:block">
            <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-end">
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                (user?.plan === 'pro' || user?.plan === 'enterprise') ? runwayColor : 'text-emerald-400'
              }`}>
                {(user?.plan === 'pro' || user?.plan === 'enterprise') 
                  ? (runwayMonths > 3 ? "Operations Stable" : "Liquidity Warning") 
                  : "Intelligence Active"}
              </span>
              <p className="text-white/20 text-[7px] font-bold mt-0.5 uppercase tracking-widest text-right">Verified Analysis</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary Stats & Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-[#001325] tracking-tight">Performance Flow</h3>
            <div className="flex gap-2">
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0028AE]" /> <span className="text-[10px] font-bold uppercase text-slate-400">Paid</span></div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'paid' ? '#0028AE' : '#CBD5E1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Volume</p>
              <p className="text-2xl font-black text-[#001325]">{stats.totalQuantity}</p>
              <p className="text-xs font-bold text-slate-400">Items Sold</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0028AE] to-[#00A6FA] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Monthly Active</p>
              <p className="text-2xl font-black">{stats.totalInvoicesThisMonth}</p>
              <p className="text-xs font-bold opacity-80">Generated Invoices</p>
            </div>
            <div className="absolute top-[-10%] right-[-10%] opacity-10">
               <TrendingUp size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modals & QuickBuddy - Now positioned relative to the viewport correctly */}
    <AnimatePresence>
      {(showPromptModal || showFormModal || showWelcomeModal) && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#001325]/60 backdrop-blur-md flex items-center justify-center p-6"
        >
          {showWelcomeModal ? (
            <WelcomeModal onClose={() => { localStorage.setItem("hasSeenWelcomeModal", "true"); setShowWelcomeModal(false); }} />
          ) : showFormModal ? (
            <KYCForm 
              formData={formData} 
              setFormData={setFormData} 
              isSubmitting={isSubmitting} 
              onSubmit={async () => {
                setIsSubmitting(true);
                await axios.put(`${API}/api/users/complete-profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
                setShowFormModal(false);
                setShowPromptModal(false);
                toast.success("Profile Verified");
                setIsSubmitting(false);
              }} 
            />
          ) : (
            <PromptModal onContinue={() => setShowFormModal(true)} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
    <QuickBuddy />
  </div>
);
};

// Sub-components for Cleanliness
const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-black text-[#001325] tracking-tighter">{value}</p>
  </div>
);

const WelcomeModal = ({ onClose }) => (
  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center">
    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#0028AE]">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-[#001325] tracking-tight mb-4">Welcome to the Elite Network</h2>
    <div className="text-left space-y-4 mb-10">
      {["Set up your bank details in Settings.", "Create your first professional invoice.", "Track real-time growth via reports."].map((text, i) => (
        <div key={i} className="flex gap-3 text-sm font-bold text-slate-500">
          <span className="text-[#0028AE]">•</span> {text}
        </div>
      ))}
    </div>
    <button onClick={onClose} className="w-full py-4 bg-[#001325] text-white rounded-2xl font-black text-sm hover:bg-[#0028AE] transition-all">
      Enter Workspace
    </button>
  </motion.div>
);

const KYCForm = ({ formData, setFormData, isSubmitting, onSubmit }) => (
  <motion.div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
    <h2 className="text-xl font-black text-[#001325] mb-6 tracking-tight">Verify Identity</h2>
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date of Birth</label>
        <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Address</label>
        <textarea placeholder="Residential Address" value={formData.residential_address} onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm h-24" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Occupation</label>
        <input type="text" placeholder="e.g. Retail Merchant" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
      </div>
    </div>
    <button onClick={onSubmit} disabled={isSubmitting} className="w-full mt-8 py-4 bg-[#0028AE] text-white rounded-2xl font-black text-sm hover:bg-[#001325] transition-all">
      {isSubmitting ? "Verifying..." : "Complete Setup"}
    </button>
  </motion.div>
);

const PromptModal = ({ onContinue }) => (
  <motion.div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl">
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0028AE]"><User size={30} /></div>
    <h3 className="text-xl font-black text-[#001325] mb-2 tracking-tight">Identity Verification</h3>
    <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">To comply with regional financial regulations, please complete your profile details.</p>
    <button onClick={onContinue} className="w-full py-4 bg-[#001325] text-white rounded-2xl font-black text-sm">Update Now</button>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="flex min-h-screen bg-[#F8FAFC]">
    <div className="hidden lg:block w-[280px] bg-white border-r" />
    <div className="flex-1 p-10 space-y-10">
      <div className="h-10 w-48 bg-slate-200 rounded-full animate-pulse" />
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />)}
      </div>
      <div className="h-80 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
    </div>
  </div>
);

export default Dashboard;
