import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/api/auth/login`, formData);
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role); 

        const userRole = res.data.role;

        setTimeout(() => {
          if (userRole === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 300);
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] md:p-6 lg:p-8 flex items-center justify-center font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1000px] bg-white min-h-[100dvh] md:min-h-0 md:rounded-2xl md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border border-slate-200 overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* Left Side: Brand Panel (Hidden on Mobile) */}
        <div className="hidden md:flex w-2/5 bg-[#09090B] p-10 lg:p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Architectural Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-[#09090B] font-bold text-lg">Q</div>
              <span className="text-white font-bold tracking-tight">QuickInvoice</span>
            </Link>
            
            <div className="mt-20 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Secure your <br />
                <span className="text-slate-400">financial empire.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[250px]">
                Enter the most advanced invoicing ecosystem in Africa.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 py-4 px-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              AES-256 Encryption Active
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white flex-1">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#09090B] rounded-md flex items-center justify-center text-white font-bold text-lg">Q</div>
            <span className="text-[#09090B] font-bold tracking-tight">QuickInvoice</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090B] tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500 font-medium">Log in to your QuickInvoice workspace.</p>
          </div>

          <AnimatePresence>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link to="/contact" className="text-[11px] font-bold text-slate-500 hover:text-[#09090B] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#09090B] transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-[#09090B] placeholder:text-slate-400 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#09090B] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#09090B] text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#09090B] font-bold hover:underline">
              Create workspace
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}