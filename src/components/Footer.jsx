/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
// export default function Footer() {
//   return (
//     <footer className="bg-[#001325] text-gray-300">
//   <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//     {/* Brand */}
//     <div>
//       <h2 className="text-white text-xl font-semibold mb-3">
//         QuickInvoice
//       </h2>
//       <p className="text-sm leading-relaxed">
//         Smart invoicing, inventory, receipts, and business management —
//         built to help African businesses grow faster and smarter.
//       </p>
//     </div>
//     {/* Product */}
//     <div>
//       <h3 className="text-white font-medium mb-3">Product</h3>
//       <ul className="space-y-2 text-sm">
//         <li><p  className="hover:text-white">Smart Invoicing</p></li>
//         <li><p className="hover:text-white">Automated Receipt</p></li>
//         <li><p className="hover:text-white">Reports</p></li>
//         <li><p  className="hover:text-white">Inventory</p></li>
//       </ul>
//     </div>
//     {/* Company */}
//     <div>
//       <h3 className="text-white font-medium mb-3">Company</h3>
//       <ul className="space-y-2 text-sm">
//         <li><a href="/" className="hover:text-white">About</a></li>
//         <li><a href="/contact" className="hover:text-white">Contact</a></li>
//         <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
//         <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
//       </ul>
//     </div>
//     {/* Trust / CTA */}
//     <div>
//       <h3 className="text-white font-medium mb-3">Built for Growth</h3>
//       <p className="text-sm mb-4">
//         Trusted by growing businesses across Nigeria and beyond.
//       </p>
//       <a
//         href="/register"
//         className="inline-block bg-[#0046A5] hover:bg-[#003a8c] transition text-white text-sm px-4 py-2 rounded-lg"
//       >
//         Get Started
//       </a>
//     </div>
//   </div>
//   {/* Bottom bar */}
//   <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
//     © {new Date().getFullYear()} QuickInvoice. All rights reserved.
//     <span className="block mt-1">
//       Built & Powered by <span className="text-white font-medium">QuickInvoice Technologies</span>
//     </span>
//   </div>
// </footer>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Globe, ShieldCheck, ArrowRight, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: ["Smart Invoicing", "Automated Receipts", "Fiscal Reports", "Inventory Hub"],
    company: ["About Us", "Our Contact", "Privacy Policy", "Terms of Service"],
    support: ["Help Center", "API Docs", "System Status", "Merchant Stories"]
  };

  return (
    <footer className="relative bg-[#FDFDFD] pt-32 pb-12 overflow-hidden border-t border-slate-100">
      {/* Background Architectural Accent */}
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#0028AE]/20 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* Brand Pillar - High Impact */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-[#001325] rounded-xl flex items-center justify-center font-black text-white italic transition-all group-hover:bg-[#0028AE] group-hover:-rotate-6">
                Q
              </div>
              <span className="text-[#001325] font-black text-2xl tracking-tighter">
                QuickInvoice
              </span>
            </Link>
            
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
              The financial OS for Africa’s next generation of commerce. Built for speed, scaled for global impact.
            </p>

            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0028AE] hover:border-[#0028AE] transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Pillars */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[#001325] text-[10px] font-black uppercase tracking-[0.3em] mb-8">Ecosystem</h3>
              <ul className="space-y-4">
                {footerLinks.product.map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-500 hover:text-[#0028AE] text-sm font-bold transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[#001325] text-[10px] font-black uppercase tracking-[0.3em] mb-8">Corporate</h3>
              <ul className="space-y-4">
                {footerLinks.company.map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-500 hover:text-[#0028AE] text-sm font-bold transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="text-[#001325] text-[10px] font-black uppercase tracking-[0.3em] mb-8">Resources</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-500 hover:text-[#0028AE] text-sm font-bold transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Utility Card */}
          <div className="lg:col-span-3">
            <div className="p-8 rounded-[2.5rem] bg-[#001325] text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-blue-900/20">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live in Lagos & Abuja</span>
                </div>
                <h4 className="text-xl font-bold leading-tight">Secure your business sovereignty.</h4>
                <Link to="/register" className="mt-6 flex items-center gap-2 text-[#00A6FA] font-black text-sm group/btn">
                  Start Free <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0028AE]/30 rounded-full blur-3xl group-hover:bg-[#0028AE]/50 transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] text-slate-400 font-black tracking-[0.1em] uppercase">
              © {currentYear} QUICKINVOICE TECHNOLOGIES.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-[10px] text-slate-400 font-black hover:text-[#0028AE] uppercase tracking-widest transition-colors">Legal</Link>
              <Link to="#" className="text-[10px] text-slate-400 font-black hover:text-[#0028AE] uppercase tracking-widest transition-colors">Privacy</Link>
              <Link to="#" className="text-[10px] text-slate-400 font-black hover:text-[#0028AE] uppercase tracking-widest transition-colors">Cookies</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 group cursor-pointer hover:border-[#0028AE]/20 transition-all">
              <Globe size={14} className="text-[#0028AE]" />
              <span className="text-[10px] font-black text-[#001325] uppercase tracking-[0.2em]">Nigeria / NGN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}