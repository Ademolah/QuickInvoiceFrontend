/* eslint-disable no-unused-vars */



import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Users, BarChart2, Settings, 
  LayoutDashboard, LogOut, Receipt, CreditCard, ShoppingCart,FileCheck2,
  Building2, Wallet, GraduationCap, LifeBuoy, BarChart3, Lock, ChevronRight, ChevronLeft,
  Plus, ChevronDown, Check, Building,
  Calculator,
  Palette
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API = "https://quickinvoice-backend-1.onrender.com";

const Sidebar = ({ closeMenu, isCollapsed, setIsCollapsed }) => {
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
        { name: "Create Work Summary", icon: <FileCheck2 size={18} />, path: "/invoice-selector" },
        { name: "Customize Invoice", icon: <Palette size={18} />, path: "/customize-invoice", isPro: true },
        { name: "Inventory", icon: <Building2 size={18} />, path: "/inventory" },
        { name: "QuickPOS", icon: <Calculator size={18} />, path: "/pos", isPro: true },
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
    <div className={`flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-300 no-scrollbar overflow-y-auto ${
      isCollapsed ? 'w-[80px]' : 'w-full'
    }`}>
      
      {/* Brand Header */}
      <div className={`p-6 pb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#0028AE] rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/20 flex-shrink-0">
            <span className="text-white font-black italic text-lg">Q</span>
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="text-[#001325] font-black tracking-tighter text-xl whitespace-nowrap"
            >
              QuickInvoice
            </motion.span>
          )}
        </div>
        
        {/* Toggle Expand/Collapse Trigger Button for Desktop Layout */}
        {!closeMenu && (
          <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden lg:flex p-2 rounded-xl bg-[#0028AE] text-white hover:bg-[#001e82] shadow-lg shadow-blue-700/20 transition-all duration-200 transform active:scale-95 ml-2 flex-shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={14} strokeWidth={3} />
          ) : (
            <ChevronLeft size={14} strokeWidth={3} />
          )}
        </button>
        )}

        {closeMenu && (
          <button onClick={closeMenu} className="lg:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* --- ENTERPRISE BUSINESS SWITCHER --- */}
      <div className={`mb-4 relative ${isCollapsed ? 'px-4 flex justify-center' : 'px-6'}`}>
        <button 
          onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
          className={`flex items-center transition-all group border ${
            isCollapsed 
              ? 'h-11 w-11 justify-center rounded-xl bg-slate-50 border-slate-100 hover:border-[#0028AE]/30' 
              : `w-full justify-between p-3 rounded-2xl ${
                  showBusinessDropdown ? 'bg-white border-[#0028AE] shadow-lg' : 'bg-slate-50 border-slate-100 hover:border-[#0028AE]/30'
                }`
          }`}
          title={isCollapsed ? "Switch Business Entity" : undefined}
        >
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
              user?.activeBusinessId ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-[#0028AE]'
            }`}>
              {user?.activeBusinessId ? <Building2 size={16} /> : <Building size={16} />}
            </div>
            
            {!isCollapsed && (
              <div className="text-left max-w-[120px]">
                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1 tracking-widest truncate">
                  {user?.activeBusinessId ? "Enterprise Entity" : "Primary Account"}
                </p>
                <p className="text-xs font-black text-[#001325] truncate">
                  {user?.activeBusinessId 
                    ? user.enterpriseBusinesses.find(b => b._id === user.activeBusinessId)?.businessName 
                    : user?.businessName}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronDown size={14} className={`text-slate-400 transition-transform ${showBusinessDropdown ? 'rotate-180' : ''}`} />}
        </button>

        {/* Floating Dropdown Logic for both Normal and Compressed frames */}
        <AnimatePresence>
          {showBusinessDropdown && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: isCollapsed ? 12 : 0 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.95, x: isCollapsed ? 12 : 0 }}
              className={`absolute bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] ${
                isCollapsed ? 'left-full top-0 ml-3 w-64' : 'left-6 right-6 mt-2'
              }`}
            >
              <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                
                {/* 1. Main Account Option */}
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

                {/* 2. Sub-Businesses */}
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
                        <div className={`w-4 h-4 rounded overflow-hidden flex-shrink-0 ${isLocked ? 'bg-slate-300' : 'bg-slate-200'}`}>
                           {biz.logo?.url ? <img src={biz.logo.url} alt="" className="w-full h-full object-cover" /> : <Building2 size={10} />}
                        </div>
                        <span className={`text-xs truncate ${isLocked ? 'font-medium' : 'font-bold'}`}>
                          {biz.businessName}
                        </span>
                      </div>
                      {isLocked ? <Lock size={12} className="text-slate-400" /> : isActive && <Check size={14} />}
                    </button>
                  );
                })}

                {/* 3. Add New Business */}
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
      <nav className={`flex-1 space-y-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {isCollapsed ? (
              <div className="h-px bg-slate-100 mx-2 my-4" />
            ) : (
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 whitespace-nowrap">
                {group.group}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.isPro && user?.plan === 'free' ? "#" : item.path}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`
                    group flex items-center rounded-2xl transition-all duration-300
                    ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'}
                    ${isActive(item.path) 
                      ? "bg-[#0028AE]/5 text-[#0028AE] shadow-[0_4px_12px_-4px_rgba(0,40,174,0.1)]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#001325]"}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive(item.path) ? "text-[#0028AE]" : "text-slate-400 group-hover:text-[#001325]"} transition-colors flex-shrink-0`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.name}</span>}
                  </div>

                  {!isCollapsed && item.isPro && user?.plan === 'free' && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Lock size={10} className="text-amber-600" />
                      <span className="text-[8px] font-black uppercase text-amber-600 tracking-tighter">Pro</span>
                    </div>
                  )}

                  {!isCollapsed && isActive(item.path) && (
                    <motion.div layoutId="activeInd" className="h-1.5 w-1.5 rounded-full bg-[#0028AE]" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Status Indicators */}
      <div className={`mt-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {!isCollapsed ? (
          <div className="bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2 px-1">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Plan: <span className={user?.plan === 'enterprise' ? 'text-purple-600' : user?.plan === 'pro' ? 'text-emerald-600' : 'text-blue-600'}>
                  {user?.plan}
                </span>
              </p>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  user?.plan === 'enterprise' ? 'w-full bg-purple-500' : user?.plan === 'pro' ? 'w-full bg-emerald-500' : 'bg-[#0028AE]'
                }`}
                style={{ width: user?.plan !== 'free' ? '100%' : `${Math.min((((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0)) / 15) * 100, 100)}%` }} 
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div 
              className={`h-2 w-2 rounded-full ${
                user?.plan === 'enterprise' ? 'bg-purple-500' : user?.plan === 'pro' ? 'bg-emerald-500' : 'bg-[#0028AE]'
              }`} 
              title={`Plan: ${user?.plan}`} 
            />
          </div>
        )}
        
        <button 
          onClick={handleLogout} 
          className={`flex items-center rounded-2xl text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300 ${
            isCollapsed ? 'justify-center w-11 h-11 p-0 mx-auto' : 'w-full gap-3 px-4 py-3'
          }`}
          title="Logout"
        >
          <LogOut size={18} /> 
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;