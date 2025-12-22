import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Trash2,  Eye, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCurrency } from "../context/CurrencyContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
// import LoadingState from "../components/LoadingState";
// import api from "../utils/api";

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const { code, } = useCurrency(); // 👈 get currency settings
  
    // helper to format currency
    const formatCurrency = (amount) =>
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency: code,
      }).format(amount);

  const deleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(invoices.filter(inv => inv._id !== id));
    } catch (err) {
      alert("Failed to delete invoice");
    }
  };

  // const updateInvoice = async (id) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`${API}/api/invoices/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setInvoices(invoices.filter(inv => inv._id !== id));
  //   } catch (err) {
  //     alert("Failed to delete invoice");
  //   }
  // };

  const markPaid = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API}/api/invoices/${id}/pay`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(invoices.map(inv => (inv._id === id ? res.data : inv)));
      toast.success("Receipt generated successfully!");
    } catch (err) {
      alert("Failed to mark as paid");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  
  // if(loading) return <LoadingState title="Loading your invoices..."/>
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
                Fetching your Invoices...
              </p>
            </motion.div>
          </div>
        );
      }
  if(error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0046A5]">Invoices</h1>
        <button
            onClick={() => navigate('/invoices/new')}
            className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded shadow transition-all duration-300"
            >
            Create New Invoice
            </button>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No invoices found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-[#0046A5] text-white">
              <tr>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Due Date</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                        <Link to={`/invoices/${inv._id}`} className="text-[#0046A5] font-semibold hover:underline">
                            {inv.clientName}
                        </Link>
                    </td>
                  <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
                  <td className={`px-4 py-3 font-semibold ${inv.status === 'paid' ? 'text-green-600' : inv.status === 'overdue' ? 'text-red-600' : 'text-gray-700'}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </td>
                  <td className="px-4 py-3">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => markPaid(inv._id)}
                      to={`/invoices/${inv._id}`}
                      className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition"
                      title="Mark Paid"
                      disabled={inv.status === 'paid'}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <Link
                      to={`/invoices/${inv._id}`}
                      className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    {/* <Link
                      onClick={()=> updateInvoice(inv._id)}
                      className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link> */}
                    <button
                      onClick={() => deleteInvoice(inv._id)}
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Q
        </button>

    </div>
  );
};

export default InvoiceList;
