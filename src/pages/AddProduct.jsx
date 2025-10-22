import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UploadCloud, Image as ImageIcon, CheckCircle } from "lucide-react";



const API = "https://quickinvoice-backend-1.onrender.com"


const AddProduct = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (image) formData.append("image", image);
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/marketsquare/product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      setSuccess(true);
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B] flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md animate-fadeIn">
        {success ? (
          <div className="text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={50} />
            <h2 className="text-2xl font-bold text-[#0046A5] mb-2">
              Product Added!
            </h2>
            <p className="text-gray-600 mb-6">
              Your product has been listed successfully on MarketSquare.
            </p>
            <div className="flex flex-col items-center space-y-3 mt-6">
                <button
                    onClick={() => setSuccess(false)}
                    className="w-full max-w-xs bg-[#0046A5] text-white px-6 py-2 rounded-lg hover:bg-[#00398D] transition"
                >
                    Add Another Product
                </button>
                <button
                    onClick={() => (window.location.href = '/product')}
                    className="w-full max-w-xs bg-gradient-to-br from-[#0046A5] to-[#00B86B] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                >
                    Go to Product List
                </button>
                </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#0046A5] mb-3 text-center">
              Add New Product 🛍️
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Upload your product details below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
                />
              </div>
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
                ></textarea>
              </div>
              {/* Image Upload */}
              <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <ImageIcon size={40} className="text-gray-400 mb-2" />
                )}
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer text-[#0046A5] font-semibold hover:underline"
                >
                  {preview ? "Change Image" : "Upload Image"}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0046A5] text-white py-2 rounded-lg hover:bg-[#00398D] transition disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <UploadCloud size={18} className="mr-2 animate-pulse" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} className="mr-2" /> Add Product
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default AddProduct;








