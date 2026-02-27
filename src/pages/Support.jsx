/* eslint-disable no-unused-vars */
// import React from "react";
// import { Mail, } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import toast from 'react-hot-toast';
// import { FaWhatsapp } from "react-icons/fa"

// const Support = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     from_name: '',
//     from_email: '',
//     message: '',
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.from_name.trim()) newErrors.from_name = 'Name is required';
//     if (!form.from_email.trim()) {
//       newErrors.from_email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(form.from_email)) {
//       newErrors.from_email = 'Email is invalid';
//     }
   
//     if (!form.message.trim()) newErrors.message = 'Message is required';

//     return newErrors;
//   };

//   const sendEmail = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});

//     toast.promise(
//       emailjs.send(
//         'service_5xchz5i',
//         'template_gehipuf',
//         form,
//         '5rER37I1dsORgSj8n'
//       ),
//       {
//         loading: 'Sending...',
//         success: 'Message sent successfully!',
//         error: 'Failed to send message. Try again later.',
//       }
//     ).then(() => {
//       setForm({
//         from_name: '',
//         from_email: '',
//         message: '',
//       });
//     });
//   };

//   const supportOptions = [
//     {
//       icon: <Mail className="w-8 h-8 text-blue-600" />,
//       title: "Email Support",
//       description: "Get in touch with our team via email for assistance.",
//       action: () => window.location.href = "mailto:info@hqbinary.com",
//     },
    
//     {
//       icon: <FaWhatsapp className="w-8 h-8 text-green-500" />,
//       title: "Join Our Community",
//       description: "Connect with other QuickInvoice users, get support, tips, and updates.",
//       action: () =>
//       window.open(
//       "https://chat.whatsapp.com/HPrlbf20lOxDiLlMe44rDQ",
//        "_blank"
//        ),
//     },
//   ];

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       {/* Heading */}
//       <div className="max-w-4xl mx-auto text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Center</h1>
//         <p className="text-gray-600">
//           Need help? Our team is here to assist you every step of the way.
//         </p>
//       </div>

//       {/* Support Options */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
//         {supportOptions.map((opt, idx) => (
//           <div
//             key={idx}
//             onClick={opt.action}
//             className="bg-white shadow-lg rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
//           >
//             <div className="flex justify-center mb-4">{opt.icon}</div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">{opt.title}</h2>
//             <p className="text-gray-500 text-sm">{opt.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Contact Form */}
//       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Send us a message</h2>
//         <form onSubmit={sendEmail} className="space-y-4">
//           <input
//             type="text"
//             name="from_name"
//             value={form.from_name}
//             onChange={handleChange}
//             placeholder="Your Name"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           {errors.from_name && <p className="text-red-500 text-sm mt-1">{errors.from_name}</p>}
//           <input
//             type="email"
//             name="from_email"
//             value={form.from_email}
//             onChange={handleChange}
//             placeholder="Your Email"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           {errors.from_email && <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>}
//           <textarea
//             name="message"
//             value={form.message}
//             onChange={handleChange}
//             placeholder="Your Message"
//             rows={4}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//           ></textarea>
//           {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
//           >
//             Submit Request
//           </button>
//         </form>
//       </div>

//       {/* Back to Dashboard button */}
//       {/* <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           ⬅ Back to Dashboard
//         </button>
//       </div> */}
//       {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-[#0046A5] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
//         >
//           Q
//         </button>
//     </div>
//   );
// };

// export default Support;


import React, { useState } from "react";
import { Mail, MessageCircle, ArrowLeft, Send, Users, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from "react-icons/fa";

const Support = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.from_name.trim()) newErrors.from_name = 'Name is required';
    if (!form.from_email.trim()) {
      newErrors.from_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.from_email)) {
      newErrors.from_email = 'Invalid email';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSending(true);

    toast.promise(
      emailjs.send(
        'service_5xchz5i',
        'template_gehipuf',
        form,
        '5rER37I1dsORgSj8n'
      ),
      {
        loading: 'Relaying message...',
        success: 'Message delivered!',
        error: 'Delivery failed. Try again.',
      }
    ).then(() => {
      setForm({ from_name: '', from_email: '', message: '' });
      setIsSending(false);
    }).catch(() => setIsSending(false));
  };

  const supportOptions = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Priority Email",
      description: "Average response: 2 hours",
      color: "bg-blue-50",
      action: () => window.location.href = "mailto:info@hqbinary.com",
    },
    {
      icon: <FaWhatsapp className="w-6 h-6 text-emerald-500" />,
      title: "WhatsApp Community",
      description: "Real-time tips & network",
      color: "bg-emerald-50",
      action: () => window.open("https://chat.whatsapp.com/HPrlbf20lOxDiLlMe44rDQ", "_blank"),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: "Documentation",
      description: "Quick start guides",
      color: "bg-purple-50",
      action: () => toast("Guides coming soon!"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-center" />
      
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0028AE] transition-colors mb-8 font-bold text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            How can we <span className="text-[#0028AE]">help?</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
            Our concierge team is available to ensure your invoicing experience remains seamless and professional.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {supportOptions.map((opt, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              onClick={opt.action}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer group hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 ${opt.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {opt.icon}
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">{opt.title}</h2>
              <p className="text-xs text-slate-400 font-bold">{opt.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#0028AE] animate-pulse" />
                <h2 className="text-xl font-black text-slate-900">Direct Message</h2>
              </div>
              
              <form onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Your Name</label>
                    <input
                      name="from_name"
                      value={form.from_name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Rivers"
                      className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm ${errors.from_name ? 'border-rose-400' : 'border-transparent focus:border-[#0028AE]'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <input
                      name="from_email"
                      value={form.from_email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm ${errors.from_email ? 'border-rose-400' : 'border-transparent focus:border-[#0028AE]'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your request in detail..."
                    rows={5}
                    className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm resize-none ${errors.message ? 'border-rose-400' : 'border-transparent focus:border-[#0028AE]'}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg hover:bg-[#0028AE] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSending ? "Processing..." : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <Users className="absolute -right-4 -bottom-4 text-white/5" size={150} />
              <h3 className="text-[#00A6FA] font-black text-[10px] uppercase tracking-[0.2em] mb-4">Community</h3>
              <p className="text-xl font-black mb-4 leading-tight">Join 500+ Nigerian Business Owners</p>
              <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                Get exclusive access to the QuickInvoice network. Share tips, get fast answers, and grow together.
              </p>
              <button 
                onClick={() => window.open("https://chat.whatsapp.com/HPrlbf20lOxDiLlMe44rDQ", "_blank")}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Enter Community
              </button>
            </div>

            <div className="p-8 border border-slate-200 rounded-[2.5rem] bg-white text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Office Hours</p>
              <p className="text-slate-900 font-black text-sm">Mon — Sat, 8AM - 8PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#0028AE] to-[#00A6FA] text-white flex items-center justify-center rounded-full shadow-2xl z-50 font-black text-xl hover:scale-110 active:scale-95 transition-all"
      >
        Q
      </button>
    </div>
  );
};

export default Support;