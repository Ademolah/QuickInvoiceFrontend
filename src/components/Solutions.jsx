import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Highly recommended for SEO
import { 
  Zap, ShieldCheck, BarChart3, Globe, 
  Smartphone, Users, ArrowRight, CheckCircle2 
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Solutions() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Freelancers & Creators",
      description: "Professional PDF invoicing and global payment links designed for the modern solo-preneur.",
      features: ["WhatsApp Integration", "Multi-currency Support", "Pro PDF Exports"],
      icon: <Zap className="text-amber-500" size={24} />,
      color: "bg-amber-50"
    },
    {
      title: "Retail & SMEs",
      description: "Comprehensive transaction history and automated payout tracking for growing businesses.",
      features: ["Inventory Tracking", "Monthly Limit Analytics", "Verified Payouts"],
      icon: <Users className="text-[#0028AE]" size={24} />,
      color: "bg-blue-50"
    },
    {
      title: "Agencies & ERPs",
      description: "White-label branding and high-volume document management for large-scale operations.",
      features: ["Custom Branding", "Expense Insights", "Priority Support"],
      icon: <Globe className="text-emerald-500" size={24} />,
      color: "bg-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* SEO Metadata: The Global Handshake */}
      <Helmet>
        <title>Business Solutions | QuickInvoice Technologies</title>
        <meta name="description" content="Explore tailored billing and inventory solutions for freelancers, retail SMEs, and digital agencies. Optimized for the Nigerian and global market." />
        <meta property="og:title" content="QuickInvoice Solutions - Invoicing for Every Business" />
        <link rel="canonical" href="https://quickinvoiceng.com/solutions" />
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        
        {/* Hero Section: Optimized for LCP */}
        <header className="bg-white border-b border-slate-200 pt-24 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black uppercase tracking-[0.2em]"
            >
              The QuickInvoice Ecosystem
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
              Tailored billing for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0028AE] to-[#00A6FA]">every business model.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Securing cashflow for Nigerian entrepreneurs through world-class automation and mobile-first design.
            </p>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
          {/* Solutions Grid: Semantic <article> tags for SEO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {categories.map((cat, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:rotate-6 transition-transform`}>
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{cat.title}</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  {cat.description}
                </p>
                <div className="space-y-4 mb-10">
                  {cat.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <div className="bg-emerald-500/10 p-1 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-2xl border-2 border-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:border-[#0028AE] group-hover:text-[#0028AE] transition-all">
                  Learn More
                </button>
              </motion.article>
            ))}
          </div>

          {/* Bento Feature Section: Visual Storytelling */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-24">
            <div className="lg:col-span-3 bg-slate-900 rounded-[3.5rem] p-12 text-white overflow-hidden relative group min-h-[400px] flex flex-col justify-center">
              <Smartphone className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-700" size={500} />
              <div className="relative z-10 max-w-md">
                <span className="text-[#00A6FA] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Merchant App</span>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Mobile-First <br />Invoicing</h2>
                <p className="text-white/50 font-medium mb-10 text-base leading-relaxed">
                  Generate professional receipts in seconds while chatting with customers. Optimized for the fast-paced Nigerian marketplace.
                </p>
                <button onClick={() => navigate("/login")} className="inline-flex items-center gap-3 px-8 py-4 bg-[#00A6FA] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-blue-500/20 transition-all">
                  Get Started <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-[#0028AE] rounded-[3.5rem] p-12 text-white overflow-hidden relative group min-h-[400px] flex flex-col justify-center">
              <ShieldCheck className="absolute -right-10 -bottom-10 text-white/5 group-hover:-rotate-12 transition-transform duration-700" size={350} />
              <div className="relative z-10">
                <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Reliability</span>
                <h2 className="text-3xl font-black mb-6 leading-tight">Bank-Grade <br />Settlements</h2>
                <p className="text-white/60 font-medium mb-10 text-sm leading-relaxed">
                  Integrate bank details and automate reconciliation with trust-built systems.
                </p>
                <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all">
                  Explore Payouts <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA: Conversion Focused */}
        <section className="mb-32 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-16 border border-slate-100 shadow-2xl shadow-slate-200/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0028AE] to-transparent opacity-20" />
            <BarChart3 className="mx-auto text-[#0028AE]/10 mb-8" size={64} />
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Ready to optimize?</h2>
            <p className="text-slate-500 text-lg font-medium mb-10 max-w-xl mx-auto">
              Join thousands of businesses simplifying operations with <span className="text-slate-900 font-bold">QuickInvoice.</span>
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#0028AE] hover:scale-105 transition-all duration-300"
            >
              Launch Your Dashboard
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}