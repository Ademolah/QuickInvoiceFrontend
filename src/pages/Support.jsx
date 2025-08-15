import React from "react";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Email Support",
      description: "Get in touch with our team via email for assistance.",
      action: () => window.location.href = "mailto:support@quickinvoiceng.com",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: "Live Chat",
      description: "Chat with our support agents in real-time.",
      action: () => alert("Live chat coming soon!"),
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-yellow-500" />,
      title: "FAQ",
      description: "Browse our frequently asked questions.",
      action: () => navigate("/faq"),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Center</h1>
        <p className="text-gray-600">
          Need help? Our team is here to assist you every step of the way.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {supportOptions.map((opt, idx) => (
          <div
            key={idx}
            onClick={opt.action}
            className="bg-white shadow-lg rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-4">{opt.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{opt.title}</h2>
            <p className="text-gray-500 text-sm">{opt.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Send us a message</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Back to Dashboard button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Support;
