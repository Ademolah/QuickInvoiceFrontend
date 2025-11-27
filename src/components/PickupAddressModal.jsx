import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


const API = "https://quickinvoice-backend-1.onrender.com";
export default function PickupAddressModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
  });
  const token = localStorage.getItem("token");
  const handleSubmit = async () => {
  try {
    const res = await axios.put(
      `${API}/api/users/pickup-address`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    toast.success("Pickup address saved!");
    onSuccess(res.data.pickupAddress);
    onClose();
  } catch (error) {
    console.log(error);
    toast.error("Failed to save pickup address");
  }
};
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Set Pickup Address</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Street"
            className="border w-full p-2 rounded"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            className="border w-full p-2 rounded"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="State"
            className="border w-full p-2 rounded"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="border w-full p-2 rounded"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country"
            className="border w-full p-2 rounded bg-gray-200"
            value={form.country}
            disabled
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-gradient-to-r from-blue-600 to-green-500 text-white w-full py-2 rounded-lg"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}