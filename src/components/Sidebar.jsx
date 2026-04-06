/* eslint-disable no-unused-vars */



import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Users, BarChart2, Settings, 
  LayoutDashboard, LogOut, Receipt, CreditCard, ShoppingCart,
  Building2, Wallet, GraduationCap, LifeBuoy, BarChart3, Lock,
  Plus, ChevronDown, Check, Building,
  Calculator
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API = "https://quickinvoice-backend-1.onrender.com";

const Sidebar = ({ closeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (err) {
        console.error("Error fetching user for sidebar", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const menuGroups = [
    {
      group: "General",
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { name: "Reports", icon: <BarChart2 size={18} />, path: "/reports" },
      ]
    },
    {
      group: "Commerce",
      items: [
        { name: "Create Invoice", icon: <FileText size={18} />, path: "/invoices" },
        { name: "Generate Receipts", icon: <Receipt size={18} />, path: "/receipts" },
        { name: "Inventory", icon: <Building2 size={18} />, path: "/inventory" },
        { name: "Quick POS", icon: <Calculator size={18} />, path: "/pos" },
        { name: "Bookkeeping", icon: <BarChart3 size={18} />, path: "/bookkeeping", isPro: true },
        { name: "Expenses", icon: <CreditCard size={18} />, path: "/expenses" },
        { name: "Clients", icon: <Users size={18} />, path: "/clients" },
      ]
    },
    {
      group: "Growth",
      items: [
        // { name: "MarketZone", icon: <ShoppingCart size={18} />, path: "/market" },
        { name: "Billing", icon: <Wallet size={18} />, path: "/billing" },
      ]
    },
    {
      group: "Settings",
      items: [
        // { name: "How To Use", icon: <GraduationCap size={18} />, path: "/how-to-use" },
        { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
        { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleItemClick = (e, item) => {
    if (item.isPro && user?.plan === 'free') {
      e.preventDefault();
      toast.error("Upgrade to Pro to access this feature", {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
      return;
    }
    if (closeMenu) closeMenu();
  };

  const handleAddAccount = () => {
    if (user?.plan !== 'enterprise') {
      // Trigger Enterprise Modal (we will build this next)
      toast("Enterprise Plan Required", {
        icon: '🏢',
        style: { borderRadius: '12px', background: '#0028AE', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
      navigate('/billing'); // Or open your new modal
      return;
    }
    // Logic for Enterprise users to add account
    navigate('/settings/accounts/new');
  };


  //ENTERPRISE FUNCTIONS

  const handleSwitchBusiness = async (businessId) => {
  const token = localStorage.getItem('token');
  try {
    const { data } = await axios.post(`${API}/api/enterprise/switch-context`, 
      { businessId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(`Switched to ${data.businessName || 'Main Account'}`, {
        style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
      
      setShowBusinessDropdown(false);

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500); 
    }
  } catch (err) {
    console.error(err);

    // ✨ WORLD-CLASS ERROR HANDLING
    if (err.response?.status === 403) {
      toast.error("Enterprise Plan Required: Upgrade to switch businesses", {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#7F1D1D', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
      // OPTIONAL: Redirect them to the pricing page or open upgrade modal
      // setShowUpgradeModal(true);
    } else {
      toast.error(err.response?.data?.message || "Failed to switch business context");
    }
  }
}

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 w-full overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#0028AE] rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/20">
            <span className="text-white font-black italic text-lg">Q</span>
          </div>
          <span className="text-[#001325] font-black tracking-tighter text-xl">QuickInvoice</span>
        </div>
        {closeMenu && (
          <button onClick={closeMenu} className="lg:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* --- ENTERPRISE BUSINESS SWITCHER --- */}
<div className="px-6 mb-4 relative">
  <button 
    onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group border ${
      showBusinessDropdown ? 'bg-white border-[#0028AE] shadow-lg' : 'bg-slate-50 border-slate-100 hover:border-[#0028AE]/30'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
        user?.activeBusinessId ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-[#0028AE]'
      }`}>
        {user?.activeBusinessId ? <Building2 size={16} /> : <Building size={16} />}
      </div>
      <div className="text-left">
        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1 tracking-widest">
          {user?.activeBusinessId ? "Enterprise Entity" : "Primary Account"}
        </p>
        <p className="text-xs font-black text-[#001325] truncate max-w-[100px]">
          {/* Determine which name to show */}
          {user?.activeBusinessId 
            ? user.enterpriseBusinesses.find(b => b._id === user.activeBusinessId)?.businessName 
            : user?.businessName}
        </p>
      </div>
    </div>
    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showBusinessDropdown ? 'rotate-180' : ''}`} />
  </button>

  
  {/* Dropdown Menu */}
<AnimatePresence>
  {showBusinessDropdown && (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
      className="absolute left-6 right-6 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100]"
    >
      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
        
        {/* 1. The Main Account Option - ALWAYS ACTIVE */}
        <button 
          onClick={() => handleSwitchBusiness(null)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
            !user?.activeBusinessId ? 'bg-blue-50/50 text-[#0028AE]' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building size={14} />
            <span className="text-xs font-black">{user?.businessName}</span>
          </div>
          {!user?.activeBusinessId && <Check size={14} />}
        </button>

        <div className="h-px bg-slate-50 mx-2 my-1" />

        {/* 2. List of Enterprise Sub-Businesses - TIER LOCKED */}
        {user?.enterpriseBusinesses?.map((biz) => {
          const isLocked = user?.plan !== 'enterprise';
          const isActive = user?.activeBusinessId === biz._id;

          return (
            <button 
              key={biz._id}
              onClick={() => !isLocked && handleSwitchBusiness(biz._id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-purple-50 text-purple-600' 
                  : isLocked 
                    ? 'opacity-60 cursor-not-allowed bg-slate-50/50 grayscale-[0.5]' 
                    : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded overflow-hidden ${isLocked ? 'bg-slate-300' : 'bg-slate-200'}`}>
                   {biz.logo?.url ? <img src={biz.logo.url} alt="" className="w-full h-full object-cover" /> : <Building2 size={10} />}
                </div>
                <span className={`text-xs ${isLocked ? 'font-medium' : 'font-bold'}`}>
                  {biz.businessName}
                </span>
              </div>
              
              {isLocked ? (
                <Lock size={12} className="text-slate-400" />
              ) : (
                isActive && <Check size={14} />
              )}
            </button>
          );
        })}

        {/* 3. Add New Business Button - TIER LOCKED */}
        <button 
          onClick={() => {
            if (user?.plan === 'enterprise') {
              handleAddAccount();
            } else {
              toast.error("Enterprise Plan Required to add multiple businesses", {
                icon: '🔒',
                style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '10px' }
              });
            }
          }}
          className={`w-full flex items-center gap-2 p-3 mt-1 rounded-xl transition-all group border border-dashed border-spacing-4 ${
            user?.plan === 'enterprise'
              ? 'hover:bg-slate-50 text-slate-400 hover:text-[#0028AE] border-slate-200'
              : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
        >
          <Plus size={14} />
          <span className="text-xs font-black uppercase tracking-tighter">Add New Business</span>
          {user?.plan !== 'enterprise' && <Lock size={10} className="ml-auto text-slate-400" />}
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
</div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.isPro && user?.plan === 'free' ? "#" : item.path}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`
                    group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
                    ${isActive(item.path) 
                      ? "bg-[#0028AE]/5 text-[#0028AE] shadow-[0_4px_12px_-4px_rgba(0,40,174,0.1)]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#001325]"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive(item.path) ? "text-[#0028AE]" : "text-slate-400 group-hover:text-[#001325]"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </div>

                  {item.isPro && user?.plan === 'free' && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Lock size={10} className="text-amber-600" />
                      <span className="text-[8px] font-black uppercase text-amber-600 tracking-tighter">Pro</span>
                    </div>
                  )}

                  {isActive(item.path) && (
                    <motion.div layoutId="activeInd" className="h-1.5 w-1.5 rounded-full bg-[#0028AE]" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Plan Status */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Plan: <span className={user?.plan === 'enterprise' ? 'text-purple-600' : user?.plan === 'pro' ? 'text-emerald-600' : 'text-blue-600'}>
                {user?.plan}
              </span>
            </p>
          </div>
          {/* Progress bar logic remains same */}
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                user?.plan === 'enterprise' ? 'w-full bg-purple-500' : user?.plan === 'pro' ? 'w-full bg-emerald-500' : 'bg-[#0028AE]'
              }`}
              style={{ width: user?.plan !== 'free' ? '100%' : `${Math.min((((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0)) / 12) * 100, 100)}%` }} 
            />
          </div>
        </div>
        
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;