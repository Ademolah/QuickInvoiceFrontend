/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";



const API = "https://quickinvoice-backend-1.onrender.com"

const MarketZone = () => {
  const [products, setProducts] = useState([]);
  const [adsIndex, setAdsIndex] = useState(0);
  const ads = [
    "/ads/ad1.jpg",
    "/ads/ad2.jpg",
    "/ads/ad3.jpg"
  ]; 

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((item) => {
  const query = searchQuery.toLowerCase();
  return (
    item.name?.toLowerCase().includes(query) ||
    item.category?.toLowerCase().includes(query)
  );
});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/market-products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const fetchVendorSlug = async (vendorId) => {
  try {
    const res = await fetch(`${API}/api/users/vendor/${vendorId}`);
    const data = await res.json();
    if (data.success) {
      return data.slug;
    }
    console.error("Vendor slug fetch failed");
    return null;
  } catch (err) {
    console.log("Error fetching vendor slug:", err);
    return null;
  }
};
  // Auto scroll ads every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setAdsIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Hero / Ad Section */}
      <div className="relative w-full h-52 sm:h-64 overflow-hidden">
        <img
          src={ads[adsIndex]}
          alt="Advertisement"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-2xl sm:text-4xl font-poppins font-semibold">
            Welcome to <span className="text-[#00B86B]">MarketZone</span>
          </h1>
        </div>
      </div>
      {/* Product Grid */}
        <div className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-[#0046A5] text-xl sm:text-2xl font-poppins font-semibold mb-6 text-center">
            Explore Amazing Products from Vendors
        </h2>
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
            <input
            type="text"
            placeholder="Search products or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046A5] shadow-sm text-sm"
            />
        </div>
        {products.length === 0 ? (
            <p className="text-center text-gray-500 font-inter">Loading products...</p>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
                <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
                onClick={async () => {
                    const slug = await fetchVendorSlug(item.userId);
                    if (slug) {
                    window.location.href = `/market/${slug}`;
                    } else {
                    alert("Unable to load vendor page.");
                    }
                }}
                >
                <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-3">
                    <h3 className="text-[#0046A5] font-semibold text-sm truncate">
                    {item.name}
                    </h3>
                    <p className="text-[#00B86B] text-xs font-medium">
                    {item.category}
                    </p>
                    <p className="text-[#4B5563] text-xs mt-1 line-clamp-2">
                    {item.description}
                    </p>
                    <p className="text-[#00B86B] text-xs font-medium">
                    ₦{item.price?.toLocaleString()}
                    </p>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
      {/* Footer */}
      <footer className="bg-[#0046A5] text-white py-4 text-center font-inter text-sm">
        © {new Date().getFullYear()} MarketZone — Empowering Commerce in Africa
      </footer>
    </div>
  );
};

export default MarketZone;