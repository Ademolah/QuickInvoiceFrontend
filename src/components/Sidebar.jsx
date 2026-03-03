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

// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion} from "framer-motion";
// import {
//   X, FileText, Users, BarChart2, Settings, 
//   LayoutDashboard, LogOut, Receipt, CreditCard, ShoppingCart,
//   Building2, Wallet, GraduationCap, LifeBuoy, BarChart3,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { useState, useEffect } from "react";
// import axios from "axios";


// const API = "https://quickinvoice-backend-1.onrender.com";

// const Sidebar = ({ closeMenu }) => {
//   const location = useLocation();
//   const navigate = useNavigate();


  

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const { data } = await axios.get(`${API}/api/users/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(data);
//       } catch (err) {
//         console.error("Error fetching user for sidebar", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const menuGroups = [
//     {
//       group: "General",
//       items: [
//         { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
//         { name: "Reports", icon: <BarChart2 size={18} />, path: "/reports" },
//       ]
//     },
//     {
//       group: "Commerce",
//       items: [
//         { name: "Invoices", icon: <FileText size={18} />, path: "/invoices" },
//         { name: "Receipts", icon: <Receipt size={18} />, path: "/receipts" },
//         { name: "Inventory", icon: <Building2 size={18} />, path: "/inventory" },
//         { name: "Bookkeeping", icon: <BarChart3 size={18} />, path: "/bookkeeping" },
//         { name: "Expenses", icon: <CreditCard size={18} />, path: "/expenses" },
//         { name: "Clients", icon: <Users size={18} />, path: "/clients" },
//       ]
//     },
//     {
//       group: "Growth",
//       items: [
//         { name: "MarketZone", icon: <ShoppingCart size={18} />, path: "/market" },
//         { name: "Billing", icon: <Wallet size={18} />, path: "/billing" },
//       ]
//     },
//     {
//       group: "Settings",
//       items: [
//         // { name: "How To Use", icon: <GraduationCap size={18} />, path: "/how-to-use" },
//         { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
//         { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
//       ]
//     }
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     toast.success("Signed out successfully");
//     navigate("/");
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex flex-col h-full bg-white border-r border-slate-100 w-full overflow-y-auto no-scrollbar">
//       {/* Brand Header */}
//       <div className="p-8 pb-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 bg-[#0028AE] rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/20">
//             <span className="text-white font-black italic text-lg">Q</span>
//           </div>
//           <span className="text-[#001325] font-black tracking-tighter text-xl">QuickInvoice</span>
//         </div>
//         {/* Mobile Close Button */}
//         {closeMenu && (
//           <button onClick={closeMenu} className="lg:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
//             <X size={20} />
//           </button>
//         )}
//       </div>

//       {/* Navigation Groups */}
//       <nav className="flex-1 px-4 py-6 space-y-8">
//         {menuGroups.map((group, idx) => (
//           <div key={idx} className="space-y-1">
//             <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
//               {group.group}
//             </h3>
//             <div className="space-y-1">
//               {group.items.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className={`
//                     group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
//                     ${isActive(item.path) 
//                       ? "bg-[#0028AE]/5 text-[#0028AE] shadow-[0_4px_12px_-4px_rgba(0,40,174,0.1)]" 
//                       : "text-slate-500 hover:bg-slate-50 hover:text-[#001325]"}
//                   `}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className={`${isActive(item.path) ? "text-[#0028AE]" : "text-slate-400 group-hover:text-[#001325]"} transition-colors`}>
//                       {item.icon}
//                     </span>
//                     <span className="text-sm font-bold tracking-tight">{item.name}</span>
//                   </div>
//                   {isActive(item.path) && (
//                     <motion.div layoutId="activeInd" className="h-1.5 w-1.5 rounded-full bg-[#0028AE]" />
//                   )}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* Footer / Logout */}
//       <div className="p-4 mt-auto">
//         {/* <div className="bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100">
//            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Plan: Premium</p>
//            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
//               <div className="h-full w-2/3 bg-[#0028AE] rounded-full" />
//            </div>
//         </div> */}

//         {/* Footer / Plan Status */}
// <div className="p-4 mt-auto">
//   <div className="bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100 transition-all">
//     <div className="flex justify-between items-center mb-2 px-1">
//       <p className="text-[10px] font-black uppercase text-slate-400">
//         Plan: <span className={user?.plan === 'pro' ? 'text-emerald-600' : 'text-blue-600'}>
//           {user?.plan === 'pro' ? 'Pro' : 'Free'}
//         </span>
//       </p>
//       {user?.plan === 'free' && (
//         <p className="text-[9px] font-black text-slate-400">
//           {((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0))}/15
//         </p>
//       )}
//     </div>

//     {/* Dynamic Progress Bar */}
//     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
//       <div 
//         className={`h-full transition-all duration-1000 ease-out rounded-full ${
//           user?.plan === 'pro' ? 'w-full bg-emerald-500' : 'bg-[#0028AE]'
//         }`}
//         style={{ 
//           width: user?.plan === 'pro' 
//             ? '100%' 
//             : `${Math.min((((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0)) / 15) * 100, 100)}%` 
//         }} 
//       />
//     </div>
    
//     {user?.plan === 'free' && (
//       <button 
//         onClick={() => navigate('/billing')}
//         className="w-full mt-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-[#0028AE] hover:text-white hover:border-[#0028AE] transition-all shadow-sm"
//       >
//         Upgrade Now
//       </button>
//     )}
//   </div>
// </div>
        
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Users, BarChart2, Settings, 
  LayoutDashboard, LogOut, Receipt, CreditCard, ShoppingCart,
  Building2, Wallet, GraduationCap, LifeBuoy, BarChart3, Lock
} from "lucide-react";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://quickinvoice-backend-1.onrender.com";

const Sidebar = ({ closeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        { name: "How To Use", icon: <GraduationCap size={18} />, path: "/how-to-use" },
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

  // --- NEW: PREMIUM NAVIGATION GUARD ---
  const handleItemClick = (e, item) => {
    if (item.isPro && user?.plan !== 'pro') {
      e.preventDefault(); // Stop navigation
      toast.error("Upgrade to Pro to access this feature", {
        icon: '🔒',
        style: {
          borderRadius: '12px',
          background: '#001325',
          color: '#fff',
          fontSize: '12px',
          fontWeight: '900',
          textTransform: 'uppercase'
        }
      });
      return;
    }
    if (closeMenu) closeMenu();
  };

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

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.isPro && user?.plan !== 'pro' ? "#" : item.path}
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

                  {/* PRO BADGE UI */}
                  {item.isPro && user?.plan !== 'pro' && (
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
        <div className="bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100 transition-all">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Plan: <span className={user?.plan === 'pro' ? 'text-emerald-600' : 'text-blue-600'}>
                {user?.plan === 'pro' ? 'Pro' : 'Free'}
              </span>
            </p>
            {user?.plan === 'free' && (
              <p className="text-[9px] font-black text-slate-400">
                {((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0))}/15
              </p>
            )}
          </div>

          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                user?.plan === 'pro' ? 'w-full bg-emerald-500' : 'bg-[#0028AE]'
              }`}
              style={{ 
                width: user?.plan === 'pro' 
                  ? '100%' 
                  : `${Math.min((((user?.usage?.invoicesThisMonth || 0) + (user?.usage?.receiptsThisMonth || 0)) / 15) * 100, 100)}%` 
              }} 
            />
          </div>
          
          {user?.plan === 'free' && (
            <button 
              onClick={() => navigate('/billing')}
              className="w-full mt-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-[#0028AE] hover:text-white hover:border-[#0028AE] transition-all shadow-sm"
            >
              Upgrade Now
            </button>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;