


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from "../components/Sidebar"; // Adjust path if needed
import { X} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext';

import { User } from 'lucide-react';

import { fetchUser } from '../utils/getUser';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

const Dashboard = ({children}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalInvoicesThisMonth: 0,
    totalRevenue: 0,
    totalUnpaid: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  //KYC
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    nationality: "Nigeria",
    date_of_birth: "",
    residential_address: "",
    occupation: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      if (
        !res.data.nationality ||
        !res.data.date_of_birth ||
        !res.data.residential_address ||
        !res.data.occupation
      ) {
        setShowPromptModal(true);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const token = localStorage.getItem("token");
    await axios.put(
      `${API}/api/users/complete-profile`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowFormModal(false);
    setShowPromptModal(false);
    toast.success("Information updated successfully!");
  };

  //welcome modal
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);
  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true"); // :white_check_mark: Do not show again
    setShowWelcomeModal(false);
  };


//image
const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser(token);
        setUser(data); // assuming backend responds with { user: {...} }
        console.log(data);
        
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    if (token) {
      getUser();
    }
  }, [token]);





  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch invoices
        const invoiceRes = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoicesData = invoiceRes.data;

        // Fetch user (business name)
        const userRes = await axios.get(`${API}/api/users/me`, {
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

  const { code, symbol } = useCurrency(); // 👈 get currency settings
  
    // helper to format currency
    const formatCurrency = (amount) =>
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency: code,
      }).format(amount);

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
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="sm:hidden md:block fixed h-screen w-[250px]  ">
        <Sidebar />
      </div>    

      {/* Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800">Submit Further Information</h2>
            <p className="text-sm text-gray-600 mt-2">
              To comply with regulations, we need some additional details before you continue.
            </p>
            <button
              onClick={() => setShowFormModal(true)}
              className="bg-[#0046A5] text-white w-full py-2 rounded-lg mt-4"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Complete Your Profile</h2>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Nationality"
                className="w-full border rounded px-3 py-2"
                value={formData.nationality}
                // onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                disabled
              />
              {/* <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              /> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Residential Address"
                className="w-full border rounded px-3 py-2 h-20"
                value={formData.residential_address}
                onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })}
              />
              <input
                type="text"
                placeholder="Occupation"
                className="w-full border rounded px-3 py-2"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-[#0046A5] text-white w-full py-2 rounded-lg mt-4 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}



      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[250px] bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <Sidebar />
      </div> 



      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 space-y-6 max-w-7xl w-full md:ml-[250px]">
        <div className='flex items-center justify-between mb-6'>
        <h1 className="text-3xl font-bold text-[#0046A5] mb-6 ml-14 md:ml-0">
          Hi, {businessName}
        </h1>

        {/* Profile Image */}
    {user?.avatar ? (
      <img
        src={user.avatar}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover border-2 border-[#0046A5] shadow-md"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border-2 border-gray-300">
        <User className='w-6 h-6 text-gray-500'/>
      </div>
    )}
    </div>


        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Invoices This Month</h2>
            <p className="text-2xl font-bold">{stats.totalInvoicesThisMonth}</p>
          </div>

          <div className="bg-gradient-to-r from-[#50D6FE] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Revenue (Paid)</h2>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue).toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-r from-[#00B86B] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Unpaid Invoices</h2>
            <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Sales</h2>
            <p className="text-xl font-bold">{formatCurrency(stats.totalSales)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Goods Sold</h2>
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
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Paid" fill="#0046A5" />
              <Bar dataKey="Unpaid" fill="#00B86B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* modal */}
        {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-[#0046A5] mb-4">
              Welcome to QuickInvoice NG 🎉
            </h2>
            <p className="text-gray-700 mb-2">
              Here's how to get started:
            </p>
            <ul className="text-gray-600 text-left mb-4 list-disc list-inside space-y-1">
              <li>Create and send invoices easily.</li>
              <li>Mark invoices as paid to generate receipts.</li>
              <li>Add or Update Bank Account details in "Setting" so it can show on Invoices</li>
              <li>Monitor business growth on your dashboard.</li>
              <li>Track business growth from your reports.</li>
              <li>And many other features to automate your business !</li>
            </ul>
            <button
              onClick={handleCloseWelcome}
              className="bg-[#0046A5] text-white px-6 py-2 rounded-lg hover:bg-[#00398D] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      </main>
      {children}
    </div>
  );
};

export default Dashboard;
