/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import PickupAddressModal from "../components/PickupAddressModal";



const API = "https://quickinvoice-backend-1.onrender.com"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const [showModal, setShowModal] = useState(false);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupAddress, setPickupAddress] = useState({
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
});

const [loadingAddressUpdate, setLoadingAddressUpdate] = useState(false);
const [addressMessage, setAddressMessage] = useState("");

const [showEditModal, setShowEditModal] = useState(false);
const [editProductData, setEditProductData] = useState(null);
const [editImagePreview, setEditImagePreview] = useState(null);

const categories = ["Electronics",'Gadgets', "Fashion", "Home", "Books", "Toys", "Health", "Sports","Groceries", "Beauty", "Automotive","Other"]


const openEditModal = (product) => {
  setEditProductData(product);
  setEditImagePreview(product.image);
  setShowEditModal(true);
};

const handleUpdateProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editProductData.name);
    formData.append("price", editProductData.price);
    formData.append("description", editProductData.description);
    formData.append("category", editProductData.category);
    formData.append("shipping_category", editProductData.shipping_category);
    formData.append("shipping_category_id", editProductData.shipping_category_id);
    if (editProductData.image instanceof File) {
      formData.append("image", editProductData.image);
    }
    await axios.patch(
      `${API}/api/marketsquare/product/${editProductData._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Product updated!");
    setShowEditModal(false);
    // Refresh Products
    fetchProducts();
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};


const handlePickupChange = (e) => {
  setPickupAddress({
    ...pickupAddress,
    [e.target.name]: e.target.value,
  });
};

const updatePickupAddress = async () => {
  try {
    setLoadingAddressUpdate(true);
    setAddressMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/users/pickup-address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pickupAddress),
    });
    const data = await res.json();
    if (!res.ok) {
      setAddressMessage(data.message || "Update failed");
      return;
    }
    toast.success("Pickup address updated!");
    setAddressMessage("Pickup address updated successfully!");
    setShowPickupModal(false);
  } catch (error) {
    setAddressMessage("Error updating address");
  } finally {
    setLoadingAddressUpdate(false);
  }
};

    useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/vendor/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTotalOrders(res.data.totalOrders);
        setTotalVolume(res.data.totalVolume);
      } catch (error) {
        console.log("Error fetching vendor stats:", error);
      }
    };
    fetchStats();
  }, []);
  
  useEffect(() => {
    async function checkPickup() {
      const res = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const addr = res.data.pickupAddress;
      if (!addr || !addr.street || !addr.city || !addr.state || !addr.postalCode) {
        setShowModal(true);
      }
    }
    checkPickup();
  }, []);


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


  //  Delete product logic
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

      {/* Scrolling Vendor Notice */}
        <div className="w-full bg-[#0047AB] py-2 overflow-hidden">
          <div className="w-max animate-marquee whitespace-nowrap text-white text-sm font-medium flex gap-24">
            <span>📩 Please always check your email for new order notifications.</span>
            <span>💼 We charge a 3% fee on every amount paid which automatically covers delivery fee.</span>
          </div>
        </div>

        {/* Show stats */}

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Vendor Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Sales (Orders)</p>
              <p className="text-xl font-bold">{totalOrders}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Volume (₦)</p>
              <p className="text-xl font-bold">
                ₦{Number(totalVolume).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

      <div className="flex items-center justify-between mb-8">
        {/* <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">
          My Items
        </h1> */}
        
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
                <p className="text-sm text-gray-500 mb-2">
                  {product.category}
                </p>
                <p className="font-bold text-[#0046A5] mb-3">
                  ₦{product.price.toLocaleString()}
                </p>
                {/* <button
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button> */}
                <div className="flex gap-4 mt-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowPickupModal(true)}
          className="bg-[#0047AB] text-white px-6 py-3 rounded-lg shadow hover:bg-[#00398a] text-sm"
        >
          Update Pickup Address
        </button>
      </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Q
        </button>

      <PickupAddressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(address) => console.log("Saved:", address)}
      />



        {showPickupModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Update Pickup Address</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            name="street"
            value={pickupAddress.street}
            onChange={handlePickupChange}
            placeholder="Street"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
          />
          <input
            name="city"
            value={pickupAddress.city}
            onChange={handlePickupChange}
            placeholder="City"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
          />
          <input
            name="state"
            value={pickupAddress.state}
          onChange={handlePickupChange}
          placeholder="State"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
        />
        <input
          name="country"
          value={pickupAddress.country}
          onChange={handlePickupChange}
          placeholder="Country"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
        />
        <input
          name="postalCode"
          value={pickupAddress.postalCode}
          onChange={handlePickupChange}
          placeholder="Postal Code"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
        />
      </div>
      {addressMessage && (
        <p className="mt-3 text-red-500">{addressMessage}</p>
      )}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowPickupModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={updatePickupAddress}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded"
        >
          {loadingAddressUpdate ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}


{showEditModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-[#0046A5]">
        Edit Product
      </h2>
      {/* Image Preview */}
      {editImagePreview && (
        <img
          src={editImagePreview}
          alt="Preview"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}
      {/* Image Upload */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setEditProductData({ ...editProductData, image: file });
            setEditImagePreview(URL.createObjectURL(file));
          }
        }}
        className="mb-3"
      />
      <input
        type="text"
        value={editProductData.name}
        onChange={(e) =>
          setEditProductData({ ...editProductData, name: e.target.value })
        }
        placeholder="Product Name"
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <input
        type="text"
        value={editProductData.price}
        onChange={(e) =>
          setEditProductData({ ...editProductData, price: e.target.value })
        }
        placeholder="Price"
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <textarea
        value={editProductData.description}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            description: e.target.value,
          })
        }
        placeholder="Description"
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <select
        value={editProductData.category}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            category: e.target.value,
          })
        }
        className="w-full border rounded px-3 py-2 mb-3"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {/* Modal Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateProduct}
          className="px-4 py-2 bg-[#0046A5] text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};
export default Products;