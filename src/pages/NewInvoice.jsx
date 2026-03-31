/* eslint-disable no-unused-vars */



import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Trash2, Calendar, User, Phone, Mail, 
  FileText, ArrowLeft, Info, Percent, Wallet 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import VatToggle from '../components/VatToggle';
import { useCurrency } from "../context/CurrencyContext";

const API = "https://quickinvoice-backend-1.onrender.com"


const NewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useCurrency();
  const selectedClient = useMemo(() => location.state?.client || null, [location.state]);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [isVatEnabled, setIsVatEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setClientName(selectedClient.name || "");
      setClientEmail(selectedClient.email || "");
      setClientPhone(selectedClient.phone || "");
    }
  }, [selectedClient]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : value === '' ? '' : Number(value);
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) * Number(it.unitPrice)), 0);
  const total = Math.max(0, subtotal + Number(tax) - Number(discount));

  const handleVatToggle = (checked) => {
    setIsVatEnabled(checked);
    setTax(checked ? Number((subtotal * 0.075).toFixed(2)) : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || items.some(i => !i.description)) {
      toast.error('Please complete client info and item descriptions');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/api/invoices`,
        { clientName, clientEmail, clientPhone, items, tax, discount, dueDate, notes, outstandingBalance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Invoice created successfully!");
      navigate(`/invoices/${response.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-6 md:px-10 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <h1 className="text-2xl font-black text-[#001325]">Draft Invoice</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#0028AE] hover:bg-[#001325] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-700/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Issue Invoice'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* Step 1: Client Information */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-[#0028AE]">
            <User size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Client Details</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="Client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0028AE]/10 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="email@company.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0028AE]/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</label>
              <input
                type="text"
                placeholder="+234..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0028AE]/10 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Line Items */}
<section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
  <div className="p-8 pb-4 flex items-center justify-between">
    <div className="flex items-center gap-2 text-[#0028AE]">
      <FileText size={18} />
      <h2 className="text-xs font-black uppercase tracking-[0.2em]">Line Items</h2>
    </div>
  </div>
  
  <div className="px-6 md:px-8 space-y-4 mb-6">
    {/* Desktop Header: Hidden on Mobile */}
    <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
      <div className="col-span-6">Description</div>
      <div className="col-span-2 text-center">Qty</div>
      <div className="col-span-2 text-right">Price</div>
      <div className="col-span-2 text-right pr-4">Total</div>
    </div>

    <AnimatePresence initial={false}>
      {items.map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-slate-50/50 p-6 md:p-4 rounded-[2rem] md:rounded-3xl border border-transparent hover:border-slate-100 transition-all relative group"
        >
          {/* DESCRIPTION */}
          <div className="w-full md:col-span-6">
            <label className="md:hidden text-[10px] font-black uppercase text-slate-400 block mb-1">Description</label>
            <input
              type="text"
              placeholder="Service or product name"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-[#001325] placeholder:text-slate-300 outline-none"
            />
          </div>

          {/* QUANTITY & UNIT PRICE (Grouped on mobile for better flow) */}
          <div className="grid grid-cols-2 md:contents gap-4 w-full">
            <div className="md:col-span-2">
              <label className="md:hidden text-[10px] font-black uppercase text-slate-400 block mb-1 text-left">Qty</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl py-2 px-2 text-left md:text-center text-sm font-bold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="md:hidden text-[10px] font-black uppercase text-slate-400 block mb-1 text-left">Unit Price</label>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl py-2 px-2 text-left md:text-right text-sm font-bold outline-none"
              />
            </div>
          </div>

          {/* TOTAL & REMOVE BUTTON */}
          <div className="w-full md:col-span-2 flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t border-slate-100 md:border-none">
            <div className="md:hidden text-[10px] font-black uppercase text-slate-400">Total</div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-[#001325]">
                {code} {(item.quantity * item.unitPrice).toLocaleString()}
              </span>
              {items.length > 1 && (
                <button 
                  onClick={() => removeItem(index)} 
                  className="p-2 bg-red-50 text-red-500 rounded-lg md:bg-transparent md:text-slate-300 md:hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>

    <button
      onClick={addItem}
      className="flex items-center gap-2 text-[#0028AE] text-[10px] font-black uppercase tracking-widest p-4 border-2 border-dashed border-slate-100 w-full justify-center rounded-[1.5rem] hover:bg-blue-50/30 transition-all mt-2"
    >
      <Plus size={16} /> Add Another Item
    </button>
  </div>
</section>

        {/* Step 3: Financials & Notes */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-[#0028AE]">
              <Calendar size={18} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Settings & Notes</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Prev. Balance</label>
                <input type="number" placeholder="0.00" value={outstandingBalance} onChange={(e) => setOutstandingBalance(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" />
              </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Notes to Client</label>
                <textarea rows="3" placeholder="Thank you for your business..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none resize-none" />
            </div>
            <div className="pt-4 border-t border-slate-50">
               <VatToggle isVatEnabled={isVatEnabled} onToggle={handleVatToggle} />
            </div>
          </div>

          <div className="bg-[#001325] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400 text-sm font-bold">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                  <Percent size={14} /> VAT (7.5%)
                </span>
                <span className="text-emerald-400 font-bold">+{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                  <Wallet size={14} /> Discount
                </span>
                <input 
                   type="number" 
                   value={discount} 
                   onChange={(e) => setDiscount(e.target.value)} 
                   className="bg-white/10 w-24 text-right px-2 py-1 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-white/30"
                />
              </div>
              <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Amount Due</div>
                <div className="text-4xl font-black tracking-tighter">
                  <span className="text-xs mr-1 opacity-50">{code}</span>
                  {total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;
