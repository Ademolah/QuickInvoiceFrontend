import React from 'react';
import { motion } from 'framer-motion';
import { Box, RefreshCw, FileText, BarChart3, ShieldCheck } from 'lucide-react';

const InventoryFeatureShowcase = () => {
  // Animation Variants for a "Premium" entrance
  const fadeIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const phoneVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const inventoryFeatures = [
    {
      icon: Box,
      title: "Automated Stock Tracking",
      desc: "Real-time updates as you sell. Never run out of your best-sellers again.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: RefreshCw,
      title: "The POS Connection",
      desc: "Every item sold via QuickPOS automatically deducts from your main warehouse.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: FileText,
      title: "Invoice Integration",
      desc: "Instantly convert inventory data into professional invoices for bulk clients.",
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <section className="bg-slate-950 py-24 md:py-32 overflow-hidden relative">
      {/* 🌌 Atmospheric Glow (Dark Mode Elegance) */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-center">
        
        {/* LEFT SIDE: THE PHONE ASSET */}
        <div className="md:col-span-6 relative flex justify-center">
          {/* Decorative Ring behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          
          <motion.div 
            variants={phoneVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
          >
            {/* 📱 YOUR PHONE MOCKUP HERE */}
            <img 
              src="phone.png" 
              alt="QuickInvoice Inventory Mobile Interface"
              className="w-full max-w-[320px] h-auto rounded-[3rem] border-[8px] border-slate-900"
            />

            {/* Floating Notification Badge */}
            <motion.div 
              className="absolute -right-6 top-1/4 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <BarChart3 size={16} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Stock Alert</p>
                <p className="text-sm font-black text-slate-900 leading-none italic">Sold +N245k</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: THE COPY */}
        <div className="md:col-span-6 space-y-10">
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.1em] uppercase mb-6 border border-blue-500/20">
              <ShieldCheck size={14} />
              Intelligent Inventory Control
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6 italic">
              A Living, Breathing <br /> Warehouse.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              Your inventory isn't just a list, it's the heart of your business. QuickInvoice connects your stock directly to your POS terminal and Invoice engine for a unified flow of data.
            </p>
          </motion.div>

          {/* FEATURE CARDS */}
          <div className="space-y-6">
            {inventoryFeatures.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${f.color}`}>
                  <f.icon size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1.5">{f.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default InventoryFeatureShowcase;