import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Wallet, TrendingUp, CreditCard, ArrowUpRight, BarChart3, LayoutGrid, Settings } from "lucide-react";

// --- Crisp, Engineered Typewriter ---
const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = words[index];
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) setTimeout(() => setIsDeleting(true), 2500);
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 30 : 60);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, index, words]);

  return (
    <span className="text-[#0028AE] inline-block min-w-[200px]">
      {currentText}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-1.5 h-[1em] bg-[#0028AE] align-text-bottom"
      />
    </span>
  );
};

export default function WorldClassHero() {
  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#FAFAFA] overflow-hidden pt-32 pb-16 font-sans">
      
      {/* Clean Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left Column: Authoritative Typography */}
          <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left pt-10 lg:pt-0">
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 w-fit px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm mx-auto lg:mx-0"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                Infrastructure for African Commerce
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-extrabold text-[#09090B] leading-[1.05] tracking-tight">
              Master your <br />
              <span className="text-slate-400 font-medium">entire </span> <br />
              <Typewriter words={["Invoices.", "Inventory.", "Stores.", "Finances."]} />
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
              Elegant tools for ambitious entrepreneurs. Sync your offline and online 
              operations with the continent's most refined business engine.
            </p>

            {/* Clean, Direct Call-to-Action */}
            <div className="flex justify-center lg:justify-start">
              <a 
                href="/login" 
                className="w-full sm:w-auto bg-[#09090B] text-white px-8 py-4 rounded-xl font-semibold text-base shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] transition-all hover:bg-slate-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Go pro with your business <ArrowRight size={18} />
              </a>
            </div>
            
          </div>

          {/* Right Column: Realistic SaaS Application Mockup */}
          <div className="flex-1 relative w-full flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[650px] z-20"
            >
              {/* App Window Chrome */}
              <div className="w-full bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden flex flex-col">
                
                {/* macOS Style Title Bar */}
                <div className="h-12 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60 flex items-center px-4 gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400/90 shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-inner" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-slate-200/60 shadow-sm">
                    <div className="w-3 h-3 bg-[#0028AE] rounded-sm flex items-center justify-center text-white font-bold text-[8px]">Q</div>
                    <span className="text-[10px] font-semibold text-slate-500">www.quickinvoiceng.com</span>
                  </div>
                </div>

                {/* Dashboard Layout */}
                <div className="flex h-[450px] md:h-[500px] bg-[#FAFAFA]">
                  
                  {/* Sidebar */}
                  <div className="hidden md:flex w-48 border-r border-slate-200/60 bg-white flex-col p-4 space-y-6">
                    <div className="space-y-1">
                      <div className="h-8 rounded-lg bg-slate-100 flex items-center px-3 gap-3 text-[#0028AE]">
                         <LayoutGrid size={14} />
                         <span className="text-xs font-semibold">Dashboard</span>
                      </div>
                      <div className="h-8 rounded-lg flex items-center px-3 gap-3 text-slate-500 hover:bg-slate-50">
                         <BarChart3 size={14} />
                         <span className="text-xs font-medium">Analytics</span>
                      </div>
                      <div className="h-8 rounded-lg flex items-center px-3 gap-3 text-slate-500 hover:bg-slate-50">
                         <CreditCard size={14} />
                         <span className="text-xs font-medium">Invoices</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="h-8 rounded-lg flex items-center px-3 gap-3 text-slate-500 hover:bg-slate-50">
                         <Settings size={14} />
                         <span className="text-xs font-medium">Settings</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="flex-1 p-5 md:p-6 overflow-hidden flex flex-col gap-4">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h2 className="text-lg font-bold text-[#09090B]">Overview</h2>
                        <p className="text-xs text-slate-500">Your business at a glance today.</p>
                      </div>
                    </div>

                    {/* Primary Stat Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded-lg text-[#0028AE]">
                            <Wallet size={16} />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio Value</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+14.2%</span>
                      </div>
                      <h3 className="text-3xl font-black text-[#09090B] tracking-tight">₦4,250,000</h3>
                    </div>

                    {/* Secondary Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Monthly Sales</p>
                        <p className="text-lg font-bold text-[#09090B]">₦1.2M</p>
                        <TrendingUp size={14} className="text-emerald-500 mt-2" />
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                         <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Invoices</p>
                         <p className="text-lg font-bold text-[#09090B]">128</p>
                         <CreditCard size={14} className="text-[#0028AE] mt-2" />
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-2 flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Settlements</p>
                      <div className="space-y-3">
                        {[
                          { label: "Olowo Designs", amount: "+₦45,000", time: "2m ago" },
                          { label: "Abuja Tech Hub", amount: "+₦120,000", time: "1h ago" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#0028AE] transition-colors">
                                <ArrowUpRight size={14} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#09090B]">{item.label}</p>
                                <p className="text-[10px] text-slate-400">{item.time}</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-emerald-600">{item.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Structural Floating Alert */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-5 -right-5 lg:-right-10 z-30 bg-white p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-200 flex items-center gap-3"
              >
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Sale Verified</p>
                  <p className="text-sm font-black text-[#09090B]">₦85,000</p>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}