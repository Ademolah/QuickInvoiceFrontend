import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, ShoppingBag } from "lucide-react";
// import { toast } from "react-toastify";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";


// const API = import.meta.env.VITE_API_URL;
const API = "https://quickinvoice-backend-1.onrender.com";

const MarketSquare = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const [referralCode, setReferralCode] = useState("");

//   const [setupData, setSetupData] = useState(null);
  const [marketProfile, setMarketProfile] = useState(null);
  const token = localStorage.getItem("token");
  // ✅ Fetch user MarketSquare status
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setMarketProfile(res.data);
        // ✅ only activate if the user already has a slug
        if (res.data.slug) {
          setActivated(true);
        } else {
          setActivated(false);
        }
      }
    } catch (err) {
      console.log("No existing MarketSquare profile yet.");
      setActivated(false);
    }
  };
  fetchProfile();
}, [token]);


  //✅ Handle setup submission
 const handleSetup = async (e) => {
  e.preventDefault();
  if (!whatsapp.trim()) {
    toast.error("Please enter your WhatsApp number");
    return;
  }
  if (!referralCode.trim()) {
    toast.error("Please enter your referral code");
    return;
  }
  if (!termsAccepted) {
    toast.error("You must agree to the terms and conditions");
    return;
  }
  try {
    setLoading(true);
    const res = await axios.post(
      `${API}/api/marketsquare/setup`,
      { whatsapp, termsAccepted, referralCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setActivated(true);
    setMarketProfile(res.data);
    toast.success("Welcome to MarketZone! :tada:");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Setup failed, please try again");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B]  flex flex-col items-center justify-center p-6">
      {!activated ? (
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={40} className="text-[#0046A5]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0046A5] mb-3">
            Welcome to MarketZone 🛍️
          </h1>
          <p className="text-gray-600 mb-6">
            MarketZone lets you list and showcase your products beautifully
            for customers to see. Buyers will contact you directly via WhatsApp.
          </p>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                WhatsApp Number
              </label>
              {/* <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 08101234567"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
              /> */}
              <div>
                {/* <label className="block text-sm font-semibold text-gray-700 mb-1">
                    WhatsApp Number
                </label> */}
                <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => {
                    let value = e.target.value.replace(/\s+/g, ''); // remove spaces
                    // If user types a local 0-number, automatically convert to +234
                    if (value.startsWith('0')) {
                        value = `+234${value.slice(1)}`;
                    }
                    // If user types without +234 or 0, also prefix
                    if (!value.startsWith('+234')) {
                        value = `+234${value}`;
                    }
                    setWhatsapp(value);
                    }}
                    placeholder="e.g. 08101234567"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
                />
                <small className="text-gray-500">
                    Please enter your WhatsApp number. +234 will be added automatically.
                </small>
                </div>
              

              <div className="text-left">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5] uppercase"
                  />
                  <small className="text-gray-500">
                    Referral code from a verified QuickInvoiceNG vendor.
                  </small>
              </div>

              <small className="text-gray-500">
                Buyers will contact you through this number.
              </small>

            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4"
              />
              <p className="text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-[#0046A5] font-semibold underline"
                >
                  Terms and Conditions
                </a>
                .
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0046A5] text-white py-2 rounded-lg hover:bg-[#00398D] transition disabled:opacity-60"
            >
              {loading ? "Setting up..." : "Get Started"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center animate-fadeIn">
          <CheckCircle size={40} className="text-green-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-[#0046A5] mb-3">
            MarketZone is Active 🎉
          </h2>
          <p className="text-gray-700 mb-4">
            You're all set up,{" "}
            <span className="font-semibold">{marketProfile?.businessName}</span>
            ! You can now start uploading your products and share your page link:
          </p>
            <div className="bg-gray-100 border rounded-lg p-3 text-sm text-gray-700 font-mono break-all flex justify-between items-center">
            <span>{`https://www.quickinvoiceng.com/market/${marketProfile?.slug}`}</span>
            <button
                onClick={() => {
                navigator.clipboard.writeText(`https://www.quickinvoiceng.com/market/${marketProfile?.slug}`);
                toast.success("Link copied!");
                }}
                className="text-[#0046A5] font-semibold ml-3 hover:underline"
            >
                <Copy size={16} />
            </button>
            </div>
          <button
            onClick={() => (window.location.href = "/product")}
            className="mt-5 bg-[#0046A5] text-white px-6 py-2 rounded-lg hover:bg-[#00398D] transition"
          >
            Go to Product Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketSquare;

