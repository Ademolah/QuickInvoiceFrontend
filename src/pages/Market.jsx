/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";


const API = "https://quickinvoice-backend-1.onrender.com"

const ads = [
  { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", caption: "Kenny Shoes Store" },
  { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", caption: "Classy Watches Collection" },
  { img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", caption: "Fabulous Fashion Deals" },
];


const Market = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentAd, setCurrentAd] = useState(0);
  useEffect(() => {
    if (slug) fetchStore();
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  const fetchStore = async () => {
    try {
      const res = await axios.get(`${API}/api/marketsquare/store/${slug}`);
      setStore(res.data.store);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Store not found or unavailable");
    }
  };


  // const openWhatsApp = (number, name) => {
  //   if (!number) {
  //     toast.error("Seller has no WhatsApp number attached.");
  //     return;
  //   }
  //   const message = encodeURIComponent(`Hi ${store?.name}, I’m interested in your product: ${name}.`);
  //   window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  // };
  const openWhatsApp = (number, name) => {
  console.log('WhatsApp button clicked');
  if (!number) {
    toast.error("Seller has no WhatsApp number attached.");
    return;
  }
  const message = encodeURIComponent(`Hi ${store?.name}, I’m interested in your product: ${name}.`);
  // Detect platform
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const whatsappURL = isMobile
    ? `whatsapp://send?phone=${number}&text=${message}` // Opens the app directly on mobile
    : `https://wa.me/${number}?text=${message}`;        // Opens WhatsApp Web on desktop
  window.open(whatsappURL, "_blank");
};


  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-500">
        Loading store...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 px-4 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={store.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt={store.name}
          className="w-16 h-16 rounded-full border-2 border-[#00B86B]"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{store.name}</h1>
          <p className="text-gray-500">@{store.slug}</p>
        </div>
      </div>
      {/* Rotating Ads */}
        <motion.div
        key={ads[currentAd].img}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-52 md:h-72 rounded-2xl overflow-hidden shadow-lg mb-4"
        >
        <img
            src={ads[currentAd].img}
            alt={ads[currentAd].caption}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-semibold">
            {ads[currentAd].caption}
            </h2>
        </div>
        </motion.div>
        {/* Ad Contact Note */}
        <div className="text-center mb-10">
        <p className="text-gray-600 text-sm md:text-base">
            To advertise your store products here,{" "}
            <a
            href="mailto:binaryhq@outlook.com?subject=Advertise%20on%20MarketZone&body=Hi%20Binary%20Team,%20I%27d%20like%20to%20advertise%20my%20product%20on%20MarketZone."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0046A5] font-medium hover:underline"
            >
            contact us
            </a>
            .
        </p>
        </div>
      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products available yet.
          </p>
        ) : (
          products.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3 cursor-pointer"
              onClick={() => setSelected(p)}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
              <p className="text-[#00B86B] font-medium">₦{p.price.toLocaleString()}</p>
              <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
            </motion.div>
          ))
        )}
      </div>
      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[500px] relative"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <img
              src={selected.image}
              alt={selected.name}
              className="w-full h-60 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{selected.name}</h2>
            <p className="text-[#00B86B] text-lg font-bold mb-2">₦{selected.price.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">{selected.description}</p>
            {/* Custom Button */}
            <button
              onClick={() => openWhatsApp(store.whatsappNumber, selected.name)}
              className="w-full py-3 rounded-xl bg-[#00B86B] text-white font-semibold text-lg hover:bg-[#009c5e] transition"
            >
              Contact Seller on WhatsApp
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer */}
        <footer className="mt-12 bg-[#0046A5] text-white py-8 px-6 rounded-t-2xl shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
            MarketZone by <span className="text-[#00B86B]">QuickInvoice NG</span>
            </h2>
            <p className="text-sm text-gray-100 mb-3">
            Empowering businesses to showcase and sell with ease.
            </p>
            <a
            href="https://www.quickinvoiceng.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00B86B] text-[#0046A5] font-medium px-4 py-2 rounded-full hover:bg-[#00a060] transition"
            >
            Visit www.quickinvoiceng.com
            </a>
            <p className="text-xs text-gray-200 mt-4">
            © {new Date().getFullYear()} QuickInvoice NG. All rights reserved.
            </p>
        </div>
        </footer>
    </div>
  );
};

export default Market;