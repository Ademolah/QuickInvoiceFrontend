// /* eslint-disable no-unused-vars */

// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
// import { useCurrency } from "../context/CurrencyContext";

// const API = "https://quickinvoice-backend-1.onrender.com"; 

// export default function ReceiptDetails() {
//   const { invoiceId } = useParams();
//   const navigate = useNavigate();
//   const [invoice, setInvoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const captureRef = useRef(null);
//   const [actionLoading, setActionLoading] = useState(false);


//   const { formatCurrency } = useCurrency()

//   // fetch invoice + user on mount
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [invRes, userRes] = await Promise.all([
//           axios.get(`${API}/api/invoices/${invoiceId}`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setInvoice(invRes.data);
//         setUser(userRes.data);
//       } catch (e) {
//         console.error("Load error:", e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [invoiceId]);


//   //fetch user for avatar
//     const [userData, setUserData] = useState(null);
//       useEffect(() => {
//         const fetchUserData = async () => {
//           try {
//             const token = localStorage.getItem("token");
//             if (!token) return;
//             const userRes = await axios.get(`${API}/api/users/me`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             setUserData(userRes.data);
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//           }
//         };
//         fetchUserData();
//       }, []);

 

//   if (loading) return <div className="p-6 md:p-10">Loading receipt…</div>;
//   if (!invoice || !user) return <div className="p-6 md:p-10">Not found.</div>;

//   // destructure invoice fields (safe defaults)
//   const {
//     clientName = "",
//     clientEmail = "",
//     clientPhone = "",
//     items = [],
//     subtotal = 0,
//     tax = 0,
//     discount = 0,
//     total = 0,
//     createdAt,
//     outstandingBalance = 0,
//   } = invoice;
//   const { businessName = "", email = "", phone = "" } = user;

//   // ---------- PDF / SHARE helpers ----------
//   // We will render the capture element at a fixed width that corresponds to A4 proportions to ensure predictable PDF capture.
//   // The function below captures and scales the image so that it fits exactly into one A4 page (with margins).
//   const captureAndMakeSinglePagePDF = async ({ share = false } = {}) => {
//     if (!captureRef.current) return;
//     setActionLoading(true);

//     try {
//       // usage logging (preserve your existing behaviour)
//       const logRes = await fetch(`${API}/api/invoices/log`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ type: "receipt" }),
//       });
//       const logData = await logRes.json();
//       if (!logRes.ok) {
//         alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//         setActionLoading(false);
//         return;
//       }

//       // Capture the node. We use a scale of 2 for crispness.
//       const canvas = await html2canvas(captureRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         scrollY: -window.scrollY,
//         backgroundColor: "#ffffff",
//       });

//       const imgData = canvas.toDataURL("image/png");

//       // create A4 PDF in mm
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageWidth = pdf.internal.pageSize.getWidth(); // mm
//       const pageHeight = pdf.internal.pageSize.getHeight(); // mm

//       // margins (mm)
//       const margin = 12;
//       const usableWidth = pageWidth - margin * 2;
//       const usableHeight = pageHeight - margin * 2;

//       // determine image dimensions in mm preserving aspect ratio
//       // imgWidthMm = usableWidth, imgHeightMm = (canvas.height / canvas.width) * imgWidthMm
//       let imgWidthMm = usableWidth;
//       let imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

//       // if image is taller than usableHeight, scale down to fit single page
//       if (imgHeightMm > usableHeight) {
//         const scaleFactor = usableHeight / imgHeightMm;
//         imgHeightMm = imgHeightMm * scaleFactor;
//         imgWidthMm = imgWidthMm * scaleFactor;
//       }

//       // center horizontally (x), top margin (y)
//       const x = (pageWidth - imgWidthMm) / 2;
//       const y = margin + (usableHeight - imgHeightMm) / 2;

//       pdf.addImage(imgData, "PNG", x, y, imgWidthMm, imgHeightMm);

//       // share or download
//       const pdfBlob = pdf.output("blob");
//       const fileName = `Receipt-${invoice._id.slice(-6).toUpperCase()}.pdf`;
//       const file = new File([pdfBlob], fileName, { type: "application/pdf" });

//       if (share && navigator.canShare && navigator.canShare({ files: [file] })) {
//         await navigator.share({
//           title: "QuickInvoice Receipt",
//           text: `Receipt #${invoice._id.slice(-6).toUpperCase()}`,
//           files: [file],
//         });
//       } else {
//         // fallback to download
//         pdf.save(fileName);
//       }
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//       alert("Failed to generate PDF. Try again.");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // const sharePDF = () => captureAndMakeSinglePagePDF({ share: true });
//   const downloadPDF = () => captureAndMakeSinglePagePDF({ share: false });

//   // ---------- PNG / SHARE helpers ----------
// const sharePNG = async () => {
//   if (!captureRef.current) return;
//   setActionLoading(true);

//   try {
//     // usage logging
//     const logRes = await fetch(`${API}/api/invoices/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ type: "receipt" }),
//     });
    
//     const logData = await logRes.json();
//     if (!logRes.ok) {
//       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//       setActionLoading(false);
//       return;
//     }

//     // Capture the node. Scale 2 is good for crispness on mobile without massive file size.
//     const canvas = await html2canvas(captureRef.current, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       scrollY: -window.scrollY,
//       backgroundColor: "#ffffff",
//     });

//     // Convert Canvas to Blob
//     const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
    
//     const fileName = `Receipt-${invoice._id.slice(-6).toUpperCase()}.png`;
//     const file = new File([blob], fileName, { type: "image/png" });

//     // Use Native Share API
//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       await navigator.share({
//         files: [file],
//         title: "QuickInvoice Receipt",
//         text: `Receipt #${invoice._id.slice(-6).toUpperCase()}`,
//       });
//     } else {
//       // Fallback: Download the PNG
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;
//       link.click();
//       URL.revokeObjectURL(url); // Clean up
//       alert("Sharing not supported on this browser. Receipt downloaded as PNG instead.");
//     }
//   } catch (err) {
//     console.error("PNG generation failed:", err);
//     alert("Failed to generate PNG. Try again.");
//   } finally {
//     setActionLoading(false);
//   }
// };

//   // ---------- Render: Stripe-style, ultra-clean single-page layout ----------
//   // We force the capture container to a fixed width close to A4 proportions in px so html2canvas output is predictable.
//   // 794px is approx A4 width at 96dpi: using this produces reliable capture -> the logic above scales to exact A4 mm on pdf.
//   const captureStyle = {
//     width: 794, // fixed px width for capture
//     maxWidth: "100%",
//     margin: "0 auto",
//     background: "#ffffff",
//     color: "#111827",
//     fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
//     fontSize: 12,
//     lineHeight: 1.4,
//     padding: "28px",
//     boxSizing: "border-box",
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header actions */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">Receipt</h1>
//             <p className="text-sm text-gray-600 mt-1">{businessName || "QuickInvoice NG"}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[#0046A5] border-[#0046A5] hover:bg-[#0046A5] hover:text-white transition"
//             >
//               <ArrowLeft size={16} /> Back
//             </button>

//             <button
//               onClick={sharePNG}
//               disabled={actionLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0028AE] to-[#00A6FA] hover:opacity-90 transition"
//             >
//               {actionLoading ? "Preparing..." : "Share"}
//             </button>

//             <button
//               onClick={downloadPDF}
//               disabled={actionLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0046A5] text-white hover:opacity-95 transition"
//             >
//               <Download size={16} />
//               {actionLoading ? "Preparing..." : "Download PDF"}
//             </button>
//           </div>
//         </div>

//         {/* Capture area: fixed width */}
//         <div ref={captureRef} style={captureStyle} className="mx-auto shadow-none">

//           {/* Top header row */}
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               {/* Avatar Section */}
//               <div 
//                 style={{ 
//                   width: 48, 
//                   height: 48, 
//                   borderRadius: 8, 
//                   overflow: "hidden", 
//                   backgroundColor: "#f1f5f9", 
//                   display: "flex", 
//                   alignItems: "center", 
//                   justifyContent: "center",
//                   border: "1px solid #e2e8f0",
//                   flexShrink: 0
//                 }}
//               >
//                 {userData?.avatar ? (
//                   <img 
//                     src={userData.avatar} 
//                     alt="User Avatar" 
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }} 
//                   />
//                 ) : (
//                   <div style={{ fontSize: 20, fontWeight: 700, color: "#64748b" }}>
//                     {(businessName || "Q").charAt(0).toUpperCase()}
//                   </div>
//                 )}
//               </div>

//               {/* Business Info */}
//               <div>
//                 <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{businessName || "QuickInvoice NG"}</div>
//                 {email && <div style={{ color: "#6b7280", fontSize: 12 }}>{email}</div>}
//                 {phone && <div style={{ color: "#6b7280", fontSize: 12 }}>{phone}</div>}
//               </div>
//             </div>

//             <div style={{ textAlign: "right" }}>
//               <div style={{ fontSize: 12, color: "#6b7280" }}>Receipt</div>
//               <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{invoice._id.slice(-8).toUpperCase()}</div>
//               <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
//                 {new Date(createdAt).toLocaleDateString()}
//               </div>
//             </div>
//           </div>

//           <hr style={{ border: "none", borderTop: "1px solid #EEF2F7", margin: "18px 0" }} />

//           {/* From / To */}
//           <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Billed By</div>
//               <div style={{ fontWeight: 700, marginTop: 6 }}>{businessName || "-"}</div>
//               {email && <div style={{ color: "#6b7280", fontSize: 12 }}>{email}</div>}
//             </div>

//             <div style={{ flex: 1 }}>
//               <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Billed To</div>
//               <div style={{ fontWeight: 700, marginTop: 6 }}>{clientName || "-"}</div>
//               {clientEmail && <div style={{ color: "#6b7280", fontSize: 12 }}>{clientEmail}</div>}
//               {clientPhone && <div style={{ color: "#6b7280", fontSize: 12 }}>{clientPhone}</div>}
//             </div>
//           </div>

//           {/* Items Table */}
//           <div style={{ width: "100%", overflow: "hidden", marginTop: 8 }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: "left", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Description</th>
//                   <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Qty</th>
//                   <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Price</th>
//                   <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((it, idx) => (
//                   <tr key={idx} style={{ borderTop: "1px solid #F1F5F9" }}>
//                     <td style={{ padding: "12px 8px", verticalAlign: "top", color: "#0f172a" }}>{it.description}</td>
//                     <td style={{ padding: "12px 8px", textAlign: "right" }}>{it.quantity}</td>
//                     <td style={{ padding: "12px 8px", textAlign: "right" }}>{formatCurrency(it.unitPrice)}</td>
//                     <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 700 }}>{formatCurrency(it.total ?? it.quantity * it.unitPrice)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
//             <div style={{ width: 320 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
//                 <div>Subtotal</div>
//                 <div>{formatCurrency(subtotal)}</div>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
//                 <div>VAT</div>
//                 <div>{formatCurrency(tax)}</div>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
//                 <div>Discount</div>
//                 <div>{formatCurrency(discount)}</div>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
//                 <div>Balance</div>
//                 <div>{formatCurrency(outstandingBalance)}</div>
//               </div>
//               <div style={{ borderTop: "1px dashed #E6EEF6", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
//                 <div>Total</div>
//                 <div>{formatCurrency(total)}</div>
//               </div>
//             </div>
//           </div>

//           {/* Footer line */}
//           <hr style={{ border: "none", borderTop: "1px solid #EEF2F7", margin: "22px 0 12px" }} />

//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6b7280", fontSize: 12 }}>
//             <div>Powered by QuickInvoice • www.quickinvoiceng.com</div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <CheckCircle2 className="text-green-600" />
//               <div style={{ fontWeight: 700, color: "#10B981" }}>Payment Confirmed</div>
//             </div>
//           </div>
//         </div>

//         {/* small spacer */}
//         <div style={{ height: 18 }} />
//       </div>
//     </div>
//   );
// }


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
        setInvoice(invRes.data);
        setUser(userRes.data);
      } catch (e) {
        toast.error("Failed to load receipt details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [invoiceId]);

  const handleCapture = async (format = 'pdf') => {
    if (!captureRef.current) return;
    
    // 1. Enter Capture Mode (Triggers CSS changes to remove rounding/shadows)
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

      // Small delay to allow React to re-render the "Flat" version for capture
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(captureRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794, 
      });

      const imgData = canvas.toDataURL("image/png");

      if (format === 'pdf') {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth; // Full bleed
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // Start at 0,0
        pdf.save(`Receipt-${invoice._id.slice(-6).toUpperCase()}.pdf`);
      } else {
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], `Receipt-${invoice._id.slice(-6).toUpperCase()}.png`, { type: "image/png" });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "Receipt" });
        } else {
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `Receipt-${invoice._id.slice(-6).toUpperCase()}.png`;
          link.click();
        }
      }
      toast.success("Ready!");
    } catch (err) {
      console.error(err);
      toast.error("Capture failed.");
    } finally {
      // 2. Exit Capture Mode (Restores visual rounding/shadows)
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

