

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, CheckCircle, Edit } from "lucide-react";



const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [businessName, setBusinessName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");



// Fetch account details
  const AccountDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/users/account-details', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res);
      
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



  const token = localStorage.getItem("token");


  

  useEffect(() => {
    fetchInvoice();
  }, []);

  

  const fetchInvoice = async () => {
    try {
      // Fetch invoice
      const res = await axios.get(`http://localhost:4000/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(res.data);
      setForm(res.data);

      // Fetch business name from user
      const userRes = await axios.get(`http://localhost:4000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setBusinessName(userRes.data.businessName || "");
      setBankName(userRes.data.accountDetails.bankName || "");
      setAccountNumber(userRes.data.accountDetails.accountNumber || "");
      setAccountName(userRes.data.accountDetails.accountName || "");

      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadPDF = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:4000/api/invoices/${invoice._id}/pdf`,
      { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${invoice._id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert('Failed to generate PDF.');
  }
};



  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = field === "quantity" || field === "unitPrice" ? Number(value) : value;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    const subtotal = updatedItems.reduce((s, it) => s + it.total, 0);
    const total = Math.max(0, subtotal + form.tax - form.discount);
    setForm(prev => ({ ...prev, items: updatedItems, subtotal, total }));
  };

  const markPaid = async () => {
    try {
      const res = await axios.patch(`http://localhost:4000/api/invoices/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInvoice = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/invoices");
    } catch (err) {
      console.error(err);
    }
  };

  const saveInvoice = async () => {
    try {
      const res = await axios.put(`http://localhost:4000/api/invoices/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg text-gray-500">Loading...</div>;
  if (!invoice) return <div className="text-center mt-20 text-lg text-red-500">Invoice not found</div>;

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0046A5]">Invoice Details</h1>
          <p className="text-gray-500 mt-1">Business: {businessName || "—"}</p>
        </div>
        <div className="flex gap-2">
          {invoice.status !== "paid" && (
            <button onClick={markPaid} className="bg-[#00B86B] hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
              <CheckCircle size={18} /> Mark Paid
            </button>
          )}
          <button onClick={deleteInvoice} className="bg-red-500 hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
            <Trash2 size={18} /> Delete
          </button>
          <button onClick={() => setEditing(!editing)} className="bg-[#0046A5] hover:opacity-90 text-white px-4 py-2 rounded shadow flex items-center gap-2">
            <Edit size={18} /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600 font-semibold">Client Name</label>
            {editing ? (
              <input
                type="text"
                value={form.clientName}
                onChange={e => handleInputChange("clientName", e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="mt-1">{invoice.clientName}</p>
            )}
          </div>
          <div>
            <label className="text-gray-600 font-semibold">Client Email</label>
            {editing ? (
              <input
                type="email"
                value={form.clientEmail || ""}
                onChange={e => handleInputChange("clientEmail", e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="mt-1">{invoice.clientEmail || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-gray-600 font-semibold">Client Phone</label>
            {editing ? (
              <input
                type="text"
                value={form.clientPhone || ""}
                onChange={e => handleInputChange("clientPhone", e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="mt-1">{invoice.clientPhone || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-gray-600 font-semibold">Due Date</label>
            {editing ? (
              <input
                type="date"
                value={form.dueDate ? new Date(form.dueDate).toISOString().split("T")[0] : ""}
                onChange={e => handleInputChange("dueDate", e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="mt-1">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-[#0046A5] mb-4">Items</h2>
        {form.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 items-center mb-3">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => handleItemChange(idx, "description", e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                  className="border rounded px-2 py-1"
                  min={1}
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={e => handleItemChange(idx, "unitPrice", e.target.value)}
                  className="border rounded px-2 py-1"
                  min={0}
                />
                <p className="font-semibold">{item.total.toFixed(2)}</p>
              </>
            ) : (
              <>
                <p>{item.description}</p>
                <p>{item.quantity}</p>
                <p>{item.unitPrice}</p>
                <p className="font-semibold">{item.total.toFixed(2)}</p>
              </>
            )}
          </div>
        ))}
      </div>
      

      {/* Summary & Notes */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-end gap-6 mb-4">
          <p className="font-semibold">Subtotal: {invoice.subtotal.toFixed(2)}</p>
          <p className="font-semibold">Tax: {invoice.tax.toFixed(2)}</p>
          <p className="font-semibold">Discount: {invoice.discount.toFixed(2)}</p>
          <p className="font-bold text-[#0046A5]">Total: {invoice.total.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-gray-600 font-semibold">Notes:</label>
          {editing ? (
            <textarea
              value={form.notes || ""}
              onChange={e => handleInputChange("notes", e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          ) : (
            <p className="mt-1">{invoice.notes || "-"}</p>
          )}
        </div>

        {/* Account details */}
        <div className="bg-gray-50 p-4 rounded shadow mt-4">
            <h3 className="font-semibold text-lg mb-2">Account Details</h3>
            <p>Bank: {bankName}</p>
            <p>Account Number: {accountNumber}</p>
            <p>Account Name: {accountName}</p>
        </div>

        {/* Pdf button */}
        <button
        onClick={handleDownloadPDF}
        className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded shadow transition-all duration-300"
        >
        Download PDF
        </button>
        {editing && (
          <div className="flex justify-end mt-4">
            <button
              onClick={saveInvoice}
              className="bg-[#0046A5] hover:opacity-90 text-white px-6 py-2 rounded shadow font-semibold"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
