// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
// import { useCurrency } from "../context/CurrencyContext";
// // import api from "../utils/api";


// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function ReceiptDetails() {
//   const { invoiceId } = useParams();
//   const navigate = useNavigate();
//   const [invoice, setInvoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const captureRef = useRef(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const inv = await axios.get(`${API}/api/invoices/${invoiceId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const usr = await axios.get(`${API}/api/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setInvoice(inv.data);
//         setUser(usr.data);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [invoiceId]);

 

//   const { code } = useCurrency(); // 👈 get currency settings
  
//     // helper to format currency
//     const formatCurrency = (amount) =>
//       new Intl.NumberFormat('en', {
//         style: 'currency',
//         currency: code,
//       }).format(amount);



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

//   const sharePDF = async () => {
//   if (!captureRef.current) return;
//   setActionLoading(true);

//   // ✅ Log usage
//   const logRes = await fetch(`${API}/api/invoices/log`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//     body: JSON.stringify({ type: "receipt" }),
//   });

//   const logData = await logRes.json();
//   console.log("Usage log response:", logData);

//   if (!logRes.ok) {
//     alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//     setActionLoading(false);
//     return;
//   }

//   try {
//     // ✅ Capture receipt
//     const node = captureRef.current;
//     const canvas = await html2canvas(node, { scale: 2, useCORS: true });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "pt", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     const imgWidth = pageWidth - 48;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 24;

//     pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight - 48;

//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight + 24;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     // ✅ Convert PDF to blob + file
//     const pdfBlob = pdf.output("blob");
//     const fileName = `Receipt_${invoice?._id?.slice(-6).toUpperCase()}.pdf`;
//     const file = new File([pdfBlob], fileName, { type: "application/pdf" });

//     // ✅ Primary: Web Share API
//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       await navigator.share({
//         title: "QuickInvoice Receipt",
//         text: `Here is your receipt #${invoice?._id?.slice(-6).toUpperCase()}`,
//         files: [file],
//       });
//     } else {
//       // 🚨 Fallback
//       const pdfUrl = URL.createObjectURL(pdfBlob);

//       // Option A: Trigger download
//       const link = document.createElement("a");
//       link.href = pdfUrl;
//       link.download = fileName;
//       link.click();

//       // Option B: Open WhatsApp share automatically
//       // window.open(`https://wa.me/?text=Here’s your receipt: ${pdfUrl}`, "_blank");

//       alert("Sharing not supported on this device. The receipt has been downloaded instead.");
//     }
//   } catch (error) {
//     console.error("Error sharing PDF:", error);
//     alert("Failed to share receipt.");
//   } finally {
//     setActionLoading(false);
//   }
// }





//   const downloadPDF = async () => {
//   if (!captureRef.current) return;
//   setActionLoading(true)
  
//   try{
//     // ✅ Log usage
//   const logRes = await fetch(`${API}/api/invoices/log`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//     body: JSON.stringify({ type: "receipt" }),
//   });

//   const logData = await logRes.json();
//   console.log("Usage log response:", logData);

//   if (!logRes.ok) {
//     alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//     return;
//   }

//   // ✅ Capture the receipt
//   const node = captureRef.current;
//   // const canvas = await html2canvas(node, { scale: 2, useCORS: true });

//   const canvas = await html2canvas(node, {
//           scale: 2,
//           useCORS: true,
//           allowTaint: true,
//           scrollY: -window.scrollY, // avoid scroll offset
//         });
//   const imgData = canvas.toDataURL("image/png");

//   // const pdf = new jsPDF("p", "pt", "a4");
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();

//   const imgWidth = pageWidth - 48; // margins
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 24; // first margin top

//   // ✅ First page
//   pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
//   heightLeft -= pageHeight - 48; // subtract content area

//   // ✅ Add extra pages if needed
//   while (heightLeft > 0) {
//     position = heightLeft - imgHeight + 24;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//   }

//   pdf.save(`Receipt_${invoice?._id?.slice(-6).toUpperCase()}.pdf`);
//   } catch (err){
//       console.error("PDF download failed", err);
//       alert("Failed to generate PDF. Try again.");
//   } finally{
//       setActionLoading(false)
//   }
  
// };





//   if (loading) return <div className="p-6 md:p-10">Loading receipt…</div>;
//   if (!invoice || !user) return <div className="p-6 md:p-10">Not found.</div>;

//   const { clientName, clientEmail, clientPhone, items = [], subtotal, tax, discount, total, createdAt, outstandingBalance } = invoice;
//   const { businessName, email, phone } = user || {};
//   // const { bankName, accountNumber, accountName } = accountDetails || {};

//   return (
//     <div className="p-6 md:p-10 max-w-5xl mx-auto">
//       {/* Actions */}
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[#0046A5] border-[#0046A5] hover:bg-[#0046A5] hover:text-white transition"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>

//         <button onClick={sharePDF} disabled={actionLoading}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
//         variant="secondary">
//           {actionLoading ? "Preparing..." : "Share"}
//           </button>


//         <button
//           onClick={downloadPDF}
//           disabled={actionLoading}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
//         >
//           <Download size={16} /> 
//           {actionLoading ? "Preparing..." : "Download PDF"}
//         </button>
//       </div>

//       {/* Receipt Card (captured for PDF) */}
//       <div
//         ref={captureRef}
//         className="bg-white rounded-2xl shadow-xl overflow-hidden border"
//         style={{
//           borderColor: "#EBEEF2",
//         }}
//       >
//         {/* Header */}
//         <div className="p-8 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center gap-3">


//             {/* <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg font-bold">Q</div>
//             <div>
//               <h2 className="text-2xl font-bold">Receipt</h2>
//               <p className="text-white/90 text-sm">{businessName}</p>
//             </div> */}

//               <div className="flex flex-col">
//                       <div className="flex items-center gap-2">
//                         {userData?.avatar ? (
//                           <img
//                             src={userData.avatar}
//                             alt="Business Logo"
//                             className="w-10 h-10 rounded-md object-cover border border-gray-200"
//                           />
//                         ) : (
//                           <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg font-bold">Q</div>
//                         )}
//                         <h2 className="text-2xl font-bold">Receipt</h2>
//                       </div>
//                       <p className="text-white/90 text-sm">{businessName}</p>
//                     </div>



//           </div>
//           <div className="text-right">
//             <p className="text-sm">Receipt No.</p>
//             <p className="text-lg font-semibold">{invoice._id.slice(-6).toUpperCase()}</p>
//             <p className="text-sm mt-1">
//               {new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//             </p>
//           </div>
//         </div>

//         {/* Business & Client */}
//         <div className="p-8 grid md:grid-cols-2 gap-6">
//           <div className="bg-gray-50 rounded-xl p-4 border">
//             <h3 className="font-semibold text-[#0046A5] mb-2">Issued By</h3>
//             <p className="font-medium">{businessName}</p>
//             <p className="text-sm text-gray-600">{email}</p>
//             {phone && <p className="text-sm text-gray-600">{phone}</p>}
//           </div>
//           <div className="bg-gray-50 rounded-xl p-4 border">
//             <h3 className="font-semibold text-[#0046A5] mb-2">Issued To</h3>
//             <p className="font-medium">{clientName}</p>
//             {clientEmail && <p className="text-sm text-gray-600">{clientEmail}</p>}
//             {clientPhone && <p className="text-sm text-gray-600">{clientPhone}</p>}
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="px-8">
//           <div className="overflow-x-auto rounded-xl border">
//             <table className="min-w-full text-left">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold text-gray-600">Description</th>
//                   <th className="px-4 py-3 font-semibold text-gray-600">Qty</th>
//                   <th className="px-4 py-3 font-semibold text-gray-600">Unit Price</th>
//                   <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((it, idx) => (
//                   <tr key={idx} className="border-t">
//                     <td className="px-4 py-3">{it.description}</td>
//                     <td className="px-4 py-3">{it.quantity}</td>
//                     <td className="px-4 py-3">{formatCurrency(Number(it.unitPrice)).toLocaleString()}</td>
//                     <td className="px-4 py-3 font-medium">{formatCurrency(Number(it.total ?? it.quantity * it.unitPrice)).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="p-8 grid md:grid-cols-2 gap-6">
//           <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
//             <CheckCircle2 className="text-green-600 shrink-0" />
//             <div>
//               <h4 className="font-semibold text-green-700">Payment Confirmed</h4>
//               <p className="text-sm text-green-700/80">
//                 This receipt confirms the payment for the items listed. Thank you for your business!
//               </p>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-4 border">
//             <div className="flex justify-between py-1">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-medium">{formatCurrency(subtotal).toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between py-1">
//               <span className="text-gray-600">Vat</span>
//               <span className="font-medium">{formatCurrency(Number(tax || 0)).toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between py-1">
//               <span className="text-gray-600">Discount</span>
//               <span className="font-medium">{formatCurrency(Number(discount || 0)).toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between py-1">
//               <span className="text-gray-600">Balance</span>
//               <span className="font-medium">{formatCurrency(Number(outstandingBalance || 0)).toLocaleString()}</span>
//             </div>
//             <div className="border-t mt-2 pt-2 flex justify-between">
//               <span className="font-semibold text-[#0046A5]">Grand Total</span>
//               <span className="font-bold text-[#0046A5]">{formatCurrency(total).toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* Bank Details */}
        

//         {/* Footer */}
//         <div className="px-8 pb-8">
//           <p >
//             Generated by QuickInvoice NG — {new Date().getFullYear()}
//           </p>
//           <p>www.quickinvoiceng.com</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

const API = "https://quickinvoice-backend-1.onrender.com"; // adjust as needed

export default function ReceiptDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const captureRef = useRef(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { code } = useCurrency();

  // fetch invoice + user on mount
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

  // format currency helper
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en", { style: "currency", currency: code || "₦" }).format(Number(amount || 0));

  if (loading) return <div className="p-6 md:p-10">Loading receipt…</div>;
  if (!invoice || !user) return <div className="p-6 md:p-10">Not found.</div>;

  // destructure invoice fields (safe defaults)
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
  const { businessName = "", email = "", phone = "" } = user;

  // ---------- PDF / SHARE helpers ----------
  // We will render the capture element at a fixed width that corresponds to A4 proportions to ensure predictable PDF capture.
  // The function below captures and scales the image so that it fits exactly into one A4 page (with margins).
  const captureAndMakeSinglePagePDF = async ({ share = false } = {}) => {
    if (!captureRef.current) return;
    setActionLoading(true);

    try {
      // usage logging (preserve your existing behaviour)
      const logRes = await fetch(`${API}/api/invoices/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ type: "receipt" }),
      });
      const logData = await logRes.json();
      if (!logRes.ok) {
        alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
        setActionLoading(false);
        return;
      }

      // Capture the node. We use a scale of 2 for crispness.
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // create A4 PDF in mm
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth(); // mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // mm

      // margins (mm)
      const margin = 12;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      // determine image dimensions in mm preserving aspect ratio
      // imgWidthMm = usableWidth, imgHeightMm = (canvas.height / canvas.width) * imgWidthMm
      let imgWidthMm = usableWidth;
      let imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      // if image is taller than usableHeight, scale down to fit single page
      if (imgHeightMm > usableHeight) {
        const scaleFactor = usableHeight / imgHeightMm;
        imgHeightMm = imgHeightMm * scaleFactor;
        imgWidthMm = imgWidthMm * scaleFactor;
      }

      // center horizontally (x), top margin (y)
      const x = (pageWidth - imgWidthMm) / 2;
      const y = margin + (usableHeight - imgHeightMm) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidthMm, imgHeightMm);

      // share or download
      const pdfBlob = pdf.output("blob");
      const fileName = `Receipt-${invoice._id.slice(-6).toUpperCase()}.pdf`;
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      if (share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QuickInvoice Receipt",
          text: `Receipt #${invoice._id.slice(-6).toUpperCase()}`,
          files: [file],
        });
      } else {
        // fallback to download
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const sharePDF = () => captureAndMakeSinglePagePDF({ share: true });
  const downloadPDF = () => captureAndMakeSinglePagePDF({ share: false });

  // ---------- Render: Stripe-style, ultra-clean single-page layout ----------
  // We force the capture container to a fixed width close to A4 proportions in px so html2canvas output is predictable.
  // 794px is approx A4 width at 96dpi: using this produces reliable capture -> the logic above scales to exact A4 mm on pdf.
  const captureStyle = {
    width: 794, // fixed px width for capture
    maxWidth: "100%",
    margin: "0 auto",
    background: "#ffffff",
    color: "#111827",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    fontSize: 12,
    lineHeight: 1.4,
    padding: "28px",
    boxSizing: "border-box",
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">Receipt</h1>
            <p className="text-sm text-gray-600 mt-1">{businessName || "QuickInvoice NG"}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[#0046A5] border-[#0046A5] hover:bg-[#0046A5] hover:text-white transition"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              onClick={sharePDF}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
            >
              {actionLoading ? "Preparing..." : "Share"}
            </button>

            <button
              onClick={downloadPDF}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0046A5] text-white hover:opacity-95 transition"
            >
              <Download size={16} />
              {actionLoading ? "Preparing..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Capture area: fixed width */}
        <div ref={captureRef} style={captureStyle} className="mx-auto shadow-none">
          {/* Top header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{businessName || "QuickInvoice NG"}</div>
              {email && <div style={{ color: "#6b7280", fontSize: 12 }}>{email}</div>}
              {phone && <div style={{ color: "#6b7280", fontSize: 12 }}>{phone}</div>}
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Receipt</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{invoice._id.slice(-8).toUpperCase()}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #EEF2F7", margin: "18px 0" }} />

          {/* From / To */}
          <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Billed By</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{businessName || "-"}</div>
              {email && <div style={{ color: "#6b7280", fontSize: 12 }}>{email}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Billed To</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{clientName || "-"}</div>
              {clientEmail && <div style={{ color: "#6b7280", fontSize: 12 }}>{clientEmail}</div>}
              {clientPhone && <div style={{ color: "#6b7280", fontSize: 12 }}>{clientPhone}</div>}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ width: "100%", overflow: "hidden", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Description</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Unit</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: "#6b7280", fontWeight: 700 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 8px", verticalAlign: "top", color: "#0f172a" }}>{it.description}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right" }}>{it.quantity}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right" }}>{formatCurrency(it.unitPrice)}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 700 }}>{formatCurrency(it.total ?? it.quantity * it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <div style={{ width: 320 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
                <div>Subtotal</div>
                <div>{formatCurrency(subtotal)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
                <div>VAT</div>
                <div>{formatCurrency(tax)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
                <div>Discount</div>
                <div>{formatCurrency(discount)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "#6b7280" }}>
                <div>Balance</div>
                <div>{formatCurrency(outstandingBalance)}</div>
              </div>
              <div style={{ borderTop: "1px dashed #E6EEF6", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <div>Total</div>
                <div>{formatCurrency(total)}</div>
              </div>
            </div>
          </div>

          {/* Footer line */}
          <hr style={{ border: "none", borderTop: "1px solid #EEF2F7", margin: "22px 0 12px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6b7280", fontSize: 12 }}>
            <div>Generated by QuickInvoice NG • www.quickinvoiceng.com</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 className="text-green-600" />
              <div style={{ fontWeight: 700, color: "#10B981" }}>Payment Confirmed</div>
            </div>
          </div>
        </div>

        {/* small spacer */}
        <div style={{ height: 18 }} />
      </div>
    </div>
  );
}
