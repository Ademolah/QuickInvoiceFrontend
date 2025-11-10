/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";



const API = "https://quickinvoice-backend-1.onrender.com"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  // ✅ Fetch all user products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/marketsquare/my-products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  },[]);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [token]);


  // :wastebasket: Delete product logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/api/marketsquare/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully!");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12 lg:px-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">
          My Items
        </h1>
        
        {/* Store Link Box */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm text-gray-600">Your Store Link:</p>
                <div className="mt-1 flex items-center">
                <span className="font-mono text-sm bg-white border rounded-md px-3 py-1 text-gray-700 break-all">
                    {`https://www.quickinvoiceng.com/market/${user?.slug || "your-slug"}`}
                </span>
                <button
                    onClick={() => {
                    navigator.clipboard.writeText(
                        `https://www.quickinvoiceng.com/market/${user?.slug || ""}`
                    );
                    toast.success("Store link copied!");
                    }}
                    className="ml-2 text-[#0046A5] hover:text-[#00398D] transition"
                >
                    📋
                </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                Share this link on your WhatsApp status or any social media to invite customers to your store.
                </p>
            </div>
        </div>

        <button
            onClick={() => navigate("/market/add-product")}
            className="flex items-center gap-1.5 bg-[#0046A5] hover:bg-[#003B8A] text-white
                        px-3 py-1.5 rounded-full shadow-md transition-all
                        text-sm sm:text-base"
            >
          <Plus size={16} />
          Add Product
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500 text-center mt-10">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-600 text-lg">
            You haven’t added any products yet.
          </p>
          <button
            onClick={() => navigate("/market/add-product")}
            className="mt-4 bg-[#0046A5] text-white px-6 py-2 rounded-full hover:bg-[#003b8a] transition-all"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-gray-400 italic">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {product.description || "No description"}
                </p>
                <p className="font-bold text-[#0046A5] mb-3">
                  ₦{product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

        <button
          onClick={() => navigate("/dashboard")}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Q
        </button>


    </div>
  );
};
export default Products;