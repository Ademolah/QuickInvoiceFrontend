/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/Cards";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
// } from "recharts";
// import {
//   // Loader2,
//   FileText,
//   DollarSign,
//   CheckCircle,
//   Clock,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useCurrency } from "../context/CurrencyContext";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {jwtDecode} from "jwt-decode"

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// const Reports = () => {
//   const [stats, setStats] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const navigate = useNavigate();

//   //printing statement of account

//   const [month, setMonth] = useState("");
//   const printRef = useRef(null);
//   const token = localStorage.getItem("token");
//   const decodedUser = token ? jwtDecode(token) : null;
//   // const [loadingStatement, setLoadingStatement] = useState(false);
//   const [printStatment, setPrintStatement] = useState(false);

//   const businessName = decodedUser?.businessName

//   const fetchStatement = async () => {
//   try {
//     const res = await axios.get(`${API}/api/reports/statement?month=${month}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setInvoices(res.data.invoices);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to load statement");
//   } 
// };

// const exportStatementPDF = async () => {
//   try {
//     setPrintStatement(true)
//     const element = printRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       windowWidth: 794,        // 👈 force desktop width
//       scrollX: 0,
//       scrollY: -window.scrollY,
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = 210;
//     const pageHeight = 297;
//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//     // Handle multi-page statements
//     while (heightLeft > 0) {
//       position -= pageHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }
//     pdf.save(`Statement-${month}.pdf`);
//   } catch (error) {
//     console.log(error);
//     alert("Failed to print statement");
//   } finally {
//     setPrintStatement(false)
//   }
// };

// useEffect(() => {
//   if (!month || printStatment) return;
//   fetchStatement();
// }, [month]);

// const ROWS_PER_PAGE = 5;
// const [currentPage, setCurrentPage] = useState(1);
// const totalPages = Math.ceil(invoices.length / ROWS_PER_PAGE);
// const paginatedInvoices = invoices.slice(
//   (currentPage - 1) * ROWS_PER_PAGE,
//   currentPage * ROWS_PER_PAGE
// );

// const totals = invoices.reduce(
//   (acc, inv) => {
//     acc.subtotal += inv.subtotal || 0;
//     acc.tax += inv.tax || 0;
//     acc.discount += inv.discount || 0;
//     acc.total += inv.total || 0;
//     acc.outstanding += inv.outstandingBalance || 0;
//     return acc;
//   },
//   { subtotal: 0, tax: 0, discount: 0, total: 0, outstanding: 0 }
// );

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [statsRes, invoicesRes] = await Promise.all([
//           axios.get(`${API}/api/reports`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API}/api/invoices`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setStats(statsRes.data);
//         setInvoices(invoicesRes.data);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, []);

//   // Filter invoices by selected month
//   const filteredInvoices = React.useMemo(() => {
//     if (!selectedMonth) return invoices;
//     const [year, month] = selectedMonth.split("-");
//     return invoices.filter((inv) => {
//       const invDate = new Date(inv.createdAt);
//       return (
//         invDate.getFullYear() === parseInt(year) &&
//         invDate.getMonth() + 1 === parseInt(month)
//       );
//     });
//   }, [selectedMonth, invoices]);

//   const { code,  } = useCurrency(); // 👈 get currency settings
    
//       // helper to format currency
//       const formatCurrency = (amount) =>
//         new Intl.NumberFormat('en', {
//           style: 'currency',
//           currency: code,
//         }).format(amount);

//   // Recalculate stats based on filtered invoices
//   const dynamicStats = React.useMemo(() => {
//     if (!filteredInvoices.length) return stats;

//     const invoiceCount = filteredInvoices.length;
//     const paidInvoices = filteredInvoices.filter(
//       (i) => i.status === "paid"
//     ).length;
//     const pendingInvoices = filteredInvoices.filter(
//       (i) => i.status === "sent"
//     ).length;
//     const totalRevenue = filteredInvoices
//       .filter((i) => i.status === "paid")
//       .reduce((acc, i) => acc + i.total, 0);

//     return { invoiceCount, paidInvoices, pendingInvoices, totalRevenue };
//   }, [filteredInvoices, stats]);

//   // Revenue trend data (per month)
//   const revenueData = React.useMemo(() => {
//     return invoices
//       .filter((i) => i.status === "paid")
//       .map((i) => {
//         const date = new Date(i.createdAt);
//         return {
//           month: `${date.getFullYear()}-${date.getMonth() + 1}`,
//           revenue: i.total,
//         };
//       })
//       .reduce((acc, curr) => {
//         const existing = acc.find((a) => a.month === curr.month);
//         if (existing) {
//           existing.revenue += curr.revenue;
//         } else {
//           acc.push(curr);
//         }
//         return acc;
//       }, []);
//   }, [invoices]);

  
//   if (loading) {
//           return (
//             <div className="flex items-center justify-center h-[70vh]">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="flex flex-col items-center"
//               >
//                 <div className="w-14 h-14 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
//                 <p className="mt-4 text-[#0046A5] font-semibold">
//                   Fetching your Reports...
//                 </p>
//               </motion.div>
//             </div>
//           );
//         }

//   if (!stats) {
//     return (
//       <div className="text-center text-gray-500 mt-10">
//         Failed to load report data.
//       </div>
//     );
//   }

//   const data = [
//     { name: "Invoices", value: dynamicStats.invoiceCount },
//     { name: "Paid", value: dynamicStats.paidInvoices },
//     { name: "Pending", value: dynamicStats.pendingInvoices },
//   ];

//   return (
//     <div className="p-6 space-y-8">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
//           <p className="text-gray-500">
//             Overview of your Business performance and revenue
//           </p>
//         </div>

//         {/* Month Filter */}
//         <input
//           type="month"
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border rounded-lg px-3 py-2 text-gray-600 mt-4 md:mt-0"
//         />
//       </div>


//       {/* Print Statement of Account Button */}
      
//       <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-6">
//           <div className="w-full sm:w-auto">
//             <label className="text-sm text-gray-600">Select Month</label>
//             <input
//               type="month"
//               value={month}
//               onChange={(e) => setMonth(e.target.value)}
//               className="mt-1 px-3 py-2 border rounded-lg w-full sm:w-[220px]"
//             />
//           </div>
//           {/* <button
//             onClick={fetchStatement}
//             disabled={!month || loading}
//             className="px-5 py-2 rounded-lg bg-[#0046A5] text-white font-medium w-full sm:w-auto disabled:opacity-50"
//           >
//             {loadingStatement ? "Generating…" : "Generate Statement"}
//           </button> */}
//           {invoices.length > 0 && (
//             <button
//               onClick={exportStatementPDF}
//               className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-medium w-full sm:w-auto"
//             >
//               {printStatment ? "Printing..." : "Print Statement"}
//             </button>
//           )}
//         </div>


//       <div className="overflow-x-auto">
//               <div
//         ref={printRef}
//         className="bg-white p-8 rounded-xl shadow text-gray-800"
//           style={{
//             width: "794px", // A4 width in pixels (96dpi)
//           }}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-[#0046A5]">
//               Statement of Account
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Period: {month}
//             </p>
//           </div>
//           <div className="text-right">
//             <h2 className="text-lg font-semibold">
//               {businessName}
//             </h2>
//             <p className="text-xs text-gray-500">
//               QuickInvoice Systems
//             </p>
//           </div>
//         </div>
//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Client</th>
//                 <th className="p-2 text-right">Subtotal</th>
//                 <th className="p-2 text-right">VAT</th>
//                 <th className="p-2 text-right">Discount</th>
//                 <th className="p-2 text-right">Total</th>
//                 <th className="p-2 text-right">Outstanding</th>
//                 <th className="p-2 text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedInvoices.map((inv) => (
//                 <tr key={inv._id} className="border-b">
//                   <td className="p-2 text-left">
//                     <div className="font-medium">{inv.clientName}</div>
//                     <div className="text-xs text-gray-500">
//                       {inv.clientPhone}
//                     </div>
//                   </td>
//                   <td className="p-2 text-right">
//                     ₦{inv.subtotal?.toLocaleString() || 0}
//                   </td>
//                   <td className="p-2 text-right">
//                     ₦{inv.tax?.toLocaleString() || 0}
//                   </td>
//                   <td className="p-2 text-right">
//                     ₦{inv.discount?.toLocaleString() || 0}
//                   </td>
//                   <td className="p-2 text-right font-semibold">
//                     ₦{inv.total?.toLocaleString() || 0}
//                   </td>
//                   <td className="p-2 text-right text-red-600">
//                     ₦{inv.outstandingBalance?.toLocaleString() || 0}
//                   </td>
//                   <td className="p-2 text-center">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-medium ${
//                         inv.status === "paid"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {inv.status === "paid" ? "Paid" : "Unpaid"}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {!printStatment && totalPages > 1 && (
//           <div className="mt-4 flex justify-between items-center text-sm">
//             <span className="text-gray-500">
//               Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
//               {Math.min(currentPage * ROWS_PER_PAGE, invoices.length)} of{" "}
//               {invoices.length} transactions
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="px-3 py-1 rounded border text-gray-700 disabled:opacity-40"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="px-3 py-1 rounded border text-gray-700 disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Summary */}
//         <div className="mt-8 flex justify-end">
//           <div className="w-full sm:w-1/2 border rounded-lg p-4 bg-gray-50">
//             <h3 className="font-semibold mb-3 text-[#0046A5]">
//               Statement Summary
//             </h3>
//             <div className="flex justify-between text-sm mb-1">
//               <span>Total Invoiced</span>
//               <span>₦{totals.total.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span>Total Outstanding</span>
//               <span className="text-red-600">
//                 ₦{totals.outstanding.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
//               <span>Total Paid</span>
//               <span className="text-green-600">
//                 ₦{(totals.total - totals.outstanding).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//         {/* Footer */}
//         <div className="mt-10 pt-4 border-t text-center text-xs text-gray-500">
//           <p>
//             This statement was generated electronically via QuickInvoice.
//           </p>
//           <p>
//             Please mark invoices as paid in your dashboard to keep records accurate.
//           </p>
//         </div>
//       </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="shadow-lg border-t-4 border-blue-600">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Invoices
//             </CardTitle>
//             <FileText className="h-5 w-5 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dynamicStats.invoiceCount}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg border-t-4 border-green-600">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Revenue
//             </CardTitle>
//             <DollarSign className="h-5 w-5 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatCurrency(dynamicStats.totalRevenue)?.toLocaleString()}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg border-t-4 border-emerald-500">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Paid Invoices
//             </CardTitle>
//             <CheckCircle className="h-5 w-5 text-emerald-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dynamicStats.paidInvoices}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg border-t-4 border-yellow-500">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Pending Invoices
//             </CardTitle>
//             <Clock className="h-5 w-5 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dynamicStats.pendingInvoices}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Analytics Chart */}
//       <Card className="shadow-xl">
//         <CardHeader>
//           <CardTitle>Invoice Distribution</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data}>
//               <XAxis dataKey="name" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Bar dataKey="value" fill="#0046A5" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Revenue Trend Line Chart */}
//       <Card className="shadow-xl">
//         <CardHeader>
//           <CardTitle>Revenue Trend</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={revenueData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#0046A5"
//                 strokeWidth={3}
//                 dot
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Back to Dashboard button */}
//       {/* <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           ⬅ Back to Dashboard
//         </button>
//       </div> */}
//       {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
//         >
//           Q
//         </button>
//     </div>
//   );
// };

// export default Reports;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Cards";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area
} from "recharts";
import {
  FileText, DollarSign, CheckCircle, Clock, 
  Download, Printer, Filter, Calendar, TrendingUp, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { motion, } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const API = "https://quickinvoice-backend-1.onrender.com";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [month, setMonth] = useState("");
  const [printStatment, setPrintStatement] = useState(false);
  
  const navigate = useNavigate();
  const printRef = useRef(null);
  const {  formatCurrency } = useCurrency();
  
  const token = localStorage.getItem("token");
  const decodedUser = useMemo(() => token ? jwtDecode(token) : null, [token]);
  const businessName = decodedUser?.businessName || "QuickInvoice User";

  // --- LOGIC: USAGE LOGGING ---
  const logUsage = async () => {
    try {
      const res = await fetch(`${API}/api/invoices/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "report" }), // Tracking report generation
      });
      if (!res.ok) {
        toast.error("Report limit reached. Please upgrade to Pro.");
        return false;
      }
      return true;
    } catch (e) { return true; } // Fallback to allow if log fails
  };

  // --- LOGIC: DATA FETCHING ---
  const fetchReports = async () => {
    try {
      setLoading(true);
      const [statsRes, invoicesRes] = await Promise.all([
        axios.get(`${API}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/invoices`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatement = async () => {
    if (!month) return;
    try {
      const res = await axios.get(`${API}/api/reports/statement?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data.invoices);
    } catch (err) {
      toast.error("Failed to load statement for this period");
    }
  };

  useEffect(() => { fetchReports(); }, []);
  useEffect(() => { if (month) fetchStatement(); }, [month]);

  // --- LOGIC: EXPORT ---
  const exportStatementPDF = async () => {
    if (!printRef.current) return;
    const canProceed = await logUsage();
    if (!canProceed) return;

    try {
      setPrintStatement(true);
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // Premium Crisp Quality
        useCORS: true,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Statement-${businessName.replace(/\s+/g, '-')}-${month}.pdf`);
      toast.success("Statement exported successfully!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setPrintStatement(false);
    }
  };

  // --- DATA PROCESSING ---
  const dynamicStats = useMemo(() => {
    if (!stats) return null;
    const filtered = !selectedMonth ? invoices : invoices.filter(inv => {
      const date = new Date(inv.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === selectedMonth;
    });

    return {
      invoiceCount: filtered.length,
      paidInvoices: filtered.filter(i => i.status === "paid").length,
      pendingInvoices: filtered.filter(i => i.status !== "paid").length,
      totalRevenue: filtered.filter(i => i.status === "paid").reduce((acc, i) => acc + i.total, 0),
    };
  }, [selectedMonth, invoices, stats]);

  const revenueTrend = useMemo(() => {
    const months = {};
    invoices.filter(i => i.status === "paid").forEach(inv => {
      const date = new Date(inv.createdAt);
      const label = date.toLocaleString('default', { month: 'short' });
      months[label] = (months[label] || 0) + inv.total;
    });
    return Object.keys(months).map(m => ({ name: m, revenue: months[m] }));
  }, [invoices]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#0028AE] border-t-[#00A6FA] rounded-full animate-spin" />
        <p className="mt-6 text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Compiling Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 font-medium">Monitoring business growth and cash flow</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Calendar size={18} className="ml-2 text-[#0028AE]" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-none focus:ring-0 text-sm font-bold text-slate-700 bg-transparent"
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Revenue", val: formatCurrency(dynamicStats?.totalRevenue || 0), icon: DollarSign, color: "bg-emerald-500" },
          { label: "Invoices", val: dynamicStats?.invoiceCount, icon: FileText, color: "bg-[#0028AE]" },
          { label: "Paid", val: dynamicStats?.paidInvoices, icon: CheckCircle, color: "bg-blue-400" },
          { label: "Pending", val: dynamicStats?.pendingInvoices, icon: Clock, color: "bg-amber-400" }
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={item.label} 
            className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-[0.03] rounded-bl-full transition-all group-hover:scale-110`} />
            <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${item.color}/20`}>
              <item.icon size={20} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{item.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 p-6">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <TrendingUp className="text-[#0028AE]" size={20} /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0028AE" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0028AE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0028AE" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 p-6">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Filter className="text-[#00A6FA]" size={20} /> Status Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Paid', value: dynamicStats?.paidInvoices, color: '#10b981' },
                { name: 'Pending', value: dynamicStats?.pendingInvoices, color: '#f59e0b' }
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px' }} />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  { [0, 1].map((entry, index) => (
                    <motion.rect key={`cell-${index}`} fill={index === 0 ? '#0028AE' : '#00A6FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statement of Account Generator Section */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0028AE] opacity-20 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-black mb-2">Statement of Account</h2>
            <p className="text-slate-400 font-medium">Generate a professional financial summary for your clients or personal records.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-white/10 border-white/20 rounded-2xl px-6 py-4 text-white font-bold focus:ring-[#00A6FA]"
              />
            </div>
            {invoices.length > 0 && (
              <button
                onClick={exportStatementPDF}
                disabled={printStatment}
                className="w-full sm:w-auto bg-gradient-to-r from-[#0028AE] to-[#00A6FA] hover:scale-105 transition-transform px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
              >
                {printStatment ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Printer size={18} />}
                {printStatment ? "Generating..." : "Print Statement"}
              </button>
            )}
          </div>
        </div>

        {/* HIDDEN PRINT PREVIEW - Styled Premium */}
        <div className="hidden">
           <div ref={printRef} style={{ width: "794px", padding: "0", backgroundColor: "white", color: "#1e293b" }}>
              {/* Premium Statement Header */}
              <div style={{ padding: '40px', background: 'linear-gradient(to right, #0028AE, #00A6FA)', color: 'white' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <h1 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px', margin: '0' }}>Statement of Account</h1>
                       <p style={{ opacity: '0.8', fontWeight: '600', margin: '5px 0 0 0' }}>Period: {month}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0' }}>{businessName}</h2>
                       <p style={{ fontSize: '12px', opacity: '0.7', margin: '0' }}>www.quickinvoiceng.com</p>
                    </div>
                 </div>
              </div>

              <div style={{ padding: '40px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ padding: '15px 10px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Client</th>
                      <th style={{ padding: '15px 10px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                      <th style={{ padding: '15px 10px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Balance</th>
                      <th style={{ padding: '15px 10px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '15px 10px' }}>
                           <div style={{ fontWeight: '800', fontSize: '14px' }}>{inv.clientName}</div>
                           <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(inv.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: '700' }}>{formatCurrency(inv.total)}</td>
                        <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: '700', color: inv.outstandingBalance > 0 ? '#ef4444' : '#10b981' }}>{formatCurrency(inv.outstandingBalance)}</td>
                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: '900', padding: '4px 8px', borderRadius: '6px', backgroundColor: inv.status === 'paid' ? '#ecfdf5' : '#fff7ed', color: inv.status === 'paid' ? '#059669' : '#d97706' }}>
                            {inv.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Print Summary */}
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                   <div style={{ width: '250px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                         <span style={{ color: '#64748b', fontWeight: '600' }}>Total Volume</span>
                         <span style={{ fontWeight: '800' }}>{formatCurrency(invoices.reduce((a, b) => a + b.total, 0))}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                         <span style={{ fontWeight: '900', color: '#0028AE' }}>Total Paid</span>
                         <span style={{ fontWeight: '900', color: '#0028AE' }}>{formatCurrency(invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.total, 0))}</span>
                      </div>
                   </div>
                </div>

                <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', color: '#0028AE', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      <ShieldCheck size={12} /> Secured by QuickInvoice
                   </div>
                   <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '5px' }}>This is a computer generated statement. www.quickinvoiceng.com</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Floating Action Navigation */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-8 right-8 bg-[#0028AE] text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-2xl hover:scale-110 transition-transform z-50 font-black text-xl"
      >
        Q
      </button>
    </div>
  );
};

export default Reports;
