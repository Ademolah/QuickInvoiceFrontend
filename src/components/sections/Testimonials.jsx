
// import { motion } from "framer-motion";
// import { Star } from "lucide-react";

// export default function Testimonials() {
//   const testimonials = [
//     {
//       name: "Favour J.",
//       role: "SweetToothiesByNk",
//       feedback:
//         "QuickInvoice NG has completely simplified my invoicing. I can send, track, and even share receipts instantly. It saves me hours every week.",
//       rating: 4,
//     },
//     {
//       name: "Eluonye U.",
//       role: "HOMKELLA CLEANING AND LAUNDRY SERVICES",
//       feedback:
//         "The smart collections feature is a game changer. My clients pay faster and I always look professional. Worth every naira!",
//       rating: 5,
//     },
//     {
//       name: "Agoremi A.",
//       role: "Charion Walkers Footwear",
//       feedback:
//         "I love how intuitive it is. From receipts to tracking payments, everything feels premium and easy to use.",
//       rating: 5,
//     },
//     {
//       name: "Aminu jr.",
//       role: "Blaze Collections Footwear, Abuja",
//       feedback:
//         "QuickInvoice NG gives me control and confidence with my finances. It’s the tool I didn’t know I needed.",
//       rating: 5,
//     },
//   ];

//   // Duplicate list so it loops seamlessly
//   const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];

//   return (
//     <section className="bg-[#F9FAFB] py-16 overflow-hidden">
//       <div className="max-w-6xl mx-auto text-center mb-10 px-6">
//         <h2 className="text-3xl md:text-4xl font-bold text-[#0046A5] font-poppins">
//           Trusted by Businesses Across Nigeria
//         </h2>
//       </div>

//       {/* Scrolling container */}
//       <div className="relative w-full overflow-hidden">
//         <motion.div
//           className="flex gap-6"
//           animate={{ x: ["0%", "-100%"] }}
//           transition={{
//             repeat: Infinity,
//             duration: 40,
//             ease: "linear",
//           }}
//         >
//           {loopTestimonials.map((t, i) => (
//             <div
//               key={i}
//               className="bg-white min-w-[300px] max-w-[350px] rounded-2xl shadow-md p-6 flex flex-col"
//             >
//               <div className="flex text-[#00B86B] mb-3">
//                 {Array.from({ length: t.rating }).map((_, idx) => (
//                   <Star key={idx} className="w-5 h-5 fill-current" />
//                 ))}
//               </div>
//               <p className="text-gray-600 text-base font-inter mb-6">
//                 “{t.feedback}”
//               </p>
//               <div className="mt-auto">
//                 <p className="font-semibold text-[#0046A5]">{t.name}</p>
//                 <p className="text-sm text-gray-500">{t.role}</p>
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    name: "Favour J.",
    role: "CEO, SweetToothiesByNk",
    feedback: "QuickInvoice NG has completely simplified my invoicing. I can send and track receipts instantly. It saves me hours every week.",
    rating: 5,
    initials: "FJ",
    color: "#0028AE"
  },
  {
    name: "Eluonye U.",
    role: "Founder, HOMKELLA CLEANING",
    feedback: "The smart collections feature is a game-changer. My clients pay faster and I always look professional. Worth every naira!",
    rating: 5,
    initials: "EU",
    color: "#00A6FA"
  },
  {
    name: "Agoremi A.",
    role: "Director, Charion Walkers",
    feedback: "I love how intuitive it is. From receipts to tracking payments, everything feels premium and easy to navigate.",
    rating: 5,
    initials: "AA",
    color: "#001325"
  },
  {
    name: "Aminu Jr.",
    role: "Manager, Blaze Collections Abuja",
    feedback: "QuickInvoice NG gives me total confidence with my finances. It’s the professional tool I didn’t know I needed.",
    rating: 5,
    initials: "AJ",
    color: "#0028AE"
  }
];

const TestimonialCard = ({ t, i }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    className="group relative bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full hover:shadow-[0_30px_60px_-15px_rgba(0,40,174,0.1)] transition-all duration-500"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="flex gap-1">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} size={14} className="fill-[#00A6FA] text-[#00A6FA]" />
        ))}
      </div>
      <Quote size={32} className="text-slate-100 group-hover:text-[#0028AE]/10 transition-colors" />
    </div>

    <p className="text-[#001325] text-lg md:text-xl font-medium leading-relaxed mb-10 tracking-tight">
      "{t.feedback}"
    </p>

    <div className="mt-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div 
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-inner"
          style={{ backgroundColor: t.color }}
        >
          {t.initials}
        </div>
        <div>
          <h4 className="text-[#001325] font-black text-base leading-none flex items-center gap-2">
            {t.name}
            <BadgeCheck size={16} className="text-[#00A6FA]" />
          </h4>
          <p className="text-slate-400 text-[10px] mt-1 font-black uppercase tracking-widest">{t.role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Testimonials() {
  return (
    <section className="relative py-32 bg-[#FDFDFD] overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#0028AE]/5 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-block px-3 py-1 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black tracking-[0.3em] uppercase mb-6"
            >
              Voices of Growth
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-[#001325] tracking-tighter leading-[0.95]">
              Trusted by Nigeria's <br /> 
              <span className="text-[#00A6FA]">Modern Leaders.</span>
            </h2>
          </div>
          
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hidden lg:block">
            <p className="text-4xl font-black text-[#0028AE] leading-none mb-1">4.9/5</p>
            <div className="flex gap-1 mb-2">
               {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-[#00A6FA] text-[#00A6FA]" />)}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Average Merchant Rating</p>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} i={i} />
          ))}
        </div>

        {/* Global Reach Indicator */}
        <div className="mt-24 pt-12 border-t border-slate-100">
           <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale group">
              {["Abuja Marketplace", "Lagos Fintech Week", "Port Harcourt Tech", "Kano Retailers"].map((brand) => (
                <span key={brand} className="text-[#001325] font-black tracking-tighter text-xl md:text-2xl uppercase hover:grayscale-0 hover:text-[#0028AE] transition-all duration-500 cursor-default">
                  {brand}
                </span>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
