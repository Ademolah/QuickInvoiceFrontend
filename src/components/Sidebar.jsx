/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   FileText,
//   Users,
//   BarChart2,
//   Settings,
//   HelpCircle,
//   LayoutDashboard,
//   // CreditCardIcon,
//   LogOut,
//   // Bike,
//   ReceiptIcon,
//   DollarSignIcon, 
//   HelpCircleIcon,
//   // MonitorPlay,
//   ShoppingCart,
//   Building,
//   CreditCardIcon
// } from "lucide-react";
// import toast from "react-hot-toast"

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const links = [
//     { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
//     { name: "Invoices", icon: <FileText size={20} />, path: "/invoices" },
//     { name: "Receipts", icon: <ReceiptIcon size={20} />, path: "/receipts" },
//     { name: "Inventory", icon: <Building size={20} />, path: "/inventory" },
//     { name: "Expenses", icon: <CreditCardIcon size={20} />, path: "/expenses" },
//     { name: "Clients", icon: <Users size={20} />, path: "/clients" },
//     { name: "MarketZone", icon: <ShoppingCart size={20} />, path: "/market" },
//     // { name: "QuickDelivery", icon: <Bike size={20} />, comingSoon: true },
//     // { name: "QuickPay", icon: <CreditCardIcon size={20} />,  comingSoon: true },
//     // { name: "QuickBills", icon: <MonitorPlay size={20} />,  comingSoon: true },
//     { name: "Reports", icon: <BarChart2 size={20} />, path: "/reports" },
//     { name: "Billing", icon: <DollarSignIcon size={20} />, path: "/billing" },
//     { name: "How To Use", icon: <HelpCircleIcon size={20} />, path: "/how-to-use" },
//     { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
//     { name: "Support", icon: <HelpCircle size={20} />, path: "/support" },
//   ];

//   const linkClass = (path) =>
//     `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
//       location.pathname === path
//         ? "bg-white/20 text-white font-semibold shadow-md"
//         : "text-white/80 hover:bg-white/10 hover:text-white"
//     }`;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     // localStorage.clear();
//     // window.location.href = "/";
//     navigate("/");
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] p-2 rounded-lg shadow-lg text-white"
//       >
//         <Menu size={24} />
//       </button>

//       {/* Sidebar for Desktop */}
//       <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-[#0028AE] to-[#00A6FA] text-white p-4 shadow-xl justify-between">
//         {/* Top Section */}
//         <div>
//           {/* Logo */}
//             <div className="flex justify-center mb-6">
//               <img
//                 src="/quicknav.svg"   // image in public/
//                 alt="QuickInvoice"
//                 className="h-14 w-auto object-contain"
//               />
//             </div>
//           {/* <nav className="flex flex-col gap-2">
//             {links.map((link) => (
//               <Link key={link.name} to={link.path} className={linkClass(link.path)}>
//                 {link.icon}
//                 {link.name}
//               </Link>
//             ))}
//           </nav> */}
//           <nav className="flex flex-col gap-2">
//           {links.map((link) =>
//             link.comingSoon ? (
//               <button
//                 key={link.name}
//                 type="button"
//                 onClick={() => {
//                   toast(`${link.name} Coming soon!`, {
//                     icon: "⌛",
//                     style: {
//                       borderRadius: "8px",
//                       background: "#0046a5",
//                       color: "#fff",
//                       padding: "8px 12px",
//                     },
//                   });
//                   setIsOpen(false);
//                 }}
//                 className={linkClass(link.path) + " text-left flex items-center justify-between"}
//               >
//             <div className="flex items-center gap-2">
//               {link.icon}
//               {link.name}
//             </div>
//             <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[#00B86B] text-white shadow">
//               Coming Soon
//             </span>
//           </button>
//                 ) : (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 onClick={() => setIsOpen(false)}
//                 className={linkClass(link.path)}
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             )
//           )}
//         </nav>
//         </div>

//         {/* Bottom Section (Logout) */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
//         >
//           <LogOut size={20} />
//           Logout
//         </button>
//       </aside>

//       {/* Mobile Drawer */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/40"
//             onClick={() => setIsOpen(false)}
//           ></div>

//           {/* Drawer Content */}
//           <div className="relative bg-gradient-to-b from-[#0028AE] to-[#00A6FA] w-64 p-4 shadow-lg flex flex-col justify-between">
            
            
//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-4 right-4 text-white"
//             >
//               <X size={24} />
//             </button>

//             {/* Top Section */}
//             <div className="mt-8">
//               {/* Logo */}
//               <div className="flex justify-center mb-6">
//                 <img
//                   src="/quicknav.svg"   // image in public/
//                   alt="QuickInvoice"
//                   className="h-14 w-auto object-contain"
//                 />
//               </div>
//               {/* <nav className="flex flex-col gap-2">
//                 {links.map((link) => (
//                   <Link
//                     key={link.name}
//                     to={link.path}
//                     onClick={() => setIsOpen(false)}
//                     className={linkClass(link.path)}
//                   >
//                     {link.icon}
//                     {link.name}
//                   </Link>
//                 ))}
//               </nav> */}
//               <nav className="flex flex-col gap-2">
//                 {links.map((link) =>
//                   link.comingSoon ? (
//                     <button
//                       key={link.name}
//                       type="button"
//                       onClick={() => {
//                         toast(`${link.name} Coming soon!`, {
//                           icon: "⌛",
//                           style: {
//                             borderRadius: "8px",
//                             background: "#0046a5",
//                             color: "#fff",
//                             padding: "8px 12px",
//                           },
//                         });
//                         setIsOpen(false);
//                       }}
//                       className={linkClass(link.path) + " text-left flex items-center justify-between"}
//                     >
//                   <div className="flex items-center gap-2">
//                     {link.icon}
//                     {link.name}
//                   </div>
//                   <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[#00B86B] text-white shadow">
//                     Coming Soon
//                   </span>
//                 </button>
//                       ) : (
//                     <Link
//                       key={link.name}
//                       to={link.path}
//                       onClick={() => setIsOpen(false)}
//                       className={linkClass(link.path)}
//                     >
//                       {link.icon}
//                       {link.name}
//                     </Link>
//                   )
//                 )}


//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                   className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 mb-4"
//                 >
//                   <LogOut size={20} />
//                   Logout
//                 </button>
//               </nav>
              
//             </div>

//             {/* Bottom Section (Logout) */}
//             {/* <button
//               onClick={() => {
//                 handleLogout();
//                 setIsOpen(false);
//               }}
//               className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 mb-4"
//             >
//               <LogOut size={20} />
//               Logout
//             </button> */}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;




import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Users, BarChart2, Settings, 
  LayoutDashboard, LogOut, Receipt, CreditCard, ShoppingCart,
  Building2, Wallet, GraduationCap, LifeBuoy, BarChart3, Lock,
  Plus, ChevronDown, Check, Building
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
        { name: "Invoices", icon: <FileText size={18} />, path: "/invoices" },
        { name: "Receipts", icon: <Receipt size={18} />, path: "/receipts" },
        { name: "Inventory", icon: <Building2 size={18} />, path: "/inventory" },
        { name: "Bookkeeping", icon: <BarChart3 size={18} />, path: "/bookkeeping", isPro: true },
        { name: "Expenses", icon: <CreditCard size={18} />, path: "/expenses" },
        { name: "Clients", icon: <Users size={18} />, path: "/clients" },
      ]
    },
    {
      group: "Growth",
      items: [
        { name: "MarketZone", icon: <ShoppingCart size={18} />, path: "/market" },
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
    // 1. Tell the backend to switch the 'activeBusinessId'
    const { data } = await axios.post(`${API}/api/enterprise/switch-context`, 
      { businessId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(`Switched to ${data.businessName || 'Main Account'}`, {
        style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
      
      setShowBusinessDropdown(false);

      // 2. THE AUTO-REFRESH LOGIC
      // Using window.location.href to the dashboard forces a full page reload.
      // This is the safest way to ensure all useEffects in all components 
      // re-run with the NEW businessId context.
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500); // Small delay so the user can see the success toast
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to switch business context");
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
          
          {/* 1. The Main Account Option */}
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

          {/* 2. List of Enterprise Sub-Businesses */}
          {user?.enterpriseBusinesses?.map((biz) => (
            <button 
              key={biz._id}
              onClick={() => handleSwitchBusiness(biz._id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                user?.activeBusinessId === biz._id ? 'bg-purple-50 text-purple-600' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-200 overflow-hidden">
                   {biz.logo?.url ? <img src={biz.logo.url} alt="" className="w-full h-full object-cover" /> : <Building2 size={10} />}
                </div>
                <span className="text-xs font-bold">{biz.businessName}</span>
              </div>
              {user?.activeBusinessId === biz._id && <Check size={14} />}
            </button>
          ))}

          {/* 3. Add New Business Button */}
          <button 
            onClick={handleAddAccount}
            className="w-full flex items-center gap-2 p-3 mt-1 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#0028AE] transition-all group border border-dashed border-slate-200 border-spacing-4"
          >
            <Plus size={14} />
            <span className="text-xs font-black uppercase tracking-tighter">Add New Business</span>
            {user?.plan !== 'enterprise' && <Lock size={10} className="ml-auto" />}
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
              style={{ width: user?.plan !== 'free' ? '100%' : `${Math.min((((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0)) / 15) * 100, 100)}%` }} 
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