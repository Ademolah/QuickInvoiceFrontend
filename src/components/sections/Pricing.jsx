/* eslint-disable no-unused-vars */
// import { motion } from "framer-motion";
// import { ShieldCheck, CreditCard } from "lucide-react";

// export default function ExtraSections() {
//   return (
//     <div className="w-full flex flex-col gap-24">
//       {/* Billing Section */}
//       <section className="relative bg-gradient-to-r from-[#00A6FA] to-[#0028AE] py-20 px-6 text-white rounded-2xl shadow-xl">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-4xl font-bold mb-6"
//           >
//             Simple, Transparent Billing
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="text-lg max-w-2xl mx-auto mb-10"
//           >
//             Pay only for what you need. No hidden fees. Upgrade your plan as your business grows — from free invoicing to enterprise-ready features.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//             className="flex flex-wrap justify-center gap-8"
//           >
//             <div className="bg-white text-gray-800 rounded-xl p-8 shadow-lg w-72">
//               <CreditCard className="w-10 h-10 text-[#0046A5] mb-4" />
//               <h3 className="text-xl font-semibold mb-2">Free</h3>
//               <p className="mb-4 text-sm">15 invoices & receipts /month. Perfect for freelancers.</p>
//               <p className="text-2xl font-bold">₦0</p>
//             </div>
//             <div className="bg-white text-gray-800 rounded-xl p-8 shadow-lg w-72">
//               <CreditCard className="w-10 h-10 text-[#00B86B] mb-4" />
//               <h3 className="text-xl font-semibold mb-2">Pro</h3>
//               <p className="mb-4 text-sm">Unlimited invoices & receipts, payment tracking.</p>
//               <p className="text-2xl font-bold">₦3,000/mo</p>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Trust & Security Section */}
//       <section className="relative py-20 px-6 bg-[#F9FAFB] rounded-2xl shadow-lg">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-4xl font-bold text-gray-900 mb-6"
//           >
//             Security You Can Trust
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
//           >
//             Your business data is protected with bank-level encryption, secure payments, and always-on reliability.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//             className="flex flex-wrap justify-center gap-10"
//           >
//             <div className="flex flex-col items-center w-60">
//               <ShieldCheck className="w-12 h-12 text-[#0046A5] mb-4" />
//               <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
//               <p className="text-sm text-gray-600">All transactions encrypted with AES-256 & SSL.</p>
//             </div>
//             <div className="flex flex-col items-center w-60">
//               <ShieldCheck className="w-12 h-12 text-[#00B86B] mb-4" />
//               <h3 className="text-lg font-semibold mb-2">Trusted Infrastructure</h3>
//               <p className="text-sm text-gray-600">Powered by top-tier cloud providers for uptime & speed.</p>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, Lock, CreditCard, ArrowRight, BadgeCheck } from "lucide-react";

const PlanCard = ({ title, price, description, features, highlighted = false, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    className={`relative p-10 rounded-[3rem] flex flex-col transition-all duration-500 border ${
      highlighted 
        ? "bg-[#001325] border-transparent shadow-[0_40px_80px_-15px_rgba(0,19,37,0.3)] scale-105 z-10 text-white" 
        : "bg-white border-slate-100 hover:border-[#0028AE]/20 hover:shadow-[0_30px_60px_-15px_rgba(0,40,174,0.08)] text-[#001325]"
    }`}
  >
    {highlighted && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0028AE] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
        Elite Choice
      </div>
    )}

    <div className={`mb-10 p-4 rounded-2xl w-fit ${highlighted ? "bg-white/10" : "bg-[#0028AE]/5"}`}>
      <Icon size={28} className={highlighted ? "text-[#00A6FA]" : "text-[#0028AE]"} />
    </div>

    <h3 className="text-3xl font-black mb-3 tracking-tighter">{title}</h3>
    <p className={`text-sm mb-8 font-medium leading-relaxed ${highlighted ? "text-slate-400" : "text-slate-500"}`}>
      {description}
    </p>

    <div className="mb-10">
      <div className="flex items-baseline gap-1">
        <span className="text-[20px] font-bold">₦</span>
        <span className="text-6xl font-black tracking-tighter">
          {price.toLocaleString()}
        </span>
        <span className={`text-sm font-bold tracking-widest uppercase opacity-40 ml-2`}>/mo</span>
      </div>
    </div>

    <div className="space-y-5 mb-12 flex-grow">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className={`mt-1 rounded-full p-0.5 ${highlighted ? "text-[#00A6FA]" : "text-[#0028AE]"}`}>
            <BadgeCheck size={18} />
          </div>
          <span className={`text-sm font-bold ${highlighted ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
        </div>
      ))}
    </div>

    <button className={`w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 group active:scale-95 ${
      highlighted 
        ? "bg-[#0028AE] text-white hover:bg-[#0028AE]/90 shadow-lg shadow-blue-900/20" 
        : "bg-[#001325] text-white hover:bg-[#001325]/90"
    }`}>
      Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

export default function Pricing() {
  return (
    <section className="relative py-32 bg-[#FDFDFD] overflow-hidden">
      {/* Background Architectural Touches */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0028AE]/[0.01] skew-x-12 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0028AE]/5 border border-[#0028AE]/10 text-[#0028AE] text-[10px] font-black tracking-[0.3em] uppercase mb-6"
          >
            Flexible Investment
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#001325] tracking-tighter leading-[0.95] mb-8"
          >
            Built for scale, <br />
            <span className="text-[#00A6FA]">priced for growth.</span>
          </motion.h2>
          
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Choose the plan that aligns with your ambition. No hidden costs. 
            No regional barriers. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-32">
          <PlanCard 
            index={0}
            title="Starter"
            price={0}
            icon={CreditCard}
            description="Essential infrastructure for solo-entrepreneurs and freelancers."
            features={["15 Invoices & Receipts", "Email Support", "Basic Analytics", "Mobile App Access"]}
          />
          <PlanCard 
            index={1}
            title="Professional"
            price={3000}
            icon={Zap}
            highlighted
            description="High-performance features for scaling businesses needing automation."
            features={["Unlimited Invoices", "Payment Tracking", "Inventory Management", "Custom Branding", "Priority Support"]}
          />
          <PlanCard 
            index={2}
            title="Enterprise"
            price={15000}
            icon={ShieldCheck}
            description="Full-suite fiscal compliance and multi-user controls for larger firms."
            features={["Everything in Pro", "Multi-user Access", "Bulk Invoicing", "Dedicated Manager", "API Access"]}
          />
        </div>

        {/* Security Trust Section - Light Modern Rebuild */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-12 md:p-16 rounded-[4rem] bg-white border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 text-[#0028AE]">
                <Lock size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Bank-Grade Security</span>
              </div>
              <h3 className="text-4xl font-black text-[#001325] tracking-tighter mb-6">Your data is your <br />sovereignty.</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                We utilize AES-256 military-grade encryption to ensure your financial 
                records remain private. QuickInvoice is fully compliant with modern data protection standards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-[#0028AE]/20 transition-colors">
                <div className="text-[#00A6FA] mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-[#001325] font-black text-lg mb-2">99.9% Uptime</h4>
                <p className="text-sm text-slate-400 font-bold leading-relaxed">Redundant servers across multiple global regions.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-[#0028AE]/20 transition-colors">
                <div className="text-[#0028AE] mb-4 group-hover:scale-110 transition-transform">
                  <BadgeCheck size={32} />
                </div>
                <h4 className="text-[#001325] font-black text-lg mb-2">ISO Certified</h4>
                <p className="text-sm text-slate-400 font-bold leading-relaxed">International standards for data management.</p>
              </div>
            </div>
          </div>
          
          {/* Subtle background decoration for the security box */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#0028AE]/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
