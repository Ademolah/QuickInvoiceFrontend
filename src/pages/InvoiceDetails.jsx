

// // src/pages/InvoiceDetails.jsx
// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   ArrowLeft,
//   Download,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";
// import { useCurrency } from "../context/CurrencyContext";
// import toast from "react-hot-toast"
// // import api from "../utils/api";






// const API_BASE = "https://quickinvoice-backend-1.onrender.com"


// // const currencyFmt = (amt = 0) =>
// //   `₦${Number(amt || 0).toLocaleString("en-NG")}`;


// export default function InvoiceDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const invoiceRef = useRef(null);

//   const [invoice, setInvoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [bankName, setBankName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [accountName, setAccountName] = useState("");

//   const token = useMemo(() => localStorage.getItem("token"), []);


  
  
//   const { formatCurrency } = useCurrency()



//     const AccountDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE}/api/users/account-details`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

      
//       setBankName(res.data.accountDetails.bankName || '');
//       setAccountNumber(res.data.accountDetails.accountNumber || '');
//       setAccountName(res.data.accountDetails.accountName || '');
//     } catch (err) {
//       console.error('Error fetching account details:', err);
//     }
//   };

//   useEffect(() => {
//     AccountDetails(); // Call it on component mount
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         if (!token) {
//           setError("Authentication required");
//           return;
//         }

//         const [invRes, userRes] = await Promise.all([
//           axios.get(`${API_BASE}/api/invoices/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_BASE}/api/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setInvoice(invRes.data);
//         setUser(userRes.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load invoice.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [id, token]);



// // const sharePDF = async () => {
// //   if (!invoiceRef.current) return;
// //   setActionLoading(true);

// //   try {
// //     // ✅ Log usage
// //     const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //       },
// //       body: JSON.stringify({ type: "invoice" }),
// //     });

// //     const logData = await logRes.json();
// //     console.log("Usage log response:", logData);

// //     if (!logRes.ok) {
// //       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
// //       setActionLoading(false);
// //       return;
// //     }

// //     // ✅ Capture invoice as before
// //     const canvas = await html2canvas(invoiceRef.current, {
// //       scale: 2,
// //       useCORS: true,
// //       allowTaint: true,
// //       scrollY: -window.scrollY,
// //     });

// //     const imgData = canvas.toDataURL("image/png");
// //     const pdf = new jsPDF("p", "mm", "a4");
// //     const pageWidth = pdf.internal.pageSize.getWidth();
// //     const pageHeight = pdf.internal.pageSize.getHeight();

// //     const margin = 12;
// //     const imgWidth = pageWidth - margin * 2;
// //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

// //     let position = margin;
// //     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

// //     let heightLeft = imgHeight - (pageHeight - margin * 2);
// //     while (heightLeft > -1) {
// //       pdf.addPage();
// //       position = margin - (imgHeight - heightLeft);
// //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// //       heightLeft -= pageHeight - margin * 2;
// //     }

// //     // ✅ Convert PDF to blob & file
// //     const pdfBlob = pdf.output("blob");
// //     const fileName = `Invoice-${id}.pdf`;
// //     const file = new File([pdfBlob], fileName, { type: "application/pdf" });

// //     // ✅ Try Web Share API first
// //     if (navigator.canShare && navigator.canShare({ files: [file] })) {
// //       await navigator.share({
// //         title: "QuickInvoice Invoice",
// //         text: `Here is your invoice #${id}`,
// //         files: [file],
// //       });
// //     } else {
// //       // 🚨 Fallback: Download PDF
// //       const pdfUrl = URL.createObjectURL(pdfBlob);
// //       const link = document.createElement("a");
// //       link.href = pdfUrl;
// //       link.download = fileName;
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       // Optional: WhatsApp / Email fallback
// //       // window.open(`https://wa.me/?text=Here’s your invoice: ${pdfUrl}`, "_blank");
// //       // window.location.href = `mailto:?subject=Invoice&body=Download your invoice here: ${pdfUrl}`;

// //       alert("Sharing not supported on this device. The invoice has been downloaded instead.");
// //     }
// //   } catch (err) {
// //     console.error("PDF share failed", err);
// //     alert("Failed to share PDF. Try again.");
// //   } finally {
// //     setActionLoading(false);
// //   }
// // };

// // const sharePDF = async () => {
// //   if (!invoiceRef.current) return;
// //   setActionLoading(true);
// //   try {
// //     // LOG USAGE
// //     const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //       },
// //       body: JSON.stringify({ type: "invoice" }),
// //     });
// //     const logData = await logRes.json();
// //     if (!logRes.ok) {
// //       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
// //       setActionLoading(false);
// //       return;
// //     }
// //     const width = invoiceRef.current.scrollWidth;
// //     const canvas = await html2canvas(invoiceRef.current, {
// //       scale: 3,
// //       useCORS: true,
// //       scrollY: 0,
// //       width: width,
// //       windowWidth: width,
// //     });
// //     const imgData = canvas.toDataURL("image/png");
// //     const pdf = new jsPDF("p", "mm", "a4");
// //     const pageWidth = pdf.internal.pageSize.getWidth();
// //     const imgProps = pdf.getImageProperties(imgData);
// //     const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
// //     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
// //     const pdfBlob = pdf.output("blob");
// //     const file = new File([pdfBlob], `Invoice-${id}.pdf`, {
// //       type: "application/pdf",
// //     });
// //     if (navigator.canShare && navigator.canShare({ files: [file] })) {
// //       await navigator.share({
// //         title: "QuickInvoice NG",
// //         text: `Invoice #${id}`,
// //         files: [file],
// //       });
// //     } else {
// //       const url = URL.createObjectURL(pdfBlob);
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.download = `Invoice-${id}.pdf`;
// //       link.click();
// //       alert("Sharing not supported. PDF downloaded instead.");
// //     }
// //   } catch (err) {
// //     console.error("Share error:", err);
// //     alert("Failed to share PDF.");
// //   } finally {
// //     setActionLoading(false);
// //   }
// // };
  
// //share as PNG

// const sharePNG = async () => {
//   if (!invoiceRef.current) return;

//   setActionLoading(true);

//   try {
//     // 1. LOG USAGE
//     const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ type: "invoice" }),
//     });
    
//     const logData = await logRes.json();
//     if (!logRes.ok) {
//       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//       setActionLoading(false);
//       return;
//     }

//     // 2. Generate Canvas from HTML
//     const width = invoiceRef.current.scrollWidth;
//     const canvas = await html2canvas(invoiceRef.current, {
//       scale: 2, // 2 is usually sufficient for mobile quality and smaller size
//       useCORS: true,
//       scrollY: 0,
//       width: width,
//       windowWidth: width,
//       backgroundColor: "#ffffff", // Ensure white background
//     });

//     // 3. Convert Canvas to Blob
//     const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
    
//     // 4. Create File Object
//     const file = new File([blob], `Invoice-${id}.png`, {
//       type: "image/png",
//     });

//     // 5. Use Native Share API
//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       await navigator.share({
//         files: [file],
//         title: `Invoice #${id}`,
//         text: `QuickInvoice - Invoice #${id}`,
//       });
//     } else {
//       // Fallback: Download the PNG
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Invoice-${id}.png`;
//       link.click();
//       URL.revokeObjectURL(url); // Clean up
//       alert("Sharing not supported on this browser. Invoice downloaded as PNG instead.");
//     }
//   } catch (err) {
//     console.error("Share error:", err);
//     alert("Failed to share invoice.");
//   } finally {
//     setActionLoading(false);
//   }
// };


// // const downloadPDF = async () => {

// //     if (!invoiceRef.current) return;
// //     setActionLoading(true);
// //     try {


        
// //         const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`, // ensure token
// //         },
// //         body: JSON.stringify({ type: "invoice" }),
// //         });

// //         const logData = await logRes.json(); // ✅ now guaranteed JSON
// //         console.log("Usage log response:", logData);

// //         if (!logRes.ok) {
// //         alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
// //         return; // 🚨 Stop download here
// //         }



// //       // Increase scale to keep crispness
// //       const canvas = await html2canvas(invoiceRef.current, {
// //         scale: 2,
// //         useCORS: true,
// //         allowTaint: true,
// //         scrollY: -window.scrollY, // avoid scroll offset
// //       });

// //       const imgData = canvas.toDataURL("image/png");
// //       const pdf = new jsPDF("p", "mm", "a4");
// //       const pageWidth = pdf.internal.pageSize.getWidth();
// //       const pageHeight = pdf.internal.pageSize.getHeight();

// //       // convert px -> mm: width_mm = px * 25.4 / dpi. html2canvas default 96dpi; but we used scale to 2 for crispness.
// //       // simpler approach: fit image to pageWidth with margin
// //       const margin = 12; // mm
// //       const imgWidth = pageWidth - margin * 2;
// //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

// //       let position = margin;
// //       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

// //       // If content larger than one page, add pages
// //       let heightLeft = imgHeight - (pageHeight - margin * 2);
// //       while (heightLeft > -1) {
// //         pdf.addPage();
// //         position = margin - (imgHeight - heightLeft);
// //         pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
// //         heightLeft -= pageHeight - margin * 2;
// //       }

// //       pdf.save(`Invoice-${id}.pdf`);
// //     } catch (err) {
// //       console.error("PDF download failed", err);
// //       alert("Failed to generate PDF. Try again.");
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// const downloadPDF = async () => {
//   if (!invoiceRef.current) return;
//   setActionLoading(true);
//   try {
//     // LOG USAGE
//     const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ type: "invoice" }),
//     });
//     const logData = await logRes.json();
//     if (!logRes.ok) {
//       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//       setActionLoading(false);
//       return;
//     }
//     // CAPTURE INVOICE PERFECTLY
//     const width = invoiceRef.current.scrollWidth;
//     const canvas = await html2canvas(invoiceRef.current, {
//       scale: 3,
//       useCORS: true,
//       scrollY: 0,
//       width: width,
//       windowWidth: width,
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
//     // ALWAYS SINGLE PAGE
//     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
//     pdf.save(`Invoice-${id}.pdf`);
//   } catch (error) {
//     console.error("PDF generation error:", error);
//     alert("Failed to generate PDF.");
//   } finally {
//     setActionLoading(false);
//   }
// };  

//   const handleMarkPaid = async () => {
//     if (!window.confirm("Mark invoice as paid?")) return;
//     try {
//       setActionLoading(true);
//       const res = await axios.patch(
//         `${API_BASE}/api/invoices/${id}/pay`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setInvoice(res.data);
//       // ✅ Check and display low stock or missing product warnings
//     if (res.data.lowStockWarnings && res.data.lowStockWarnings.length > 0) {
//       alert(
//         "⚠️ Inventory Notice:\n\n" +
//         res.data.lowStockWarnings.join("\n")
//       );
//       } else {
//       toast.success("Receipt generated successfully!");
//     }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to mark as paid");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   //fetch user for avatar
//   const [userData, setUserData] = useState(null);
//     useEffect(() => {
//       const fetchUserData = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) return;
//           const userRes = await axios.get(`${API_BASE}/api/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setUserData(userRes.data);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       };
//       fetchUserData();
//     }, []);

//   // const handleDelete = async () => {
//   //   if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
//   //   try {
//   //     setActionLoading(true);
//   //     await axios.delete(`${API_BASE}/api/invoices/${id}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     navigate("/invoices");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert(err.response?.data?.message || "Failed to delete invoice");
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
//         <Loader2 className="w-10 h-10 text-[#0046A5] animate-spin" />
//       </div>
//     );
//   }

//   if (error || !invoice) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
//           <p className="text-red-600 font-semibold mb-4">{error || "Invoice not found"}</p>
//           <button
//             onClick={() => navigate("/invoices")}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0046A5] text-white"
//           >
//             <ArrowLeft size={16} />
//             Back to Invoices
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // invoice fields based on your model: items: [{description, quantity, unitPrice, total}], subtotal, tax, discount, total, status, dueDate, notes
//   const {
//     clientName,
//     clientEmail,
//     clientPhone,
//     items = [],
//     subtotal,
//     tax,
//     discount,
//     total,
//     outstandingBalance,
//     status,
//     createdAt,
//     dueDate,
//     notes,
//   } = invoice;

//   // const accountDetails = user?.accountDetails || {};
  
  

//   const statusClass =
//     status === "paid"
//       ? "bg-green-100 text-green-800"
//       : status === "overdue"
//       ? "bg-red-100 text-red-800"
//       : status === "sent"
//       ? "bg-blue-100 text-blue-800"
//       : "bg-gray-100 text-gray-800";

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header with actions */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold text-[#0046A5]">Invoice Details</h1>
//             <p className="text-sm text-gray-600 mt-1">{user?.businessName || "Your Business"}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             {status && (
//               <span className={`px-3 py-2 rounded-full font-semibold ${statusClass}`}>
//                 {status.toUpperCase()}
//               </span>
//             )}

//             {status !== "paid" && (
//               <button
//                 onClick={handleMarkPaid}
//                 disabled={actionLoading}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B86B] text-white hover:brightness-105 disabled:opacity-60"
//               >
//                 <CheckCircle2 size={18} />
//                 {actionLoading ? "Processing..." : "Mark as Paid"}
//               </button>
//             )}

//             <button onClick={sharePNG} disabled={actionLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0028AE] to-[#00A6FA] hover:opacity-90 transition"
//             variant="secondary">
//               {actionLoading ? "Preparing..." : "Share"}
//               </button>

//             <button
//               onClick={downloadPDF}
//               disabled={actionLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white hover:opacity-95 disabled:opacity-60"
//             >
//               <Download size={18} />
//               {actionLoading ? "Preparing..." : "Download PDF"}
//             </button>

//             {/* <button
//               onClick={() => navigate(`/invoices/${id}/edit`)}
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200"
//             >
//               <Edit3 size={16} />
//               Edit
//             </button> */}

//             {/* <button
//               onClick={handleDelete}
//               disabled={actionLoading}
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
//             >
//               <Trash2 size={16} />
//               Delete
//             </button> */}
//           </div>
//         </div>

//         {/* Invoice card that will be captured for PDF */}
//         {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden" ref={invoiceRef}> */}
//         <div
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//           ref={invoiceRef}
//           style={{
//             width: "794px",           // A4 width at 96dpi
//             margin: "0 auto",
//             padding: 0,
//           }}
//         >
//           {/* Premium gradient header */}
//           <div className="p-6 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex items-center gap-4">

//                   {/* User image */}

//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-2">
//                         {userData?.avatar ? (
//                           <img
//                             src={userData.avatar}
//                             alt="Business Logo"
//                             className="w-10 h-10 rounded-md object-cover border border-gray-200"
//                           />
//                         ) : (
//                           <div className="flex justify-center mb-6">
//                           <img
//                             src="/quicksocial.jpg"   // image in public/
//                             alt="QuickInvoice"
//                             className="h-14 w-auto object-contain"
//                           />
//                         </div>
//                         )}
//                         <h2 className="text-2xl md:text-3xl font-extrabold">Invoice</h2>
//                       </div>
//                       <p className="text-sm opacity-90 font-semibold mt-1">
//                         {user?.businessName ? user?.businessName : "QuickInvoice NG"}
//                       </p>
//                     </div>

//               </div>

//               <div className="text-right">
//                 <p className="text-sm opacity-90">Invoice ID</p>
//                 <p className="text-xl font-semibold">{String(id).slice(-8).toUpperCase()}</p>
//                 <p className="text-sm mt-1">{new Date(createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 md:p-8">
//             {/* From / To */}
//             <div className="grid md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <h3 className="text-sm font-semibold text-[#0046A5]">From</h3>
//                 <p className="font-bold text-gray-800">{user?.businessName || "-"}</p>
//                 {user?.email && <p className="text-sm text-gray-600">{user.name}</p>}
//                 {user?.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-[#0046A5]">Billed To</h3>
//                 <p className="font-semibold text-gray-800">{clientName || "-"}</p>
//                 {clientEmail && <p className="text-sm text-gray-600">{clientEmail}</p>}
//                 {clientPhone && <p className="text-sm text-gray-600">{clientPhone}</p>}
//                 <div className="mt-2 text-sm">
//                   <p className="text-gray-500">Due Date</p>
//                   <p className="font-medium">{dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Items table */}
//             <div className="overflow-x-auto rounded-xl border">
//               <table className="min-w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-4 py-3 text-left font-medium text-gray-600 w-[45%]">
//                       Description
//                     </th>
//                     <th className="px-4 py-3 text-right font-medium text-gray-600 w-[15%]">
//                       Qty
//                     </th>
//                     <th className="px-4 py-3 text-right font-medium text-gray-600 w-[20%]">
//                       Unit Price
//                     </th>
//                     <th className="px-4 py-3 text-right font-medium text-gray-600 w-[20%]">
//                       Total
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((it, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-b last:border-b-0 hover:bg-gray-50"
//                     >
//                       {/* Description */}
//                       <td className="px-4 py-4 text-gray-800 break-words whitespace-normal">
//                         {it.description}
//                       </td>
//                       {/* Quantity */}
//                       <td className="px-4 py-4 text-right text-gray-800 tabular-nums">
//                         {it.quantity}
//                       </td>
//                       {/* Unit Price */}
//                       <td className="px-4 py-4 text-right text-gray-800 tabular-nums">
//                         {formatCurrency(it.unitPrice)}
//                       </td>
//                       {/* Total */}
//                       <td className="px-4 py-4 text-right font-medium text-gray-900 tabular-nums">
//                         {formatCurrency(it.total ?? it.quantity * it.unitPrice)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Notes */}
//             {notes && (
//               <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
//                 <h4 className="text-sm text-gray-600 mb-1">Notes</h4>
//                 <p className="text-sm text-gray-800">{notes}</p>
//               </div>
//             )}

//             {/* Summary & Account */}
//             <div className="mt-6 grid md:grid-cols-2 gap-6">
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
//                 <h4 className="text-sm text-gray-600 mb-2">Payment Info</h4>
//                 <p className="text-sm text-gray-700">Bank: {bankName || "-"}</p>
//                 <p className="text-sm text-gray-700">Account Number: {accountNumber || "-"}</p>
//                 <p className="text-sm text-gray-700">Account Name: {accountName || "-"}</p>
//               </div>

//               <div className="bg-white p-4 rounded-lg border border-gray-100 self-start">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-gray-600">Subtotal</span>
//                   <span className="font-medium">{formatCurrency(subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-gray-600">VAT</span>
//                   <span className="font-medium">{formatCurrency(tax)}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-gray-600">Discount</span>
//                   <span className="font-medium">{formatCurrency(discount)}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-gray-600">Balance</span>
//                   <span className="font-medium">{formatCurrency(outstandingBalance)}</span>
//                 </div>

//                 <div className="h-px bg-gray-200 my-2" />

//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-bold text-[#0046A5]">Total</span>
//                   <span className="text-xl font-extrabold text-[#0046A5]">{formatCurrency(total)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-8 text-center text-sm text-gray-500">
//               <p >
//                 Powered by QuickInvoice • {new Date().getFullYear()}
//               </p>
//               <p >
//                 www.quickinvoiceng.com
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Back to Dashboard button */}
      
//       {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
//         >
//           Q
//         </button>
//     </div>
//   );
// }

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

        setInvoice(invRes.data);
        setUser(userRes.data);
        setUserData(userRes.data); // For avatar
        setBankName(accRes.data.accountDetails?.bankName || '');
        setAccountNumber(accRes.data.accountDetails?.accountNumber || '');
        setAccountName(accRes.data.accountDetails?.accountName || '');
      } catch (err) {
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
      toast.error(data.message || "Usage limit exceeded. Upgrade to Pro.");
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
          text: `Invoice #${id.slice(-8).toUpperCase()}`,
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
      toast.error("Sharing failed");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    setActionLoading(true);
    try {
      const canProceed = await logUsage();
      if (!canProceed) return;

      const canvas = await html2canvas(invoiceRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pageWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`Invoice-${id.slice(-6)}.pdf`);
      toast.success("PDF Saved");
    } catch (err) {
      toast.error("PDF failed");
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
      toast.error("Failed to update status");
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
              <p className="text-[10px] font-bold text-slate-400">
                Powered by QuickInvoice • {new Date().getFullYear()} • <span className="text-[#0028AE]">www.quickinvoiceng.com</span>
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
