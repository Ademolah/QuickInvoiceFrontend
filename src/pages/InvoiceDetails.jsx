

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Trash2, CheckCircle, Edit } from "lucide-react";



// const InvoiceDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({});
//   const [businessName, setBusinessName] = useState("");
//   const [bankName, setBankName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [accountName, setAccountName] = useState("");



// // Fetch account details
//   const AccountDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:4000/api/users/account-details', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log(res);
      
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



//   const token = localStorage.getItem("token");


  

//   useEffect(() => {
//     fetchInvoice();
//   }, []);

  

//   const fetchInvoice = async () => {
//     try {
//       // Fetch invoice
//       const res = await axios.get(`http://localhost:4000/api/invoices/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoice(res.data);
//       setForm(res.data);

//       // Fetch business name from user
//       const userRes = await axios.get(`http://localhost:4000/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setBusinessName(userRes.data.businessName || "");
//       setBankName(userRes.data.accountDetails.bankName || "");
//       setAccountNumber(userRes.data.accountDetails.accountNumber || "");
//       setAccountName(userRes.data.accountDetails.accountName || "");

      
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleDownloadPDF = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(
//       `http://localhost:4000/api/invoices/${invoice._id}/pdf`,
//       { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
//     );

//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `invoice-${invoice._id}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (err) {
//     console.error(err);
//     alert('Failed to generate PDF.');
//   }
// };



//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...form.items];
//     updatedItems[index][field] = field === "quantity" || field === "unitPrice" ? Number(value) : value;
//     updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
//     const subtotal = updatedItems.reduce((s, it) => s + it.total, 0);
//     const total = Math.max(0, subtotal + form.tax - form.discount);
//     setForm(prev => ({ ...prev, items: updatedItems, subtotal, total }));
//   };

//   const markPaid = async () => {
//     try {
//       const res = await axios.patch(`http://localhost:4000/api/invoices/${id}/pay`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoice(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteInvoice = async () => {
//     if (!window.confirm("Are you sure you want to delete this invoice?")) return;
//     try {
//       await axios.delete(`http://localhost:4000/api/invoices/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       navigate("/invoices");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const saveInvoice = async () => {
//     try {
//       const res = await axios.put(`http://localhost:4000/api/invoices/${id}`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setInvoice(res.data);
//       setEditing(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="text-center mt-20 text-lg text-gray-500">Loading...</div>;
//   if (!invoice) return <div className="text-center mt-20 text-lg text-red-500">Invoice not found</div>;

//   return (
//     <div className="p-6 md:p-10">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-[#0046A5]">Invoice Details</h1>
//           <p className="text-gray-500 mt-1">Business: {businessName || "—"}</p>
//         </div>
//         <div className="flex gap-2">
//           {invoice.status !== "paid" && (
//             <button onClick={markPaid} className="bg-[#00B86B] hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
//               <CheckCircle size={18} /> Mark Paid
//             </button>
//           )}
//           <button onClick={deleteInvoice} className="bg-red-500 hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
//             <Trash2 size={18} /> Delete
//           </button>
//           <button onClick={() => setEditing(!editing)} className="bg-[#0046A5] hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
//             <Edit size={18} /> {editing ? "Cancel" : "Edit"}
//           </button>
//         </div>
//       </div>

//       {/* Invoice Info */}
//       <div className="bg-white rounded-xl shadow p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-gray-600 font-semibold">Client Name</label>
//             {editing ? (
//               <input
//                 type="text"
//                 value={form.clientName}
//                 onChange={e => handleInputChange("clientName", e.target.value)}
//                 className="mt-1 w-full border rounded px-3 py-2"
//               />
//             ) : (
//               <p className="mt-1">{invoice.clientName}</p>
//             )}
//           </div>
//           <div>
//             <label className="text-gray-600 font-semibold">Client Email</label>
//             {editing ? (
//               <input
//                 type="email"
//                 value={form.clientEmail || ""}
//                 onChange={e => handleInputChange("clientEmail", e.target.value)}
//                 className="mt-1 w-full border rounded px-3 py-2"
//               />
//             ) : (
//               <p className="mt-1">{invoice.clientEmail || "-"}</p>
//             )}
//           </div>
//           <div>
//             <label className="text-gray-600 font-semibold">Client Phone</label>
//             {editing ? (
//               <input
//                 type="text"
//                 value={form.clientPhone || ""}
//                 onChange={e => handleInputChange("clientPhone", e.target.value)}
//                 className="mt-1 w-full border rounded px-3 py-2"
//               />
//             ) : (
//               <p className="mt-1">{invoice.clientPhone || "-"}</p>
//             )}
//           </div>
//           <div>
//             <label className="text-gray-600 font-semibold">Due Date</label>
//             {editing ? (
//               <input
//                 type="date"
//                 value={form.dueDate ? new Date(form.dueDate).toISOString().split("T")[0] : ""}
//                 onChange={e => handleInputChange("dueDate", e.target.value)}
//                 className="mt-1 w-full border rounded px-3 py-2"
//               />
//             ) : (
//               <p className="mt-1">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Items */}
//       <div className="bg-white rounded-xl shadow p-6 mb-6">
//         <h2 className="text-xl font-bold text-[#0046A5] mb-4">Items</h2>
//         {form.items.map((item, idx) => (
//           <div key={idx} className="grid grid-cols-4 gap-4 items-center mb-3">
//             {editing ? (
//               <>
//                 <input
//                   type="text"
//                   value={item.description}
//                   onChange={e => handleItemChange(idx, "description", e.target.value)}
//                   className="border rounded px-2 py-1"
//                 />
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={e => handleItemChange(idx, "quantity", e.target.value)}
//                   className="border rounded px-2 py-1"
//                   min={1}
//                 />
//                 <input
//                   type="number"
//                   value={item.unitPrice}
//                   onChange={e => handleItemChange(idx, "unitPrice", e.target.value)}
//                   className="border rounded px-2 py-1"
//                   min={0}
//                 />
//                 <p className="font-semibold">{item.total.toFixed(2)}</p>
//               </>
//             ) : (
//               <>
//                 <p>{item.description}</p>
//                 <p>{item.quantity}</p>
//                 <p>{item.unitPrice}</p>
//                 <p className="font-semibold">{item.total.toFixed(2)}</p>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
      

//       {/* Summary & Notes */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex justify-end gap-6 mb-4">
//           <p className="font-semibold">Subtotal: {invoice.subtotal.toFixed(2)}</p>
//           <p className="font-semibold">Tax: {invoice.tax.toFixed(2)}</p>
//           <p className="font-semibold">Discount: {invoice.discount.toFixed(2)}</p>
//           <p className="font-bold text-[#0046A5]">Total: {invoice.total.toFixed(2)}</p>
//         </div>
//         <div>
//           <label className="text-gray-600 font-semibold">Notes:</label>
//           {editing ? (
//             <textarea
//               value={form.notes || ""}
//               onChange={e => handleInputChange("notes", e.target.value)}
//               className="mt-1 w-full border rounded px-3 py-2"
//             />
//           ) : (
//             <p className="mt-1">{invoice.notes || "-"}</p>
//           )}
//         </div>

//         {/* Account details */}
//         <div className="bg-gray-50 p-4 rounded shadow mt-4">
//             <h3 className="font-semibold text-lg mb-2">Account Details</h3>
//             <p>Bank: {bankName}</p>
//             <p>Account Number: {accountNumber}</p>
//             <p>Account Name: {accountName}</p>
//         </div>

//         {/* Pdf button */}
//         <button
//         onClick={handleDownloadPDF}
//         className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded shadow transition-all duration-300"
//         >
//         Download PDF
//         </button>
//         {editing && (
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={saveInvoice}
//               className="bg-[#0046A5] hover:opacity-90 text-white px-6 py-2 rounded shadow font-semibold"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetails;

// src/pages/InvoiceDetails.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";

/**
 * Premium InvoiceDetails.jsx
 * - Fetches invoice and user
 * - Renders premium invoice
 * - Downloads pixel-perfect PDF with html2canvas + jsPDF
 */

const API_BASE = "http://localhost:4000";
const BRAND_BLUE = "#0046A5";
const BRAND_GREEN = "#00B86B";

const currencyFmt = (amt = 0) =>
  `₦${Number(amt || 0).toLocaleString("en-NG")}`;

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

    const AccountDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/users/account-details', {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      setBankName(res.data.accountDetails.bankName || '');
      setAccountNumber(res.data.accountDetails.accountNumber || '');
      setAccountName(res.data.accountDetails.accountName || '');
    } catch (err) {
      console.error('Error fetching account details:', err);
    }
  };

  useEffect(() => {
    AccountDetails(); // Call it on component mount
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const [invRes, userRes] = await Promise.all([
          axios.get(`${API_BASE}/api/invoices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setInvoice(invRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token]);

  

  const downloadPDF = async () => {

    if (!invoiceRef.current) return;
    setActionLoading(true);
    try {


        // 🔑 Step 1: Check logs/limits before generating
        // const token = localStorage.getItem("token");
        // const logRes = await fetch("http://localhost:4000/api/invoices/log", {
        // method: "POST",
        // headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        // },
        // body: JSON.stringify({ type: "invoice" }), // or "receipt"
        // });

        // const logData = await logRes.json();

        // if (!logData.success) {
        // alert(logData.message); // e.g., "Upgrade to Pro..."
        // setActionLoading(false);
        // return; // 🚫 Stop here if limit reached
        // }
        const logRes = await fetch("http://localhost:4000/api/invoices/log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ensure token
        },
        body: JSON.stringify({ type: "invoice" }),
        });

        const logData = await logRes.json(); // ✅ now guaranteed JSON
        console.log("Usage log response:", logData);

        if (!logRes.ok) {
        alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
        return; // 🚨 Stop download here
        }



      // Increase scale to keep crispness
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY, // avoid scroll offset
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // convert px -> mm: width_mm = px * 25.4 / dpi. html2canvas default 96dpi; but we used scale to 2 for crispness.
      // simpler approach: fit image to pageWidth with margin
      const margin = 12; // mm
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

      // If content larger than one page, add pages
      let heightLeft = imgHeight - (pageHeight - margin * 2);
      while (heightLeft > -1) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(`Invoice-${id}.pdf`);
    } catch (err) {
      console.error("PDF download failed", err);
      alert("Failed to generate PDF. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  

  const handleMarkPaid = async () => {
    if (!window.confirm("Mark invoice as paid?")) return;
    try {
      setActionLoading(true);
      const res = await axios.patch(
        `${API_BASE}/api/invoices/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark as paid");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      setActionLoading(true);
      await axios.delete(`${API_BASE}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/invoices");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete invoice");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-10 h-10 text-[#0046A5] animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">{error || "Invoice not found"}</p>
          <button
            onClick={() => navigate("/invoices")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0046A5] text-white"
          >
            <ArrowLeft size={16} />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // invoice fields based on your model: items: [{description, quantity, unitPrice, total}], subtotal, tax, discount, total, status, dueDate, notes
  const {
    clientName,
    clientEmail,
    clientPhone,
    items = [],
    subtotal,
    tax,
    discount,
    total,
    status,
    createdAt,
    dueDate,
    notes,
  } = invoice;

  const accountDetails = user?.accountDetails || {};
  
  

  const statusClass =
    status === "paid"
      ? "bg-green-100 text-green-800"
      : status === "overdue"
      ? "bg-red-100 text-red-800"
      : status === "sent"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0046A5]">Invoice Details</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.businessName || "Your Business"}</p>
          </div>

          <div className="flex items-center gap-3">
            {status && (
              <span className={`px-3 py-2 rounded-full font-semibold ${statusClass}`}>
                {status.toUpperCase()}
              </span>
            )}

            {status !== "paid" && (
              <button
                onClick={handleMarkPaid}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B86B] text-white hover:brightness-105 disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                {actionLoading ? "Processing..." : "Mark as Paid"}
              </button>
            )}

            <button
              onClick={downloadPDF}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white hover:opacity-95 disabled:opacity-60"
            >
              <Download size={18} />
              {actionLoading ? "Preparing..." : "Download PDF"}
            </button>

            <button
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200"
            >
              <Edit3 size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Invoice card that will be captured for PDF */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" ref={invoiceRef}>
          {/* Premium gradient header */}
          <div className="p-6 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-md font-bold">Q</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Invoice</h2>
                  <p className="text-sm opacity-90 font-semibold">{user?.businessName ? user?.businessName : "QuickInvoice NG"}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm opacity-90">Invoice</p>
                <p className="text-xl font-semibold">{String(id).slice(-8).toUpperCase()}</p>
                <p className="text-sm mt-1">{new Date(createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* From / To */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-[#0046A5]">From</h3>
                <p className="font-bold text-gray-800">{user?.businessName || "-"}</p>
                {user?.email && <p className="text-sm text-gray-600">{user.name}</p>}
                {user?.phone && <p className="text-sm text-gray-600">+{user.phone}</p>}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0046A5]">Billed To</h3>
                <p className="font-semibold text-gray-800">{clientName || "-"}</p>
                {clientEmail && <p className="text-sm text-gray-600">{clientEmail}</p>}
                {clientPhone && <p className="text-sm text-gray-600">{clientPhone}</p>}
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm text-gray-600">Description</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Qty</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Unit Price</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-800">{it.description}</td>
                      <td className="px-4 py-4 text-right text-sm">{it.quantity}</td>
                      <td className="px-4 py-4 text-right text-sm">{currencyFmt(it.unitPrice)}</td>
                      <td className="px-4 py-4 text-right font-semibold">{currencyFmt(it.total ?? it.quantity * it.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm text-gray-600 mb-1">Notes</h4>
                <p className="text-sm text-gray-800">{notes}</p>
              </div>
            )}

            {/* Summary & Account */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm text-gray-600 mb-2">Payment Info</h4>
                <p className="text-sm text-gray-700">Bank: {bankName || "-"}</p>
                <p className="text-sm text-gray-700">Account Number: {accountNumber || "-"}</p>
                <p className="text-sm text-gray-700">Account Name: {accountName || "-"}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 self-start">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-medium">{currencyFmt(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="font-medium">{currencyFmt(tax)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="font-medium">{currencyFmt(discount)}</span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0046A5]">Total</span>
                  <span className="text-xl font-extrabold text-[#0046A5]">{currencyFmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>QuickInvoice NG — thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}


