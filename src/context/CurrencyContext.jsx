


import React, { createContext, useState, useContext, useEffect } from "react";
// Supported currencies
const currencies = {
  NGN: { symbol: "₦", code: "NGN" },
  USD: { symbol: "$", code: "USD" },
  GBP: { symbol: "£", code: "GBP" },
  EUR: { symbol: "€", code: "EUR" },
  TRY: { symbol: "₺", code: "TRY" },
};
const CurrencyContext = createContext();
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "NGN";
  });
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);
  const switchCurrency = (code) => {
    if (currencies[code]) {
      setCurrency(code);
    }
  };
  const current = currencies[currency];
  // 🌟 Centralized formatter — symbol always correct
  const format = (amount) => {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: current.code,
    }).format(amount);
    // Replace ISO currency code with our chosen symbol
    return formatted.replace(/[A-Z]{3}/, current.symbol);
  };
  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol: current.symbol,
        code: current.code,
        switchCurrency,
        formatCurrency: format,   // ⭐ expose the formatter
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);









