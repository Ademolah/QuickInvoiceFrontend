import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Trash2, Plus, Minus, Download, MessageCircle,  User, Store,Maximize, ArrowLeft, Zap, Printer, ChevronLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScannerModal from "../components/ScannerModal";
import { db } from '../db/posDb'
import SyncStatusBadge from "../components/SyncStatusBadge";

const API = "https://quickinvoice-backend-1.onrender.com";

const POSInterface = () => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [todaySales, setTodaySales] = useState([]);
  const [terminalStats, setTerminalStats] = useState({ total: 0, count: 0 });
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [lastSaleData, setLastSaleData] = useState(null);
  const [lastSaleItems, setLastSaleItems] = useState("");
  const [showScanner, setShowScanner] = useState(false);



// 1. Create a reusable fetch function
  const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const userRes = await axios.get(`${API}/api/users/me`, config);
    const currentUser = userRes.data;
    setUser(currentUser);

    // 1. DYNAMIC EXTRACTION: Check top-level OR inside activeContext
    const activeBusinessId = currentUser.activeBusinessId || currentUser.activeContext?.id;


    // 2. LOGIC FOR "CHARLES KITCHEN" FALLBACK
    // If there is no activeBusinessId, it means they are using the primary account.
    // Instead of 'return', we should fetch the primary data.
    
    let inventoryUrl = `${API}/api/inventory`;
    let salesUrl = `${API}/api/pos/today`;

    if (activeBusinessId) {
      inventoryUrl += `?businessId=${activeBusinessId}`;
      salesUrl += `?businessId=${activeBusinessId}`;
    }

    // 3. FETCH THE DATA
    const [prodRes, salesRes] = await Promise.all([
      axios.get(inventoryUrl, config),
      axios.get(salesUrl, config)
    ]);

    setInventory(prodRes.data);
    setTodaySales(salesRes.data.sales || []);
    setTerminalStats({
      total: salesRes.data.totalRevenue || 0,
      count: (salesRes.data.sales || []).length
    });

  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

  // 2. Initial load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = inventory.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, inventory]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    const currentQty = existing ? existing.quantity : 0;
    
    // Check if adding 1 more exceeds stock
    if (!validateStock(product._id, currentQty + 1)) return;

    setCart(prev => {
      if (existing) {
        return prev.map(item => 
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        productId: product._id, 
        name: product.name, 
        unitPrice: product.price, 
        quantity: 1 
      }];
    });
    setSearchTerm("");
  };

  const updateQty = (id, delta) => {
    const item = cart.find(i => i.productId === id);
    if (delta > 0 && !validateStock(id, item.quantity + 1)) return;

    setCart(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.productId !== id));
    toast.error("Item removed from cart");
  };

  // 🛡️ STOCK VALIDATOR (Add this to prevent the 400 error)
  const validateStock = (productId, requestedQty) => {
    const product = inventory.find(p => p._id === productId);
    if (product && requestedQty > product.stock) {
      toast.error(`Only ${product.stock} units of ${product.name} available!`, {
        icon: '⚠️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return false;
    }
    return true;
  };

  const handleBarcodeScan = (barcode) => {
  // 1. Search the main inventory array
  // We use String() on both sides to avoid type-mismatch (number vs string)
  const product = inventory.find(p => String(p.barcode) === String(barcode));

  if (product) {
    // 2. Check stock levels before adding
    if (product.stock <= 0) {
      toast.error(`Stock Alert: ${product.name} is empty`, {
        style: { borderRadius: '15px', background: '#BE123C', color: '#fff' }
      });
      return;
    }

    // 3. Add to your cart state
    addToCart(product); 
    
    // 4. Open the mobile drawer automatically
    setIsMobileCartOpen(true);

    // 5. World-Class Feedback
    toast.success(`Added ${product.name}`, {
      icon: '🛒',
      style: { borderRadius: '15px', background: '#0F172A', color: '#fff' }
    });

    // Haptic feedback for mobile devices
    if (navigator.vibrate) navigator.vibrate(100); 

  } else {
    // If barcode isn't found, show a subtle error
    toast.error(`Barcode [${barcode}] not found`, {
      style: { borderRadius: '15px', background: '#334155', color: '#fff' }
    });
  }
};


const downloadReceipt = (saleData) => {
    try {
      
      const isReprint = !!saleData?._id;
      const itemsToPrint = isReprint ? saleData.items : cart;
      const methodToPrint = isReprint ? (saleData.paymentDetails?.method || "N/A") : paymentMethod;
      const totalToPrint = isReprint ? saleData.totalAmount : cart.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
      const dateToPrint = isReprint ? new Date(saleData.createdAt) : new Date();

      const doc = new jsPDF({ unit: "mm", format: [80, 160] });

      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;
      const businessName = user?.activeContext?.businessName?.toUpperCase() || "QUICKPOS";
      if (businessName.length > 20) {
          doc.setFontSize(10); // Shrink for long names
      } else {
          doc.setFontSize(14); // Standard bold size
      }

      // --- 1. HEADER SECTION ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 19, 37);
      doc.text(businessName, centerX, 12, { align: "center" });
      // doc.text(user?.businessName?.toUpperCase() || "QUICKPOS", 40, 12, { align: "center" });
      
      doc.setDrawColor(200, 200, 200);
      doc.line(5, 15, 75, 15);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`CASHIER: ${user?.name?.toUpperCase() || 'STAFF'}`, 5, 22);
      doc.text(`METHOD:  ${methodToPrint.toUpperCase()}`, 5, 26);
      doc.text(`REF:     ${saleData?.receiptNumber || 'TXN-' + Date.now()}`, 5, 30);
      doc.text(`DATE:    ${dateToPrint.toLocaleString()}`, 5, 34);

      // --- 2. THE TABLE ---
      autoTable(doc, {
        startY: 38,
        head: [['ITEM DESCRIPTION', 'QTY', 'PRICE']],
        body: itemsToPrint.map(item => [
          item.name.toUpperCase(), 
          item.quantity, 
          // Use stored subtotal or calculate it
          (item.subtotal || item.unitPrice * item.quantity).toLocaleString()
        ]),
        theme: 'plain',
        styles: { fontSize: 7, cellPadding: 2, font: 'helvetica', textColor: [40, 40, 40] },
        headStyles: { fontStyle: 'bold', textColor: [0, 0, 0], borderBottom: { color: [0, 0, 0], width: 0.1 } },
        columnStyles: { 2: { halign: 'right' }, 1: { halign: 'center' } }
      });
      
      // --- 3. SUMMARY SECTION ---
      const finalY = doc.lastAutoTable.finalY || 70;
      doc.setLineDash([1, 1], 0);
      doc.line(5, finalY + 2, 75, finalY + 2);
      doc.setLineDash([], 0);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      
      doc.text("GRAND TOTAL", 5, finalY + 10);
      doc.text(`NGN ${totalToPrint.toLocaleString()}`, 75, finalY + 10, { align: "right" });

      // --- 4. FOOTER ---
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("Items purchased in good condition", 40, finalY + 20, { align: "center" });
      doc.text("are not returnable. Thank you!", 40, finalY + 23, { align: "center" });

      // SECURITY SEAL (The Rectangle Fix)
      doc.setDrawColor(0, 19, 37); // Use your brand dark blue for the border
      doc.rect(35, finalY + 28, 10, 10); 
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(0, 19, 37);
      doc.text("Q", 40, finalY + 35, { align: "center" }); // A stylized 'Q' for QuickPOS

      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("SECURE DIGITAL RECEIPT", 40, finalY + 41, { align: "center" });
      

      doc.save(`Receipt_${saleData?.receiptNumber || Date.now()}.pdf`);
    } catch (pdfError) {
      console.error("PDF Beauty Error:", pdfError);
      toast.error("Receipt failed. Check console.");
    }
  };


  

//   const handleFinalize = async () => {
//   if (cart.length === 0) return;

//   try {
//     const token = localStorage.getItem("token");
//     const totalAmount = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // const capturedNames = cart.map(item => item.name).join(", ");
    // setLastSaleItems(capturedNames);

//     // 🚀 Prepare items for backend
//     const formattedItems = cart.map(item => ({
//       productId: item.productId,
//       name: item.name,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice,
//       subtotal: item.unitPrice * item.quantity 
//     }));

//     const payload = {
//       items: formattedItems,
//       totalAmount,
//       paymentDetails: {
//         method: paymentMethod,
//         amountTendered: totalAmount,
//         changeDue: 0
//       }
//     };

//     const res = await axios.post(`${API}/api/pos/process`, payload, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

    // if (res.data.success) {
    //   // 1. Capture the sale data for WhatsApp
    //   setLastSaleData({
    //     receiptId: res.data.sale.receiptNumber || `QI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    //     total: totalAmount,
    //     method: paymentMethod
    //   });

//       // 2. Success Feedback
//       toast.success("Sale Recorded Successfully!", {
//         icon: '✅',
//         style: { borderRadius: '15px', background: '#10B981', color: '#fff' }
//       });

//       // 3. Trigger Actions
//       downloadReceipt(res.data.sale); // Keep PDF as backup
//       setCart([]);
//       setIsMobileCartOpen(false);
//       fetchData(); // Refresh Today's Revenue

//       // 4. 🚀 OPEN WHATSAPP MODAL
//       setShowWhatsappModal(true); 
//     }
//   } catch (err) {
//     const errorMsg = err.response?.data?.message || "Sale failed";
//     toast.error(errorMsg);
//     console.error("POS Error Details:", err.response?.data);
//   }
// };


const handleFinalize = async () => {
  if (cart.length === 0) return;

  const clientTxnId = window.crypto.randomUUID ? window.crypto.randomUUID() : `TXN-${Date.now()}`;
  const localReceiptNumber = `QN-POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const offlineCreatedAt = new Date().toISOString();
  
  const token = localStorage.getItem("token");
  const totalAmount = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const capturedNames = cart.map(item => item.name).join(", ");
  setLastSaleItems(capturedNames);

  const salePayload = {
    clientTxnId,
    receiptNumber: localReceiptNumber,
    items: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.unitPrice * item.quantity 
    })),
    totalAmount,
    paymentDetails: {
      method: paymentMethod,
      amountTendered: totalAmount,
      changeDue: 0
    },
    offlineCreatedAt,
    isOffline: !navigator.onLine
  };

  // --- THE TRUTH TRACKER ---
  // Start with local data; upgrade to server data if sync works.
  let finalSaleData = salePayload; 
  let apiSuccess = false;

  try {
    // 1. Save Locally (Safety First)
    await db.pendingSales.add(salePayload);

    // 2. Attempt Sync
    if (navigator.onLine) {
      try {
        const res = await axios.post(`${API}/api/pos/process`, 
          { sales: [salePayload] }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success || res.data.summary?.synced.length > 0) {
          apiSuccess = true;
          // If server returned the saved object, use it for the receipt
          if (res.data.sale) finalSaleData = res.data.sale; 
          
          await db.pendingSales.where({ clientTxnId }).delete();
          await db.syncedSales.add(finalSaleData);
        }
      } catch (syncErr) {
        console.warn("Offline fallback engaged.");
      }
    }

    // 3. UI & Actions (Using finalSaleData)
    setLastSaleData({
      receiptId: finalSaleData.receiptNumber,
      total: finalSaleData.totalAmount,
      method: finalSaleData.paymentDetails.method
    });

    toast.success(apiSuccess ? "Sale Synced!" : "Saved Offline ✅", {
      icon: apiSuccess ? '✅' : '📡',
      style: { borderRadius: '15px', background: apiSuccess ? '#10B981' : '#6366F1', color: '#fff' }
    });

    // 🚀 IMPORTANT: We now pass the 'Final' version to these functions
    downloadReceipt(finalSaleData); 
    setCart([]);
    setIsMobileCartOpen(false);
    
    if (apiSuccess) fetchData(); 

    setShowWhatsappModal(true); 

  } catch (err) {
    toast.error("Critical Storage Error.");
    console.error(err);
  }
};




 
const cartUIContent = (
  <div className="flex flex-col h-full">
    <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
       {/* 🚀 BACK ARROW: Only visible on mobile */}
       <button 
         onClick={() => setIsMobileCartOpen(false)} 
         className="md:hidden p-3 bg-slate-100 rounded-full active:scale-90"
       >
         <ArrowLeft size={20} className="text-slate-700" />
       </button>

       <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
         <ShoppingBag className="text-blue-600" /> Cart
       </h2>
       
       <div className="flex items-center gap-2">
      {/* 🚀 ADD SCANNER ICON TO CART HEADER */}
      <button 
        onClick={() => setShowScanner(true)}
        className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
      >
        <Maximize size={20} />
      </button>

      <button onClick={() => setCart([])} className="text-red-400 hover:text-red-600 p-2">
        <Trash2 size={22}/>
      </button>
    </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {cart.map(item => (
        <div key={item.productId} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black text-slate-800 text-lg truncate pr-4">{item.name}</span>
            <span className="font-black text-blue-600">N{(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 bg-white shadow-sm border rounded-2xl p-1">
              <button onClick={() => updateQty(item.productId, -1)} className="w-10 h-10 flex items-center justify-center text-slate-400"><Minus size={18}/></button>
              <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.productId, 1)} className="w-10 h-10 flex items-center justify-center text-slate-400"><Plus size={18}/></button>
            </div>
            <button onClick={() => removeFromCart(item.productId)} className="text-red-400 font-bold text-xs uppercase tracking-widest">Remove</button>
          </div>
        </div>
      ))}
    </div>

    <div className="p-8 bg-[#001325] rounded-t-[3rem] text-white shadow-2xl">
       {/* Payment Methods & Total (Same as your original code) */}
       <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Select Payment Method</p>
          <div className="grid grid-cols-3 gap-3">
             {['Cash', 'POS-Card', 'Transfer'].map((method) => (
                <button
                   key={method}
                   onClick={() => setPaymentMethod(method)}
                   className={`py-3 px-2 rounded-2xl text-[11px] font-black transition-all border-2 ${
                      paymentMethod === method 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                   }`}
                >
                   {method}
                </button>
             ))}
          </div>
       </div>
       <div className="flex justify-between items-center mb-8 border-t border-white/5 pt-6">
          <span className="text-slate-400 font-bold text-sm uppercase">Total Balance</span>
          <span className="text-3xl font-black">N{cart.reduce((s, i) => s + (i.unitPrice * i.quantity), 0).toLocaleString()}</span>
       </div>
       <button onClick={handleFinalize} disabled={cart.length === 0} className="w-full py-6 bg-blue-600 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 active:scale-95">
         <Download size={24} /> Pay & Receipt
       </button>
    </div>
  </div>
);


<>
  {/* MOBILE DRAWER: Only animates when isMobileCartOpen is true */}
  <AnimatePresence>
    {isMobileCartOpen && (
      <motion.aside 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden"
      >
        {cartUIContent}
      </motion.aside>
    )}
  </AnimatePresence>

  {/* DESKTOP SIDEBAR: Always visible on large screens, hidden on mobile */}
  <aside className="hidden md:flex md:w-[450px] bg-white flex-col border-l border-slate-100">
    {cartUIContent}
  </aside>
</>

  return (
    <div className="h-screen bg-[#F1F5F9] flex flex-col md:flex-row overflow-hidden select-none">
      
      {/* LEFT: PRODUCTS ENGINE */}
<div className="flex-1 flex flex-col min-w-0 bg-white shadow-inner overflow-y-auto custom-scrollbar">
  <header className="p-6 bg-white border-b flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
  {/* 🚀 MOBILE-ONLY BACK ARROW (Hidden on Screens 768px and up) */}
  {/* 🚀 MOBILE-ONLY BACK ARROW (Hidden on Screens 768px and up) */}
  <div className="flex items-center gap-3 md:gap-5 w-full">
  {/* 1. MINIMALIST NAVIGATION */}
  <button 
    onClick={() => window.location.href = '/dashboard'} 
    className="flex items-center justify-center min-w-[40px] md:hidden h-10 md:h-12 md:w-12 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-sm rounded-xl transition-all active:scale-95 group"
  >
    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
  </button>

  {/* 2. BRAND & STATUS CONTAINER */}
  <div className="flex items-center gap-3 overflow-hidden">
    {/* Scaled Icon: Smaller on mobile, standard on desktop */}
    <div className="hidden xs:flex p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-100 flex-shrink-0">
      <Store size={18} className="md:w-6 md:h-6" />
    </div>

    <div className="flex flex-col min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h1 className="text-lg md:text-xl font-[900] text-slate-900 tracking-tight whitespace-nowrap">
          Quick <span className="text-blue-600">Terminal</span>
        </h1>
        
        {/* Status Badge: Integrated as a sleek tag */}
        <div className="transform scale-90 md:scale-100 origin-left">
          <SyncStatusBadge />
        </div>
      </div>

      {/* Business Name: Subtle and crisp */}
      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] truncate">
        {user?.activeContext?.businessName || "Main Branch"}
      </p>
    </div>
  </div>
</div>
</div>
</div>
      
      {/* STATS PILLS */}
        <div className="flex items-center gap-2">
        {/* 🚀 TODAY'S REVENUE: Now visible on all screens */}
        <div className="flex flex-col items-end px-3 md:px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <span className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-tighter md:tracking-normal">
            Today's Revenue
            </span>
            <span className="text-xs md:text-sm font-black text-emerald-700">
            N{terminalStats.total.toLocaleString()}
            </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 bg-slate-50 p-1.5 md:p-2 rounded-2xl border border-slate-100">
            <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800">{user?.name}</p>
            <p className="text-[9px] text-slate-400 uppercase font-bold">Cashier</p>
            </div>
            {/* Avatar Box */}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center border shadow-sm text-slate-400">
            <User size={18} className="md:size-5" />
            </div>
        </div>
        </div>
    </div>

    <div className="relative group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={22} />
      <input 
        ref={searchInputRef}
        type="text"
        placeholder="Search inventory to start a sale..."
        className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[2rem] text-lg font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all border-none shadow-inner"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </header>

  <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
    {searchTerm.trim() !== "" ? (
      /* SEARCH RESULTS GRID */
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <motion.div 
            key={product._id} whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-xl">📦</div>
              <span className="text-[9px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-black tracking-widest">{product.sku}</span>
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg capitalize truncate">{product.name}</h3>
              <p className="text-blue-600 font-black text-xl">N{product.price.toLocaleString()}</p>
              <div className="mt-3 flex items-center justify-between">
                 <p className={`text-[10px] font-black ${product.stock < 5 ? 'text-red-500' : 'text-slate-400'}`}>
                    {product.stock} IN STOCK
                 </p>
                 <div className="p-2 rounded-xl bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16}/></div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">No matches found for "{searchTerm}"</div>
        )}
      </div>
    ) : (
      /* RECENT ACTIVITY DASHBOARD (When search is empty) */
      <div className="max-w-4xl mx-auto space-y-8">
         <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity Today</h2>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{terminalStats.count} SALES</span>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
    {todaySales.length > 0 ? (
        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-50 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {todaySales.map((sale, idx) => (
        <div key={sale._id || idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
          
          {/* LEFT SECTION: ICON & INFO */}
          <div className="flex items-center gap-4">
            {/* REPRINT ACTION */}
            <div 
              onClick={() => {
                console.log("Reprinting:", sale.receiptNumber);
                downloadReceipt(sale);
              }} 
              className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-xl transition-all cursor-pointer active:scale-90 group/btn"
              title="Reprint Receipt"
            >
              <Printer size={20} className="group-hover/btn:rotate-12 transition-transform" /> 
            </div>

            <div>
              {/* PRODUCT NAME(S) DISPLAY */}
              <p className="font-black text-slate-800 text-sm capitalize">
                {sale.items[0]?.name || "Unnamed Item"}
                {sale.items.length > 1 && (
                  <span className="ml-2 text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    +{sale.items.length - 1} more
                  </span>
                )}
              </p>
              
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                {sale.receiptNumber} • {new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {sale.paymentDetails.method}
              </p>
            </div>
          </div>

          {/* RIGHT SECTION: TOTAL */}
          <div className="text-right">
            <p className="font-black text-slate-800">N{sale.totalAmount.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Completed</p>
          </div>

        </div>
      ))}
    </div>
  ) : (
    <div className="p-20 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="text-slate-200" size={32} />
      </div>
      <p className="text-slate-400 font-medium">No sales recorded yet today.</p>
    </div>
  )}
</div>
         {/* QUICK ACTION TILES */}
         <div className="grid grid-cols-2 gap-4 pb-24 md:pb-10"> 
        {/* Status Tile */}
        <div className="p-6 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-100/50 group cursor-pointer overflow-hidden relative active:scale-95 transition-transform">
            <Zap className="absolute -right-4 -top-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Status</p>
            <p className="text-lg font-black">System Online</p>
        </div>

        {/* Inventory Tile */}
        <div className="p-6 bg-slate-800 rounded-[2.5rem] text-white shadow-xl shadow-slate-100 group cursor-pointer overflow-hidden relative active:scale-95 transition-transform">
            <Store className="absolute -right-4 -top-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Inventory</p>
            <p className="text-lg font-black">{inventory.length} Products</p>
        </div>
        </div>
      </div>
    )}
  </main>
</div>

      {/* RIGHT: SMART CART DRAWER */}
{/* --- SURGICAL REPLACEMENT START --- */}
<>
  {/* 1. MOBILE DRAWER: Only triggers when isMobileCartOpen is true */}
  <AnimatePresence mode="wait">
    {isMobileCartOpen && (
      <motion.aside 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden"
      >
        {cartUIContent}
      </motion.aside>
    )}
  </AnimatePresence>

  {/* 2. DESKTOP SIDEBAR: Always visible, locked to the right, hidden on mobile */}
  <aside className="hidden md:flex md:w-[450px] bg-white flex-col border-l border-slate-100 h-screen sticky top-0">
    {cartUIContent}
  </aside>
</>
{/* --- SURGICAL REPLACEMENT END --- */}

      {/* FLOATING ACTION (Mobile) */}
      {/* {!isMobileCartOpen && cart.length > 0 && (
         <button onClick={() => setIsMobileCartOpen(true)} className="md:hidden fixed bottom-8 right-8 bg-blue-600 text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce">
            <ShoppingBag size={30}/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full text-[10px] font-black border-2 border-white flex items-center justify-center">{cart.length}</span>
         </button>
      )} */}

      {/* --- BOTTOM RIGHT ACTIONS (MOBILE ONLY) --- */}
<div className="md:hidden fixed bottom-8 right-6 flex flex-col gap-4 z-[70]">
  
  {/* 1. THE SCANNER BUTTON (Always visible for quick entry) */}
  {!isMobileCartOpen && (
    <button 
      onClick={() => setShowScanner(true)}
      className="w-16 h-16 bg-[#0028AE] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white active:scale-90 transition-all"
    >
      <Maximize size={24} />
    </button>
  )}

  {/* 2. THE SHOPPING BAG (Only shows if cart has items) */}
  {!isMobileCartOpen && cart.length > 0 && (
    <button 
      onClick={() => setIsMobileCartOpen(true)} 
      className="bg-blue-600 text-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center animate-bounce border-4 border-white relative active:scale-90 transition-all"
    >
      <ShoppingBag size={30}/>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white w-7 h-7 rounded-full text-[12px] font-black border-2 border-white flex items-center justify-center">
        {cart.length}
      </span>
    </button>
  )}
</div>

{/* 🚀 THE SCANNER MODAL (Place this at the root level of return) */}
{showScanner && (
  <ScannerModal 
    onScan={(code) => {
      handleBarcodeScan(code);
      // Optional: setShowScanner(false) if you want it to close after one scan
    }} 
    onClose={() => setShowScanner(false)} 
  />
)}

      <AnimatePresence>
  {showWhatsappModal && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Send WhatsApp Receipt</h3>
          <p className="text-slate-500 font-medium mb-8">Enter the buyer's phone number to send the digital receipt via WhatsApp.</p>
          
          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+234</span>
            <input 
              autoFocus
              type="tel"
              placeholder="803 000 0000"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-lg font-bold focus:border-green-500 transition-all outline-none"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                // 1. Format the phone number (080... -> 23480...)
                const cleanPhone = customerPhone.startsWith('0') 
                    ? '234' + customerPhone.substring(1) 
                    : customerPhone.startsWith('234') ? customerPhone : '234' + customerPhone;

                // 2. Create a link to the receipt on your website
                const receiptLink = `https://quickinvoiceng.com/view-receipt/${lastSaleData?.receiptId}`;

                // 3. Construct the Message
                const message = `*Receipt from ${user?.activeContext?.businessName}*%0A` +
                                `--------------------------%0A` +
                                `*Order ID:* ${lastSaleData?.receiptId}%0A` +
                                `*Item(s):* ${lastSaleItems}%0A` + 
                                `*Total Amount:* N${lastSaleData?.total.toLocaleString()}%0A%0A` +
                                `*Click below to download your PDF receipt:*%0A` +
                                `${receiptLink}%0A%0A` +
                                `_Thank you for your patronage!_`;

                // 4. Open WhatsApp
                window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                
                setShowWhatsappModal(false);
                setCustomerPhone("");
                }}
              className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95"
            >
              Send Receipt
            </button>
            <button 
              onClick={() => setShowWhatsappModal(false)}
              className="w-full py-4 text-slate-400 font-bold hover:text-slate-600"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>


    </div>
  );
};

export default POSInterface;