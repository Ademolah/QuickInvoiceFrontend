/* eslint-disable no-unused-vars */


// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useCurrency } from "../context/CurrencyContext";
// import { motion, AnimatePresence } from "framer-motion";
// // import PremiumTrashButton from "../components/ui/Delete";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   Search,
//   Package,
//   Tag,
//   Hash,
//   Layers,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { useRef } from "react";
// import PrintInventory from "../components/PrintInventory";
// import html2canvas from "html2canvas"
// import jsPDF from "jspdf"
// import {jwtDecode} from "jwt-decode"

// /* =========================
//    Inline UI Primitives
//    ========================= */

// // Brand Button

// const Button = ({ className = "", children, ...props }) => (
//   <button
//     className={
//       "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all " +
//       "bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white shadow hover:shadow-md hover:opacity-95 active:scale-[0.98] " +
//       className
//     }
//     {...props}
//   >
//     {children}
//   </button>
// );

// // Subtle/ghost button
// const GhostButton = ({ className = "", children, ...props }) => (
//   <button
//     className={
//       "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors " +
//       "text-[#0046A5] hover:bg-[#0046A5]/10 " +
//       className
//     }
//     {...props}
//   >
//     {children}
//   </button>
// );


// // Card
// const Card = ({ className = "", children }) => (
//   <div className={"bg-white rounded-2xl shadow-md border border-gray-100 " + className}>
//     {children}
//   </div>
// );
// const CardHeader = ({ children, className = "" }) => (
//   <div className={"p-5 border-b border-gray-100 " + className}>{children}</div>
// );
// const CardContent = ({ children, className = "" }) => (
//   <div className={"p-5 " + className}>{children}</div>
// );

// // Dialog / Modal
// const Dialog = ({ open, onClose, children }) => {
//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             className="fixed inset-0 z-40 bg-black/40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0, scale: 0.96, y: 8 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.98, y: 8 }}
//           >
//             <div
//               className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {children}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// /* =========================
//    Helpers
//    ========================= */
// // const NGN = (n) =>
// //   new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
// //     Number(n || 0)
// //   );

// // const api = axios.create({
// //   baseURL: "http://localhost:4000/api",
// // });

// const api = axios.create({
//   baseURL: "https://quickinvoice-backend-1.onrender.com/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// /* =========================
//    Inventory Page
//    ========================= */
// export default function Inventory() {

//   const { formatCurrency } = useCurrency()
  
    
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate()


//   //printing inventory
//   const token = localStorage.getItem("token");
//   const user = token ? jwtDecode(token) : null;
  
  
  

//   const printRef = useRef(null);
//   const [exportItems, setExportItems] = useState([]);
//   const [exporting, setExporting] = useState(false);
//   const exportInventoryPDF = async () => {
//     try {
//       setExporting(true);
//       const res = await api.get("/inventory/export/all");
//       setExportItems(res.data.items);
//       // wait for render
//       setTimeout(async () => {
//         const canvas = await html2canvas(printRef.current, {
//           scale: 2,
//           useCORS: true,
//         });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const pdfWidth = 210;
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save("QuickInvoice-Inventory.pdf");
//       }, 300);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to export inventory");
//     } finally {
//       setExporting(false);
//     }
//   };
  

  
//   const [query, setQuery] = useState("");

//   // Modal state
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState("create"); // 'create' | 'edit'
//   const [form, setForm] = useState({
//     _id: null,
//     name: "",
//     sku: "",
//     price: "",
//     stock: "",
//     category: "",
//     description: "",
//   });

//   // Fetch inventory
//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/inventory");
//       setItems(res.data || []);
//     } catch (e) {
//       console.error(e);
//       setError(e.response?.data?.message || "Failed to load inventory");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // Derived stats
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter(
//       (i) =>
//         i.name?.toLowerCase().includes(q) ||
//         i.sku?.toLowerCase().includes(q) ||
//         i.category?.toLowerCase().includes(q)
//     );
//   }, [items, query]);

//   const totals = useMemo(() => {
//     const totalProducts = filtered.length;
//     const totalUnits = filtered.reduce((s, it) => s + Number(it.stock || 0), 0);
//     const totalValue = filtered.reduce(
//       (s, it) => s + Number(it.stock || 0) * Number(it.price || 0),
//       0
//     );
//     return { totalProducts, totalUnits, totalValue };
//   }, [filtered]);

//   // Handlers
//   const openCreate = () => {
//     setMode("create");
//     setForm({
//       _id: null,
//       name: "",
//       sku: "",
//       price: "",
//       stock: "",
//       category: "",
//       description: "",
//     });
//     setOpen(true);
//   };

//   const categories = [ // Electronics & Tech
//   "Phones",
//   "Laptops",
//   "Tablets",
//   "Accessories",
//   "Computer Peripherals",
//   "Gadgets",
//   "Smart Home Devices",
//   "Gaming Consoles",
//   "Gaming Accessories",
//   // Fashion & Lifestyle
//   "Men's Clothing",
//   "Women's Clothing",
//   "Children's Clothing",
//   "Footwear",
//   "Bags & Wallets",
//   "Watches",
//   "Jewelry",
//   "Beauty & Cosmetics",
//   "Fragrances",
//   // Health & Medicine
//   "Medicine",
//   "Medical Equipment",
//   "Health Supplements",
//   "Personal Care",
//   // Home & Furniture
//   "Furniture",
//   "Home Decor",
//   "Kitchen Appliances",
//   "Household Items",
//   "Lighting & Fixtures",
//   // Food & Restaurant
//   "Restaurant",
//   "Fast Food",
//   "Groceries",
//   "Beverages",
//   "Bakery Items",
//   "Frozen Foods",
//   // Office & Stationery
//   "Stationery",
//   "Office Supplies",
//   "Printing & Packaging",
//   "School Supplies",
//   // Auto & Industrial
//   "Automobile Parts",
//   "Car Accessories",
//   "Motorcycles & Parts",
//   "Industrial Equipment",
//   // Services & Digital
//   "Digital Products",
//   "Services",
//   "Subscriptions",
//   // Others
//   "Sports & Fitness",
//   "Toys & Games",
//   "Books & Educational Materials",
//   "Agricultural Products",
//   "Other"];

//   const openEdit = (item) => {
//     setMode("edit");
//     setForm({
//       _id: item._id,
//       name: item.name || "",
//       sku: item.sku || "",
//       price: item.price ?? "",
//       stock: item.stock ?? "",
//       category: item.category || "",
//       description: item.description || "",
//     });
//     setOpen(true);
//   };

//   // const saveItem = async () => {
//   //   // basic validation
//   //   if (!form.name || !String(form.price).length || !String(form.stock).length) {
//   //     setError("Please fill Name, Price and Quantity.");
//   //     return;
//   //   }
//   //   // if (!form.name.trim() || form.price === "" || form.quantity === "") {
//   //   // setError("Please fill Name, Price and Quantity.");
//   //   // return;
//   //   // }
//   //   try {
//   //     setError("");
//   //     if (mode === "create") {
//   //       const res = await api.post("/inventory", {
//   //         name: form.name,
//   //         sku: form.sku,
//   //         price: Number(form.price),
//   //         stock: Number(form.stock),
//   //         category: form.category,
//   //         description: form.description,
//   //       });
//   //       setItems((prev) => [res.data, ...prev]);
//   //     } else {
//   //       const res = await api.put(`/inventory/${form._id}`, {
//   //         name: form.name,
//   //         sku: form.sku,
//   //         price: Number(form.price),
//   //         stock: Number(form.stock),
//   //         category: form.category,
//   //         description: form.description,
//   //       });
//   //       setItems((prev) => prev.map((it) => (it._id === form._id ? res.data : it)));
//   //     }
//   //     setOpen(false);
//   //   } catch (e) {
//   //     console.error(e);
//   //     setError(e.response?.data?.message || "Save failed");
//   //   }
//   // };

//   const [saving, setSaving] = useState(false);
// const saveItem = async () => {
//   // basic validation
//   if (!form.name || !String(form.price).length || !String(form.stock).length) {
//     setError("Please fill Name, Price and Quantity.");
//     return;
//   }
//   try {
//     setError("");
//     setSaving(true);
//     let res;
//     if (mode === "create") {
//       res = await api.post("/inventory", {
//         name: form.name,
//         sku: form.sku,
//         price: Number(form.price),
//         stock: Number(form.stock),
//         category: form.category,
//         description: form.description,
//       });
//       setItems((prev) => [res.data, ...prev]);
//     } else {
//       res = await api.put(`/inventory/${form._id}`, {
//         name: form.name,
//         sku: form.sku,
//         price: Number(form.price),
//         stock: Number(form.stock),
//         category: form.category,
//         description: form.description,
//       });
//       setItems((prev) => prev.map((it) => (it._id === form._id ? res.data : it)));
//     }
//     setOpen(false);
//   } catch (e) {
//     console.error(e);
//     if(e.response?.data?.code === "UPGRADE_REQUIRED"){
//       setError(e.response.data.message)
//     } else {
//       setError(e.response?.data?.message || "Save failed");
//     }
//   } finally {
//     setSaving(false);
//   }
// }
  
//   const deleteItem = async (id) => {
//     const ok = window.confirm("Delete this product? This cannot be undone.");
//     if (!ok) return;
//     try {
//       setBusyId(id);
//       await api.delete(`/inventory/${id}`);
//       setItems((prev) => prev.filter((it) => it._id !== id));
//     } catch (e) {
//       console.error(e);
//       setError(e.response?.data?.message || "Delete failed");
//     } finally {
//       setBusyId(null);
//     }
//   };

  

//   return (
//     <div className="min-h-screen bg-[#F5F7FB]">
//       {/* Header */}
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#0028AE] via-[#00A6FA] to-[#0028AE] opacity-90" />
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="relative z-10 max-w-7xl mx-auto px-6 py-10"
//         >
//           <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white">Inventory</h1>
//               <p className="text-white/80 mt-2">
//                 Track products, stock levels, and values in one place.
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-3 w-full">
//               <div className="relative w-full sm:w-auto">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2"
//                   size={18}
//                   color="#4B5563"
//                 />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search by name, SKU, category…"
//                   className="pl-10 pr-4 py-2 rounded-xl bg-white/90 backdrop-blur text-gray-800 placeholder:text-gray-500 shadow-md
//                             w-full sm:w-[260px] md:w-[320px]
//                             focus:outline-none focus:ring-2 focus:ring-white/60"
//                 />
//               </div>
//                <Button
//                 onClick={openCreate}
//                 className="flex items-center justify-center gap-2
//                           w-full sm:w-auto whitespace-nowrap"
//               >
//                 <Plus size={18} />
//                 <span>Add Product</span>
//               </Button>
//             </div>
//             {/* Right: Export / Print */}
//             <Button
//               onClick={exportInventoryPDF}
//               disabled={exporting}
//               className="flex items-center justify-center gap-2
//                           w-full sm:w-auto whitespace-nowrap"
//             >
//               📄{exporting ? " Preparing PDF..." : " Print Inventory"}
//             </Button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
//             <Card>
//               <CardContent className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-[#0046A5]/10">
//                   <Package className="text-[#0046A5]" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Products</p>
//                   <p className="text-2xl font-bold text-gray-800">{totals.totalProducts}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-[#00B86B]/10">
//                   <Layers className="text-[#00B86B]" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Units in Stock</p>
//                   <p className="text-2xl font-bold text-gray-800">{totals.totalUnits}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-emerald-100">
//                   <Tag className="text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Stock Value</p>
//                   <p className="text-2xl font-bold text-gray-800">{formatCurrency((totals.totalValue))}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </motion.div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         {error && (
//           <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-100">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="py-20 text-center text-gray-500">Loading inventory…</div>
//         ) : filtered.length === 0 ? (
//           <Card>
//             <CardContent className="py-16 text-center">
//               <p className="text-gray-600 mb-6">No products found.</p>
//               <Button onClick={openCreate}>
//                 <Plus size={18} /> Add your first product
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AnimatePresence>
//               {filtered.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 8 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Card className="h-full">
//                     <CardHeader className="flex items-start justify-between">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
//                         <p className="text-sm text-gray-500">SKU: {item.sku || "—"}</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <GhostButton onClick={() => openEdit(item)} title="Edit">
//                           <Pencil size={18} />
//                         </GhostButton>
//                         <GhostButton
//                           onClick={() => deleteItem(item._id)}
//                           title="Delete"
//                           className="text-red-600 hover:bg-red-50"
//                         >
//                           {busyId === item._id ? (
//                             <svg
//                               className="animate-spin h-4 w-4"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                               />
//                             </svg>
//                           ) : (
//                             <Trash2  size={18} />
//                           )}
//                         </GhostButton>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-500">Category</span>
//                         <span className="font-medium">{item.category || "—"}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-500">Price</span>
//                         <span className="font-semibold">{formatCurrency((item.price))}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-500">Stock</span>
//                         <span className="font-semibold">{item.stock}</span>
//                       </div>
//                       <div className="pt-2 border-t border-gray-100">
//                         <p className="text-sm text-gray-600">
//                           {item.description?.length ? item.description : "No description"}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* Create / Edit Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="text-xl font-semibold text-gray-800">
//             {mode === "create" ? "Add Product" : "Edit Product"}
//           </h3>
//           <GhostButton onClick={() => setOpen(false)}>
//             <X size={18} />
//           </GhostButton>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field
//               label="Product Name"
//               value={form.name}
//               onChange={(v) => setForm((f) => ({ ...f, name: v }))}
//               placeholder="e.g., iPhone 15 Pro"
//               required
//             />
//             <Field
//               label="SKU"
//               value={form.sku}
//               onChange={(v) => setForm((f) => ({ ...f, sku: v }))}
//               placeholder="e.g., IP15-256-GRY"
//               icon={<Hash size={16} />}
//             />
//             <Field
//               label="Price"
//               type="number"
//               value={form.price}
//               onChange={(v) => setForm((f) => ({ ...f, price: v }))}
//               placeholder="e.g., 250000"
//               required
//             />
//             <Field
//               label="Stock"
//               type="number"
//               value={form.stock}
//               onChange={(v) => setForm((f) => ({ ...f, stock: v }))}
//               placeholder="e.g., 10"
//               required
//             />
           
//             <select
//             value={form.category}
//             onChange={(e) =>
//               setForm((f) => ({ ...f, category: e.target.value }))
//             }
//             className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Select Category --</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>

    

//             <Field
//               label="Description"
//               value={form.description}
//               onChange={(v) => setForm((f) => ({ ...f, description: v }))}
//               placeholder="Optional notes…"
//               textarea
//               className="md:col-span-2"
//             />
//           </div>

//           {error && (
//             <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 border border-red-100">
//               {error}
//             </div>
//           )}

//           {/* <div className="mt-6 flex items-center justify-end gap-3">
//             <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
//             <Button onClick={saveItem}>{mode === "create" ? "Add Product" : "Save Changes"}</Button>
//           </div> */}
//           <div className="mt-6 flex items-center justify-end gap-3">
//             <GhostButton onClick={() => setOpen(false)} disabled={saving}>
//               Cancel
//             </GhostButton>
//             <Button onClick={saveItem} disabled={saving}>
//               {saving
//                 ? mode === "create"
//                   ? "Adding..."
//                   : "Saving..."
//                 : mode === "create"
//                 ? "Add Product"
//                 : "Save Changes"}
//             </Button>
//           </div>
//         </div>
//       </Dialog>

//       {/* Back to Dashboard button */}
//       {/* <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           ⬅ Back to Dashboard
//         </button>
//       </div> */}
//       {/* Floating Q Button at Bottom */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 right-4 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-[#00A6FA] transition"
//         >
//           Q
//         </button>


//         <div className="absolute left-[-9999px] top-0">
//         <PrintInventory
//           ref={printRef}
//           items={exportItems}
//           businessName={user?.businessName || "My Business"}
//         />
//       </div>
//     </div>

    
//   );
// }

// /* =========================
//    Reusable Field Component
//    ========================= */
// const Field = ({
//   label,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   required = false,
//   textarea = false,
//   className = "",
//   icon = null,
// }) => {
//   const base =
//     "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-gray-800 placeholder:text-gray-400 " +
//     "focus:outline-none focus:ring-2 focus:ring-[#0046A5]/30 focus:border-[#0046A5]/40";
//   return (
//     <div className={className}>
//       <label className="mb-1.5 block text-sm font-medium text-gray-700">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
//         {textarea ? (
//           <textarea
//             className={base + (icon ? " pl-9" : "")}
//             rows={4}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//           />
//         ) : (
//           <input
//             className={base + (icon ? " pl-9" : "")}
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//           />
//         )}

        
//       </div>

//     </div>
    
//   );
// };

import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { useCurrency } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Search, Package, Tag, Hash, 
  Layers, X, Filter, ChevronRight, AlertCircle, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrintInventory from "../components/PrintInventory";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { jwtDecode } from "jwt-decode";

/* =========================
   WORLD-CLASS UI COMPONENTS
   ========================= */

const StatusBadge = ({ stock }) => {
  const isLow = stock > 0 && stock <= 5;
  const isOut = stock <= 0;
  
  if (isOut) return <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100">Out of Stock</span>;
  if (isLow) return <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">Low Stock</span>;
  return <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">In Stock</span>;
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

/* =========================
   API CONFIG
   ========================= */
const api = axios.create({ baseURL: "https://quickinvoice-backend-1.onrender.com/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Inventory() {
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const printRef = useRef(null);

  // States
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportItems, setExportItems] = useState([]);

  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  }, []);

  const [form, setForm] = useState({
    _id: null, name: "", sku: "", price: "", stock: "", category: "", description: "",
  });

  const categories = ["Phones", "Laptops", "Accessories", "Gadgets", "Men's Clothing", "Women's Clothing", "Health", "Groceries", "Services", "Other"];

  /* =========================
     LOGIC HANDLERS
     ========================= */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      setItems(res.data || []);
    } catch (e) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(i => 
      i.name?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const totals = useMemo(() => ({
    totalProducts: filtered.length,
    totalUnits: filtered.reduce((s, it) => s + Number(it.stock || 0), 0),
    totalValue: filtered.reduce((s, it) => s + Number(it.stock || 0) * Number(it.price || 0), 0)
  }), [filtered]);

  const saveItem = async () => {
    if (!form.name || !form.price || !form.stock) return setError("Required fields missing");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      const res = mode === "create" ? await api.post("/inventory", payload) : await api.put(`/inventory/${form._id}`, payload);
      setItems(prev => mode === "create" ? [res.data, ...prev] : prev.map(it => it._id === form._id ? res.data : it));
      setOpen(false);
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete product?")) return;
    setBusyId(id);
    try {
      await api.delete(`/inventory/${id}`);
      setItems(prev => prev.filter(it => it._id !== id));
    } finally { setBusyId(null); }
  };

  const exportInventoryPDF = async () => {
    setExporting(true);
    try {
      const res = await api.get("/inventory/export/all");
      setExportItems(res.data.items);
      setTimeout(async () => {
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save("Inventory.pdf");
        setExporting(false);
      }, 500);
    } catch { setExporting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Inventory</h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage your stock and business value</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportInventoryPDF} disabled={exporting} className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
                <FileText size={16} /> {exporting ? "..." : "Export"}
              </button>
              <button onClick={() => { setMode("create"); setForm({ name: "", sku: "", price: "", stock: "", category: "", description: "" }); setOpen(true); }} className="flex items-center gap-2 px-5 py-3 bg-[#0028AE] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>

          {/* QUICK SEARCH */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKUs, or categories..." 
              className="w-full bg-slate-800 border-none text-white placeholder:text-slate-500 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* STATS OVERLAY */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Items" value={totals.totalProducts} icon={Package} colorClass="bg-blue-50 text-blue-600" />
          <StatCard title="Stock Count" value={totals.totalUnits} icon={Layers} colorClass="bg-indigo-50 text-indigo-600" />
          <StatCard title="Total Value" value={formatCurrency(totals.totalValue)} icon={Tag} colorClass="bg-emerald-50 text-emerald-600" />
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-40">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Fetching Inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No items found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">Start by adding your first product to the inventory database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <StatusBadge stock={item.stock} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm(item); setMode("edit"); setOpen(true); }} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors">{busyId === item._id ? "..." : <Trash2 size={16} />}</button>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-1 truncate">{item.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{item.category || "No Category"}</p>
                  
                  <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Current Stock</p>
                      <p className="text-xl font-black text-slate-800">{item.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Unit Price</p>
                      <p className="text-xl font-black text-[#0028AE]">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{mode === "create" ? "New Product" : "Edit Product"}</h2>
                  <button onClick={() => setOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800 transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Product Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="iPhone 15..." className="col-span-2" />
                    <InputField label="SKU / ID" value={form.sku} onChange={v => setForm({...form, sku: v})} placeholder="SKU-001" />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <InputField label="Unit Price" type="number" value={form.price} onChange={v => setForm({...form, price: v})} placeholder="0.00" />
                    <InputField label="Stock Level" type="number" value={form.stock} onChange={v => setForm({...form, stock: v})} placeholder="0" />
                  </div>
                  <InputField label="Description" value={form.description} onChange={v => setForm({...form, description: v})} placeholder="Optional product details..." textarea />
                </div>

                {error && <div className="mt-4 p-3 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}

                <button onClick={saveItem} disabled={saving} className="w-full mt-8 py-4 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {saving ? "Processing..." : mode === "create" ? "Add to Inventory" : "Update Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVIGATION FAB */}
      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <div className="font-black text-xl">Q</div>
      </button>

      {/* PRINT LAYER (HIDDEN) */}
      <div className="absolute left-[-9999px] top-0">
        <PrintInventory ref={printRef} items={exportItems} businessName={user?.businessName || "My Business"} />
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange, placeholder, type = "text", textarea = false, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 resize-none" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500" />
    )}
  </div>
);