// import React from "react";
import { Link } from "react-router-dom";


// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const phrasesDefault = [
  "Send invoices in seconds",
  "Get paid faster, every time",
  "Track payments. Grow your business.",
  "Receipts, reports & powerful automation",
];

function useTypewriter(phrases = [], speed = 80, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [mode, setMode] = useState("typing");

  useEffect(() => {
    let mounted = true;
    let timer;
    const current = phrases[index % phrases.length];

    if (mode === "typing") {
      let i = 0;
      timer = setInterval(() => {
        if (!mounted) return;
        setDisplay(current.slice(0, i + 1));
        i++;
        if (i === current.length) {
          clearInterval(timer);
          timer = setTimeout(() => setMode("deleting"), pause);
        }
      }, speed);
    } else if (mode === "deleting") {
      let i = current.length;
      timer = setInterval(() => {
        if (!mounted) return;
        setDisplay(current.slice(0, i - 1));
        i--;
        if (i <= 0) {
          clearInterval(timer);
          setIndex((prev) => prev + 1);
          setMode("typing");
        }
      }, speed / 1.6);
    }

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [index, mode, phrases, speed, pause]);

  return display;
}

export default function Hero({
  phrases = phrasesDefault,
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
}) {
  const typed = useTypewriter(phrases, 60, 1200);

  const blobVariants = {
    float: {
      y: [0, -18, 0],
      x: [0, 10, -8, 0],
      transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
    },
  };


  const invoiceAmount = useMotionValue(0);
const formattedAmount = useTransform(invoiceAmount, (v) =>
  `₦ ${Math.floor(v).toLocaleString()}`
);
const [invoiceCount, setInvoiceCount] = useState(1248);

useEffect(() => {
  // Animate invoice amount
  animate(invoiceAmount, 120500, {
    duration: 1.8,
    ease: "easeOut",
  });
  // Auto-increment invoices issued
  const interval = setInterval(() => {
    setInvoiceCount((prev) => prev + Math.floor(Math.random() * 3 + 1));
  }, 2500);
  return () => clearInterval(interval);
}, []);


const statuses = ["Draft", "Sent", "Paid"];
const [status, setStatus] = useState("Draft");

useEffect(() => {
  const interval = setInterval(() => {
    setStatus(prev => {
      const nextIndex = (statuses.indexOf(prev) + 1) % statuses.length;
      return statuses[nextIndex];
    });
  }, 2500);
  return () => clearInterval(interval);
}, []);


  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(120deg, #00A6FA 0%, #0028AE 50%, #00A6FA 100%)",
          backgroundSize: "200% 200%",
          animation: "bgShift 12s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Decorative blobs */}
      <motion.div
        className="absolute -right-8 top-8 opacity-40"
        variants={blobVariants}
        animate="float"
        aria-hidden
      >
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="blur-sm">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#00B86B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0046A5" stopOpacity="0.8" />
            </linearGradient>
            <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="35" result="b" />
            </filter>
          </defs>
          <g filter="url(#f1)">
            <path d="M80 40 C 180 -20, 320 0, 360 100 C 400 200, 320 320, 220 360 C 120 400, 40 320, 60 220 C 80 120, 40 60, 80 40 Z" fill="url(#g1)"/>
          </g>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          {/* Left - text */}
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight font-poppins"
            >
              Business, simplified 
              <span className="block text-white/95 mt-3 text-2xl md:text-3xl font-semibold">
                Powerful tools to run & grow your SME
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-6 text-gray-100 max-w-md mx-auto md:mx-0 text-base md:text-lg"
            >
              Invoicing, receipts, payments, inventory, Business management, wrapped in a single elegant app built for Businesses.
            </motion.p>

            {/* Typewriter effect */}
            <div className="mt-6 flex items-center justify-center md:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-white/95 font-medium bg-white/10 px-4 py-2 rounded-full shadow-sm"
                aria-live="polite"
              >
                <span>{typed}</span>
                <span className="animate-pulse ml-1">▌</span>
              </motion.div>
            </div>

            {/* CTA buttons */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >

              <Link to="/register">
              <button
                // onClick={onPrimaryClick}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-white text-[#0046A5] font-semibold shadow-lg hover:scale-[1.02] hover:shadow-2xl transition transform"
              >
                Get Started It's Free
              </button>
              </Link>

              {/* <button
                onClick={onSecondaryClick}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
              >
                View Pricing
              </button> */}
            </motion.div>
          </div>

          {/* Right - illustrative card */}
<motion.div
  initial={{ scale: 0.98, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.45, duration: 0.6 }}
  className="flex items-center justify-center"
>
  <div className="relative w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-6 md:p-8">
    {/* Soft ambient glow */}
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0028AE]/5 to-[#00A6FA]/10 rounded-2xl" />
    
    {/* Top stats row (NO overlap, NO clipping) */}
    <div className="relative flex items-center justify-between mb-4">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-xs font-semibold text-[#0028AE] bg-blue-50 px-3 py-1 rounded-full"
      >
        {invoiceCount.toLocaleString()} invoices issued
      </motion.div>
      <div className="text-sm font-semibold text-[#0046A5] whitespace-nowrap">
        Quick • Simple
      </div>
    </div>

    {/* Header */}
    <div className="relative">
      <h3 className="text-sm font-semibold text-gray-700">
        Invoice preview
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        Professional template ready to send
      </p>
    </div>

    {/* Body */}
    <div className="relative mt-4 space-y-3">
      <div className="rounded-lg p-3 bg-gray-50 border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-800">
              Acme Store
            </div>
            <div className="text-xs text-gray-500">
              Invoice • 2025-09-01
            </div>
          </div>
          <motion.div className="text-sm font-bold text-[#00B86B]">
            ₦ 120,500
          </motion.div>
        </div>
      </div>

      <div className="rounded-lg p-3 bg-gray-50 border">
        <div className="text-sm text-gray-700">
          1 × Website design — ₦ 120,500
        </div>
      </div>

      {/* Realistic Status Transition */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">Status</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={
              status === "Draft"
                ? "text-gray-500"
                : status === "Sent"
                ? "text-yellow-600"
                : "text-green-600"
            }
          >
            {status}
          </motion.span>
        </motion.div>
      </div>
    </div>

    {/* Actions */}
    <div className="relative mt-6 flex gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-semibold"
      >
        Send
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="px-3 py-2 rounded-md border"
      >
        Preview
      </motion.button>
    </div>
  </div>
</motion.div>

        </motion.div>
      </div>
    </section>
  );
}