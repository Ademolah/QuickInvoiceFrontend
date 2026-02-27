

// import React from "react";
// import { motion } from "framer-motion";
// const features = [
//   {
//     title: "Easy Invoicing",
//     description: "Create and send professional invoices in seconds.",
//     icon: "📄",
//   },
//   {
//     title: "Payment Tracking",
//     description: "Monitor payments and get instant alerts for overdue invoices.",
//     icon: "💳",
//   },
//   {
//     title: "E-Commerce Integration",
//     description:
//       "Launch a clean, modern online store for your business in minutes.",
//     icon: "🛍️",
//   },
//   {
//     title: "Custom Branding",
//     description: "Add your logo and personalize templates effortlessly.",
//     icon: "🎨",
//   },
//   {
//     title: "Analytics Dashboard",
//     description:
//       "Track revenue, performance, trends, and financial insights.",
//     icon: "📊",
//   },
//   {
//     title: "Multi-Currency Support",
//     description: "Invoice clients anywhere, using their local currency.",
//     icon: "🌍",
//   },
// ];
// export default function Features() {
//   return (
//     <section
//       id="features"
//       className="relative py-24 bg-white overflow-hidden"
//     >
//       {/* Background Orbs */}
//       <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#0046A5]/10 blur-3xl rounded-full"></div>
//       <div className="absolute -bottom-32 right-0 w-80 h-80 bg-[#00B86B]/10 blur-3xl rounded-full"></div>
//       <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
//         {/* Heading */}
//         <div className="text-center max-w-3xl mx-auto">
//           <motion.h2
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             viewport={{ once: true }}
//             className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
//           >
//             Powerful Features Built for Modern Businesses
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             viewport={{ once: true }}
//             className="mt-4 text-lg text-gray-600"
//           >
//             Everything you need to run, scale, and automate your business in one place.
//           </motion.p>
//         </div>
//         {/* Feature Cards */}
//         <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.65, delay: index * 0.12 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -8 }}
//               className="
//                 group p-8 rounded-3xl bg-white/70 backdrop-blur-lg shadow-md
//                 hover:shadow-2xl transition-all duration-300 border border-white
//               "
//             >
//               {/* Icon Circle */}
//               <div
//                 className="
//                 w-14 h-14 flex items-center justify-center rounded-2xl
//                 bg-gradient-to-br from-[#00A6FA] to-[#0028AE]
//                 text-white text-3xl shadow-md mb-6 group-hover:scale-110 transition
//                 "
//               >
//                 {feature.icon}
//               </div>
//               {/* Title */}
//               <h3 className="text-xl font-bold text-gray-900">
//                 {feature.title}
//               </h3>
//               {/* Description */}
//               <p className="mt-2 text-gray-600 leading-relaxed">
//                 {feature.description}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }




import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  CreditCard, 
  ShoppingBag, 
  Palette, 
  BarChart3, 
  Globe, 
  ArrowUpRight,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const features = [
  {
    title: "Precision Invoicing",
    description: "Architect professional, tax-compliant invoices in seconds with our smart editor.",
    icon: FileText,
    accent: "#0028AE"
  },
  {
    title: "Real-time Tracking",
    description: "Instant telemetry on payment statuses with automated smart-reminders.",
    icon: CreditCard,
    accent: "#00A6FA"
  },
  {
    title: "Storefront Engine",
    description: "Convert your inventory into a high-converting digital storefront instantly.",
    icon: ShoppingBag,
    accent: "#001325"
  },
  {
    title: "Brand Sovereignty",
    description: "White-label your financial documents with custom domains and business logic.",
    icon: Palette,
    accent: "#0028AE"
  },
  {
    title: "Deep Intelligence",
    description: "Advanced fiscal reporting and predictive analytics for scaling SMEs.",
    icon: BarChart3,
    accent: "#00A6FA"
  },
  {
    title: "Global Settlement",
    description: "Accept payments and issue invoices in 135+ currencies effortlessly.",
    icon: Globe,
    accent: "#001325"
  },
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#0028AE]/20 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,40,174,0.08)]"
    >
      {/* Subtle brand glow on hover */}
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0028AE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
      />
      
      <div className="relative z-10">
        <div 
          className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm"
          style={{ backgroundColor: `${feature.accent}10`, color: feature.accent }}
        >
          <feature.icon size={30} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-black text-[#001325] tracking-tight flex items-center gap-2">
          {feature.title}
          <ArrowUpRight size={18} className="text-[#00A6FA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </h3>
        
        <p className="mt-4 text-slate-500 leading-relaxed font-medium">
          {feature.description}
        </p>

        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0028AE] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          Learn More <div className="h-1 w-4 bg-[#0028AE] rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section id="features" className="relative py-32 bg-[#FDFDFD] overflow-hidden">
      {/* Background Architectural Touches */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black tracking-[0.2em] uppercase mb-6"
            >
              <CheckCircle size={12} />
              Unified Ecosystem
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-[#001325] tracking-tighter leading-[0.95]"
            >
              Everything you need <br />
              <span className="text-[#00A6FA]">to dominate.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl text-slate-500 max-w-sm leading-relaxed font-medium"
          >
            Ditch the chaos of multiple apps. We’ve consolidated your entire back-office into a singular, high-performance interface.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA for Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 p-12 rounded-[3rem] bg-[#001325] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h4 className="text-3xl font-bold tracking-tight">Ready to streamline?</h4>
            <p className="text-slate-400 mt-2 font-medium">Join 10,000+ businesses scaling with QuickInvoice.</p>
          </div>
          <button className="relative z-10 px-10 py-5 bg-[#0028AE] rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3">
            Get Started Now <ArrowRight size={20} />
          </button>
          
          {/* Decorative background for the CTA box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0028AE]/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#00A6FA]/20 transition-colors duration-700" />
        </motion.div>
      </div>
    </section>
  );
}
