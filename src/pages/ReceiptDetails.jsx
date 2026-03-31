


/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Download, CheckCircle2, Share2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import toast, { Toaster } from "react-hot-toast";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function ReceiptDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const captureRef = useRef(null);
  const { formatCurrency } = useCurrency();

  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const [invRes, userRes] = await Promise.all([
        axios.get(`${API}/api/invoices/${invoiceId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const rawUser = userRes.data;
      const invoiceData = invRes.data;

      // 1. Locate the business used for this specific transaction
      const activeBusiness = rawUser.enterpriseBusinesses?.find(
        (b) => b._id === invoiceData.businessId
      );

      // 2. Build the Contextual User for the Receipt
      const contextualUser = {
        ...rawUser,
        // Match the businessName field your UI expects
        businessName: activeBusiness ? activeBusiness.businessName : (rawUser.businessName || rawUser.name || "QuickInvoice NG"),
        // Use the specific business logo for the receipt header
        avatar: activeBusiness?.logo?.url ? activeBusiness.logo.url : rawUser.avatar,
        // Ensure address matches the business entity
        address: activeBusiness?.address ? activeBusiness.address : rawUser.address
      };

      setInvoice(invoiceData);
      setUser(contextualUser);
    } catch (e) {
      console.error("Receipt load error:", e);
      toast.error("Failed to load receipt details");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [invoiceId]);

  

  const handleCapture = async (format = 'pdf') => {
    if (!captureRef.current) return;
    
    setActionLoading(true);
    const loadingToast = toast.loading(`Generating Premium ${format.toUpperCase()}...`);

    try {
      const logRes = await fetch(`${API}/api/invoices/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ type: "receipt" }),
      });
      
      if (!logRes.ok) {
        toast.error("Usage limit exceeded.");
        setActionLoading(false);
        toast.dismiss(loadingToast);
        return;
      }

      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(captureRef.current, {
        scale: 2, // 🚀 Optimized from 3 to 2 (Plenty sharp for receipts)
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794, 
      });

      // 🚀 CRITICAL: Switch to JPEG with 0.7 compression for massive size savings
      const imgData = canvas.toDataURL("image/jpeg", 0.7);

      if (format === 'pdf') {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // 🚀 Use 'JPEG' and 'FAST' alias for optimized PDF building
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        pdf.save(`Receipt-${invoice._id.slice(-6).toUpperCase()}.pdf`);
      } else {
        // For 'Share PNG', we actually send a compressed JPEG but keep the name .png 
        // Or better yet, rename to .jpg for better compatibility
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], `Receipt-${invoice._id.slice(-6).toUpperCase()}.jpg`, { type: "image/jpeg" });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "Receipt", text: "Here is your receipt from QuickPOS" });
        } else {
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `Receipt-${invoice._id.slice(-6).toUpperCase()}.jpg`;
          link.click();
        }
      }
      toast.success("Ready!");
    } catch (err) {
      console.error(err);
      toast.error("Capture failed.");
    } finally {
      setActionLoading(false);
      toast.dismiss(loadingToast);
    }
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-600 rounded-full mb-4"></div>
        <p className="font-bold text-slate-400">Verifying Transaction...</p>
      </div>
    </div>
  );

  if (!invoice || !user) return <div className="p-10 text-center font-bold">Receipt not found.</div>;

  const { clientName, clientEmail, clientPhone, items, subtotal, tax, discount, total, createdAt, outstandingBalance } = invoice;

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-12">
      <Toaster />
      
      {/* Top Actions Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex gap-2">
            <button onClick={() => handleCapture('png')} disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
              <Share2 size={16} /> <span className="hidden md:inline">Share PNG</span>
            </button>
            <button onClick={() => handleCapture('pdf')} disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg transition-all">
              <Download size={16} /> <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* THE MASTER CONTAINER: Ref is now here */}
        <div 
          ref={captureRef}
          className={`bg-white transition-all duration-300 mx-auto overflow-hidden
            ${actionLoading ? 'rounded-0 border-0 shadow-none' : 'rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5'}
          `}
          style={{ width: "100%", maxWidth: "794px" }}
        >
          {/* Status Banner: Now part of captureRef */}
          <div className="bg-emerald-500 py-4 px-6 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-white" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Official Payment Receipt</span>
          </div>

          {/* Receipt Body */}
          <div className="p-8 md:p-12 bg-white">
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-slate-300">{user?.businessName?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none mb-1">{user?.businessName}</h2>
                  <p className="text-xs font-bold text-slate-400">{user?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Receipt Number</p>
                <p className="text-lg font-black text-slate-900">#{invoice._id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer</h4>
                <p className="text-sm font-black text-slate-800">{clientName}</p>
                <p className="text-xs font-medium text-slate-500">{clientEmail}</p>
                <p className="text-xs font-medium text-slate-500">{clientPhone}</p>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Date Issued</h4>
                <p className="text-sm font-black text-slate-800">{new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mb-10 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="text-left pb-4">Description</th>
                    <th className="text-center pb-4">Qty</th>
                    <th className="text-right pb-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-5">
                        <p className="text-sm font-black text-slate-800">{item.description}</p>
                        <p className="text-[10px] font-bold text-slate-400">{formatCurrency(item.unitPrice)} / unit</p>
                      </td>
                      <td className="py-5 text-center text-sm font-bold text-slate-600">{item.quantity}</td>
                      <td className="py-5 text-right text-sm font-black text-slate-800">{formatCurrency(item.total || item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end pt-6 border-t-2 border-slate-100">
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Discount</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>VAT</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Balance</span>
                  <span>{formatCurrency(outstandingBalance)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Amount Paid</span>
                  <span className="text-emerald-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Perforated Line - Only visible on screen, not during capture */}
            <div className={`relative h-px bg-slate-100 my-12 ${actionLoading ? 'opacity-0' : 'opacity-100'}`}>
               <div className="absolute -left-14 -top-2 w-4 h-4 rounded-full bg-[#F4F7FA]"></div>
               <div className="absolute -right-14 -top-2 w-4 h-4 rounded-full bg-[#F4F7FA]"></div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Payment Verified</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Thank you for your business</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">www.quickinvoiceng.com</p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Powered by <span className="text-[#0028AE]">QuickInvoice</span> Invoicing Systems
        </p>
      </div>
    </div>
  );
}

