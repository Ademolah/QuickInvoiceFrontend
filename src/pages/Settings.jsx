

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, Landmark, Globe, Camera, 
  ArrowLeft, Check, Loader2, Save, Key , Hash, FileText, CheckCircle,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { uploadAvatar } from "../utils/upload";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    accountName: "", accountNumber: "", bankName: "", bankCode: "",
  });

  // Password State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Profile Photo State
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { currency, switchCurrency } = useCurrency();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [tin, setTin] = useState(user?.tin || ""); // Initialize with existing user data

  const handleUpdateTin = async () => {
    // 1. Basic Validation
    if (!tin || tin.trim().length < 5) {
      return toast.error("Please enter a valid Tax Identification Number", {
        style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '11px', fontWeight: '900' }
      });
    }

    const token = localStorage.getItem('token');
    setIsUpdating(true);

    try {
      const { data } = await axios.put(
        `${API}/api/users/update-tin`, 
        { tin: tin.trim() }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // 2. Update local state so the UI reflects the change immediately
        setUser({ ...user, tin: data.tin });
        
        toast.success("Tax ID Updated Successfully", {
          icon: '📝',
          style: { borderRadius: '12px', background: '#001325', color: '#fff', fontSize: '11px', fontWeight: '900' }
        });
      }
    } catch (err) {
      console.error("TIN Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update Tax ID");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBanks(true);
      try {
        const [bankRes, accountRes] = await Promise.all([
          axios.get(`${API}/api/banks`),
          axios.get(`${API}/api/users/account-details`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (bankRes.data?.banks) setBankList(bankRes.data.banks);
        if (accountRes.data) setBankDetails(accountRes.data);
      } catch (err) {
        toast.error("Failed to sync settings");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchData();
  }, [token]);

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API}/api/users/account-details`, bankDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Payout details updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords don't match");
    setLoadingPassword(true);
    try {
      await axios.put(`${API}/api/users/change-password`, 
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await uploadAvatar(selectedFile, token);
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "payout", label: "Payouts", icon: Landmark },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-2 px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          </div>

          {/* Premium Tab Bar */}
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-[#0028AE]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0028AE] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <img 
                      src={preview || "/default-avatar.png"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-slate-50 shadow-inner"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                      <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setPreview(URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 mb-1">Business Identity</h3>
                    <p className="text-slate-400 text-sm font-medium mb-4">Your avatar will appear on official receipts and invoices.</p>
                    {selectedFile && (
                       <button onClick={handleUpload} className="px-6 py-2 bg-[#0028AE] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto md:mx-0">
                         {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save New Photo
                       </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Globe size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Localization</h3>
                </div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => switchCurrency(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold text-slate-700 outline-none"
                >
                  <option value="NGN">₦ Nigerian Naira (NGN)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                </select>
              </div>


              {/* ✨ NEW: Taxation Card */}
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-[#0028AE] rounded-lg"><FileText size={20} /></div>
        <div>
           <h3 className="text-lg font-black text-slate-900">Taxation</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Required for professional business invoices</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tax Identification Number (TIN)</label>
          <div className="relative group">
            <input 
              type="text" 
              value={tin}
              onChange={(e) => setTin(e.target.value)}
              placeholder="e.g. 12345678-0001"
              className="w-full p-4 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] focus:bg-white transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0028AE] transition-colors">
              <Hash size={16} />
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdateTin}
          disabled={isUpdating}
          className="bg-[#001325] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0028AE] transition-all active:scale-95 shadow-lg shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isUpdating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle size={14} />
              Save Tax ID
            </>
          )}
        </button>
      </div>
    </div>


            </motion.div>
          )}

          {/* PAYOUT TAB */}
          {activeTab === "payout" && (activeTab === "payout" && (
            <motion.div key="payout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleBankSubmit} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-[#0028AE] rounded-lg"><Landmark size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Payout Destination</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder</label>
                    <input 
                      type="text" 
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      placeholder="e.g. John Enterprises"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input 
                      type="text" 
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      placeholder="0000000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Financial Institution</label>
                  <select 
                    value={bankDetails.bankName}
                    onChange={(e) => {
                      const b = bankList.find(x => x.name === e.target.value);
                      setBankDetails({...bankDetails, bankName: b.name, bankCode: b.code});
                    }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                  >
                    <option value="">{loadingBanks ? "Fetching Banks..." : "Select Bank"}</option>
                    {bankList.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Save Settlement Details
                </button>
              </form>
            </motion.div>
          ))}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Key size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Change Password</h3>
                </div>

                <div className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="Current Password"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="password" 
                      placeholder="New Password"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loadingPassword} className="w-full py-4 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
                  {loadingPassword ? <Loader2 className="animate-spin" size={16} /> : "Update Security Credentials"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#0028AE] to-[#00A6FA] text-white flex items-center justify-center rounded-full shadow-2xl z-50 font-black text-xl hover:scale-110 active:scale-95 transition-all">Q</button>
    </div>
  );
}
