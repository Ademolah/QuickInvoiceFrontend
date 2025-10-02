import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";


// const BASEURL = "http://localhost:4000";
const BASEURL= "https://quickinvoice-backend-1.onrender.com"


export default function QuickPay() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine_1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "NG",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bvn: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASEURL}/api/anchor/create-customer`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Customer created:", res.data);
      navigate("/quickpay/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const checkAnchorStatus = async () => {
      try {
        const token = localStorage.getItem("token"); // or however you store JWT
        const res = await axios.get(
          `${BASEURL}/api/anchor/check-customer`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // :white_check_mark: If user already exists on Anchor, go straight to dashboard
        if (res.data?.anchorCustomerExists) {
          navigate("/quickpay/dashboard");
        }
      } catch (err) {
        console.log("QuickPay status check error:", err.message);
        // If error or no anchor record, user stays on onboarding
      }
    };
    checkAnchorStatus();
  }, []);

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B]  px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        {step === 1 && (
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-700">Welcome to QuickPay 🎉</h1>
            <div className="text-gray-600 text-sm text-left space-y-4 max-h-64 overflow-y-auto p-4 border rounded-lg">
              <h2 className="font-semibold text-base">Terms & Conditions</h2>
              <p>
                By using QuickPay, you agree to comply with and be bound by the following
                Terms and Conditions. Please read them carefully before proceeding.
              </p>
              <h3 className="font-semibold">1. Acceptance of Service</h3>
              <p>
                By creating an account or accessing our platform, you confirm that you are
                at least 18 years old and legally permitted to use financial services in
                your jurisdiction. If you are acting on behalf of a business, you
                represent that you have the authority to do so.
              </p>
              <h3 className="font-semibold">2. User Responsibilities</h3>
              <p>
                You must provide accurate information during registration and keep your
                login credentials secure. You are fully responsible for all activity on
                your account.
              </p>
              <h3 className="font-semibold">3. Payment Transactions</h3>
              <p>
                Transactions made through QuickPay must be lawful, authorized, and
                accurate. We may monitor, review, delay, or cancel transactions for
                security, fraud prevention, or regulatory reasons.
              </p>
              <h3 className="font-semibold">4. Fees and Billing</h3>
              <p>
                Some services may include processing fees or charges. These will be
                disclosed before payment is finalized. By proceeding, you agree to any
                applicable charges.
              </p>
              <h3 className="font-semibold">5. Data Privacy</h3>
              <p>
                We collect and process personal and transaction data according to our
                Privacy Policy. We do not sell or share your data with unauthorized third parties.
              </p>
              <h3 className="font-semibold">6. Prohibited Use</h3>
              <p>
                You may not use QuickPay for money laundering, fraud, identity theft,
                terrorism financing, or any illegal activity. Violation may lead to
                account suspension, reporting to authorities, or legal action.
              </p>
              <h3 className="font-semibold">7. Service Availability</h3>
              <p>
                We strive to provide uninterrupted service but do not guarantee
                error-free or always-available access. Maintenance or third-party issues
                may cause delays or downtime.
              </p>
              <h3 className="font-semibold">8. Liability Disclaimer</h3>
              <p>
                QuickPay is not responsible for losses arising from user error,
                unauthorized use of your account, system downtime, or third-party service
                interruptions. Your use of the platform is at your own risk.
              </p>
              <h3 className="font-semibold">9. Account Suspension or Termination</h3>
              <p>
                We may suspend or terminate your access if you breach these terms,
                engage in illegal activities, or compromise the security or integrity of
                the system.
              </p>
              <h3 className="font-semibold">10. Changes to Terms</h3>
              <p>
                We may update these Terms & Conditions at any time. Continued use of the
                platform after changes indicates acceptance of the updated terms.
              </p>
              <h3 className="font-semibold">11. Contact Information</h3>
              <p>
                For questions or concerns about these Terms, you may contact our support
                team at support@quickpay.com.
              </p>
              <p className="font-medium">
                By clicking “Agree to our Terms & Continue,” you acknowledge that you
                have read, understood, and accepted these Terms & Conditions.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Agree to our Terms & Continue
            </button>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-blue-700">Create Your QuickPay Profile</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm"
              />
              <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="addressLine_1" placeholder="Address Line 1" value={formData.addressLine_1} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" />

              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />

              <select name="gender" value={formData.gender} onChange={handleChange} className="input" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input name="bvn" placeholder="BVN" value={formData.bvn} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] placeholder-gray-400 text-sm" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}










