import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ShieldCheck, BarChart3, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const QuickPosPage = () => {

    const navigate = useNavigate();

  return (
    <div className="bg-[#001325] min-h-screen text-white font-sans selection:bg-blue-500/30">

        <Navbar/>
      
      {/* 1. HERO SECTION: THE IMMERSIVE ENTRANCE */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/quickpos.jpg" // Manually replace with your desktop image
            alt="QuickPOS Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001325]/60 via-transparent to-[#001325]" />
        </div>

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-[0.3em] uppercase bg-blue-600 rounded-full">
              Enterprise Grade
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              QuickPOS: The <span className="text-blue-500">Financial Heart</span> <br /> of Modern Retail.
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Transform your storefront into a high-fidelity data engine. Speed, VAT compliance, and world-class inventory intelligence in one seamless terminal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY SECTION (Crisp Text) */}
      <section className="py-24 bg-white text-[#001325]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Engineered for the <br /> <span className="text-blue-600">Ambitious Merchant.</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              QuickPOS isn't just a checkout tool; it's a strategic asset. We've removed the friction between making a sale and balancing your books. Every tap is recorded, every tax is calculated, and every inventory movement is tracked with surgical precision.
            </p>
            <div className="space-y-4">
              {[
                "Instant Offline-to-Cloud Sync",
                "Built-in Nigerian VAT Intelligence",
                "Inventory Management",
                "High-Fidelity Transaction Reports"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 font-bold text-slate-800">
                  <CheckCircle2 className="text-blue-600 w-6 h-6" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Retail Store Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-slate-100"
          >
            <img 
              src="/retail.jpg" // Manually replace with your retail store image
              alt="QuickPOS in Retail"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xs">
              <ShoppingBag className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-black text-slate-900 leading-tight">Trusted by 500+ Luxury Brands across Nigeria.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. THE "WORLD-CLASS" FEATURE GRID */}
      <section className="py-32 bg-[#001325]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Uncompromising Features.</h2>
            <p className="text-slate-400 text-lg">Everything you need to run a high-performance business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />} 
              title="Lightning Speed" 
              desc="Process transactions in under 2 seconds. The fastest checkout experience in the market." 
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />} 
              title="VAT Ready" 
              desc="Automatically handles 7.5% VAT and other custom tax structures with zero manual entry." 
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8" />} 
              title="Real-Time Analytics" 
              desc="Deep insights into your profit margins, top-selling items, and stock velocity." 
            />
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 bg-blue-600 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-8 px-4">Ready to elevate your terminal?</h2>
        <button onClick={()=>navigate('/login')} className="bg-[#001325] text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl uppercase tracking-widest">
          Get Started with QuickPOS
        </button>
      </section>

      <Footer/>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[2rem] bg-[#001d36] border border-slate-800 hover:border-blue-500/50 transition-all group">
    <div className="bg-blue-600 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default QuickPosPage;