import React from "react";
const VatToggle = ({ isVatEnabled, onToggle }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isVatEnabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4 accent-blue-600"
      />
      <span className="text-sm font-medium">Add VAT (7.5%)</span>
    </label>
  );
};
export default VatToggle;