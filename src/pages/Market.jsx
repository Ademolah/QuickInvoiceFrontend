/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";


// const API = "https://quickinvoice-backend-1.onrender.com"

// const ads = [
//   { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", caption: "Kenny Shoes Store" },
//   { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", caption: "Classy Watches Collection" },
//   { img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", caption: "Fabulous Fashion Deals" },
// ];


// const Market = () => {
//   const { slug } = useParams();
//   const [store, setStore] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [currentAd, setCurrentAd] = useState(0);
//   useEffect(() => {
//     if (slug) fetchStore();
//     const interval = setInterval(() => {
//       setCurrentAd((prev) => (prev + 1) % ads.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [slug]);

//   const fetchStore = async () => {
//     try {
//       const res = await axios.get(`${API}/api/marketsquare/store/${slug}`);
//       setStore(res.data.store);
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Store not found or unavailable");
//     }
//   };


//   // const openWhatsApp = (number, name) => {
//   //   if (!number) {
//   //     toast.error("Seller has no WhatsApp number attached.");
//   //     return;
//   //   }
//   //   const message = encodeURIComponent(`Hi ${store?.name}, I’m interested in your product: ${name}.`);
//   //   window.open(`https://wa.me/${number}?text=${message}`, "_blank");
//   // };
//   const openWhatsApp = (number, name) => {
//   console.log('WhatsApp button clicked');
//   if (!number) {
//     toast.error("Seller has no WhatsApp number attached.");
//     return;
//   }
//   const message = encodeURIComponent(`Hi ${store?.name}, I’m interested in your product: ${name}.`);
//   // Detect platform
//   const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
//   const whatsappURL = isMobile
//     ? `whatsapp://send?phone=${number}&text=${message}` // Opens the app directly on mobile
//     : `https://wa.me/${number}?text=${message}`;        // Opens WhatsApp Web on desktop
//   window.open(whatsappURL, "_blank");
// };


//   if (!store) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-500">
//         Loading store...
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-gray-800 px-4 md:px-10 py-8">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-8">
//         <img
//           src={store.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//           alt={store.name}
//           className="w-16 h-16 rounded-full border-2 border-[#00B86B]"
//         />
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{store.name}</h1>
//           <p className="text-gray-500">@{store.slug}</p>
//         </div>
//       </div>
//       {/* Rotating Ads */}
//         <motion.div
//         key={ads[currentAd].img}
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="relative w-full h-52 md:h-72 rounded-2xl overflow-hidden shadow-lg mb-4"
//         >
//         <img
//             src={ads[currentAd].img}
//             alt={ads[currentAd].caption}
//             className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//             <h2 className="text-white text-2xl md:text-3xl font-semibold">
//             {ads[currentAd].caption}
//             </h2>
//         </div>
//         </motion.div>
//         {/* Ad Contact Note */}
//         <div className="text-center mb-10">
//         <p className="text-gray-600 text-sm md:text-base">
//             To advertise your store products here,{" "}
//             <a
//             href="mailto:binaryhq@outlook.com?subject=Advertise%20on%20MarketZone&body=Hi%20Binary%20Team,%20I%27d%20like%20to%20advertise%20my%20product%20on%20MarketZone."
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-[#0046A5] font-medium hover:underline"
//             >
//             contact us
//             </a>
//             .
//         </p>
//         </div>
//       {/* Products grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//         {products.length === 0 ? (
//           <p className="col-span-full text-center text-gray-500">
//             No products available yet.
//           </p>
//         ) : (
//           products.map((p) => (
//             <motion.div
//               key={p._id}
//               whileHover={{ scale: 1.03 }}
//               className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3 cursor-pointer"
//               onClick={() => setSelected(p)}
//             >
//               <img
//                 src={p.image}
//                 alt={p.name}
//                 className="w-full h-44 object-cover rounded-lg mb-3"
//               />
//               <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
//               <p className="text-[#00B86B] font-medium">₦{p.price.toLocaleString()}</p>
//               <p className="text-gray-500 text-sm line-clamp-2">{p.category}</p>
//               <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
//             </motion.div>
//           ))
//         )}
//       </div>
//       {/* Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[500px] relative"
//           >
//             <button
//               onClick={() => setSelected(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <img
//               src={selected.image}
//               alt={selected.name}
//               className="w-full h-60 object-cover rounded-xl mb-4"
//             />
//             <h2 className="text-2xl font-semibold mb-2">{selected.name}</h2>
//             <p className="text-[#00B86B] text-lg font-bold mb-2">₦{selected.price.toLocaleString()}</p>
//             <p className="text-gray-600 mb-4">{selected.category}</p>
//             <p className="text-gray-600 mb-4">{selected.description}</p>
//             {/* Custom Button */}
//             <button
//               onClick={() => openWhatsApp(store.whatsappNumber, selected.name)}
//               className="w-full py-3 rounded-xl bg-[#00B86B] text-white font-semibold text-lg hover:bg-[#009c5e] transition"
//             >
//               Contact Seller on WhatsApp
//             </button>
//           </motion.div>
//         </div>
//       )}

//       {/* Footer */}
//         <footer className="mt-12 bg-[#0046A5] text-white py-8 px-6 rounded-t-2xl shadow-inner">
//         <div className="max-w-6xl mx-auto text-center">
//             <h2 className="text-lg md:text-xl font-semibold mb-2">
//             MarketZone by <span className="text-[#00B86B]">QuickInvoice NG</span>
//             </h2>
//             <p className="text-sm text-gray-100 mb-3">
//             Empowering businesses to showcase and sell with ease.
//             </p>
//             <a
//             href="https://www.quickinvoiceng.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block bg-[#00B86B] text-[#0046A5] font-medium px-4 py-2 rounded-full hover:bg-[#00a060] transition"
//             >
//             Visit www.quickinvoiceng.com
//             </a>
//             <p className="text-xs text-gray-200 mt-4">
//             © {new Date().getFullYear()} QuickInvoice NG. All rights reserved.
//             </p>
//         </div>
//         </footer>
//     </div>
//   );
// };

// export default Market;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import CheckoutDrawer from "../components/CheckoutDrawer";
const API = "https://quickinvoice-backend-1.onrender.com";
const ads = [
  { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", caption: "10% discount Kenny Shoes Store" },
  { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", caption: "Classy Watches Collection" },
  { img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", caption: "Fabulous Fashion Deals" },
];
const Market = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentAd, setCurrentAd] = useState(0);
  const PAYSTACK_PUBLIC_KEY="pk_live_f81e5344aaa5dd40d6ae97daae005d8855539811"
  // Cart state


  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [vendorId, setVendorId] = useState(null)
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryType: "regular",

    deliveryFee: 4000,
    totalAmount: 0
  });
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("marketCart");
    return saved ? JSON.parse(saved) : [];
  });


  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("marketCart", JSON.stringify(cartItems));
  }, [cartItems]);



  useEffect(() => {
  // 1. Base cart total
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);
  // 2. Delivery fee logic
  const deliveryFee =
    checkoutData.deliveryType === "express" ? 7000 : 4000;
  // 3. Final total
  const totalAmount = cartTotal + deliveryFee;
  // 4. Update state
  setCheckoutData((prev) => ({
    ...prev,
    deliveryFee,
    totalAmount,
  }));
  console.log("Recalculated totals →", {
    cartTotal,
    deliveryFee,
    totalAmount,
  });
}, [cartItems, checkoutData.deliveryType]);

  
const handlePaystackPayment = async (deliveryFee, selectedCourier, checkoutData, setLoading, createShipment) => {
  try {
    setLoading(true)
    console.log("=== STARTING PAYSTACK PAYMENT WITH SHIPBUBBLE DATA ===");
    // Prepare cart data
    const itemsPayload = cartItems.map((i) => ({
      productId: i._id,
      price: i.price,
      name: i.name,
      qty: i.quantity,
      weight: i.weight || 1, // default
      length: i.length || 10,
      width: i.width || 10,
      height: i.height || 10,
      category: i.category || "General Goods",
    }));
    // Prepare full payload for backend
    const payload = {
      userId: vendorId,
      items: itemsPayload,
      // Buyer data
      buyerName: checkoutData.name,
      buyerEmail: checkoutData.email,
      buyerPhone: checkoutData.phone,
      buyerAddress: checkoutData.address,
      // Shipbubble Delivery Data
      deliveryFee: deliveryFee,
      courier: selectedCourier?.courier_name || "",
      courier_code: selectedCourier?.courier_code || "",
      courier_eta: selectedCourier?.delivery_time || "",
      // Derived total (backend still recalculates)
      totalAmount: checkoutData.totalAmount,
    };
    console.log("=== Sending checkout payload to backend ===");
    console.log(payload);
    const res = await axios.post(`${API}/api/checkout/initiate`, payload);
    const { access_code, amount, reference, orderId } = res.data;
    console.log("initiate data: ", res.data);
    
    
    if (!access_code) {
      return toast.error("Backend did not return access_code");
    }
    console.log("Launching Paystack with:", {
      key: PAYSTACK_PUBLIC_KEY,
      email: checkoutData.email,
      amount,
      access_code,
      reference,
    });
    const handler = new window.PaystackPop().newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: checkoutData.email,
      amount,
      access_code,
      reference,
      onSuccess: async (response) => {
        console.log("Payment successful:", response);
        // Clear cart
        try {
          localStorage.removeItem("marketCart");
          setCartItems([]);
          console.log("Cart cleared successfully!");
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
        toast.success("Payment successful! Your order has been placed.");
        createShipment(orderId)
      },
      onCancel: () => {
        console.log("PAYSTACK CLOSED");
        toast.error("Payment window closed");
      },
    });
  } catch (err) {
    console.log("PAYMENT ERROR:", err);
    if (err.response) {
      console.log("Backend error:", err.response.data);
    }
    toast.error("Payment initialization failed");
  } finally {
    setLoading(false)
  }
};



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
    const fetchedStore = res.data.store;
    const fetchedProducts = res.data.products || [];
    setStore({
      ...fetchedStore,
      name: String(fetchedStore.name),
      slug: String(fetchedStore.slug),
      avatar: fetchedStore.avatar ? String(fetchedStore.avatar) : "",
      whatsappNumber: fetchedStore.whatsappNumber ? String(fetchedStore.whatsappNumber) : "",
    });
    const cleanProducts = fetchedProducts.map((p) => ({
      ...p,
      name: String(p.name),
      description: String(p.description),
      price: Number(p.price) || 0,
      image: String(p.image),
    }));
    setProducts(cleanProducts);
    // EXTRACT vendorId from the FIRST product since all belong to same vendor
    if (cleanProducts.length > 0) {
      setVendorId(cleanProducts[0].userId);
    }
  } catch (err) {
    console.error(err);
    toast.error("Store not found or unavailable");
  }
};
  

  const openWhatsApp = (number, name) => {
    if (!number) {
      toast.error("Seller has no WhatsApp number attached.");
      return;
    }
    const message = encodeURIComponent(`Hi ${store?.name}, I’m interested in your product: ${name}.`);
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };
  // Cart handlers
  const addToCart = (product) => {
  const exists = cartItems.find((item) => item._id === product._id);
  if (exists) {
    setCartItems(
      cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  } else {
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
  }
  toast.success(`${product.name} added to cart!`);
  setIsCartOpen(true);
};

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
    toast.success("Product removed from cart.");
  };
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-500">
        Loading store...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 px-4 md:px-10 py-8 relative">
      {/* Cart Icon (Top Right) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="absolute top-5 right-6 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 transition "
      >
        <FiShoppingCart size={22} className="text-[#0046A5]" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>
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
          alt={String(ads[currentAd].caption)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-2xl md:text-3xl font-semibold">
            {String(ads[currentAd].caption)}
          </h2>
        </div>
      </motion.div>
      {/* Ad Contact Note */}
      <div className="text-center mb-10">
        <p className="text-gray-600 text-sm md:text-base">
          To advertise your store products here,{" "}
          <a
            href="mailto:binaryhq@outlook.com?subject=Advertise%20on%20MarketSquare&body=Hi%20Binary%20Team,%20I’d%20like%20to%20advertise%20my%20product%20on%20MarketSquare."
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
          <p className="col-span-full text-center text-gray-500">No products available yet.</p>
        ) : (
          products.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3 cursor-pointer flex flex-col"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-44 object-cover rounded-lg mb-3"
                onClick={() => setSelected(p)}
              />
              <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
              <p className="text-[#00B86B] font-medium">₦{p.price.toLocaleString()}</p>
              <p className="text-gray-500 text-sm line-clamp-2">{p.category}</p>
              <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
              <button
                onClick={() => addToCart(p)}
                className="mt-3 bg-[#0046A5] text-white px-3 py-2 rounded-lg hover:bg-[#00398D] transition text-sm font-medium"
              >
                Add to Cart
              </button>
            </motion.div>
          ))
        )}
      </div>
      {/* Product Modal */}
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
            <p className="text-gray-600 mb-4">{selected.category}</p>
            <p className="text-gray-600 mb-4">{selected.description}</p>
            {/* <button
              onClick={() => openWhatsApp(store.whatsappNumber, selected.name)}
              className="w-full py-3 rounded-xl bg-[#00B86B] text-white font-semibold text-lg hover:bg-[#009C5E] transition"
            >
              Contact Seller on WhatsApp
            </button> */}
            <button
              onClick={() => addToCart(selected)}
              className="w-full py-3 mt-2 rounded-xl bg-[#0046A5] text-white font-semibold text-lg hover:bg-[#00398D] transition"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      )}
      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-50 p-4 overflow-y-auto flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <div className="flex-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-[#00B86B]">
                      Price: ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
        ))}

        {/* Checkout Drawer */}
        
        <CheckoutDrawer
          isOpen={isCheckoutOpen}
          onClose={()=>setIsCheckoutOpen(false)}
          vendorId={vendorId}
          vendor={store}
          cartItems={cartItems}
          onInitiatePayment={handlePaystackPayment}
        />

        {/*  Total Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold flex justify-between">
            <span>Total:</span>
             <span className="text-[#00B86B]">
              ₦
              {cartItems
                .reduce((acc, item) => {
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 0;
                  return acc + price * quantity;
                }, 0)
                .toLocaleString()}
            </span>
          </h3>
        </div>
      </div>
    )}
    {/*  Buttons */}
    <div className="mt-6 space-y-3">
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full py-2 bg-[#00B86B] text-white font-semibold rounded-lg hover:bg-[#009C5E] transition"
        >
          Proceed to Checkout
        </button>
      )}
      <button
        onClick={() => setIsCartOpen(false)}
        className="w-full py-2 bg-[#0046A5] text-white font-semibold rounded-lg hover:bg-[#00398D] transition"
      >
        Close
      </button>
    </div>
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
          <p className="text-sm text-gray-100 mb-3">
            Contact us at : info@hqbinary.com
          </p>
          <a
            href="https://www.quickinvoiceng.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00B86B] text-[#0046A5] font-medium px-4 py-2 rounded-full hover:bg-[#00A060] transition"
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