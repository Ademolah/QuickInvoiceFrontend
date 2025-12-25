/* eslint-disable react-hooks/exhaustive-deps */


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Cards";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  // Loader2,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {jwtDecode} from "jwt-decode"

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  //printing statement of account

  const [month, setMonth] = useState("");
  const printRef = useRef(null);
  const token = localStorage.getItem("token");
  const decodedUser = token ? jwtDecode(token) : null;
  // const [loadingStatement, setLoadingStatement] = useState(false);
  const [printStatment, setPrintStatement] = useState(false);

  const businessName = decodedUser?.businessName

  const fetchStatement = async () => {
  try {
    const res = await axios.get(`${API}/api/reports/statement?month=${month}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setInvoices(res.data.invoices);
  } catch (err) {
    console.error(err);
    alert("Failed to load statement");
  } 
};

const exportStatementPDF = async () => {
  try {
    setPrintStatement(true)
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: 794,        // 👈 force desktop width
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    // Handle multi-page statements
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`Statement-${month}.pdf`);
  } catch (error) {
    console.log(error);
    alert("Failed to print statement");
  } finally {
    setPrintStatement(false)
  }
};

useEffect(() => {
  if (!month || printStatment) return;
  fetchStatement();
}, [month]);

const ROWS_PER_PAGE = 5;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(invoices.length / ROWS_PER_PAGE);
const paginatedInvoices = invoices.slice(
  (currentPage - 1) * ROWS_PER_PAGE,
  currentPage * ROWS_PER_PAGE
);

const totals = invoices.reduce(
  (acc, inv) => {
    acc.subtotal += inv.subtotal || 0;
    acc.tax += inv.tax || 0;
    acc.discount += inv.discount || 0;
    acc.total += inv.total || 0;
    acc.outstanding += inv.outstandingBalance || 0;
    return acc;
  },
  { subtotal: 0, tax: 0, discount: 0, total: 0, outstanding: 0 }
);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const [statsRes, invoicesRes] = await Promise.all([
          axios.get(`${API}/api/reports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/api/invoices`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter invoices by selected month
  const filteredInvoices = React.useMemo(() => {
    if (!selectedMonth) return invoices;
    const [year, month] = selectedMonth.split("-");
    return invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      return (
        invDate.getFullYear() === parseInt(year) &&
        invDate.getMonth() + 1 === parseInt(month)
      );
    });
  }, [selectedMonth, invoices]);

  const { code,  } = useCurrency(); // 👈 get currency settings
    
      // helper to format currency
      const formatCurrency = (amount) =>
        new Intl.NumberFormat('en', {
          style: 'currency',
          currency: code,
        }).format(amount);

  // Recalculate stats based on filtered invoices
  const dynamicStats = React.useMemo(() => {
    if (!filteredInvoices.length) return stats;

    const invoiceCount = filteredInvoices.length;
    const paidInvoices = filteredInvoices.filter(
      (i) => i.status === "paid"
    ).length;
    const pendingInvoices = filteredInvoices.filter(
      (i) => i.status === "sent"
    ).length;
    const totalRevenue = filteredInvoices
      .filter((i) => i.status === "paid")
      .reduce((acc, i) => acc + i.total, 0);

    return { invoiceCount, paidInvoices, pendingInvoices, totalRevenue };
  }, [filteredInvoices, stats]);

  // Revenue trend data (per month)
  const revenueData = React.useMemo(() => {
    return invoices
      .filter((i) => i.status === "paid")
      .map((i) => {
        const date = new Date(i.createdAt);
        return {
          month: `${date.getFullYear()}-${date.getMonth() + 1}`,
          revenue: i.total,
        };
      })
      .reduce((acc, curr) => {
        const existing = acc.find((a) => a.month === curr.month);
        if (existing) {
          existing.revenue += curr.revenue;
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);
  }, [invoices]);

  
  if (loading) {
          return (
            <div className="flex items-center justify-center h-[70vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 border-4 border-[#0046A5] border-t-[#00B86B] rounded-full animate-spin" />
                <p className="mt-4 text-[#0046A5] font-semibold">
                  Fetching your Reports...
                </p>
              </motion.div>
            </div>
          );
        }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Failed to load report data.
      </div>
    );
  }

  const data = [
    { name: "Invoices", value: dynamicStats.invoiceCount },
    { name: "Paid", value: dynamicStats.paidInvoices },
    { name: "Pending", value: dynamicStats.pendingInvoices },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">
            Overview of your Business performance and revenue
          </p>
        </div>

        {/* Month Filter */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-600 mt-4 md:mt-0"
        />
      </div>


      {/* Print Statement of Account Button */}
      
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-6">
          <div className="w-full sm:w-auto">
            <label className="text-sm text-gray-600">Select Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg w-full sm:w-[220px]"
            />
          </div>
          {/* <button
            onClick={fetchStatement}
            disabled={!month || loading}
            className="px-5 py-2 rounded-lg bg-[#0046A5] text-white font-medium w-full sm:w-auto disabled:opacity-50"
          >
            {loadingStatement ? "Generating…" : "Generate Statement"}
          </button> */}
          {invoices.length > 0 && (
            <button
              onClick={exportStatementPDF}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-medium w-full sm:w-auto"
            >
              {printStatment ? "Printing..." : "Print Statement"}
            </button>
          )}
        </div>


      <div className="overflow-x-auto">
              <div
        ref={printRef}
        className="bg-white p-8 rounded-xl shadow text-gray-800"
          style={{
            width: "794px", // A4 width in pixels (96dpi)
          }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0046A5]">
              Statement of Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Period: {month}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold">
              {businessName}
            </h2>
            <p className="text-xs text-gray-500">
              QuickInvoice Systems
            </p>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-right">Subtotal</th>
                <th className="p-2 text-right">VAT</th>
                <th className="p-2 text-right">Discount</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-right">Outstanding</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv) => (
                <tr key={inv._id} className="border-b">
                  <td className="p-2 text-left">
                    <div className="font-medium">{inv.clientName}</div>
                    <div className="text-xs text-gray-500">
                      {inv.clientPhone}
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    ₦{inv.subtotal?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 text-right">
                    ₦{inv.tax?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 text-right">
                    ₦{inv.discount?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    ₦{inv.total?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 text-right text-red-600">
                    ₦{inv.outstandingBalance?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inv.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!printStatment && totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(currentPage * ROWS_PER_PAGE, invoices.length)} of{" "}
              {invoices.length} invoices
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded border text-gray-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded border text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full sm:w-1/2 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 text-[#0046A5]">
              Statement Summary
            </h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Total Invoiced</span>
              <span>₦{totals.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Total Outstanding</span>
              <span className="text-red-600">
                ₦{totals.outstanding.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
              <span>Total Paid</span>
              <span className="text-green-600">
                ₦{(totals.total - totals.outstanding).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-10 pt-4 border-t text-center text-xs text-gray-500">
          <p>
            This statement was generated electronically via QuickInvoice.
          </p>
          <p>
            Please mark invoices as paid in your dashboard to keep records accurate.
          </p>
        </div>
      </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-t-4 border-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.invoiceCount}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dynamicStats.totalRevenue)?.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Invoices
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.paidInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.pendingInvoices}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Invoice Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0046A5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend Line Chart */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0046A5"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Back to Dashboard button */}
      {/* <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div> */}
      {/* Floating Q Button at Bottom */}
        <button
          onClick={() => navigate("/dashboard")}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
        >
          Q
        </button>
    </div>
  );
};

export default Reports;


