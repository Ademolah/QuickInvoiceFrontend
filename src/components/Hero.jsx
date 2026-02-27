/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// // import React from "react";
// import { Link } from "react-router-dom";


// // src/components/Hero.jsx
// import React, { useEffect, useState } from "react";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// const phrasesDefault = [
//   "Send invoices in seconds",
//   "Get paid faster, every time",
//   "Track payments. Grow your business.",
//   "Receipts, reports & powerful automation",
// ];

// function useTypewriter(phrases = [], speed = 80, pause = 1200) {
//   const [index, setIndex] = useState(0);
//   const [display, setDisplay] = useState("");
//   const [mode, setMode] = useState("typing");

//   useEffect(() => {
//     let mounted = true;
//     let timer;
//     const current = phrases[index % phrases.length];

//     if (mode === "typing") {
//       let i = 0;
//       timer = setInterval(() => {
//         if (!mounted) return;
//         setDisplay(current.slice(0, i + 1));
//         i++;
//         if (i === current.length) {
//           clearInterval(timer);
//           timer = setTimeout(() => setMode("deleting"), pause);
//         }
//       }, speed);
//     } else if (mode === "deleting") {
//       let i = current.length;
//       timer = setInterval(() => {
//         if (!mounted) return;
//         setDisplay(current.slice(0, i - 1));
//         i--;
//         if (i <= 0) {
//           clearInterval(timer);
//           setIndex((prev) => prev + 1);
//           setMode("typing");
//         }
//       }, speed / 1.6);
//     }

//     return () => {
//       mounted = false;
//       if (timer) clearInterval(timer);
//     };
//   }, [index, mode, phrases, speed, pause]);

//   return display;
// }

// export default function Hero({
//   phrases = phrasesDefault,
//   onPrimaryClick = () => {},
//   onSecondaryClick = () => {},
// }) {
//   const typed = useTypewriter(phrases, 60, 1200);

//   const blobVariants = {
//     float: {
//       y: [0, -18, 0],
//       x: [0, 10, -8, 0],
//       transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
//     },
//   };


// const invoiceAmount = useMotionValue(0);
// const formattedAmount = useTransform(invoiceAmount, (v) =>
//   `₦ ${Math.floor(v).toLocaleString()}`
// );
// const [invoiceCount, setInvoiceCount] = useState(1248);

// useEffect(() => {
//   // Animate invoice amount
//   animate(invoiceAmount, 120500, {
//     duration: 1.8,
//     ease: "easeOut",
//   });
//   // Auto-increment invoices issued
//   const interval = setInterval(() => {
//     setInvoiceCount((prev) => prev + Math.floor(Math.random() * 3 + 1));
//   }, 2500);
//   return () => clearInterval(interval);
// }, []);


// const statuses = ["Draft", "Sent", "Paid"];
// const [status, setStatus] = useState("Draft");

// useEffect(() => {
//   const interval = setInterval(() => {
//     setStatus(prev => {
//       const nextIndex = (statuses.indexOf(prev) + 1) % statuses.length;
//       return statuses[nextIndex];
//     });
//   }, 2500);
//   return () => clearInterval(interval);
// }, []);


//   return (
//     <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Animated gradient background */}
//       <div
//         aria-hidden
//         className="absolute inset-0 -z-10"
//         style={{
//           background:
//             "linear-gradient(120deg, #00A6FA 0%, #0028AE 50%, #00A6FA 100%)",
//           backgroundSize: "200% 200%",
//           animation: "bgShift 12s ease-in-out infinite",
//         }}
//       />
//       <style>{`
//         @keyframes bgShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>

//       {/* Decorative blobs */}
//       <motion.div
//         className="absolute -right-8 top-8 opacity-40"
//         variants={blobVariants}
//         animate="float"
//         aria-hidden
//       >
//         <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="blur-sm">
//           <defs>
//             <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
//               <stop offset="0%" stopColor="#00B86B" stopOpacity="0.8" />
//               <stop offset="100%" stopColor="#0046A5" stopOpacity="0.8" />
//             </linearGradient>
//             <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
//               <feGaussianBlur stdDeviation="35" result="b" />
//             </filter>
//           </defs>
//           <g filter="url(#f1)">
//             <path d="M80 40 C 180 -20, 320 0, 360 100 C 400 200, 320 320, 220 360 C 120 400, 40 320, 60 220 C 80 120, 40 60, 80 40 Z" fill="url(#g1)"/>
//           </g>
//         </svg>
//       </motion.div>

//       {/* Content */}
//       <div className="relative z-10 w-full max-w-6xl px-6 py-20 md:py-28">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
//         >
//           {/* Left - text */}
//           <div className="text-center md:text-left">
//             <motion.h1
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1, duration: 0.6 }}
//               className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight font-poppins"
//             >
//               Business, simplified 
//               <span className="block text-white/95 mt-3 text-2xl md:text-3xl font-semibold">
//                 Powerful tools to run & grow your SME
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.25, duration: 0.6 }}
//               className="mt-6 text-gray-100 max-w-md mx-auto md:mx-0 text-base md:text-lg"
//             >
//               Invoicing, receipts, payments, inventory, Business management, wrapped in a single elegant app built for Businesses.
//             </motion.p>

//             {/* Typewriter effect */}
//             <div className="mt-6 flex items-center justify-center md:justify-start">
//               <motion.div
//                 initial={{ opacity: 0, y: 6 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//                 className="text-white/95 font-medium bg-white/10 px-4 py-2 rounded-full shadow-sm"
//                 aria-live="polite"
//               >
//                 <span>{typed}</span>
//                 <span className="animate-pulse ml-1">▌</span>
//               </motion.div>
//             </div>

//             {/* CTA buttons */}
//             <motion.div
//               className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//             >

//               <Link to="/register">
//               <button
//                 // onClick={onPrimaryClick}
//                 className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-white text-[#0046A5] font-semibold shadow-lg hover:scale-[1.02] hover:shadow-2xl transition transform"
//               >
//                 Get Started It's Free
//               </button>
//               </Link>

//               {/* <button
//                 onClick={onSecondaryClick}
//                 className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
//               >
//                 View Pricing
//               </button> */}
//             </motion.div>
//           </div>

//           {/* Right - illustrative card */}
// <motion.div
//   initial={{ scale: 0.98, opacity: 0 }}
//   animate={{ scale: 1, opacity: 1 }}
//   transition={{ delay: 0.45, duration: 0.6 }}
//   className="flex items-center justify-center"
// >
//   <div className="relative w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-6 md:p-8">
//     {/* Soft ambient glow */}
//     <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0028AE]/5 to-[#00A6FA]/10 rounded-2xl" />
    
//     {/* Top stats row (NO overlap, NO clipping) */}
//     <div className="relative flex items-center justify-between mb-4">
//       <motion.div
//         initial={{ opacity: 0, y: -6 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.7 }}
//         className="text-xs font-semibold text-[#0028AE] bg-blue-50 px-3 py-1 rounded-full"
//       >
//         {invoiceCount.toLocaleString()} invoices issued
//       </motion.div>
//       <div className="text-sm font-semibold text-[#0046A5] whitespace-nowrap">
//         Quick • Simple
//       </div>
//     </div>

//     {/* Header */}
//     <div className="relative">
//       <h3 className="text-sm font-semibold text-gray-700">
//         Invoice preview
//       </h3>
//       <p className="text-xs text-gray-500 mt-1">
//         Professional template ready to send
//       </p>
//     </div>

//     {/* Body */}
//     <div className="relative mt-4 space-y-3">
//       <div className="rounded-lg p-3 bg-gray-50 border">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-sm font-semibold text-gray-800">
//               Acme Store
//             </div>
//             <div className="text-xs text-gray-500">
//               Invoice • 2025-09-01
//             </div>
//           </div>
//           <motion.div className="text-sm font-bold text-[#00B86B]">
//             ₦ 120,500
//           </motion.div>
//         </div>
//       </div>

//       <div className="rounded-lg p-3 bg-gray-50 border">
//         <div className="text-sm text-gray-700">
//           1 × Website design — ₦ 120,500
//         </div>
//       </div>

//       {/* Realistic Status Transition */}
//       <div className="mt-3 flex justify-between items-center">
//         <div className="text-xs text-gray-500">Status</div>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{
//             opacity: 1,
//           }}
//           transition={{ duration: 0.4 }}
//           className="flex items-center gap-2 text-sm font-semibold"
//         >
//           <motion.span
//             key={status}
//             initial={{ opacity: 0, y: 4 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={
//               status === "Draft"
//                 ? "text-gray-500"
//                 : status === "Sent"
//                 ? "text-yellow-600"
//                 : "text-green-600"
//             }
//           >
//             {status}
//           </motion.span>
//         </motion.div>
//       </div>
//     </div>

//     {/* Actions */}
//     <div className="relative mt-6 flex gap-3">
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.97 }}
//         className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-semibold"
//       >
//         Send
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.97 }}
//         className="px-3 py-2 rounded-md border"
//       >
//         Preview
//       </motion.button>
//     </div>
//   </div>
// </motion.div>

//         </motion.div>
//       </div>
//     </section>
//   );
// }



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