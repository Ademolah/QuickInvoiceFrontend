import React, { forwardRef } from "react";

const PrintInventory = forwardRef(({ items, businessName }, ref) => {
  // 🧮 ELEGANT CALCULATIONS
  const totalSKUs = items.length;
  const totalUnits = items.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.stock) || 0)), 0);

  return (
    <div
      ref={ref}
      className="bg-white p-8 text-gray-800 w-[794px] mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0046A5] tracking-tight">
            Inventory Report
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
            {new Date().toLocaleDateString("en-GB", { 
              day: "2-digit", month: "long", year: "numeric" 
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-[#001325] uppercase">{businessName}</p>
          <p className="text-xs font-bold text-slate-400 mt-0.5">Powered by QuickInvoice</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0046A5] text-white">
              <th className="p-3 text-left font-bold uppercase tracking-wider text-xs">Name</th>
              <th className="p-3 font-bold uppercase tracking-wider text-xs">SKU</th>
              <th className="p-3 font-bold uppercase tracking-wider text-xs">Category</th>
              <th className="p-3 text-right font-bold uppercase tracking-wider text-xs">Price</th>
              <th className="p-3 text-center font-bold uppercase tracking-wider text-xs">Stock</th>
              <th className="p-3 text-center font-bold uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-100 last:border-0 ${
                  idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                }`}
              >
                <td className="p-3 font-medium text-slate-900">{it.name}</td>
                <td className="p-3 text-center text-slate-500 font-mono text-xs">{it.sku || "-"}</td>
                <td className="p-3 text-center text-slate-600">{it.category}</td>
                <td className="p-3 text-right font-bold text-slate-900">
                  ₦{Number(it.price).toLocaleString()}
                </td>
                <td className="p-3 text-center font-bold text-slate-700">{it.stock}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-black ${
                      it.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {it.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🌟 PREMIUM SUMMARY METRICS */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total SKUs</p>
          <p className="text-2xl font-black text-slate-900">{totalSKUs}</p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Units in Stock</p>
          <p className="text-2xl font-black text-slate-900">{totalUnits.toLocaleString()}</p>
        </div>
        <div className="bg-[#0046A5]/5 p-5 rounded-2xl border border-[#0046A5]/10">
          <p className="text-[10px] text-[#0046A5] font-black uppercase tracking-widest mb-1">Total Inventory Value</p>
          <p className="text-2xl font-black text-[#0046A5]">₦{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
        Generated with QuickInvoice Inventory System
      </div>
    </div>
  );
});

export default PrintInventory;