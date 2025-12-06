import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dialCode: "+234",
    businessName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Add country codes list (minimal example, you can expand it)
  const countryCodes = [
    { code: "+234", country: "Nigeria" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
    { code: "+90", country: "Turkey" },
    { code: "+91", country: "India" },
    { code: "+27", country: "South Africa" },
    { code: "+233", country: "Ghana" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        // phone: Number(formData.phone), // ensure numeric
        dialCode: formData.dialCode,
        phone: Number(formData.phone),
        businessName: formData.businessName,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      // navigate("/dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 300); 
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B] p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#0046A5] mb-6">
          Create Your QuickInvoice NG Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your First Name and Last Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />




          <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-[#0046A5]">
  {/* Country code selector */}
  <select
    value={formData.dialCode || "+234"}
    onChange={(e) =>
      setFormData({ ...formData, dialCode: e.target.value })
    }
    className="px-3 bg-white text-gray-600 border-r border-gray-300 focus:outline-none"
  >
    {countryCodes.map((item, idx) => (
      <option key={idx} value={item.code}>
        {item.code} ({item.country})
      </option>
    ))}
  </select>

  {/* Phone input field */}
  <input
    type="tel"
    name="phone"
    placeholder="7012345678"
    value={formData.phone}
    onChange={(e) => {
      // remove any leading 0 automatically
      let value = e.target.value.replace(/^0+/, "");
      setFormData({ ...formData, phone: value });
    }}
    className="w-full p-3 rounded-r focus:outline-none"
    required
  />
</div>


          {/* <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-[#0046A5]"> */}
  {/* Hardcoded prefix */}
  {/* <span className="px-3 text-gray-600  border-r border-gray-300">
    +234
  </span> */}

  {/* Input field */}
  {/* <input
    type="tel"
    name="phone"
    placeholder="8012345678"
    value={formData.phone}
    onChange={(e) => {
      // remove any leading 0 automatically
      let value = e.target.value.replace(/^0+/, "");
      setFormData({ ...formData, phone: value });
    }}
    className="w-full p-3 rounded-r focus:outline-none"
    required
  /> */}
{/* </div> */}

          {/* <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g. 2348012345678)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          /> */}

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          {/* <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0046A5]"
            required
          /> */}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-[#00477B] focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#0046A5] font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
