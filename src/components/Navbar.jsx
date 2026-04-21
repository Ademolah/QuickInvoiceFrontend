/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */



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
    { name: "QuickPOS", path: "/quickpos", description: "Elevate your retail stores" },
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
        {/* 1. SCROLLABLE NAVIGATION AREA */}
        {/* We use flex-1 and overflow-y-auto to ensure this area takes up available space but scrolls if it overflows */}
        <div className="flex-1 overflow-y-auto pt-24 px-8 pb-8 custom-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-4 mb-6">
            Navigation
          </p>
          
          <div className="space-y-1"> {/* Tightened space-y from 2 to 1 for better density */}
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }} // Faster staggered animation
              >
                <Link 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between py-4 border-b border-slate-50 transition-all"
                >
                  <div>
                    <p className="text-xl font-bold text-[#001325] group-hover:text-[#0028AE] transition-colors">
                      {link.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium leading-tight max-w-[200px]">
                      {link.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0028AE] group-hover:text-white transition-all">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. PINNED DRAWER FOOTER */}
        {/* This stays at the bottom regardless of how many links you add */}
        <div className="p-8 bg-white border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <Globe size={14} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Nigeria / English</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Link 
              to="/register" 
              className="w-full py-4 bg-[#0028AE] text-white text-center rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-transform"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="w-full py-4 bg-white border border-slate-200 text-[#001325] text-center rounded-xl font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  );
}

