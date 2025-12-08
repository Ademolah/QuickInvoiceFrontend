

import React from "react";
import { motion } from "framer-motion";
const features = [
  {
    title: "Easy Invoicing",
    description: "Create and send professional invoices in seconds.",
    icon: "📄",
  },
  {
    title: "Payment Tracking",
    description: "Monitor payments and get instant alerts for overdue invoices.",
    icon: "💳",
  },
  {
    title: "E-Commerce Integration",
    description:
      "Launch a clean, modern online store for your business in minutes.",
    icon: "🛍️",
  },
  {
    title: "Custom Branding",
    description: "Add your logo and personalize templates effortlessly.",
    icon: "🎨",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track revenue, performance, trends, and financial insights.",
    icon: "📊",
  },
  {
    title: "Multi-Currency Support",
    description: "Invoice clients anywhere, using their local currency.",
    icon: "🌍",
  },
];
export default function Features() {
  return (
    <section
      id="features"
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#0046A5]/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-32 right-0 w-80 h-80 bg-[#00B86B]/10 blur-3xl rounded-full"></div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            Powerful Features Built for Modern Businesses
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600"
          >
            Everything you need to run, scale, and automate your business in one place.
          </motion.p>
        </div>
        {/* Feature Cards */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="
                group p-8 rounded-3xl bg-white/70 backdrop-blur-lg shadow-md
                hover:shadow-2xl transition-all duration-300 border border-white
              "
            >
              {/* Icon Circle */}
              <div
                className="
                w-14 h-14 flex items-center justify-center rounded-2xl
                bg-gradient-to-br from-[#0046A5] to-[#00B86B]
                text-white text-3xl shadow-md mb-6 group-hover:scale-110 transition
                "
              >
                {feature.icon}
              </div>
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="mt-2 text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

