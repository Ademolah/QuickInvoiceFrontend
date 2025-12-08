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
                <div className="relative w-full h-40 overflow-hidden rounded-t-lg bg-gray-50">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "product"}
                    className="w-full h-full object-cover"
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
                      Visit store
                    </button>
                    <div className="text-xs text-gray-500">Verified Sellers</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {/* FOOTER */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[#0046A5] font-poppins font-semibold mb-2">MarketZone</h4>
            <p className="text-gray-500 text-sm max-w-sm">
              Discover and shop verified products from vendors across Nigeria. Built by QuickInvoice NG, empowering commerce.
            </p>
          </div>
          <div>
            <h5 className="text-gray-700 font-semibold mb-2">Quick Links</h5>
            <ul className="text-sm text-gray-500 space-y-1">
              <li><a href="https://www.instagram.com/quickinvoiceng/" className="hover:underline">Instagram</a></li>
              <li><a href="https://web.facebook.com/profile.php?id=61579992747218" className="hover:underline">Facebook</a></li>
              <li><a href="https://www.linkedin.com/company/quickinvoice-ng" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-gray-700 font-semibold mb-2">Contact</h5>
            <p className="text-sm text-gray-500">support@quickinvoiceng.com</p>
            <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} QuickInvoice NG</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MarketZone;