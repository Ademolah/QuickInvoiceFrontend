import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck, Zap } from "lucide-react";

const testimonials = [
  {
    name: "Favour J.",
    role: "CEO, SweetToothiesByNk",
    feedback: "QuickInvoice has completely simplified my invoicing. I can send and track receipts instantly. It saves me hours every week.",
    rating: 5,
    initials: "FJ",
    color: "#0028AE",
    featured: true // This card will be larger
  },
  {
    name: "Eluonye U.",
    role: "Founder, HOMKELLA CLEANING",
    feedback: "The smart collections feature is a game-changer. My clients pay faster. Worth every naira!",
    rating: 5,
    initials: "EU",
    color: "#00A6FA",
    featured: false
  },
  {
    name: "Agoremi A.",
    role: "Director, Charion Walkers",
    feedback: "I love how intuitive it is. Everything feels premium and easy to navigate.",
    rating: 5,
    initials: "AA",
    color: "#001325",
    featured: false
  },
  {
    name: "Aminu Jr.",
    role: "Manager, Blaze Collections Abuja",
    feedback: "QuickInvoice gives me total confidence with my finances. It’s the professional tool I didn’t know I needed.",
    rating: 5,
    initials: "AJ",
    color: "#0028AE",
    featured: true
  }
];

const TestimonialCard = ({ t, i }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10 }}
    transition={{ delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    viewport={{ once: true }}
    className={`group relative overflow-hidden backdrop-blur-sm bg-white/70 border border-white/50 p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full 
      ${t.featured ? 'md:col-span-2' : 'md:col-span-1'} 
      hover:shadow-[0_40px_80px_-20px_rgba(0,40,174,0.15)] transition-all duration-500`}
  >
    {/* Subtle Gradient Overlay on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00A6FA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#00A6FA] text-[#00A6FA]" />
          ))}
        </div>
        <span className="text-[10px] font-bold text-[#00A6FA] bg-[#00A6FA]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Merchant</span>
      </div>
      <Quote size={40} className="text-slate-100 group-hover:text-[#0028AE]/20 transition-all group-hover:rotate-12 duration-500" />
    </div>

    <p className={`text-[#001325] font-medium tracking-tight mb-10 relative z-10 leading-[1.4]
      ${t.featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
      "{t.feedback}"
    </p>

    <div className="mt-auto flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div 
          className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg rotate-[-3deg] group-hover:rotate-0 transition-transform duration-300"
          style={{ backgroundColor: t.color }}
        >
          {t.initials}
        </div>
        <div>
          <h4 className="text-[#001325] font-black text-lg leading-none flex items-center gap-2">
            {t.name}
            <BadgeCheck size={18} className="text-[#00A6FA]" />
          </h4>
          <p className="text-slate-400 text-[10px] mt-1.5 font-bold uppercase tracking-[0.2em]">{t.role}</p>
        </div>
      </div>
      
      <div className="hidden sm:flex h-10 w-10 rounded-full border border-slate-100 items-center justify-center group-hover:bg-[#0028AE] group-hover:border-[#0028AE] transition-colors duration-300">
          <Zap size={16} className="text-slate-300 group-hover:text-white transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default function Testimonials() {
  return (
    <section className="relative py-32 bg-[#F8FAFC] overflow-hidden">
      
      {/* Animated Background Accents */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#0028AE]/5 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -60, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#00A6FA]/10 blur-[130px] rounded-full pointer-events-none" 
      />

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[#0028AE] text-xs font-bold tracking-widest uppercase mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A6FA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A6FA]"></span>
            </span>
            Real Stories from Real Businesses
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-black text-[#001325] tracking-[ -0.04em] leading-[0.9]">
            The Standard for <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0028AE] to-[#00A6FA]">Success in Nigeria.</span>
          </h2>
        </div>

        {/* The Grid - Now using Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard t={testimonials[0]} i={0} />
          <TestimonialCard t={testimonials[1]} i={1} />
          <TestimonialCard t={testimonials[2]} i={2} />
          <TestimonialCard t={testimonials[3]} i={3} />
        </div>

        {/* Logo Marquee-style Reach Indicator */}
        <div className="mt-32">
          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Empowering Commerce Across</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["Abuja", "Lagos", "Port Harcourt", "Kano", "Ibadan"].map((city) => (
              <span key={city} className="text-[#001325] font-black text-2xl md:text-4xl tracking-tighter border-b-4 border-transparent hover:border-[#00A6FA] transition-all cursor-default uppercase">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}