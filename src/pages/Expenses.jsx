/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const API = "https://quickinvoice-backend-1.onrender.com"

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const navigate = useNavigate()

  const printRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  const exportExpensesPDF = async () => {
  try {
    setExporting(true);
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: 794,
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
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`Expenses-${month}.pdf`);
  } catch (err) {
    console.error(err);
    alert("Failed to export expenses");
  } finally {
    setExporting(false);
  }
};


  const [form, setForm] = useState({
    title: "",
    category: "Others",
    amount: "",
    paymentMethod: "cash",
    expenseDate: "",
    note: "",
  });

  const token = localStorage.getItem("token");

  const fetchExpenses = async (selectedMonth = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/expenses${selectedMonth ? `?month=${selectedMonth}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(res.data.expenses);
    } catch (err) {
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(month);
  }, [month]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
      `${API}/api/expenses`,
      {
        ...form,
        amount: Number(form.amount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setForm({
      title: "",
      category: "Others",
      amount: "",
      paymentMethod: "cash",
      expenseDate: "",
      note: "",
    });
    fetchExpenses(month);
  } catch (error) {
    console.error(error);
    alert("Failed to add expense");
  }
};


  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 border-4 border-[#0046A5] border-t-[#00A6FA] rounded-full animate-spin" />
            <p className="mt-4 text-[#0046A5] font-semibold">
              Preparing your Expenses…
            </p>
          </motion.div>
        </div>
      );
    }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0028AE]">Expenses</h1>
        <p className="text-gray-500 text-sm">
          Track and manage your business spending
        </p>
      </div>

      {/* Controls */}
     <div className="flex flex-col gap-1 w-full sm:w-auto mb-6">
        <label className="text-sm font-medium text-gray-700">
          Expense Month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-[220px]"
        />
      </div>

      <div className="flex gap-3">
      <button
        onClick={exportExpensesPDF}
        disabled={exporting || expenses.length === 0}
        className="bg-[#0028AE] hover:bg-[#00A6FA] text-white px-4 py-2 rounded-lg text-sm font-medium shadow disabled:opacity-50 w-full sm:w-auto"
      >
        {exporting ? "Preparing PDF..." : "Print Expenses (PDF)"}
      </button>
    </div>


      {/* Add Expense */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <input
          placeholder="Expense title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-lg px-3 py-2"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded-lg px-3 py-2"
        >
          <option>Rent</option>
          <option>Utilities</option>
          <option>Internet</option>
          <option>Transport</option>
          <option>Supplies</option>
          <option>Salary</option>
          <option>Marketing</option>
          <option>Maintenance</option>
          <option>Others</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border rounded-lg px-3 py-2"
          required
        />
        <select
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          className="border rounded-lg px-3 py-2"
        >
          <option value="cash">Cash</option>
          <option value="transfer">Transfer</option>
          <option value="card">Card</option>
        </select>


        {/* date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Expense Date
          </label>
          <input
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
        </div>

        
        <button
          type="submit"
          className="bg-[#0028AE] hover:bg-[#00A6FA] text-white rounded-lg px-4 py-2 font-medium"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-b">
                <td className="p-3">{e.title}</td>
                <td className="p-3 text-right font-medium">
                  ₦{e.amount.toLocaleString()}
                </td>
                <td className="p-3">{e.category}</td>
                <td className="p-3">
                  {new Date(e.expenseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 text-right">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold text-[#0028AE]">
          ₦{totalExpenses.toLocaleString()}
        </p>
      </div>


      {/* printable statement */}

      <div className="absolute left-[-9999px] top-0">
  <div
    ref={printRef}
    className="bg-white p-8 text-gray-800"
    style={{ width: "794px" }} // A4 width
  >
    {/* Header */}
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0028AE]">
          Expenses Statement
        </h1>
        <p className="text-sm text-gray-500">Period: {month}</p>
      </div>
      <div className="text-right">
        <h2 className="font-semibold text-lg">QuickInvoice</h2>
        <p className="text-xs text-gray-500">
          Professional Expense Report
        </p>
      </div>
    </div>
    {/* Table */}
    <table className="w-full border-collapse text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">Category</th>
          <th className="p-2 text-left">Payment</th>
          <th className="p-2 text-right">Amount</th>
          <th className="p-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e._id} className="border-b">
            <td className="p-2">{e.title}</td>
            <td className="p-2">{e.category}</td>
            <td className="p-2 capitalize">{e.paymentMethod}</td>
            <td className="p-2 text-right font-medium">
              ₦{e.amount.toLocaleString()}
            </td>
            <td className="p-2">
              {new Date(e.expenseDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* Summary */}
    <div className="mt-6 flex justify-end">
      <div className="w-1/2 border rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between text-sm">
          <span>Total Expenses</span>
          <span className="font-semibold">
            ₦{totalExpenses.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
    {/* Footer */}
    <div className="mt-8 text-center text-xs text-gray-400">
      Generated by QuickInvoice • Smart Business Tools
    </div>
  </div>
</div>

    {/* Floating Q Button at Bottom */}
        <button
          onClick={() => navigate("/dashboard")}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
        >
          Q
        </button>


    </div>
  );
}
