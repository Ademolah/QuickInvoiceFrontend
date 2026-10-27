/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */




import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Bell, Wallet, TrendingUp, MoreHorizontal, CreditCard, ArrowUpRight } from "lucide-react";

// --- Custom Premium Typewriter ---
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
    <span className="text-[#00A6FA] inline-block min-w-[180px]">
      {currentText}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block w-1 h-10 md:h-16 bg-[#00A6FA] shadow-[0_0_15px_#00A6FA] align-middle"
      />
    </span>
  );
};

export default function WorldClassHero() {
  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#FDFDFD] overflow-hidden pt-28 pb-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[#0028AE]/[0.02] -skew-x-12 translate-x-20 pointer-events-none hidden lg:block" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#00A6FA]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column */}
          <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 w-fit px-4 py-2 rounded-full bg-white shadow-xl shadow-blue-900/5 border border-slate-100 mx-auto lg:mx-0"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#0028AE]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#001325]">
                Infrastructure for African Commerce
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-7xl xl:text-8xl font-black text-[#001325] leading-[0.9] tracking-tighter">
              Master your <br />
              <span className="text-slate-400">entire </span> <br />
              <Typewriter words={["Invoices.", "Inventory.", "Stores.", "Finances."]} />
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
              Elegant tools for ambitious entrepreneurs. Sync your offline and online 
              operations with the continent's most refined business engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <button className="group relative w-full sm:w-auto bg-[#0028AE] px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-blue-900/30 transition-all hover:bg-[#001325] flex items-center justify-center gap-3">
                Elevate Now <ArrowRight size={20} />
              </button>

              <button className="flex items-center gap-4 text-[#001325] font-bold group">
                <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-slate-50 group-hover:border-[#0028AE] transition-all">
                  <Play size={18} className="fill-[#001325] ml-1" />
                </div>
                <span className="text-xs tracking-[0.2em] uppercase">Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Masterpiece */}
          <div className="flex-1 relative w-full flex items-center justify-center lg:h-[650px]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[480px] md:max-w-[550px] aspect-[4/5] md:aspect-auto md:h-[600px] scale-90 md:scale-100"
              style={{ perspective: "1500px" }}
            >
              {/* Main Dashboard Mockup */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotateX: [2, 4, 2], rotateY: [-3, -1, -3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,19,37,0.12)] border border-slate-100 overflow-hidden flex flex-col"
              >
                {/* Header of Mockup */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0028AE] rounded-lg flex items-center justify-center text-white font-black text-xs italic">Q</div>
                    <div className="h-2 w-20 md:w-24 bg-slate-100 rounded-full" />
                  </div>
                  <div className="flex gap-3 md:gap-4">
                    <Bell size={18} className="text-slate-300" />
                    <div className="h-6 w-6 rounded-full bg-slate-100" />
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="p-6 md:p-8 space-y-6 bg-white flex-1 overflow-hidden">
                  {/* Total Balance Card */}
                  <div className="bg-[#0028AE] p-6 rounded-[2rem] text-white flex justify-between items-start overflow-hidden relative shadow-lg shadow-blue-900/20">
                    <div className="relative z-10">
                      <p className="text-[9px] uppercase tracking-[0.2em] opacity-60 font-black mb-1">Portfolio Value</p>
                      <h3 className="text-2xl font-black">₦4,250,000</h3>
                    </div>
                    <Wallet size={20} className="opacity-40" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[2rem] bg-[#00A6FA]/5 border border-[#00A6FA]/10 flex flex-col justify-between">
                      <TrendingUp size={16} className="text-[#00A6FA]" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Monthly Sales</p>
                        <p className="text-xl font-black text-[#001325]">₦1.2M</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-[2rem] bg-[#001325] border border-white/5 flex flex-col justify-between text-white">
                       <CreditCard size={16} className="text-[#00A6FA]" />
                       <div>
                        <p className="text-[9px] text-white/40 font-black uppercase mb-1">Invoices</p>
                        <p className="text-xl font-black">128</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-4 pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recent Settlements</p>
                    {[
                      { label: "Olowo Designs", amount: "+₦45,000", color: "text-emerald-500" },
                      { label: "Abuja Tech Hub", amount: "+₦120,000", color: "text-emerald-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0028AE]">
                            <ArrowUpRight size={16} />
                          </div>
                          <p className="text-xs font-bold text-[#001325]">{item.label}</p>
                        </div>
                        <p className={`text-xs font-black ${item.color}`}>{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Success Notification - Hidden on very small mobile for space, visible on tablet/desktop */}
              <motion.div 
                animate={{ y: [0, 40, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 lg:-right-12 z-30 w-64 md:w-72 bg-[#001325] p-5 md:p-6 rounded-[2.5rem] shadow-3xl text-white flex items-center gap-4 border border-white/10 sm:flex"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 bg-[#0028AE] rounded-2xl flex items-center justify-center text-[#00A6FA]">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sale Verified</p>
                  <p className="text-lg md:text-xl font-bold">₦85,000</p>
                </div>
              </motion.div>

              {/* Glass Decorators */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#00A6FA]/20 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-20 -right-20 w-48 h-48 bg-[#0028AE]/10 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}