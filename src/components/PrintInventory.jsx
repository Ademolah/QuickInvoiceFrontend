import React, { forwardRef } from "react";
const PrintInventory = forwardRef(({ items, businessName }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white p-6 text-gray-800 w-[794px] mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0046A5]">
            Inventory Report
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{businessName}</p>
          <p className="text-xs text-gray-500">Powered by QuickInvoice</p>
        </div>
      </div>
      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#0046A5] text-white">
            <th className="p-2 text-left">Name</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-gray-50" : ""}
            >
              <td className="p-2">{it.name}</td>
              <td className="p-2 text-center">{it.sku || "-"}</td>
              <td className="p-2 text-center">{it.category}</td>
              <td className="p-2 text-center">
                ₦{Number(it.price).toLocaleString()}
              </td>
              <td className="p-2 text-center">{it.stock}</td>
              <td className="p-2 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    it.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {it.active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        Generated with QuickInvoice Inventory System
      </div>
    </div>
  );
});
export default PrintInventory;