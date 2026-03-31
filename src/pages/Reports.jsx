/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */

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

  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
    } catch (err) {
      console.error("Error fetching user for report usage", err);
    }
  };
  fetchUser();
}, []);


const canExportReport = () => {
  // 1. If user is Pro, they have unlimited power.
  if (user?.plan === 'pro') return true;

  // 2. For Free users, check their monthly report usage
  // Adjust 'reportsThisMonth' based on your actual user schema keys
  const reportUsage = user?.usage?.reportsThisMonth || 0;
  const REPORT_LIMIT = 3; // Or whatever limit you want for free users

  if (reportUsage >= REPORT_LIMIT) {
    toast.error("Monthly Report Limit Reached", {
      icon: '🔒',
      style: {
        borderRadius: '12px',
        background: '#0F172A',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    });
    return false;
  }

  return true;
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
  const element = printRef.current;
  if (!element) return;
  if (!canExportReport()) return;

  try {
    setPrintStatement(true);
    const toastId = toast.loading("Generating Executive Report...");

    // 1. Force the hidden element to be 'block' temporarily for the capture
    element.parentElement.style.display = 'block';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      width: 794, // Standard A4 width in pixels at 96 DPI
      onclone: (clonedDoc) => {
        // This ensures the cloned version is visible to the canvas engine
        const clonedArea = clonedDoc.querySelector('[ref="printRef"]') || clonedDoc.body.querySelector('div[style*="794px"]');
        if (clonedArea) {
           clonedArea.style.display = 'block';
           // Flatten gradients to solid colors to prevent 'non-finite' errors
           const gradients = clonedArea.querySelectorAll('*');
           gradients.forEach(el => {
             if (window.getComputedStyle(el).backgroundImage.includes('gradient')) {
               el.style.background = "#0028AE";
             }
           });
        }
      }
    });

    // 2. Hide it again immediately
    element.parentElement.style.display = 'none';

    // 3. Convert to Data URL and verify it exists
    const imgData = canvas.toDataURL("image/jpeg", 0.95); // Using JPEG is more memory efficient
    if (imgData === "data:,") {
      throw new Error("Canvas captured an empty image.");
    }

    // 4. Initialize PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // 5. Calculate dimensions manually to avoid getImageProperties crash
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const finalImgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    // 6. Add Image with explicit format and coordinates
    // Using JPEG/JPG here matches the toDataURL above
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, finalImgHeight);
    
    pdf.save(`Statement-${businessName.replace(/\s+/g, '-')}.pdf`);
    
    toast.dismiss(toastId);
    toast.success("Statement Exported Successfully");
  } catch (error) {
    toast.dismiss();
    console.error("Critical Export Error:", error);
    toast.error("Export failed. Please try again.");
  } finally {
    setPrintStatement(false);
    // Ensure the hidden container stays hidden
    if (printRef.current) printRef.current.parentElement.style.display = 'none';
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
