import React from 'react';

/**
 * InvoiceRenderer - A Standalone Premium Engine
 * @param {Object} settings - User branding (colors, template choice)
 * @param {Object} user - User/Company profile (logo, name)
 * @param {Object} data - The actual Invoice details (items, total, client)
 */
const InvoiceRenderer = ({ settings, user, data }) => {
  // Destructure with safe defaults
  const { headerColor = '#0028AE', accentColor = '#001325', selectedTemplate = 'minimalist' } = settings || {};
  const companyName = user?.companyName || "QuickInvoice Client";
  
  // Dynamic Invoice Data (Fallbacks for Preview Mode)
  const invoiceId = data?.invoiceNumber || "#INV-001-2026";
  const date = data?.date || "May 12, 2026";
  const clientName = data?.clientName || "The Central Strategy Group";
  const clientAddress = data?.clientAddress || "Victoria Island, Lagos";
  const items = data?.items || [
    { description: "Software Infrastructure Architecture", qty: 1, price: 1500000 }
  ];
  const grandTotal = data?.total || items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  // Shared Premium Typography
  const labelStyle = { 
    color: 'rgba(100, 116, 139, 1)', 
    fontSize: '10px', 
    fontWeight: '900', 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em' 
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(val);

  // --- 1. THE INSTITUTIONAL (Corporate Style) ---
  if (selectedTemplate === 'institutional') {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500 bg-white">
        <div style={{ background: headerColor }} className="p-12 lg:p-16 flex justify-between items-start text-white">
          <div className="h-16 w-16 lg:h-20 lg:w-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-900 font-black text-xs uppercase overflow-hidden">
            {user?.logo ? <img src={user.logo} alt="logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-right">
            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter italic">INVOICE</h2>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-[3px] mt-2">Document ID: {invoiceId}</p>
          </div>
        </div>
        
        <div className="p-12 lg:p-16 flex-1">
          <div style={{ borderColor: accentColor }} className="border-l-8 pl-8 py-2 mb-16">
            <p style={labelStyle} className="mb-2">Attention To</p>
            <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">{clientName}</p>
            <p className="text-sm text-slate-500 mt-2 font-medium">{clientAddress}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-4 border-b-2 border-slate-100 pb-4">
              <span className="col-span-2" style={labelStyle}>Execution Item</span>
              <span className="text-center" style={labelStyle}>Qty</span>
              <span className="text-right" style={labelStyle}>Amount</span>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 pt-2">
                <span className="col-span-2 font-bold text-slate-800">{item.description}</span>
                <span className="text-center font-bold text-slate-600">{item.qty.toString().padStart(2, '0')}</span>
                <span className="text-right font-black text-slate-900">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. THE ZENITH (Modern Sidebar Style) ---
  if (selectedTemplate === 'zenith') {
    return (
      <div className="flex h-full min-h-[900px] animate-in slide-in-from-right-4 duration-500 bg-white">
        <div style={{ background: headerColor }} className="w-[30%] p-10 text-white flex flex-col justify-between">
           <div className="h-12 w-12 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center font-black">
             {user?.logo ? <img src={user.logo} alt="logo" className="w-6 h-6 object-contain invert" /> : "L"}
           </div>
           <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Authorized By</p>
                <p className="text-sm font-bold leading-tight">{companyName}</p>
              </div>
              <div className="space-y-2">
                <div className="h-0.5 w-10 bg-white/40" />
                <p className="text-[14px] font-black italic tracking-tighter">Verified Document</p>
              </div>
           </div>
        </div>
        <div className="flex-1 p-16 relative">
           <div className="flex justify-between items-start mb-20">
              <h2 style={{ color: accentColor }} className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.8]">Execution<br/>Invoice</h2>
              <div className="text-right">
                 <p style={labelStyle}>Issued Date</p>
                 <p className="text-sm font-black text-slate-900">{date}</p>
              </div>
           </div>
           
           <div className="space-y-8 mt-20">
              <div className="h-[2px] w-full bg-slate-50" />
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-end border-b border-slate-50 pb-4">
                   <div>
                     <p style={labelStyle} className="mb-1">Project Milestone</p>
                     <p className="font-bold text-slate-800">{item.description}</p>
                   </div>
                   <p className="text-2xl font-black text-slate-900">{formatCurrency(item.price)}</p>
                </div>
              ))}
              <div style={{ background: headerColor }} className="h-12 w-full flex items-center px-6 justify-between text-white rounded-lg shadow-lg">
                 <span className="text-[10px] font-black uppercase tracking-widest">Total Valuation</span>
                 <span className="font-black text-lg tracking-tight">{formatCurrency(grandTotal)}</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 3. THE MINIMALIST (Clean Default Style) ---
  return (
    <div className="p-12 lg:p-20 bg-white h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-24">
        <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black overflow-hidden">
          {user?.logo ? <img src={user.logo} alt="logo" className="w-full h-full object-contain" /> : "Q"}
        </div>
        <h2 style={{ color: headerColor }} className="text-[10px] font-black uppercase tracking-[12px] pl-4">Invoice</h2>
      </div>

      <div className="space-y-16">
        <div style={{ background: accentColor }} className="h-2 w-16" />
        
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-3">
            <p style={labelStyle}>Billing From</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{companyName}</p>
          </div>
          <div className="space-y-3 text-right">
            <p style={labelStyle}>Billing To</p>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{clientName}</p>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
           <div>
             <span style={labelStyle}>Grand Total Due</span>
             <p className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 mt-2">{formatCurrency(grandTotal)}</p>
           </div>
           <div style={{ background: headerColor }} className="px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
             Payment Pending
           </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRenderer;