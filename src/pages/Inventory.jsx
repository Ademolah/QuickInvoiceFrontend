/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { useCurrency } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Search, Package, Tag, Hash, 
  Layers, X, Filter, ChevronRight, AlertCircle, FileText, ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrintInventory from "../components/PrintInventory";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import autoTable from "jspdf-autotable";
import Barcode from 'react-barcode';
import { useAlert } from "../context/AlertContext";

/* =========================
   WORLD-CLASS UI COMPONENTS
   ========================= */

const StatusBadge = ({ stock }) => {
  const isLow = stock > 0 && stock <= 5;
  const isOut = stock <= 0;
  
  if (isOut) return <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100">Out of Stock</span>;
  if (isLow) return <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">Low Stock</span>;
  return <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">In Stock</span>;
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

/* =========================
   API CONFIG
   ========================= */
const api = axios.create({ baseURL: "https://quickinvoice-backend-1.onrender.com/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Inventory() {
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const printRef = useRef(null);

  // States
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportItems, setExportItems] = useState([]);
  const { showAlert } = useAlert();

  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  }, []);

  const [form, setForm] = useState({
    _id: null, name: "", sku: "", barcode: "", price: "", stock: "", category: "", description: "",
  });

  // const categories = ["Phones", "Laptops", "Accessories", "Gadgets", "Men's Clothing", "Women's Clothing", "Health", "Groceries", "Services", "Other"];

  const categories = [ // Electronics & Tech
  "Phones",
  "Laptops",
  "Tablets",
  "Accessories",
  "Computer Peripherals",
  "Gadgets",
  "Smart Home Devices",
  "Gaming Consoles",
  "Gaming Accessories",
  // Fashion & Lifestyle
  "Men's Clothing",
  "Women's Clothing",
  "Children's Clothing",
  "Footwear",
  "Bags & Wallets",
  "Watches",
  "Jewelry",
  "Beauty & Cosmetics",
  "Fragrances",
  // Health & Medicine
  "Medicine",
  "Medical Equipment",
  "Health Supplements",
  "Personal Care",
  // Home & Furniture
  "Furniture",
  "Home Decor",
  "Kitchen Appliances",
  "Household Items",
  "Lighting & Fixtures",
  // Food & Restaurant
  "Restaurant",
  "Fast Food",
  "Groceries",
  "Beverages",
  "Bakery Items",
  "Frozen Foods",
  // Office & Stationery
  "Stationery",
  "Office Supplies",
  "Printing & Packaging",
  "School Supplies",
  // Auto & Industrial
  "Automobile Parts",
  "Car Accessories",
  "Motorcycles & Parts",
  "Industrial Equipment",
  // Services & Digital
  "Digital Products",
  "Services",
  "Subscriptions",
  // Others
  "Sports & Fitness",
  "Toys & Games",
  "Books & Educational Materials",
  "Agricultural Products",
  "Other"];

  /* =========================
     LOGIC HANDLERS
     ========================= */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      setItems(res.data || []);
    } catch (e) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(i => 
      i.name?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const totals = useMemo(() => ({
    totalProducts: filtered.length,
    totalUnits: filtered.reduce((s, it) => s + Number(it.stock || 0), 0),
    totalValueSold: filtered.reduce((s, it) => s + Number(it.sold || 0), 0),
    totalValue: filtered.reduce((s, it) => s + Number(it.stock || 0) * Number(it.price || 0), 0)
  }), [filtered]);



const saveItem = async () => {
  // 1. Premium validation feedback
  if (!form.name || !form.price || !form.stock) {
  showAlert("Please fill all required fields", "warning");
  
  return setError("Required fields missing");
}

  setSaving(true);
  
  // Create a loading toast instance to show "work in progress"
  const loadingToast = toast.loading(mode === "create" ? "Creating item..." : "Updating item...", {
    style: { borderRadius: '15px', background: '#0F172A', color: '#fff', fontSize: '12px' }
  });

  try {
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), barcode: form.barcode?.trim() || undefined };
    const res = mode === "create" 
      ? await api.post("/inventory", payload) 
      : await api.put(`/inventory/${form._id}`, payload);

    setItems(prev => mode === "create" 
      ? [res.data, ...prev] 
      : prev.map(it => it._id === form._id ? res.data : it)
    );

    // 2. Success Feedback (replaces loading toast)
    toast.success(`${form.name} saved successfully!`, {
      id: loadingToast,
      icon: '✅',
      style: { borderRadius: '15px', background: '#0F172A', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
    });

    setOpen(false);
  } catch (e) {
    const errorMsg = e.response?.data?.message || "Save failed";
    
    // 3. Error Feedback (replaces loading toast)
    toast.error(errorMsg, {
      id: loadingToast,
      style: { borderRadius: '15px', background: '#BE123C', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
    });

    setError(errorMsg);
  } finally {
    setSaving(false);
  }
};

  const deleteItem = async (id) => {
    if (!window.confirm("Delete product?")) return;
    setBusyId(id);
    try {
      await api.delete(`/inventory/${id}`);
      setItems(prev => prev.filter(it => it._id !== id));
    } finally { setBusyId(null); }
  };

  const exportInventoryPDF = async () => {
    setExporting(true);
    try {
      const res = await api.get("/inventory/export/all");
      setExportItems(res.data.items);
      setTimeout(async () => {
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save("Inventory.pdf");
        setExporting(false);
      }, 500);
    } catch { setExporting(false); }
  };



//sales summary

const [reportRange, setReportRange] = useState('monthly');
const token = localStorage.getItem("token");

const [isGenerating, setIsGenerating] = useState(false);

const handleExportSalesReport = async () => {
  setIsGenerating(true);
  try {
    const res = await api.get(`/pos/sales-summary?range=${reportRange}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const { summary, grandTotal, period } = res.data;
    generateSalesReportPDF(summary, grandTotal, period, user);
    toast.success("Report downloaded successfully");
  } catch (err) {
  showAlert("We encountered an issue fetching your sales data. Please check your connection or refresh the dashboard.", "error");
  } finally {
    setIsGenerating(false);
  }
};

const generateSalesReportPDF = (data, total, range, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const brandColor = [0, 40, 174]; // Your #0028AE Blue
  const secondaryColor = [15, 23, 42]; // Slate-900

  // 1. BRAND HEADER (Solid Blue Bar)
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(user?.businessName?.toUpperCase() || "QUICKPOS", 15, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${range.toUpperCase()} PERFORMANCE REPORT`, 15, 30);
  doc.text(`DATE: ${new Date().toLocaleDateString()}`, pageWidth - 15, 30, { align: "right" });

  // 2. REVENUE SUMMARY BOX
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 50, pageWidth - 30, 25, 3, 3, "F");
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(9);
  doc.text("TOTAL REVENUE GENERATED", 25, 60);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text(`N${total.toLocaleString()}`, 25, 70);

  // 3. THE TABLE
  const tableColumn = ["ITEM DESCRIPTION", "UNITS", "AVG PRICE", "TOTAL REVENUE"];
  const tableRows = data.map(item => [
    item.name.toUpperCase(),
    item.quantity,
    `N${(item.revenue / item.quantity).toLocaleString()}`,
    `N${item.revenue.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 
        0: { cellWidth: 80 },
        3: { fontStyle: 'bold', halign: 'right' } 
    },
    alternateRowStyles: { fillColor: [250, 252, 255] },
    margin: { left: 15, right: 15, bottom: 25 }, // 🚀 Margin for footer

    // 🛠️ THE WORLD-CLASS FOOTER
    didDrawPage: (data) => {
      const pWidth = doc.internal.pageSize.getWidth();
      const pHeight = doc.internal.pageSize.getHeight();

      // Separator Line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(15, pHeight - 20, pWidth - 15, pHeight - 20);

      // Footer Text
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate-400
      
      // Left: Timestamp
      const timestamp = `Generated: ${new Date().toLocaleString()} | QuickPOS`;
      doc.text(timestamp, 15, pHeight - 12);

      // Center: Page Number
      const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
      doc.text(pageStr, pWidth / 2, pHeight - 12, { align: "center" });

      // Right: Branding/Stamp
      doc.setFont("helvetica", "bolditalic");
      doc.text("OFFICIAL BUSINESS RECORD", pWidth - 15, pHeight - 12, { align: "right" });
    }
  });

  doc.save(`${user?.businessName || 'QuickPOS'}_Report_${range}.pdf`);
};




  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER SECTION */}
<div className="bg-slate-900 pt-12 pb-20 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Inventory</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Manage your stock and business value</p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-3">
        {/* 🚀 START: SALES REPORT GENERATOR SECTION */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-sm transition-all hover:border-slate-600">
          <select 
            value={reportRange} 
            onChange={(e) => setReportRange(e.target.value)}
            className="bg-transparent text-slate-300 text-[11px] font-black uppercase tracking-wider px-3 outline-none border-none cursor-pointer hover:text-white"
          >
            <option value="weekly" className="bg-slate-900">Weekly</option>
            <option value="monthly" className="bg-slate-900">Monthly</option>
            <option value="yearly" className="bg-slate-900">Yearly</option>
          </select>
          
          <button 
            onClick={handleExportSalesReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-md active:scale-95"
          >
            <FileText size={14} />
            Sales Report
          </button>
        </div>
        {/* 🚀 END: SALES REPORT GENERATOR SECTION */}

        <button 
          onClick={exportInventoryPDF} 
          disabled={exporting} 
          className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-transparent active:scale-95"
        >
          <FileText size={16} /> {exporting ? "..." : "Export"}
        </button>

        <button 
          onClick={() => { 
            setMode("create"); 
            setForm({ name: "", sku: "", price: "", stock: "", category: "", description: "" }); 
            setOpen(true); 
          }} 
          className="flex items-center gap-2 px-5 py-3 bg-[#0028AE] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>
    </div>
  </div>
</div>

          {/* QUICK SEARCH */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKUs, or categories..." 
              className="w-full bg-slate-800 border-none text-white placeholder:text-slate-500 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

     
      {/* STATS OVERLAY */}
<div className="max-w-7xl mx-auto px-6 -mt-10">
  {/* 🚀 Changed grid-cols-1 md:grid-cols-3 to md:grid-cols-4 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard 
      title="Total Items" 
      value={totals.totalProducts} 
      icon={Package} 
      colorClass="bg-blue-50 text-blue-600" 
    />
    <StatCard 
      title="Stock Count" 
      value={totals.totalUnits} 
      icon={Layers} 
      colorClass="bg-indigo-50 text-indigo-600" 
    />
    <StatCard 
      title="Total Value" 
      value={formatCurrency(totals.totalValue)} 
      icon={Tag} 
      colorClass="bg-emerald-50 text-emerald-600" 
    />
    {/* 🚀 NEW STAT CARD: Total Units Sold */}
    <StatCard 
      title="Units Sold" 
      value={formatCurrency(totals.totalValueSold)} 
      icon={ShoppingCart} // Or use 'TrendingUp' from lucide-react
      colorClass="bg-amber-50 text-amber-600" 
    />
  </div>
</div>

      {/* PRODUCT LIST */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-40">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Fetching Inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No items found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">Start by adding your first product to the inventory database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <StatusBadge stock={item.stock} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm(item); setMode("edit"); setOpen(true); }} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors">{busyId === item._id ? "..." : <Trash2 size={16} />}</button>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-1 truncate">{item.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{item.category || "No Category"}</p>


                  {/* 🚀 BARCODE SECTION: The "Pro" Touch */}
                  {item.barcode && (
                    <div className="my-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-50 flex flex-col items-center justify-center group-hover:bg-white group-hover:border-slate-100 transition-all">
                      <div className="scale-[0.8] origin-center opacity-80 group-hover:opacity-100 transition-all">
                        <Barcode 
                          value={item.barcode} 
                          width={1.2} 
                          height={30} 
                          fontSize={10} 
                          background="transparent" 
                          lineColor="#1e293b" // Slate-800
                        />
                      </div>
                      <span className="text-[8px] font-bold text-slate-300 group-hover:text-slate-400 tracking-[0.2em] -mt-1">
                        {item.barcode}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Current Stock</p>
                      <p className="text-xl font-black text-slate-800">{item.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Unit Price</p>
                      <p className="text-xl font-black text-[#0028AE]">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{mode === "create" ? "New Product" : "Edit Product"}</h2>
                  <button onClick={() => setOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800 transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Product Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="iPhone 15..." className="col-span-2" />
                    <InputField label="SKU / ID" value={form.sku} onChange={v => setForm({...form, sku: v})} placeholder="SKU-001" />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <InputField label="Unit Price" type="number" value={form.price} onChange={v => setForm({...form, price: v})} placeholder="0.00" />
                    <InputField label="Stock Level" type="number" value={form.stock} onChange={v => setForm({...form, stock: v})} placeholder="0" />
                  </div>
                  <InputField label="Description" value={form.description} onChange={v => setForm({...form, description: v})} placeholder="Optional product details..." textarea />
                </div>

                {error && <div className="mt-4 p-3 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}

                <button onClick={saveItem} disabled={saving} className="w-full mt-8 py-4 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {saving ? "Processing..." : mode === "create" ? "Add to Inventory" : "Update Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVIGATION FAB */}
      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <div className="font-black text-xl">Q</div>
      </button>

      {/* PRINT LAYER (HIDDEN) */}
      <div className="absolute left-[-9999px] top-0">
        <PrintInventory ref={printRef} items={exportItems} businessName={user?.businessName || "My Business"} />
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange, placeholder, type = "text", textarea = false, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 resize-none" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500" />
    )}
  </div>
);