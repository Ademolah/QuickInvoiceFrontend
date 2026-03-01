import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
      title: "For Freelancers",
      description: "Get paid faster with professional PDF invoices and automated payment links.",
      features: ["Instant WhatsApp Sharing", "Multi-currency Support", "Pro PDF Templates"],
      icon: <Zap className="text-amber-500" size={24} />,
      color: "bg-amber-50"
    },
    {
      title: "For Retail & SMEs",
      description: "Track your monthly limits and manage customer payouts with bank-grade security.",
      features: ["Transaction History", "Usage Tracking", "Verified Payouts"],
      icon: <Users className="text-[#0028AE]" size={24} />,
      color: "bg-blue-50"
    },
    {
      title: "For Digital Agencies",
      description: "Scale your business with branding tools and centralized document management.",
      features: ["Custom Branding", "Expense Insights", "Priority Support"],
      icon: <Globe className="text-emerald-500" size={24} />,
      color: "bg-emerald-50"
    }
  ];

  return (
    /* Removed pb-20 so Footer touches the bottom properly */
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Main Content Wrapper - flex-grow ensures footer stays at bottom if content is short */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 pt-20 pb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black uppercase tracking-[0.2em]"
            >
              The QuickInvoice Ecosystem
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Tailored billing for every <br />
              <span className="text-[#0028AE]">business model.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Whether you're a solo creator or a growing team, our platform adapts to your workflow, 
              securing your cashflow with world-class automation.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 -mt-10">
          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{cat.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                  {cat.description}
                </p>
                <div className="space-y-3 mb-8">
                  {cat.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <CheckCircle2 size={14} className="text-[#0028AE]" />
                      {feat}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bento Feature Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative group">
              <Smartphone className="absolute -right-10 -bottom-10 text-white/5 group-hover:rotate-12 transition-transform duration-500" size={300} />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Mobile-First <br />Invoicing</h3>
                <p className="text-white/60 font-medium mb-8 max-w-xs text-sm">
                  Generate and send professional receipts directly from your phone. 
                  Optimized for the Nigerian entrepreneur on the go.
                </p>
                <button 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00A6FA] hover:gap-4 transition-all"
                >
                  Launch Dashboard <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-[#0028AE] rounded-[3rem] p-10 text-white overflow-hidden relative group">
              <ShieldCheck className="absolute -right-10 -bottom-10 text-white/5 group-hover:-rotate-12 transition-transform duration-500" size={300} />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Bank-Grade <br />Settlements</h3>
                <p className="text-white/60 font-medium mb-8 max-w-xs text-sm">
                  Integrate your bank details once and let our system handle the rest. 
                  Secure, transparent, and built for trust.
                </p>
                <button 
                   onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:gap-4 transition-all"
                >
                  View Plans <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Added mb-24 to create space before Footer */}
        <section className="mt-24 mb-24 px-6 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
            <BarChart3 className="mx-auto text-slate-200 mb-6" size={48} />
            <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to optimize?</h2>
            <p className="text-slate-500 font-medium mb-8">Join thousands of businesses simplifying their financial operations.</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
            >
              Start Invoicing Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}