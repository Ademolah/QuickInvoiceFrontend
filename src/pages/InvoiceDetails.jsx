

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Loader2,
  Share2,
  ShieldCheck,
  Building2,
  CreditCard,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import toast from "react-hot-toast";
import { useAlert } from "../context/AlertContext";

const API_BASE = "https://quickinvoice-backend-1.onrender.com"

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const { formatCurrency } = useCurrency();

  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const {showAlert} = useAlert();

  const token = useMemo(() => localStorage.getItem("token"), []);

  // 1. DATA LOADING
  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);
      if (!token) { setError("Authentication required"); return; }

      const [invRes, userRes, accRes] = await Promise.all([
        axios.get(`${API_BASE}/api/invoices/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/users/account-details`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const rawUser = userRes.data;
      const invoiceData = invRes.data;

      // 1. Identify which business this specific invoice belongs to
      const activeBusiness = rawUser.enterpriseBusinesses?.find(
        (b) => b._id === invoiceData.businessId
      );

      // 2. Build the Contextual User
      const contextualUser = {
        ...rawUser,
        // This line ensures your JSX {user?.businessName} works perfectly
        businessName: activeBusiness ? activeBusiness.businessName : (rawUser.businessName || rawUser.name || "QuickInvoice NG"),
        
        // Update avatar to use the business logo URL
        avatar: activeBusiness?.logo?.url ? activeBusiness.logo.url : rawUser.avatar,
        
        // Use business address if available
        address: activeBusiness?.address ? activeBusiness.address : rawUser.address
      };

      setInvoice(invoiceData);
      setUser(contextualUser); 
      setUserData(contextualUser); // Updates the logo/avatar in the UI
      
      // 3. Set Bank Details (Backend already handles the business/main switch)
      setBankName(accRes.data.accountDetails?.bankName || '');
      setAccountNumber(accRes.data.accountDetails?.accountNumber || '');
      setAccountName(accRes.data.accountDetails?.accountName || '');

    } catch (err) {
      console.error("Load error:", err);
      setError(err.response?.data?.message || "Failed to load invoice.");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [id, token]);

  // 2. USAGE LOGGING LOGIC
  const logUsage = async () => {
    const res = await fetch(`${API_BASE}/api/invoices/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: "invoice" }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Use the premium modal for professional boundary setting
      showAlert(data.message || "You've reached your current usage limit. To continue scaling your business, please upgrade to Pro.", "warning");
      
      return false;
    }
    return true;
  };

  // 3. SHARE AS PNG (Mobile Optimized)
  const sharePNG = async () => {
    if (!invoiceRef.current) return;
    setActionLoading(true);
    try {
      const canProceed = await logUsage();
      if (!canProceed) return;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3, // High crisp quality
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
      const file = new File([blob], `Invoice-${id.slice(-6)}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice from ${user?.businessName}`,
          text: `Invoice from ${user?.businessName}`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${id.slice(-6)}.png`;
        link.click();
        toast.success("PNG Downloaded");
      }
    } catch (err) {
      // toast.error("Sharing failed");
      showAlert("Failed to share invoice. Maybe browser or network connectivity, please retry", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // // 4. DOWNLOAD PDF
  // const downloadPDF = async () => {

  const downloadPDF = async () => {
  if (!invoiceRef.current) return;
  setActionLoading(true);
  try {
    const canProceed = await logUsage();
    if (!canProceed) return;

    // 1. Lower the scale slightly (2 is plenty for A4 sharpness)
    const canvas = await html2canvas(invoiceRef.current, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      allowTaint: true
    });

    // 2. CRITICAL CHANGE: Use JPEG instead of PNG and set quality to 0.7 or 0.8
    // PNG is lossless (heavy). JPEG at 0.7 is 90% smaller and looks identical on a phone.
    const imgData = canvas.toDataURL("image/jpeg", 0.7); 

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 3. Add the JPEG to the PDF
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    
    pdf.save(`Invoice-${id.slice(-6)}.pdf`);
    toast.success("PDF Downloaded (Optimized)");
  } catch (err) {
    console.error(err);
    // toast.error("PDF generation failed");
    showAlert("Failed to generate PDF. Please try again.", "error");
  } finally {
    setActionLoading(false);
  }
};

  const handleMarkPaid = async () => {
    if (!window.confirm("Mark as paid?")) return;
    try {
      setActionLoading(true);
      const res = await axios.patch(`${API_BASE}/api/invoices/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoice(res.data);
      toast.success("Receipt generated!");
    } catch (err) {
      // toast.error("Failed to update status");
      showAlert("Failed to update invoice status. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="w-10 h-10 text-[#0028AE] animate-spin" />
  </div>
);

// If there's an error OR invoice is still null after loading, show error UI
if (error || !invoice) return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ArrowLeft size={30} />
      </div>
      <p className="text-slate-900 font-black text-xl mb-2">{error || "Invoice Not Found"}</p>
      <p className="text-slate-500 text-sm mb-6">We couldn't retrieve the details for this invoice.</p>
      <button
        onClick={() => navigate("/invoices")}
        className="w-full py-3 rounded-2xl bg-[#0028AE] text-white font-black uppercase tracking-widest text-xs"
      >
        Back to Invoices
      </button>
    </div>
  </div>
);

// NOW it is safe to destructure because we know 'invoice' exists
const { 
  clientName, 
  clientEmail, 
  clientPhone, 
  items = [], 
  subtotal, 
  tax, 
  discount, 
  total,
  outstandingBalance, 
  status, 
  createdAt, 
  dueDate, 
  notes 
} = invoice;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 font-bold text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex items-center gap-2">
             {status !== "paid" && (
               <button onClick={handleMarkPaid} disabled={actionLoading} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                 Mark Paid
               </button>
             )}
             <button onClick={sharePNG} disabled={actionLoading} className="bg-slate-900 text-white p-2 rounded-xl">
               <Share2 size={18} />
             </button>
             <button onClick={downloadPDF} disabled={actionLoading} className="bg-[#0028AE] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
               {actionLoading ? "..." : "PDF"}
             </button>
          </div>
        </div>

        {/* INVOICE CANVAS */}
        <div 
          ref={invoiceRef}
          className="bg-white shadow-2xl overflow-hidden relative"
          style={{ width: "794px", margin: "0 auto", minHeight: "1123px" }}
        >
          {/* Brand Header */}
          <div className="p-10 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white flex justify-between items-center">
            <div className="flex items-center gap-5">
              {userData?.avatar ? (
                <img src={userData.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg" alt="logo" />
              ) : (
                <img src="/quicksocial.jpg" className="h-16 w-auto object-contain rounded-xl" alt="QuickInvoice" />
              )}
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Invoice</h2>
                <p className="text-sm font-bold opacity-80">{user?.businessName || "QuickInvoice NG"}</p>
                
                {/* 👇 Only renders if tin exists and is not an empty string */}
                {user?.tin && (
                  <p className="text-sm font-bold opacity-80">TIN: {user.tin}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Reference</p>
              <p className="text-xl font-black">#{String(id).slice(-8).toUpperCase()}</p>
              <p className="text-xs font-bold mt-1 opacity-80">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-12">
            {/* Parties */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0028AE] mb-3">From</h4>
                <div className="space-y-1">
                  <p className="font-black text-slate-900">{user?.businessName}</p>
                  <p className="text-xs font-bold text-slate-500">{user?.email}</p>
                  <p className="text-xs font-bold text-slate-500">{user?.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0028AE] mb-3">Billed To</h4>
                <div className="space-y-1">
                  <p className="font-black text-slate-900">{clientName}</p>
                  <p className="text-xs font-bold text-slate-500">{clientEmail}</p>
                  <p className="text-xs font-bold text-slate-500">{clientPhone}</p>
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase">Due Date</p>
                    <p className="text-xs font-black text-slate-900">{dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mb-10 rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left p-5 text-[10px] font-black uppercase text-slate-400">Description</th>
                    <th className="text-center p-5 text-[10px] font-black uppercase text-slate-400">Qty</th>
                    <th className="text-right p-5 text-[10px] font-black uppercase text-slate-400">Price</th>
                    <th className="text-right p-5 text-[10px] font-black uppercase text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-5 text-sm font-bold text-slate-800">{it.description}</td>
                      <td className="p-5 text-center text-sm font-bold text-slate-600">{it.quantity}</td>
                      <td className="p-5 text-right text-sm font-bold text-slate-600">{formatCurrency(it.unitPrice)}</td>
                      <td className="p-5 text-right text-sm font-black text-slate-900">{formatCurrency(it.total ?? it.quantity * it.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Payment Details</h4>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                    <p className="text-[11px] font-black text-slate-900 flex items-center gap-2"><Building2 size={12}/> {bankName || "-"}</p>
                    <p className="text-[11px] font-black text-[#0028AE] flex items-center gap-2"><CreditCard size={12}/> {accountNumber || "-"}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{accountName || "-"}</p>
                  </div>
                </div>
                {notes && (
                  <div className="p-5 bg-blue-50/30 border-l-4 border-[#0028AE] rounded-r-xl">
                    <p className="text-[10px] font-black text-[#0028AE] uppercase mb-1">Notes</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>VAT</span>
                  <span className="text-slate-900">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 pb-3 border-b border-dashed">
                  <span>Discount</span>
                  <span className="text-emerald-500">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 pb-3 border-b border-dashed">
                  <span>Balance</span>
                  <span className="text-red-500">-{formatCurrency(outstandingBalance)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black uppercase text-[#0028AE]">Total</span>
                  <span className="text-2xl font-black text-[#0028AE] tracking-tighter">{formatCurrency(total)}</span>
                </div>
                {status === 'paid' && (
                  <div className="mt-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-center text-[10px] font-black uppercase tracking-widest">
                    Fully Paid
                  </div>
                )}
              </div>
            </div>

            {/* Professional Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-2">
              <div className="flex justify-center items-center gap-2 text-[#0028AE] font-black text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={14}/> Secured by QuickInvoice
              </div>
              <div className="flex justify-center items-center gap-2 text-[#0028AE] font-black text-[10px] uppercase tracking-[0.3em]">
                  www.quickinvoiceng.com
              </div>
              <p className="text-[10px] font-bold text-slate-400">
                Powered by QuickInvoice • {new Date().getFullYear()} 
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Floating Action for Mobile Navigation */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-6 right-6 bg-[#0028AE] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-transform z-50 font-black text-xl"
      >
        Q
      </button>
    </div>
  );
}
