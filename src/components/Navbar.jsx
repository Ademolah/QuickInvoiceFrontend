/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Menu, X } from "lucide-react";
// // import Contact from "../pages/Contact";

// export default function Navbar() {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center gap-2"
//         >
//           <Link to="/" className="flex items-center">
//             <img
//               src="/quicknav.svg"   // your image in public/
//               alt="QuickInvoice"
//               className="h-8 w-auto sm:h-9 object-contain"
//             />
//           </Link>
         
//         </motion.div>

//         {/* Desktop Links */}
//         <div className="hidden md:flex items-center gap-8 font-inter">
//           {/* <Link
//             to="/"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//           >
//             Home
//           </Link> */}
//           <Link
//             to="/blog"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//           >
//             Blog
//           </Link>
//           <Link
//             to="/how"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//           >
//             How to Install
//           </Link>
//           <Link
//             to="/contact"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//           >
//             Contact
//           </Link>
//         </div>

//         {/* Auth Buttons (Desktop) */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="hidden md:flex items-center gap-4"
//         >
//           <Link
//             to="/login"
//             className="px-5 py-2 border-2 border-[#0046A5] text-[#0046A5] rounded-lg font-medium hover:bg-[#0046A5] hover:text-white transition-all duration-300 shadow-sm"
//           >
//             Login
//           </Link>
//           <Link
//             to="/register"
//             className="px-5 py-2 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
//           >
//             Register
//           </Link>
//         </motion.div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//           onClick={toggleDrawer}
//         >
//           {drawerOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
//           drawerOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center px-4 py-4 border-b">
//           <div className="flex items-center gap-2">
//             <Link to="/" className="flex items-center">
//             <img
//               src="/quicknav.svg"   // your image in public/
//               alt="QuickInvoice"
//               className="h-8 w-auto sm:h-9 object-contain"
//             />
//           </Link>
            
//           </div>
//           <button
//             onClick={toggleDrawer}
//             className="p-1 rounded-lg hover:bg-gray-100"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="flex flex-col mt-6 space-y-4 px-4 font-inter">
//           <Link
//             to="/"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//             onClick={toggleDrawer}
//           >
//             Home
//           </Link>
//           <Link
//             to="/blog"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//             onClick={toggleDrawer}
//           >
//             Blog
//           </Link>
//           <Link
//             to="/how"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//             onClick={toggleDrawer}
//           >
//             How to Install
//           </Link>
//           <Link
//             to="/contact"
//             className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
//             onClick={toggleDrawer}
//           >
//             Contact
//           </Link>
//           <Link
//             to="/login"
//             className="px-5 py-2 border-2 border-[#0046A5] text-[#0046A5] rounded-lg font-medium hover:bg-[#0046A5] hover:text-white transition-all duration-300 shadow-sm"
//             onClick={toggleDrawer}
//           >
//             Login
//           </Link>
//           <Link
//             to="/register"
//             className="px-5 py-2 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
//             onClick={toggleDrawer}
//           >
//             Register
//           </Link>
//         </div>
//       </div>

//       {/* Backdrop */}
//       {drawerOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40"
//           onClick={toggleDrawer}
//         ></div>
//       )}
//     </nav>
//   );
// }



import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LayoutGrid, Zap, Shield, ChevronRight, Globe } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Solutions", path: "/solutions", description: "Tailored for your industry" },
    { name: "Integration", path: "/how", description: "Connect your ecosystem" },
    { name: "Resources", path: "/blog", description: "Insights for growth" },
    { name: "Contact", path: "/contact", description: "Global 24/7 support" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          scrolled 
            ? "py-3 bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo - Keeping your custom SVG */}
          <Link to="/" className="relative z-[110] flex items-center group">
            <img
              src="/quicknav.svg"
              alt="QuickInvoice"
              className={`h-8 w-auto transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}
            />
          </Link>

          {/* Desktop Navigation - Center-aligned for elegance */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-6 py-2 text-[13px] font-bold text-[#001325]/70 hover:text-[#0028AE] hover:bg-white rounded-full transition-all duration-300 relative group"
              >
                {link.name}
                <motion.div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0028AE] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Desktop Action Group */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-[#001325] hover:text-[#0028AE] transition-colors">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="group relative px-8 py-3 bg-[#0028AE] text-white text-sm font-bold rounded-full overflow-hidden shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-[#001325] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="relative z-[110] lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#001325] text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? <X size={20} key="close" /> : <Menu size={20} key="open" />}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Side Drawer - World Class Mobile Experience */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#001325]/40 backdrop-blur-md z-[101]"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white z-[105] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="p-8 pt-24 space-y-8 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-4">
                  Navigation
                </p>
                <div className="space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Link 
                        to={link.path} 
                        className="group flex items-center justify-between py-4 border-b border-slate-50 transition-all"
                      >
                        <div>
                          <p className="text-xl font-bold text-[#001325] group-hover:text-[#0028AE] transition-colors">{link.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{link.description}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0028AE] group-hover:text-white transition-all">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-8 bg-slate-50 space-y-4">
                <div className="flex items-center gap-3 text-slate-500 mb-6">
                  <Globe size={16} />
                  <span className="text-xs font-bold tracking-widest uppercase">Nigeria / English</span>
                </div>
                <Link 
                  to="/register" 
                  className="block w-full py-5 bg-[#0028AE] text-white text-center rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20"
                >
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="block w-full py-5 bg-white border border-slate-200 text-[#001325] text-center rounded-2xl font-bold text-lg"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

