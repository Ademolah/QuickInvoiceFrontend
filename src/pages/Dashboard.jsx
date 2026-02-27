/* eslint-disable no-unused-vars */


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import Sidebar from "../components/Sidebar"; // Adjust path if needed
// import { X} from 'lucide-react'
// import { useCurrency } from '../context/CurrencyContext';

// import { User } from 'lucide-react';

// import { fetchUser } from '../utils/getUser';
// // import api from '../utils/api';
// import { toast } from 'react-hot-toast';
// import QuickBuddy from '../components/QuickBuddy';

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// const Dashboard = ({children}) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [businessName, setBusinessName] = useState('');
//   const [invoices, setInvoices] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [stats, setStats] = useState({
//     totalInvoicesThisMonth: 0,
//     totalRevenue: 0,
//     totalUnpaid: 0,
//     totalSales: 0,
//     totalQuantity: 0,
//   });

//   //KYC
//   const [showPromptModal, setShowPromptModal] = useState(false);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [formData, setFormData] = useState({
//     nationality: "Nigeria",
//     date_of_birth: "",
//     residential_address: "",
//     occupation: "",
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data);
//       if (
//         !res.data.nationality ||
//         !res.data.date_of_birth ||
//         !res.data.residential_address ||
//         !res.data.occupation
//       ) {
//         setShowPromptModal(true);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleSubmit = async () => {
//     setIsSubmitting(true)
//     const token = localStorage.getItem("token");
//     await axios.put(
//       `${API}/api/users/complete-profile`,
//       formData,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setShowFormModal(false);
//     setShowPromptModal(false);
//     toast.success("Information updated successfully!");
//   };

//   //welcome modal
//   const [showWelcomeModal, setShowWelcomeModal] = useState(false);
//   useEffect(() => {
//     const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
//     if (!hasSeenWelcome) {
//       setShowWelcomeModal(true);
//     }
//   }, []);
//   const handleCloseWelcome = () => {
//     localStorage.setItem("hasSeenWelcomeModal", "true"); // :white_check_mark: Do not show again
//     setShowWelcomeModal(false);
//   };


// //image
// const [user, setUser] = useState(null);
//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const data = await fetchUser(token);
//         setUser(data); // assuming backend responds with { user: {...} }
//         console.log(data);
        
//       } catch (err) {
//         console.error("Failed to load user:", err);
//       }
//     };
//     if (token) {
//       getUser();
//     }
//   }, [token]);





//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         // Fetch invoices
//         const invoiceRes = await axios.get(`${API}/api/invoices`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const invoicesData = invoiceRes.data;

//         // Fetch user (business name)
//         const userRes = await axios.get(`${API}/api/users/me`, {
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


//    // helper to format currency

//   const { formatCurrency } = useCurrency()
  
   
    

//   const chartData = invoices.map(inv => ({
//     date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
//     Paid: inv.status === 'paid' ? inv.total : 0,
//     Unpaid: inv.status !== 'paid' ? inv.total : 0,
//   }));

 

  
//   if (loading) {
//   return (
//     <div className="flex bg-[#F9FAFB] min-h-screen">
//       <Sidebar className="fixed h-screen" />
//       <div className="md:ml-[250px] ml-0 flex-1 p-4 md:p-6">
//         <div className="flex flex-col items-center justify-center h-full">
//           {/* Animated Logo Loader */}
//           <div className="flex items-center gap-3 mb-6 animate-fadeIn">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0028AE] to-[#00A6FA] animate-pulse" />
//             <p className="text-xl font-semibold text-[#0046A5]">
//               Preparing your dashboard…
//             </p>
//           </div>
//           {/* Skeleton Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 animate-fadeIn"
//                 style={{ animationDelay: `${i * 0.1}s` }}
//               >
//                 <div className="h-4 w-24 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
//                 <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
//               </div>
//             ))}
//           </div>
//           {/* Wide skeleton table */}
//           <div className="w-full max-w-4xl mt-10 bg-white border shadow-md rounded-2xl p-6 animate-fadeIn">
//             <div className="h-4 w-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
//             <div className="space-y-3">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="h-3 w-full bg-gray-200 rounded-md animate-pulse"
//                   style={{ animationDelay: `${i * 0.08}s` }}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//   return (
//     <div className="flex min-h-screen">
//       {/* Fixed Sidebar */}
//       <div className="sm:hidden md:block fixed h-screen w-[250px]  ">
//         <Sidebar />
//       </div>    

//       {/* Prompt Modal */}
//       {showPromptModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg text-center">
//             <h2 className="text-lg font-semibold text-gray-800">Submit Further Information</h2>
//             <p className="text-sm text-gray-600 mt-2">
//               To comply with regulations, we need some additional details before you continue.
//             </p>
//             <button
//               onClick={() => setShowFormModal(true)}
//               className="bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-full py-2 rounded-lg mt-4"
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}
//       {/* Form Modal */}
//       {showFormModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold text-gray-800">Complete Your Profile</h2>
//             <div className="mt-4 space-y-3">
//               <label className="block">
//                 <span className="text-gray-700 font-medium mb-1 block">Nationality</span>
//                 <input
//                   type="text"
//                   placeholder="Nationality"
//                   className="w-full border rounded px-3 py-2"
//                   value={formData.nationality}
//                   disabled
//                 />
//               </label>
//               {/* <input
//                 type="date"
//                 className="w-full border rounded px-3 py-2"
//                 value={formData.date_of_birth}
//                 onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
//               /> */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                 <input
//                   type="date"
//                   className="w-full border rounded px-3 py-2"
//                   value={formData.date_of_birth}
//                   onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
//                 />
//               </div>
//               <textarea
//                 placeholder="Residential Address"
//                 className="w-full border rounded px-3 py-2 h-20"
//                 value={formData.residential_address}
//                 onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Occupation"
//                 className="w-full border rounded px-3 py-2"
//                 value={formData.occupation}
//                 onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
//               />
//             </div>
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className={`bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-full py-2 rounded-lg mt-4 ${
//                 isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </div>
//       )}



//       {/* Mobile Sidebar (Drawer) */}
//       <div
//         className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setIsOpen(false)}
//       />
//       <div
//         className={`fixed top-0 left-0 z-50 h-full w-[250px] bg-white shadow-lg transform transition-transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-lg font-semibold">Menu</h2>
//           <button onClick={() => setIsOpen(false)}>
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//         <Sidebar />
//       </div> 



//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-10 space-y-6 max-w-7xl w-full md:ml-[250px]">
//         <div className='flex items-center justify-between mb-6'>
//         <h1 className="text-3xl font-bold text-[#0046A5] mb-6 ml-14 md:ml-0">
//           Hi, {businessName}
//         </h1>

//         {/* Profile Image */}
//     {user?.avatar ? (
//       <img
//         src={user.avatar}
//         alt="Profile"
//         className="w-12 h-12 rounded-full object-cover border-2 border-[#0046A5] shadow-md"
//       />
//     ) : (
//       <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border-2 border-gray-300">
//         <User className='w-6 h-6 text-gray-500'/>
//       </div>
//     )}
//     </div>


//         {/* Stats */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-[#0028AE] text-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold mb-2">Invoices This Month</h2>
//             <p className="text-2xl font-bold">{stats.totalInvoicesThisMonth}</p>
//           </div>

//           <div className="bg-gradient-to-r from-[#50D6FE] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold mb-2">Revenue (Paid)</h2>
//             <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue).toLocaleString()}</p>
//           </div>

//           <div className="bg-[#00A6FA] text-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold mb-2">Unpaid Invoices</h2>
//             <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Sales</h2>
//             <p className="text-xl font-bold">{formatCurrency(stats.totalSales)}</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Goods Sold</h2>
//             <p className="text-xl font-bold">{stats.totalQuantity}</p>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4 text-[#0046A5]">Sales Chart</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip formatter={(value) => formatCurrency(value)} />
//               <Legend />
//               <Bar dataKey="Paid" fill="#0046A5" />
//               <Bar dataKey="Unpaid" fill="#00B86B" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* modal */}
//         {showWelcomeModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 text-center animate-fadeIn">
//             <h2 className="text-xl font-bold text-[#0046A5] mb-4">
//               Welcome to QuickInvoice NG 🎉
//             </h2>
//             <p className="text-gray-700 mb-2">
//               Here's how to get started:
//             </p>
//             <ul className="text-gray-600 text-left mb-4 list-disc list-inside space-y-1">
//               <li>Create and send invoices easily.</li>
//               <li>Mark invoices as paid to generate receipts.</li>
//               <li>Add or Update Bank Account details in "Setting" so it can show on Invoices</li>
//               <li>Monitor business growth on your dashboard.</li>
//               <li>Track business growth from your reports.</li>
//               <li>And many other features to automate your business !</li>
//             </ul>
//             <button
//               onClick={handleCloseWelcome}
//               className="bg-[#0046A5] text-white px-6 py-2 rounded-lg hover:bg-[#00398D] transition"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       </main>
//       {children}
//       <QuickBuddy />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import Sidebar from "../components/Sidebar"; 
import { X, User, Bell, TrendingUp, CreditCard, Package, Clock, Menu, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { fetchUser } from '../utils/getUser';
import { toast } from 'react-hot-toast';
import QuickBuddy from '../components/QuickBuddy';

const API = "https://quickinvoice-backend-1.onrender.com";

// const API = "http://localhost:4000";

const Dashboard = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { formatCurrency } = useCurrency();
  const [stats, setStats] = useState({
    totalInvoicesThisMonth: 0,
    totalRevenue: 0,
    totalUnpaid: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  // Modals state
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    nationality: "Nigeria",
    date_of_birth: "",
    residential_address: "",
    occupation: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [userRes, invoiceRes] = await Promise.all([
          axios.get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/invoices`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const userData = userRes.data;
        const invoicesData = invoiceRes.data;

        setUser(userData);
        setBusinessName(userData.businessName || '');

        // KYC Check
        if (!userData.nationality || !userData.date_of_birth || !userData.residential_address || !userData.occupation) {
          setShowPromptModal(true);
        }

        // Welcome Modal Check
        if (!localStorage.getItem("hasSeenWelcomeModal")) setShowWelcomeModal(true);

        // Process Stats
        const now = new Date();
        const invoicesThisMonth = invoicesData.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
        });

        setInvoices(invoicesThisMonth);
        setStats({
          totalInvoicesThisMonth: invoicesThisMonth.length,
          totalRevenue: invoicesThisMonth.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
          totalUnpaid: invoicesThisMonth.filter(inv => inv.status !== 'paid').length,
          totalSales: invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0),
          totalQuantity: invoicesThisMonth.reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + it.quantity, 0), 0),
        });

      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) initializeDashboard();
  }, [token]);

  const chartData = invoices.map(inv => ({
    date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    amount: inv.total,
    status: inv.status
  }));

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed h-screen w-[280px] border-r border-slate-200 bg-white z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-[#001325]/40 backdrop-blur-sm lg:hidden" 
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-[70] h-full w-[280px] bg-white lg:hidden"
            >
              <Sidebar closeMenu={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-[280px] min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Menu size={24} className="text-[#001325]" />
              </button>
              <div>
                <h1 className="text-xl font-black text-[#001325] tracking-tight">
                  Dashboard
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-[#0028AE] transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-10 w-10 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0028AE]/5 text-[#0028AE]">
                    <User size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
          {/* Welcome Section */}
          <section>
            <h2 className="text-3xl font-black text-[#001325] tracking-tighter">
              Welcome back, <span className="text-[#0028AE]">{businessName}</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Here is what's happening with your business today.</p>
          </section>

          {/* Primary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              label="Revenue (Paid)" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={TrendingUp} 
              trend="+12.5%" 
              color="bg-[#0028AE]" 
            />
            <StatCard 
              label="Pending Invoices" 
              value={stats.totalUnpaid} 
              icon={Clock} 
              trend="Attention" 
              color="bg-[#00A6FA]" 
            />
            <StatCard 
              label="Total Sales" 
              value={formatCurrency(stats.totalSales)} 
              icon={CreditCard} 
              color="bg-[#001325]" 
            />
          </div>

          {/* Secondary Stats & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-[#001325] tracking-tight">Performance Flow</h3>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0028AE]" /> <span className="text-[10px] font-bold uppercase text-slate-400">Paid</span></div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'paid' ? '#0028AE' : '#CBD5E1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Micro Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Volume</p>
                  <p className="text-2xl font-black text-[#001325]">{stats.totalQuantity}</p>
                  <p className="text-xs font-bold text-slate-400">Items Sold</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package size={24} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0028AE] to-[#00A6FA] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Monthly Active</p>
                  <p className="text-2xl font-black">{stats.totalInvoicesThisMonth}</p>
                  <p className="text-xs font-bold opacity-80">Generated Invoices</p>
                </div>
                <div className="absolute top-[-10%] right-[-10%] opacity-10">
                   <TrendingUp size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* KYC & Welcome Modals (Refined) */}
      <AnimatePresence>
        {(showPromptModal || showFormModal || showWelcomeModal) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#001325]/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            {showWelcomeModal ? (
              <WelcomeModal onClose={() => { localStorage.setItem("hasSeenWelcomeModal", "true"); setShowWelcomeModal(false); }} />
            ) : showFormModal ? (
              <KYCForm 
                formData={formData} 
                setFormData={setFormData} 
                isSubmitting={isSubmitting} 
                onSubmit={async () => {
                  setIsSubmitting(true);
                  await axios.put(`${API}/api/users/complete-profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
                  setShowFormModal(false);
                  setShowPromptModal(false);
                  toast.success("Profile Verified");
                  setIsSubmitting(false);
                }} 
              />
            ) : (
              <PromptModal onContinue={() => setShowFormModal(true)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <QuickBuddy />
    </div>
  );
};

// Sub-components for Cleanliness
const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-black text-[#001325] tracking-tighter">{value}</p>
  </div>
);

const WelcomeModal = ({ onClose }) => (
  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center">
    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#0028AE]">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-[#001325] tracking-tight mb-4">Welcome to the Elite Network</h2>
    <div className="text-left space-y-4 mb-10">
      {["Set up your bank details in Settings.", "Create your first professional invoice.", "Track real-time growth via reports."].map((text, i) => (
        <div key={i} className="flex gap-3 text-sm font-bold text-slate-500">
          <span className="text-[#0028AE]">•</span> {text}
        </div>
      ))}
    </div>
    <button onClick={onClose} className="w-full py-4 bg-[#001325] text-white rounded-2xl font-black text-sm hover:bg-[#0028AE] transition-all">
      Enter Workspace
    </button>
  </motion.div>
);

const KYCForm = ({ formData, setFormData, isSubmitting, onSubmit }) => (
  <motion.div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
    <h2 className="text-xl font-black text-[#001325] mb-6 tracking-tight">Verify Identity</h2>
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date of Birth</label>
        <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Address</label>
        <textarea placeholder="Residential Address" value={formData.residential_address} onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm h-24" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Occupation</label>
        <input type="text" placeholder="e.g. Retail Merchant" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
      </div>
    </div>
    <button onClick={onSubmit} disabled={isSubmitting} className="w-full mt-8 py-4 bg-[#0028AE] text-white rounded-2xl font-black text-sm hover:bg-[#001325] transition-all">
      {isSubmitting ? "Verifying..." : "Complete Setup"}
    </button>
  </motion.div>
);

const PromptModal = ({ onContinue }) => (
  <motion.div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl">
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0028AE]"><User size={30} /></div>
    <h3 className="text-xl font-black text-[#001325] mb-2 tracking-tight">Identity Verification</h3>
    <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">To comply with regional financial regulations, please complete your profile details.</p>
    <button onClick={onContinue} className="w-full py-4 bg-[#001325] text-white rounded-2xl font-black text-sm">Update Now</button>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="flex min-h-screen bg-[#F8FAFC]">
    <div className="hidden lg:block w-[280px] bg-white border-r" />
    <div className="flex-1 p-10 space-y-10">
      <div className="h-10 w-48 bg-slate-200 rounded-full animate-pulse" />
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />)}
      </div>
      <div className="h-80 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
    </div>
  </div>
);

export default Dashboard;
