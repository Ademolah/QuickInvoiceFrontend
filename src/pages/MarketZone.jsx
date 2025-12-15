import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";


const API =  "https://quickinvoice-backend-1.onrender.com";


const ads = ["/ads/ad1.jpg", "/ads/ad2.jpg", "/ads/ad3.jpg"]; 
const MarketZone = () => {
  const [products, setProducts] = useState([]);
  const [adsIndex, setAdsIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(true);


  const [vendorInfo, setVendorInfo] = useState(null)
  
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const openProductModal = async  (product) => {
    setSelectedProduct(product);
    const info = await fetchVendorMeta(product.userId);
    setVendorInfo(info)
  };
  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // --- fetch products ---
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/market-products`);
        // normalize to array
        const list = Array.isArray(res.data?.products) ? res.data.products : [];
        if (mounted) setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => (mounted = false);
  }, []);
  // --- hero auto-rotate ---
  useEffect(() => {
    if (!heroPlaying) return;
    const t = setInterval(() => setAdsIndex((p) => (p + 1) % ads.length), 4000);
    return () => clearInterval(t);
  }, [heroPlaying]);
  // --- debounce search (simple) ---
  const [debounced, setDebounced] = useState(searchQuery);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchQuery.trim().toLowerCase()), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);
  // --- filtered products (memoized) ---
  const filteredProducts = useMemo(() => {
    if (!debounced) return products;
    return products.filter((p) => {
      const q = debounced;
      return (
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, debounced]);
  // --- fetch vendor slug helper ---
  const fetchVendorSlug = useCallback(async (vendorId) => {
    try {
      const res = await axios.get(`${API}/api/users/vendor/${vendorId}`);
      // expect { success: true, slug: 'store-slug' }
      if (res.data?.success) return res.data.slug;
      return null;
    } catch (err) {
      console.error("Error fetching vendor slug:", err);
      return null;
    }
  }, []);


  // vendor meta
  const fetchVendorMeta = useCallback(async (vendorId) => {
  try {
    const res = await axios.get(`${API}/api/users/vendor/${vendorId}`);
    if (res.data?.success) {
      return {
        slug: res.data.slug,
        businessName: res.data.businessName,
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching vendor meta:", err);
    return null;
  }
}, []);

  // --- navigate to vendor store ---
  const openVendor = async (vendorId) => {
    if (!vendorId) return alert("Vendor id missing");
    const slug = await fetchVendorSlug(vendorId);
    if (slug) {
      // navigate to vendor store route (client-side or full page)
      window.location.href = `/market/${slug}`;
    } else {
      alert("Unable to load vendor page.");
    }
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* HERO / ADS */}
      <div className="relative w-full overflow-hidden">
        <div
          className="w-full h-60 sm:h-72 md:h-96 relative"
          onMouseEnter={() => setHeroPlaying(false)}
          onMouseLeave={() => setHeroPlaying(true)}
        >
          {/* Background image */}
          <img
            src={ads[adsIndex]}
            alt="MarketZone promotion"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: 1 }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0046A5]/70 to-[#00B86B]/30 flex flex-col justify-center items-start px-6 sm:px-12">
            <h1 className="text-white text-2xl sm:text-4xl font-poppins font-bold leading-tight max-w-lg">
              Discover great products from independent vendors across Nigeria
            </h1>
            <p className="text-white/90 mt-3 max-w-md">
              Curated deals, local stores & genuine sellers. Browse, buy and support local.
            </p>
            {/* Search (hero-level) */}
            <div className="mt-6 w-full max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-white/70"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 border border-white/30 placeholder-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Search products, categories, vendors..."
                />
              </div>
            </div>
          </div>
        </div>
        {/* small dots */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              aria-label={`select-slide-${i}`}
              onClick={() => setAdsIndex(i)}
              className={`w-2 h-2 rounded-full ${i === adsIndex ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
      {/* CONTENT */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0046A5] text-xl sm:text-2xl font-poppins font-semibold">
            Explore Amazing Products
          </h2>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-500">Showing</span>
            <div className="px-3 py-1 bg-white rounded shadow-sm text-sm">{filteredProducts.length}</div>
          </div>
        </div>
        {/* Mobile search (when not using hero) */}
        <div className="sm:hidden mb-4">
          <input
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046A5] shadow-sm text-sm"
            placeholder="Search products or categories..."
          />
        </div>
        {/* Loading / Empty */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-4 h-56" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found. Try another search or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <article
                key={item._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col"
                onClick={() => openVendor(item.userId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openVendor(item.userId)}
              >
                <div
                  className="relative w-full h-40 overflow-hidden rounded-t-lg bg-gray-50 cursor-zoom-in"
                  onClick={(e) => {
                    e.stopPropagation(); // :fire: prevent opening vendor
                    openProductModal(item);
                  }}
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "product"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  {/* price badge */}
                  <div className="absolute left-2 top-2 bg-[#00B86B] text-white px-2 py-1 rounded text-xs font-semibold shadow">
                    ₦{Number(item.price || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-[#0046A5] font-semibold text-sm truncate">{item.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{item.category || "Uncategorized"}</p>
                    <p className="text-xs text-gray-400">• {item.userName || ""}</p>
                  </div>
                  <p className="text-[#4B5563] text-xs mt-2 line-clamp-3 flex-1">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVendor(item.userId);
                      }}
                      className="text-sm bg-[#0046A5] text-white px-3 py-1 rounded-md"
                    >
                      Store
                    </button>
                    <div className="text-xs text-gray-500">Verified Sellers</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {/* product grid */}

        {selectedProduct && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
      {/* Close */}
      <button
        onClick={closeProductModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* LEFT: Image */}
        <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={selectedProduct.image || "/placeholder.jpg"}
            alt={selectedProduct.name}
            className="w-full h-full object-contain max-h-[420px]"
          />
        </div>
        {/* RIGHT: Details */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-[#0046A5]">
            {selectedProduct.name}
          </h2>
          <p className="text-xl font-semibold text-[#00B86B] mt-2">
            ₦{Number(selectedProduct.price || 0).toLocaleString()}
          </p>
          <div className="mt-3 text-sm text-gray-500">
            <p>Category: <span className="font-medium">{selectedProduct.category || "Uncategorized"}</span></p>
            <p className="mt-1">Vendor: <span className="font-medium">{vendorInfo?.businessName}</span></p>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedProduct.description || "No description provided."}
            </p>
          </div>
          <div className="mt-auto pt-6">
            <button
              onClick={() => openVendor(selectedProduct.userId)}
              className="w-full bg-[#0046A5] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Visit Vendor Store
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* FOOTER */}
      <footer className="bg-[#0046A5] mt-10 text-white">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <h4 className="text-2xl font-poppins font-bold mb-3 text-[#00B86B]">
              MarketZone
            </h4>
            <p className="text-gray-200 text-sm leading-relaxed">
              Discover and shop verified products from trusted vendors.
              Powered by QuickInvoice NG — enabling modern commerce for everyone.
            </p>
          </div>
          {/* Links */}
          <div>
            <h5 className="text-lg font-semibold mb-3 text-white">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/quickinvoiceng/"
                  className="text-gray-200 hover:text-[#00B86B] transition"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://web.facebook.com/profile.php?id=61579992747218"
                  className="text-gray-200 hover:text-[#00B86B] transition"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/quickinvoice-ng"
                  className="text-gray-200 hover:text-[#00B86B] transition"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-3 text-white">Contact</h5>
            <p className="text-gray-200 text-sm">support@quickinvoiceng.com</p>
            <p className="text-gray-300 text-sm mt-4">
              © {new Date().getFullYear()} QuickInvoice 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MarketZone;