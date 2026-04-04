


// import React from "react";
// import { motion } from "framer-motion";
// import { 
//   FileText, 
//   CreditCard, 
//   ShoppingBag, 
//   Palette, 
//   BarChart3, 
//   Globe, 
//   ArrowUpRight,
//   ArrowRight,
//   CheckCircle
// } from "lucide-react";

// const features = [
//   {
//     title: "Precision Invoicing",
//     description: "Architect professional, tax-compliant invoices in seconds with our smart editor.",
//     icon: FileText,
//     accent: "#0028AE"
//   },
//   {
//     title: "Real-time Tracking",
//     description: "Instant telemetry on payment statuses with automated smart-reminders.",
//     icon: CreditCard,
//     accent: "#00A6FA"
//   },
//   {
//     title: "Storefront Engine",
//     description: "Convert your inventory into a high-converting digital storefront instantly.",
//     icon: ShoppingBag,
//     accent: "#001325"
//   },
//   {
//     title: "Brand Sovereignty",
//     description: "White-label your financial documents with custom domains and business logic.",
//     icon: Palette,
//     accent: "#0028AE"
//   },
//   {
//     title: "Deep Intelligence",
//     description: "Advanced fiscal reporting and predictive analytics for scaling SMEs.",
//     icon: BarChart3,
//     accent: "#00A6FA"
//   },
//   {
//     title: "Global Settlement",
//     description: "Accept payments and issue invoices in 135+ currencies effortlessly.",
//     icon: Globe,
//     accent: "#001325"
//   },
// ];

// const FeatureCard = ({ feature, index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
//       viewport={{ once: true }}
//       className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#0028AE]/20 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,40,174,0.08)]"
//     >
//       {/* Subtle brand glow on hover */}
//       <div 
//         className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0028AE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
//       />
      
//       <div className="relative z-10">
//         <div 
//           className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm"
//           style={{ backgroundColor: `${feature.accent}10`, color: feature.accent }}
//         >
//           <feature.icon size={30} strokeWidth={1.5} />
//         </div>
        
//         <h3 className="text-2xl font-black text-[#001325] tracking-tight flex items-center gap-2">
//           {feature.title}
//           <ArrowUpRight size={18} className="text-[#00A6FA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
//         </h3>
        
//         <p className="mt-4 text-slate-500 leading-relaxed font-medium">
//           {feature.description}
//         </p>

//         <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0028AE] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
//           Learn More <div className="h-1 w-4 bg-[#0028AE] rounded-full" />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function Features() {
//   return (
//     <section id="features" className="relative py-32 bg-[#FDFDFD] overflow-hidden">
//       {/* Background Architectural Touches */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

//       <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24">
//           <div className="max-w-2xl">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black tracking-[0.2em] uppercase mb-6"
//             >
//               <CheckCircle size={12} />
//               Unified Ecosystem
//             </motion.div>
            
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="text-5xl md:text-7xl font-black text-[#001325] tracking-tighter leading-[0.95]"
//             >
//               Everything you need <br />
//               <span className="text-[#00A6FA]">to dominate.</span>
//             </motion.h2>
//           </div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             className="text-xl text-slate-500 max-w-sm leading-relaxed font-medium"
//           >
//             Ditch the chaos of multiple apps. We’ve consolidated your entire back-office into a singular, high-performance interface.
//           </motion.p>
//         </div>

//         {/* Feature Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <FeatureCard key={index} feature={feature} index={index} />
//           ))}
//         </div>

//         {/* Bottom CTA for Features */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           className="mt-20 p-12 rounded-[3rem] bg-[#001325] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
//         >
//           <div className="relative z-10">
//             <h4 className="text-3xl font-bold tracking-tight">Ready to streamline?</h4>
//             <p className="text-slate-400 mt-2 font-medium">Join 10,000+ businesses scaling with QuickInvoice.</p>
//           </div>
//           <button className="relative z-10 px-10 py-5 bg-[#0028AE] rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3">
//             Get Started Now <ArrowRight size={20} />
//           </button>
          
//           {/* Decorative background for the CTA box */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-[#0028AE]/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#00A6FA]/20 transition-colors duration-700" />
//         </motion.div>
//       </div>
//     </section>
//   );
// }


import React from "react";
import { motion } from "framer-motion";
import { 
  FileText,  
  ShoppingBag, 
  LayoutDashboard, 
  BarChart3, 
  ScanBarcode, 
  ArrowUpRight,
  ArrowRight,
  Zap
} from "lucide-react";

const features = [
  {
    title: "Quick Invoice Builder", // SEO Optimized
    description: "Generate professional, tax-compliant invoices in seconds. The fastest quick invoice solution for Nigerian SMEs.",
    icon: FileText,
    accent: "#0028AE",
    visual: "invoice" 
  },
  {
    title: "Digital Receipt Generator", // SEO Optimized
    description: "Replace paper booklets with instant e-receipts. Send digital receipts via WhatsApp or Email automatically.",
    icon: Zap,
    accent: "#00A6FA",
    visual: "receipt"
  },
  {
    title: "Inventory & Stock Tracker", // SEO Optimized
    description: "Real-time inventory management. Track stock levels, set low-stock alerts, and manage your warehouse effortlessly.",
    icon: ShoppingBag,
    accent: "#001325",
    visual: "inventory"
  },
  {
    title: "Barcode Scanner Integration", // SEO Optimized
    description: "Turn your smartphone into a high-speed barcode scanner. Perfect for retail shops and fast-paced checkouts.",
    icon: ScanBarcode,
    accent: "#0028AE",
    visual: "scanner"
  },
  {
    title: "Smart POS Intelligence", // SEO Optimized
    description: "Advanced fiscal reporting and predictive analytics. Get deep insights into your business growth in Naira.",
    icon: BarChart3,
    accent: "#00A6FA",
    visual: "stats"
  },
  {
    title: "Unified Shop Management", // SEO Optimized
    description: "Manage multiple storefronts from one dashboard. The ultimate business management app for Nigeria.",
    icon: LayoutDashboard,
    accent: "#001325",
    visual: "dashboard"
  },
];

// Upgraded Miniature Design Components
const FeatureVisual = ({ type, color }) => {
  const baseClass = "relative w-full h-40 mb-8 rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-all duration-500 shadow-inner";
  
  // 1. INVOICE VISUAL - Layered & Professional
  if (type === "invoice") return (
    <div className={baseClass}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0028AE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative w-20 h-24 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,40,174,0.1)] border border-slate-100 p-3 flex flex-col gap-2 rotate-[-6deg] group-hover:rotate-0 transition-all duration-500">
        <div className="w-8 h-1.5 bg-[#0028AE] rounded-full" />
        <div className="space-y-1.5 mt-2">
          <div className="w-full h-1 bg-slate-100 rounded-full" />
          <div className="w-full h-1 bg-slate-100 rounded-full" />
          <div className="w-3/4 h-1 bg-slate-100 rounded-full" />
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div className="w-10 h-3 bg-[#00A6FA]/10 rounded-md" />
          <div className="w-5 h-5 rounded-full border-2 border-slate-100" />
        </div>
      </div>
      {/* Background Accent */}
      <div className="absolute -right-4 bottom-4 w-24 h-24 bg-[#00A6FA]/5 rounded-full blur-2xl" />
    </div>
  );

  // 2. RECEIPT VISUAL - Detailed & Clear
  if (type === "receipt") return (
    <div className={baseClass}>
      <div className="w-16 h-28 bg-white rounded shadow-2xl border-t-[6px] border-[#00A6FA] p-3 flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <div className="flex justify-between items-center">
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <div className="w-8 h-1 bg-slate-100 rounded-full" />
        </div>
        <div className="w-full h-px border-b border-dashed border-slate-200 my-1" />
        <div className="space-y-2">
          <div className="flex justify-between"><div className="w-8 h-1.5 bg-slate-50 rounded" /><div className="w-4 h-1.5 bg-slate-100 rounded" /></div>
          <div className="flex justify-between"><div className="w-10 h-1.5 bg-slate-50 rounded" /><div className="w-5 h-1.5 bg-slate-100 rounded" /></div>
        </div>
        <div className="mt-auto pt-3 border-t border-slate-50">
          <div className="bg-[#00A6FA] text-white text-[8px] font-black py-1.5 rounded-md text-center tracking-widest shadow-lg shadow-[#00A6FA]/20">PAID</div>
        </div>
      </div>
    </div>
  );

  // 3. INVENTORY VISUAL - Dynamic & Modern
  if (type === "inventory") return (
    <div className={baseClass}>
      <div className="grid grid-cols-2 gap-2 w-28 relative z-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-12 w-full rounded-xl border-b-4 transition-all duration-500 flex flex-col p-2 
            ${i === 1 ? 'bg-[#001325] border-[#00A6FA] -translate-y-2' : 'bg-white border-slate-100'}`} 
          >
            <div className={`h-1 w-1/2 rounded-full ${i === 1 ? 'bg-[#00A6FA]/40' : 'bg-slate-100'}`} />
            <div className={`mt-auto h-2 w-full rounded-sm ${i === 1 ? 'bg-[#00A6FA]' : 'bg-slate-50'}`} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(#00A6FA_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.15]" />
    </div>
  );

  // 4. SCANNER VISUAL - High-Tech Feel
  if (type === "scanner") return (
    <div className={baseClass}>
       <div className="relative w-24 h-16 bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden">
          <div className="flex gap-1 mb-2">
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="w-1 h-1 rounded-full bg-slate-200" />
          </div>
          <div className="w-full h-full border-2 border-dashed border-[#0028AE]/20 rounded-lg flex items-center justify-center relative overflow-hidden">
            <motion.div 
              animate={{ y: [-20, 40] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-0.5 bg-[#0028AE] shadow-[0_0_10px_#0028AE]" 
            />
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-6 bg-slate-100 rounded-full" />)}
            </div>
          </div>
       </div>
    </div>
  );

  // 5. STATS VISUAL - Business Analytics
  if (type === "stats") return (
    <div className={baseClass}>
      <div className="w-28 h-20 bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex items-end gap-1.5">
        {[40, 70, 45, 90, 60].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-[#00A6FA]' : 'bg-[#0028AE]/20'}`}
          />
        ))}
      </div>
    </div>
  );

  // 6. DASHBOARD VISUAL - Multi-Shop
  if (type === "dashboard") return (
    <div className={baseClass}>
      <div className="w-28 h-20 bg-slate-900 rounded-xl shadow-2xl p-2 flex flex-col gap-2 scale-110 group-hover:scale-125 transition-transform duration-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00A6FA]" />
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-3 w-full bg-white/5 rounded-sm" />)}
        </div>
      </div>
    </div>
  );
};
const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group relative p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#0028AE]/10 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,40,174,0.08)] flex flex-col h-full"
    >
      <FeatureVisual type={feature.visual} color={feature.accent} />
      
      <div className="relative z-10">
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-sm"
          style={{ backgroundColor: `${feature.accent}10`, color: feature.accent }}
        >
          <feature.icon size={24} strokeWidth={2} />
        </div>
        
        <h3 className="text-2xl font-black text-[#001325] tracking-tight flex items-center gap-2">
          {feature.title}
          <ArrowUpRight size={18} className="text-[#00A6FA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </h3>
        
        <p className="mt-4 text-slate-500 leading-relaxed font-medium text-sm md:text-base">
          {feature.description}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0028AE] group-hover:gap-4 transition-all duration-500">
          Explore Feature <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-[#FDFDFD] overflow-hidden">
      {/* Background Dots */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 md:mb-24">
          <div className="max-w-2xl text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-bold tracking-[0.2em] uppercase mb-6"
            >
              <Zap size={14} className="fill-[#0028AE]" />
              Built for Scale
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-[#001325] tracking-tighter leading-[1] md:leading-[0.95]"
            >
              The Modern Merchant <br />
              <span className="text-[#00A6FA]">Super-App.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-lg md:text-xl text-slate-500 max-w-sm leading-relaxed font-medium text-center md:text-left"
          >
            Consolidate your quick invoices, digital receipts, and stock tracking into one world-class mobile interface.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Premium Banner CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-24 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-[#001325] to-[#0028AE] text-white text-center relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h4 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Take your business to the next level today.</h4>
            <button className="bg-white text-[#0028AE] px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-base md:text-xl hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto uppercase tracking-tighter">
              Start Free Trial <ArrowRight size={20} />
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </motion.div>
      </div>
    </section>
  );
}