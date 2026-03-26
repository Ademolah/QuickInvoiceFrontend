import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const POSBespokeShowcase = () => {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const imageScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative bg-white py-24 md:py-32 overflow-hidden">
      {/* 🌎 Subtle Background Decoration (Premium feel) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        
        {/* HEADER AREA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-amber-400" />
              Next-Gen Terminal
            </span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tighter leading-[1.1]">
            Experience the <span className="text-blue-600">QuickPOS</span> Difference.
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
            We’ve reimagined the checkout experience from the ground up. 
            Faster processing, smarter inventory, and elegant digital receipts—all in one world-class interface.
          </motion.p>
        </motion.div>

        {/* 🖼️ THE MAIN ASSET DISPLAY 🖼️ */}
        <motion.div 
          variants={imageScale}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl group"
        >
          {/* Elevation Shadow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* ASSET CONTAINER */}
          <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 bg-white">
            {/* 🚀 INSERT YOUR IMAGE HERE 🚀 */}
            <img 
              src="desk.png" 
              alt="QuickPOS Terminal Showcase"
              className="w-full h-auto block" // h-auto maintains the aspect ratio of your custom asset
            />
          </div>

          {/* FLOATING BENEFIT BADGES (Desktop Only) */}
          <motion.div 
            className="hidden lg:flex absolute -left-12 top-1/4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white items-center gap-3"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-bold text-slate-800 pr-2">99.9% Uptime</span>
          </motion.div>

          <motion.div 
            className="hidden lg:flex absolute -right-12 bottom-1/4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white items-center gap-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ArrowRight size={20} />
            </div>
            <span className="font-bold text-slate-800 pr-2">Instant Sync</span>
          </motion.div>
        </motion.div>

        {/* BOTTOM CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-28 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
            Start Selling Now
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live across Nigeria
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default POSBespokeShowcase;