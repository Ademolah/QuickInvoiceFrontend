/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, UploadCloud, ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";


const API = "https://quickinvoice-backend-1.onrender.com";

const AddBusiness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    street: "",
    city: "",
    state: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API}/api/enterprise/add-business`, {
        businessName: formData.businessName,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Business Empire Expanded!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-bold text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-[#1A0B2E] p-10 text-white relative">
            <Sparkles className="absolute right-10 top-10 text-purple-400/20" size={60} />
            <h1 className="text-3xl font-black mb-2">New Business Entity</h1>
            <p className="text-purple-200/60 font-medium">Register a sub-account under your Enterprise umbrella.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Identity</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                  placeholder="e.g. Venture Logistics Ltd"
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Address Fields */}
               <div className="space-y-4 md:col-span-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Headquarters Address</label>
                 <input 
                   className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-500 outline-none font-bold text-sm"
                   placeholder="Street Address"
                   onChange={(e) => setFormData({...formData, street: e.target.value})}
                 />
               </div>
               <input 
                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-500 outline-none font-bold text-sm"
                 placeholder="City"
                 onChange={(e) => setFormData({...formData, city: e.target.value})}
               />
               <input 
                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-500 outline-none font-bold text-sm"
                 placeholder="State"
                 onChange={(e) => setFormData({...formData, state: e.target.value})}
               />
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-3"
            >
              {loading ? "Establishing Entity..." : "Create Business Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBusiness;