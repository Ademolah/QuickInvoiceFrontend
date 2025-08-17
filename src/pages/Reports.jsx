// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate }  from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/Cards";
// import { TrendingUp, FileText, CheckCircle, AlertCircle } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { name: "Jan", revenue: 1200 },
//   { name: "Feb", revenue: 1800 },
//   { name: "Mar", revenue: 2200 },
//   { name: "Apr", revenue: 1500 },
//   { name: "May", revenue: 2600 },
//   { name: "Jun", revenue: 3000 },
// ];



// export default function Reports() {
//     const navigate = useNavigate()

    
//   return (
//     <div className="p-4 md:p-10 space-y-8">
//       {/* Page Title */}
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl font-bold bg-gradient-to-r from-[#0046A5] to-[#00B86B] bg-clip-text text-transparent"
//       >
//         Reports & Analytics
//       </motion.h1>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="rounded-2xl shadow-md">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Total Invoices</CardTitle>
//             <FileText className="text-[#0046A5]" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">120</p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-md">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Paid</CardTitle>
//             <CheckCircle className="text-[#00B86B]" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">95</p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-md">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Outstanding</CardTitle>
//             <AlertCircle className="text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">25</p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-md">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Revenue</CardTitle>
//             <TrendingUp className="text-[#0046A5]" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">₦2,450,000</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Revenue Trend */}
//       <Card className="rounded-2xl shadow-md">
//         <CardHeader>
//           <CardTitle>Revenue Trend</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="revenue" stroke="#0046A5" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Recent Reports Table */}
//       <Card className="rounded-2xl shadow-md">
//         <CardHeader>
//           <CardTitle>Recent Invoices Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2">Invoice ID</th>
//                   <th className="px-4 py-2">Client</th>
//                   <th className="px-4 py-2">Amount</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-t">
//                   <td className="px-4 py-2">#INV-001</td>
//                   <td className="px-4 py-2">John Doe</td>
//                   <td className="px-4 py-2">₦120,000</td>
//                   <td className="px-4 py-2 text-green-600">Paid</td>
//                   <td className="px-4 py-2">Aug 10, 2025</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td className="px-4 py-2">#INV-002</td>
//                   <td className="px-4 py-2">Jane Smith</td>
//                   <td className="px-4 py-2">₦45,000</td>
//                   <td className="px-4 py-2 text-yellow-600">Pending</td>
//                   <td className="px-4 py-2">Aug 12, 2025</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td className="px-4 py-2">#INV-003</td>
//                   <td className="px-4 py-2">Acme Ltd</td>
//                   <td className="px-4 py-2">₦300,000</td>
//                   <td className="px-4 py-2 text-green-600">Paid</td>
//                   <td className="px-4 py-2">Aug 14, 2025</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>


//       {/* Back to Dashboard button */}
//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           ⬅ Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Cards";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, FileText, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:4000/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching reports stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
    { name: "Invoices", value: stats.invoiceCount },
    { name: "Paid", value: stats.paidInvoices },
    { name: "Pending", value: stats.pendingInvoices },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
      <p className="text-gray-500">Overview of your Business performance and revenue</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-t-4 border-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoiceCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidInvoices}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
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
};

export default Reports;

