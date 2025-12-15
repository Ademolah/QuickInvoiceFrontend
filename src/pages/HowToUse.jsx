import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCog,
  FaFileInvoice,
  FaShareAlt,
  FaCheckCircle,
  FaReceipt,
  FaBoxes,
  FaStore,
  FaCreditCard,
} from "react-icons/fa";
const steps = [
  {
    title: "Update Your Bank Details",
    icon: <FaCog />,
    description:
      "Immediately after signing up, go to Settings on the sidebar and update your bank account details. This ensures that payments from invoices and MarketZone orders are credited directly to you.",
  },
  {
    title: "Create an Invoice",
    icon: <FaFileInvoice />,
    description:
      "Click on Invoice on the sidebar, then select Create Invoice. Fill in the required details. Client email is optional. Once created, your invoice is generated instantly with a professional layout and your bank details clearly shown for payment.",
  },
  {
    title: "Share Invoice Easily",
    icon: <FaShareAlt />,
    description:
      "At the top of every invoice, you’ll find a Share button. Use it to send your invoice via WhatsApp or any other platform directly to your client.",
  },
  {
    title: "Mark Invoice as Paid",
    icon: <FaCheckCircle />,
    description:
      "Once payment is received, click Mark as Paid on the invoice. This automatically generates a receipt for that transaction.",
  },
  {
    title: "Access & Share Receipts",
    icon: <FaReceipt />,
    description:
      "All receipts are stored in the Receipts section on the sidebar. You can view, download, or share receipts the same way as invoices.",
  },
  {
    title: "Manage Inventory",
    icon: <FaBoxes />,
    description:
      "Use the Inventory feature to keep track of your products and stock levels automatically. Perfect for store owners who want organized product management.",
  },
  {
    title: "Sell with MarketZone",
    icon: <FaStore />,
    description:
      "MarketZone lets you create a digital storefront and become an official vendor partner. Your products are displayed on our e-commerce platform: www.quickinvoiceng.com/marketzone. You also get a unique store link to share on social media. Buyers can order and pay with automatic courier service included.",
  },
  {
    title: "Billing & Pro Subscription",
    icon: <FaCreditCard />,
    description:
      "The Billing section shows your usage. Free users can issue up to 15 invoices or receipts. Upgrade to Pro for ₦3,000/month to enjoy unlimited invoices and receipts for 30 days via Paystack.",
  },
];
export default function HowToUse() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 border-4 border-[#0046A5] border-t-[#00B86B] rounded-full animate-spin" />
          <p className="mt-4 text-[#0046A5] font-semibold">
            Preparing your guide…
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#0046A5]">
          How to Use QuickInvoice
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Everything you need to create invoices, manage receipts, track inventory, run business
          and sell online — all in one powerful business platform.
        </p>
      </motion.div>
      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-white bg-gradient-to-br from-[#0046A5] to-[#00B86B] p-3 rounded-xl text-xl">
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}