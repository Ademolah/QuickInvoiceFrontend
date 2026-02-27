// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
  

 

  

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     const res = await axios.post(`${API}/api/auth/login`, formData);
    

//     if (res.data.token) {
//       localStorage.setItem("token", res.data.token);
//       // wait until it's saved
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 300); 
//     } else {
//       setError("No token received. Please try again.");
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || "Login failed. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };





//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#00A6FA] p-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src="/quickauth.svg"   // image in public/
//             alt="QuickInvoice"
//             className="h-14 w-auto object-contain"
//           />
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold font-poppins text-center text-[#0046A5] mb-2">
//           Welcome Back
//         </h1>
//         <p className="text-center text-gray-500 mb-6 font-inter">
//           Sign in to your QuickInvoice account
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-700 font-medium text-sm mb-1 font-inter">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="you@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium text-sm mb-1 font-inter">
//               Password
//             </label>
//             {/* <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
//               required
//             /> */}

//             <div className="relative w-full">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-[#00477B] focus:outline-none"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//           </div>

//           <div className="flex justify-between text-sm">
//             <Link to="/contact" className="text-[#0046A5] hover:underline">
//               Forgot password ? send us a message
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-sm text-gray-500 mt-6 font-inter">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-[#0046A5] hover:underline font-medium">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Mail } from "lucide-react";

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
        setTimeout(() => navigate("/dashboard"), 300);
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
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Architectural Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0028AE]/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
      >
        
        {/* Left Side: Brand Experience (Visible on Desktop) */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#001325] text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/">
              <img src="/quicknav.svg" alt="QuickInvoice" className="h-8 w-auto brightness-200" />
            </Link>
            <div className="mt-24 space-y-6">
              <h2 className="text-5xl font-black tracking-tighter leading-[1.1]">
                Secure your <br />
                <span className="text-[#00A6FA]">financial empire.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium max-w-xs leading-relaxed">
                Enter the most advanced invoicing ecosystem in Africa.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 py-6 px-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <ShieldCheck className="text-[#00A6FA]" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Bank-grade AES-256 Encryption Active
            </p>
          </div>

          {/* Decorative Glow */}
          <div className="absolute bottom-[-20%] right-[-20%] w-80 h-80 bg-[#0028AE]/40 blur-[100px] rounded-full" />
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="lg:hidden flex justify-center mb-10">
            <img src="/quickauth.svg" alt="QuickInvoice" className="h-10 w-auto" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#001325] tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Continue to your workspace</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Corporate Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/20 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Password
                </label>
                <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0028AE] hover:text-[#001325]">
                  Reset?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0028AE]/20 focus:bg-white transition-all font-medium text-[#001325]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001325] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#001325] text-white rounded-2xl font-black text-sm hover:bg-[#0028AE] transition-all duration-300 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authorizing..." : "Sign In to QuickInvoice"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-10 font-bold">
            New to the ecosystem?{" "}
            <Link to="/register" className="text-[#0028AE] hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
