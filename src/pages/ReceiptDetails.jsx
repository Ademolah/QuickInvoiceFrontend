/* eslint-disable no-unused-vars */

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



import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Download,  Share2, ShieldCheck } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { motion } from "framer-motion";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function ReceiptDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const captureRef = useRef(null);
  
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { formatCurrency } = useCurrency();

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
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [invoiceId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-[#0028AE] border-slate-200 rounded-full animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Verifying Transaction</p>
      </div>
    </div>
  );

  if (!invoice || !user) return <div className="p-10 text-center font-bold">Receipt not found.</div>;

  const {
    clientName = "",
    clientEmail = "",
    clientPhone = "",
    items = [],
    subtotal = 0,
    tax = 0,
    discount = 0,
    total = 0,
    createdAt,
    outstandingBalance = 0,
  } = invoice;

  const { businessName = "", email = "", phone = "", avatar = "" } = user;

  // ---------- GENERATION HELPERS ----------
 




  
const handleCapture = async (format = "png") => {
  if (!captureRef.current) return;
  setActionLoading(true);

  try {
    // 1. LOGGING (Preserved)
    const logRes = await fetch(`${API}/api/invoices/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ type: "receipt" }),
    });

    if (!logRes.ok) {
      const logData = await logRes.json();
      alert(logData.message || "Limit exceeded.");
      setActionLoading(false);
      return;
    }

    // 2. THE CAPTURE FIX
    const element = captureRef.current;
    const canvas = await html2canvas(element, {
      scale: 3, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
    });

    const fileName = `Receipt-${invoice._id.slice(-6).toUpperCase()}`;

    if (format === "pdf") {
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions in mm
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      
      // Convert pixels to mm (1px = 0.264583mm)
      const pdfWidth = 210; // Standard A4 Width
      const pdfHeight = (imgHeightPx * pdfWidth) / imgWidthPx; 

      // WORLD-CLASS FIX: Create a PDF with a CUSTOM height 
      // instead of forcing it onto a standard A4 page height.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight] // Custom page size to match receipt perfectly
      });

      // Add image at 0,0 - No margins, No floating
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } else {
      // PNG SHARING
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${fileName}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "QuickInvoice Receipt",
            text: `Official Receipt from ${businessName}`,
          });
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png", 1.0);
    }
  } catch (err) {
    console.error("Capture Error:", err);
    alert("Could not generate receipt. Please try again.");
  } finally {
    setActionLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-slate-100 py-6 md:py-12 px-4">
    {/* Action Bar */}
    <div className="max-w-[600px] mx-auto mb-8 flex items-center justify-between">
      <button 
        onClick={() => navigate(-1)}
        className="p-3 bg-white rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-all"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => handleCapture("png")}
          disabled={actionLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
        >
          <Share2 size={16} /> {actionLoading ? "..." : "Share"}
        </button>
        <button
          onClick={() => handleCapture("pdf")}
          disabled={actionLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0028AE] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
        >
          <Download size={16} /> {actionLoading ? "..." : "PDF"}
        </button>
      </div>
    </div>

    {/* The Receipt Document */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[600px] mx-auto"
    >
      {/* World-Class Fix: 
          1. Removed rounded-t-[2.5rem] to ensure the capture doesn't clip.
          2. Removed overflow-hidden which often causes cutoff issues in html2canvas.
          3. Added h-auto to ensure it expands to the full height of the content.
      */}
      <div 
        ref={captureRef}
        className="bg-white shadow-2xl relative"
        style={{ width: "100%", height: "auto", minHeight: "800px" }}
      >
        {/* Brand Header Section - Completely Rectangle */}
        <div className="bg-slate-900 p-10 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl p-1 overflow-hidden shadow-xl">
                {avatar ? (
                  <img src={avatar} alt="logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-900 font-black text-2xl">
                    {businessName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">{businessName}</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Receipt #</p>
              <p className="font-mono text-lg font-bold">{invoice._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Transaction Brief */}
          <div className="grid grid-cols-2 gap-8 py-8 border-b border-slate-100">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</h4>
              <p className="font-black text-slate-800 text-lg">{clientName}</p>
              <p className="text-sm text-slate-500 font-medium">{clientEmail}</p>
              <p className="text-sm text-slate-500 font-medium">{clientPhone}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Date</h4>
              <p className="font-black text-slate-800 text-lg">
                {new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-slate-500 font-medium tracking-wide">Method: Electronic Transfer</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="pb-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                  <th className="pb-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-5">
                      <p className="font-bold text-slate-800 text-sm">{it.description}</p>
                    </td>
                    <td className="py-5 text-center font-bold text-slate-500 text-sm">x{it.quantity}</td>
                    <td className="py-5 text-right font-black text-slate-800 text-sm">{formatCurrency(it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Block */}
          <div className="flex justify-end pt-6">
            <div className="w-full md:w-64 space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Tax (VAT)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Discount</span>
                <span className="text-rose-500">-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Balance</span>
                <span className="text-rose-500">{formatCurrency(outstandingBalance)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-xs font-black text-slate-900 uppercase">Amount Paid</span>
                <span className="text-xl font-black text-[#0028AE]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Premium Branding Footer */}
          <div className="pt-10 border-t border-dashed border-slate-200 text-center space-y-6 pb-6">
             <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Official Receipt</span>
                </div>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.1em] mb-4">
                  This document is digitally signed and serves as valid proof of payment.
                </p>
                
                {/* Decorative Barcode */}
                <div className="w-3/4 h-8 bg-[url('https://www.scantech.com/wp-content/uploads/2021/04/barcode-1.png')] bg-repeat-x opacity-10 grayscale mx-auto mb-6" />
             </div>

             <div className="flex flex-col items-center gap-1">
               <p className="text-[11px] font-black text-slate-800">Powered by QuickInvoice NG</p>
               <p className="text-[10px] font-bold text-[#0028AE] tracking-widest">www.quickinvoiceng.com</p>
             </div>
          </div>
        </div>
        
        {/* The Physical Receipt Cut Effect - Added padding bottom to prevent cutoff */}
        <div className="flex justify-between px-2 h-4 mb-0 pb-8 bg-white">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-slate-100 rounded-full mt-[-12px]" />
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);
}