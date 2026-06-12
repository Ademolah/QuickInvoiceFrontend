
import React, { createContext, useState, useContext, useEffect } from "react";

const currencies = {
  NGN: { symbol: "₦", code: "NGN" },
  USD: { symbol: "$", code: "USD" },
  GBP: { symbol: "£", code: "GBP" },
  EUR: { symbol: "€", code: "EUR" },
  TRY: { symbol: "₺", code: "TRY" },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // 1. The Global Currency (User's preferred app currency)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "NGN";
  });

  // 2. The Override Currency (Used ONLY when viewing specific documents)
  const [overrideCurrency, setOverrideCurrency] = useState(null);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const switchCurrency = (code) => {
    if (currencies[code]) setCurrency(code);
  };

  // 🌟 The smart formatting logic
  const format = (amount) => {
    // If an override is active, use it. Otherwise, use the global currency.
    const activeCode = overrideCurrency && currencies[overrideCurrency] 
      ? overrideCurrency 
      : currency;

    const target = currencies[activeCode];

    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: target.code,
    }).format(amount);

    return formatted.replace(/[A-Z]{3}/, target.symbol);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: overrideCurrency || currency, // Expose the active one
        symbol: currencies[overrideCurrency || currency].symbol,
        code: currencies[overrideCurrency || currency].code,
        switchCurrency,
        formatCurrency: format,
        setOverrideCurrency, // ⭐ Expose the ability to lock the currency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);





