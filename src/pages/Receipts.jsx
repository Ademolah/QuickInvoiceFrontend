/* eslint-disable no-unused-vars */


import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Search, Receipt, ArrowRight, Wallet, Filter } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Receipts() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Only PAID invoices are receipt-ready
        setInvoices(res.data.filter((i) => i.status === "paid"));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices.slice(0, 10);
    return invoices
      .filter(
        (i) =>
          i.clientName?.toLowerCase().includes(q) ||
          i.clientEmail?.toLowerCase().includes(q) ||
          i._id?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [invoices, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
          <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Receipts</p>
        </div>
      </div>
    );
  }

  return (
  <div className="p-4 md:p-10 max-w-5xl mx-auto mb-20">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#0028AE]/10 p-2 rounded-xl">
            <Receipt size={24} className="text-[#0028AE]" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Receipts
          </h1>
        </div>
        <p className="text-sm md:text-base text-slate-500 font-medium tracking-tight">History of cleared transactions</p>
      </div>

      {/* Search Bar - Premium Styled */}
      <div className="relative group w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-[#0028AE] transition-colors" size={18} />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search receipts..."
          className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-11 pr-4 py-3 md:py-4 focus:outline-none focus:ring-4 focus:ring-[#0028AE]/5 focus:border-[#0028AE] transition-all font-bold text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
        />
      </div>
    </div>

    {/* Main Content Area - Flattened Stack */}
    <div className="flex flex-col gap-3 md:gap-4">
      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-2xl shadow-slate-200/50"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">No Receipts Found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8 font-medium">
            Only invoices marked as <span className="text-emerald-500 font-bold">Paid</span> will appear here.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {filtered.map((inv, idx) => (
            <motion.div
              key={inv._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => navigate(`/receipts/${inv._id}`)}
              className="group relative bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-slate-100 hover:border-[#0028AE]/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-4 md:gap-6"
            >
              {/* Date Column - Simplified */}
              <div className="flex flex-col items-center justify-center bg-slate-50 min-w-[50px] md:min-w-[65px] py-2 md:py-3 rounded-xl border border-slate-100">
                <span className="text-[9px] md:text-[10px] font-black text-[#0028AE] uppercase tracking-tighter">
                  {new Date(inv.createdAt).toLocaleDateString("en-GB", { month: "short" })}
                </span>
                <span className="text-base md:text-xl font-black text-slate-900 leading-none">
                  {new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "2-digit" })}
                </span>
              </div>

              {/* Info Column - Flattened Layout */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                  <div>
                    <h3 className="text-base md:text-xl font-black text-slate-900 truncate group-hover:text-[#0028AE] transition-colors leading-tight">
                      {inv.clientName}
                    </h3>
                    <p className="text-[10px] md:text-xs font-mono font-bold text-slate-400 mt-0.5">
                      #{inv._id.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                    <div className="text-right">
                      <span className="text-sm md:text-2xl font-black text-slate-900 tracking-tighter">
                        {formatCurrency(Number(inv.total))}
                      </span>
                    </div>
                    
                    {/* Persistent Premium Badge */}
                    <div className="bg-[#0028AE] text-white p-2 rounded-lg shadow-lg shadow-[#0028AE]/20">
                      <FileText size={14} className="md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Indicator (Mobile Only Spark) */}
              <div className="absolute top-2 right-2 md:hidden">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>

    {/* Counter Badge */}
    {filtered.length > 0 && (
      <div className="mt-8 flex justify-center">
        <div className="px-5 py-1.5 bg-slate-900/5 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
          Showing {filtered.length} Records
        </div>
      </div>
    )}

    {/* Floating Action Button */}
    <button
      onClick={() => navigate("/dashboard")}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 group"
    >
      <span className="text-lg md:text-xl font-black">Q</span>
    </button>
  </div>
);
}

