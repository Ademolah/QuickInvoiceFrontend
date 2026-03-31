

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  User, Mail, Phone, Briefcase, Lock, Eye, EyeOff, 
  ArrowRight, CheckCircle2, Globe 
} from "lucide-react";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dialCode: "+234",
    businessName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const countryCodes = [
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        ...formData,
        phone: Number(formData.phone),
      });
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/dashboard"), 300);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
      >
        
        {/* Left Side: Brand Value Proposition (4 Cols) */}
        <div className="lg:col-span-5 bg-[#001325] p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/">
              <div className="h-10 w-10 bg-[#0028AE] rounded-xl flex items-center justify-center font-black text-white italic mb-12">Q</div>
            </Link>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
              Join the <br />
              <span className="text-[#00A6FA]">New Standard</span> <br />
              of Commerce.
            </h2>
            
            <div className="space-y-6">
              {[
                "Instant professional invoicing",
                "Automated fiscal tracking",
                "Bank-grade data security"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#00A6FA]" />
                  <span className="text-slate-400 font-bold text-sm tracking-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
             <p className="text-xs text-slate-400 font-medium leading-relaxed">
               "QuickInvoice has transformed how we handle retail in Abuja. It's the infrastructure we've been waiting for."
             </p>
             <p className="text-[10px] font-black uppercase tracking-widest text-[#00A6FA] mt-4">— Aminu Jr, Blaze Col.</p>
          </div>

          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#0028AE]/20 blur-[80px] rounded-full" />
        </div>

        {/* Right Side: Registration Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 md:p-16">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#001325] tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Start your 14-day premium trial. No credit card required.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-8 text-xs font-bold flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Legal Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/10 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="john@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/10 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
              </div>
            </div>

            {/* Phone with Country Selector */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    value={formData.dialCode}
                    onChange={(e) => setFormData({ ...formData, dialCode: e.target.value })}
                    className="pl-12 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none appearance-none font-bold text-sm text-[#001325] cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-grow">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="7012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/^0+/, "") })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/10 focus:bg-white transition-all font-medium text-[#001325]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Registered Business Name</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Global Ventures Ltd"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/10 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/10 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001325]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#001325] text-white rounded-2xl font-black text-sm hover:bg-[#0028AE] transition-all duration-300 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Initializing Workspace..." : "Create My Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
              
              <p className="mt-8 text-center text-sm text-slate-400 font-bold">
                Already part of the network?{" "}
                <Link to="/login" className="text-[#0028AE] hover:underline transition-all">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}