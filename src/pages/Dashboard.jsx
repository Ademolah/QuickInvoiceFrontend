

// import React from "react";
// import Sidebar from "../components/Sidebar"; // Adjust the path as needed

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-[#F9FAFB] flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Dashboard Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//           <div className="w-14 h-14 bg-gradient-to-r from-[#0046A5] to-[#00B86B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
//             Q
//           </div>
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-700">Hi, Charles</span>
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="Profile"
//               className="w-10 h-10 rounded-full border border-gray-300"
//             />
//           </div>
//         </header>

//         {/* Main content */}
//         <main className="flex-1 p-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {[
//               { title: "Total Invoices", value: "120", color: "from-[#0046A5] to-[#00B86B]" },
//               { title: "Pending Payments", value: "15", color: "from-yellow-500 to-orange-400" },
//               { title: "Revenue (₦)", value: "850,000", color: "from-green-500 to-emerald-400" },
//             ].map((stat, i) => (
//               <div
//                 key={i}
//                 className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${stat.color} text-white`}
//               >
//                 <h3 className="text-lg">{stat.title}</h3>
//                 <p className="text-3xl font-bold mt-2">{stat.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Chart Placeholder */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
//             <div className="w-full h-48 bg-gradient-to-r from-[#0046A5] to-[#00B86B] rounded-lg flex items-center justify-center text-white font-bold">
//               Chart Placeholder
//             </div>
//           </div>

//           {/* Recent Invoices */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Invoices</h2>
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b">
//                   <th className="py-2">Invoice #</th>
//                   <th className="py-2">Client</th>
//                   <th className="py-2">Amount</th>
//                   <th className="py-2">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { id: "INV-001", client: "John Doe", amount: "₦50,000", status: "Paid" },
//                   { id: "INV-002", client: "Jane Smith", amount: "₦30,000", status: "Pending" },
//                   { id: "INV-003", client: "Acme Corp", amount: "₦120,000", status: "Paid" },
//                 ].map((invoice, i) => (
//                   <tr key={i} className="border-b hover:bg-gray-50">
//                     <td className="py-3">{invoice.id}</td>
//                     <td className="py-3">{invoice.client}</td>
//                     <td className="py-3">{invoice.amount}</td>
//                     <td className="py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm ${
//                           invoice.status === "Paid"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {invoice.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import Sidebar from "../components/Sidebar"; // Adjust the path as needed

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [businessName, setBusinessName] = useState('');
//   const [invoices, setInvoices] = useState([]);
//   const [stats, setStats] = useState({
//     totalInvoicesThisMonth: 0,
//     totalRevenue: 0,
//     totalUnpaid: 0,
//     totalSales: 0,
//     totalQuantity: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         // Fetch invoices
//         const invoiceRes = await axios.get('http://localhost:4000/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const invoicesData = invoiceRes.data;

//         // Fetch user (business name)
//         const userRes = await axios.get('http://localhost:4000/api/users/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBusinessName(userRes.data.businessName || '');

//         const now = new Date();
//         const currentMonth = now.getMonth();
//         const currentYear = now.getFullYear();

//         // Filter invoices for this month
//         const invoicesThisMonth = invoicesData.filter(inv => {
//           const invDate = new Date(inv.createdAt);
//           return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
//         });

//         const totalInvoicesThisMonth = invoicesThisMonth.length;
//         const totalRevenue = invoicesThisMonth
//           .filter(inv => inv.status === 'paid')
//           .reduce((sum, inv) => sum + inv.total, 0);

//         const totalUnpaid = invoicesThisMonth.filter(inv => inv.status !== 'paid').length;
//         const totalSales = invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0);
//         const totalQuantity = invoicesThisMonth.reduce(
//           (sum, inv) => sum + inv.items.reduce((itemSum, it) => itemSum + it.quantity, 0),
//           0
//         );

//         setInvoices(invoicesThisMonth);
//         setStats({
//           totalInvoicesThisMonth,
//           totalRevenue,
//           totalUnpaid,
//           totalSales,
//           totalQuantity,
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Prepare chart data
//   const chartData = invoices.map(inv => ({
//     date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
//     Paid: inv.status === 'paid' ? inv.total : 0,
//     Unpaid: inv.status !== 'paid' ? inv.total : 0,
//   }));

//   if (loading) return <div className="text-center mt-10 text-[#0046A5] font-semibold">Loading Dashboard...</div>;

//   return (
//     <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      
      
//       <h1 className="text-3xl font-bold text-[#0046A5] mb-6">Dashboard - {businessName}</h1>

//       {/* Stats Grid */}
//       <div className="grid md:grid-cols-3 gap-6">
        
//         <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-lg font-semibold mb-2">Invoices This Month</h2>
//           <p className="text-2xl font-bold">{stats.totalInvoicesThisMonth}</p>
//         </div>

//         <div className="bg-gradient-to-r from-[#50D6FE] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-lg font-semibold mb-2">Revenue (Paid)</h2>
//           <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
//         </div>

//         <div className="bg-gradient-to-r from-[#00B86B] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-lg font-semibold mb-2">Unpaid Invoices</h2>
//           <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Sales</h2>
//           <p className="text-xl font-bold">₦{stats.totalSales.toLocaleString()}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Quantity Sold</h2>
//           <p className="text-xl font-bold">{stats.totalQuantity}</p>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//         <h2 className="text-lg font-semibold mb-4 text-[#0046A5]">Sales Chart</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
//             <Legend />
//             <Bar dataKey="Paid" fill="#0046A5" />
//             <Bar dataKey="Unpaid" fill="#00B86B" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from "../components/Sidebar"; // Adjust path if needed

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalInvoicesThisMonth: 0,
    totalRevenue: 0,
    totalUnpaid: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch invoices
        const invoiceRes = await axios.get('http://localhost:4000/api/invoices', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoicesData = invoiceRes.data;

        // Fetch user (business name)
        const userRes = await axios.get('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinessName(userRes.data.businessName || '');

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter invoices for this month
        const invoicesThisMonth = invoicesData.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        const totalInvoicesThisMonth = invoicesThisMonth.length;
        const totalRevenue = invoicesThisMonth
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.total, 0);
        const totalUnpaid = invoicesThisMonth.filter(inv => inv.status !== 'paid').length;
        const totalSales = invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0);
        const totalQuantity = invoicesThisMonth.reduce(
          (sum, inv) => sum + inv.items.reduce((itemSum, it) => itemSum + it.quantity, 0),
          0
        );

        setInvoices(invoicesThisMonth);
        setStats({
          totalInvoicesThisMonth,
          totalRevenue,
          totalUnpaid,
          totalSales,
          totalQuantity,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = invoices.map(inv => ({
    date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    Paid: inv.status === 'paid' ? inv.total : 0,
    Unpaid: inv.status !== 'paid' ? inv.total : 0,
  }));

  if (loading) {
    return (
      <div className="flex">
        <Sidebar className="fixed h-screen" />
        <div className="ml-[250px] flex-1 p-6">
          <div className="text-center mt-10 text-[#0046A5] font-semibold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="fixed h-screen w-[250px] bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="ml-[250px] flex-1 p-6 md:p-10 space-y-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-[#0046A5] mb-6">
          Dashboard - {businessName}
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Invoices This Month</h2>
            <p className="text-2xl font-bold">{stats.totalInvoicesThisMonth}</p>
          </div>

          <div className="bg-gradient-to-r from-[#50D6FE] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Revenue (Paid)</h2>
            <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-r from-[#00B86B] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Unpaid Invoices</h2>
            <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Sales</h2>
            <p className="text-xl font-bold">₦{stats.totalSales.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Quantity Sold</h2>
            <p className="text-xl font-bold">{stats.totalQuantity}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-[#0046A5]">Sales Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Paid" fill="#0046A5" />
              <Bar dataKey="Unpaid" fill="#00B86B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
