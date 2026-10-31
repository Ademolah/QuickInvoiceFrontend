import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  User, Mail, Phone, Briefcase, Lock, Eye, EyeOff, 
  ArrowRight, CheckCircle2, Globe 
} from "lucide-react";

const API = "https://quickinvoice-backend-1.onrender.com";

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
    <div className="min-h-[100dvh] bg-[#FAFAFA] md:p-6 lg:p-8 flex items-center justify-center font-sans">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-white min-h-[100dvh] md:min-h-0 md:rounded-2xl md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border border-slate-200 overflow-hidden flex flex-col lg:flex-row"
      >
        
        {/* Left Side: Brand Panel (Hidden on Mobile) */}
        <div className="hidden lg:flex w-[40%] bg-[#09090B] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-16">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-[#09090B] font-bold text-lg">Q</div>
              <span className="text-white font-bold tracking-tight">QuickInvoice</span>
            </Link>
            
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight mb-8">
              Join the <br />
              <span className="text-slate-400">new standard</span> <br />
              of commerce.
            </h2>
            
            <div className="space-y-4">
              {[
                "Instant professional invoicing",
                "Automated fiscal tracking",
                "Bank-grade data security"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-medium text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
             <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
               "QuickInvoice has transformed how we handle retail in Abuja. It's the infrastructure we've been waiting for."
             </p>
             <p className="text-[10px] font-bold uppercase tracking-wider text-white mt-3">— Aminu Jr, Blaze Col.</p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-[60%] p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white flex-1">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#09090B] rounded-md flex items-center justify-center text-white font-bold text-lg">Q</div>
            <span className="text-[#09090B] font-bold tracking-tight">QuickInvoice</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight mb-2">Create account</h1>
            <p className="text-sm text-slate-500 font-medium">Start your 14-day premium trial. No credit card required.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 overflow-hidden"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Legal Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={16} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Phone with Country Selector */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative w-[110px] shrink-0">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.dialCode}
                    onChange={(e) => setFormData({ ...formData, dialCode: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 appearance-none text-sm font-semibold text-[#09090B] cursor-pointer shadow-sm"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B]" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="701 234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/^0+/, "") })}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Business Name</label>
              <div className="relative group">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={16} />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Global Ventures Ltd"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#09090B]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#09090B] text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Initializing Workspace..." : "Create account"}
                {!loading && <ArrowRight size={16} />}
              </button>
              
              <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                Already part of the network?{" "}
                <Link to="/login" className="text-[#09090B] font-bold hover:underline transition-all">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}