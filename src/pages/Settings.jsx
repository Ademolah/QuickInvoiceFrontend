// import React, { useState, useEffect } from "react";
// import axios from "axios";
// // import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import { Toaster, toast } from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";
// // import Sidebar from "../components/Sidebar";
// import { useCurrency } from "../context/CurrencyContext";
// import { uploadAvatar } from "../utils/upload";
// // import api from "../utils/api";


// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export function Button({ children, className, ...props }) {
//   return (
//     <button
//       {...props}
//       className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
//     >
//       {children}
//     </button>
//   );
// }
// export function Card({ children, className }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow ${className}`}>{children}</div>
//   );
// }
// export function CardContent({ children, className }) {
//   return <div className={`p-6 ${className}`}>{children}</div>;
// }


// export default function Settings() {
//   const [loading, setLoading] = useState(false);
//   const [bankDetails, setBankDetails] = useState({
//     accountName: "",
//     accountNumber: "",
//     bankName: "",
//     bankCode: "",
//   });

//   const [bankList, setBankList] = useState([]);
//   const [loadingBanks, setLoadingBanks] = useState(false);

//   useEffect(() => {
//   const fetchBanks = async () => {
//     setLoadingBanks(true);
//     try {
//       const res = await axios.get(`${API}/api/banks`);
//       if (res.data && res.data.banks) {
//         setBankList(res.data.banks); // show all banks exactly as returned
//       } else {
//         toast.error("Failed to load banks");
//       }
//     } catch (err) {
//       console.error("Error fetching banks:", err);
//       toast.error("Could not fetch banks. Please try again later.");
//     } finally {
//       setLoadingBanks(false);
//     }
//   };
//   fetchBanks();
// }, []);

//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [loadingPassword, setLoadingPassword] = useState(false);
//   const navigate = useNavigate()

//   const { currency, switchCurrency } = useCurrency();

//   const handleChangePassword = async (e) => {
//   e.preventDefault();
//   if (newPassword !== confirmNewPassword) {
//     toast.error('New passwords do not match');
//     return;
//   }

//   try {
//     setLoadingPassword(true);
//     const token = localStorage.getItem('token');

//     await axios.put(
//       `${API}/api/users/change-password`,
//       { currentPassword, newPassword },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     toast.success('Password changed successfully');
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmNewPassword('');
//   } catch (err) {
//     console.error(err);
//     toast.error(err.response?.data?.message || 'Error changing password');
//   } finally {
//     setLoadingPassword(false);
//   }
// };

//   // Fetch existing bank details on mount
//   useEffect(() => {
//     const fetchBankDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${API}/api/users/account-details`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (res.data) {
//           setBankDetails({
//             accountName: res.data.accountName || "",
//             accountNumber: res.data.accountNumber || "",
//             bankName: res.data.bankName || "",
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load account details");
//       }
//     };
//     fetchBankDetails();
//   }, []);

//   const handleChange = (e) => {
//     setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${API}/api/users/account-details`,
//         bankDetails,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Bank account details updated successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update account details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //image upload 

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [avatarUrl, setAvatarUrl] = useState(null);
//   const token = localStorage.getItem("token"); // adjust if you use context
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };
//   const handleUpload = async () => {
//     if (!selectedFile) return alert("Please select an image first!");
//     try {
//       setLoading(true);
//       const url = await uploadAvatar(selectedFile, token);
//       setAvatarUrl(url);
//       toast.success("Avatar uploaded successfully!");
//     } catch (error) {
//       toast.error("Upload failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //QuickPay transaction pin

//   // const [showCreateModal, setShowCreateModal] = useState(false);
//   // const [showUpdateModal, setShowUpdateModal] = useState(false);
//   // // Create PIN fields
//   // const [createPin, setCreatePin] = useState("");
//   // const [createPinConfirm, setCreatePinConfirm] = useState("");
//   // // Update PIN fields
//   // const [oldPin, setOldPin] = useState("");
//   // const [newPin, setNewPin] = useState("");
//   // const [newPinConfirm, setNewPinConfirm] = useState("");

  
//   // // ✅Create PIN
//   // const handleSetPin = async () => {
//   //   if (createPin !== createPinConfirm) {
//   //     toast.error("PIN does not match");
//   //     return;
//   //   }
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const res = await axios.post(
//   //       `${API}/api/transaction-pin/set-transaction-pin`,
//   //       { pin: createPin},
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     toast.success(res.data.message || "Transaction PIN set successfully");
//   //     setShowCreateModal(false);
//   //     setCreatePin("");
//   //     setCreatePinConfirm("");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error(err.response?.data?.message || "Error setting transaction PIN");
//   //   }
//   // };

//   // // ✅ Update PIN
//   // const handleUpdatePin = async () => {
//   //   if (newPin !== newPinConfirm) {
//   //     alert("New PIN does not match");
//   //     return;
//   //   }
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const res = await axios.put(
//   //       `${API}/api/transaction-pin/update-transaction-pin`,
//   //       {
//   //         oldPin,
//   //         newPin,
//   //       },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     toast.success(res.data.message || "Transaction PIN updated successfully");
//   //     setShowUpdateModal(false);
//   //     setOldPin("");
//   //     setNewPin("");
//   //     setNewPinConfirm("");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error(err.response?.data?.message || "Error updating PIN");
//   //   }
//   // };

//   return (
    
//     <div className="p-6 bg-gray-50 min-h-screen">
//         <Toaster position="top-right" reverseOrder={false} />
        
//       <h1 className="text-3xl font-bold text-[#0046A5] mb-6">
//         ⚙️ Settings
//       </h1>

//       {/* Bank Account Details */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           💳 Bank Account Details
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-600 mb-1">Account Name</label>
//             <input
//               type="text"
//               name="accountName"
//               value={bankDetails.accountName}
//               onChange={handleChange}
//               placeholder="John Doe"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-600 mb-1">Account Number</label>
//             <input
//               type="text"
//               name="accountNumber"
//               value={bankDetails.accountNumber}
//               onChange={handleChange}
//               placeholder="0123456789"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
//               required
//             />
//           </div>
//           <div>
//             {/* <label className="block text-gray-600 mb-1">Bank Name</label>
//             <input
//               type="text"
//               name="bankName"
//               value={bankDetails.bankName}
//               onChange={handleChange}
//               placeholder="GTBank"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
//               required
//             /> */}
//             <label className="block text-gray-600 mb-1">Bank Name</label>
//             <select
//               name="bankName"
//               value={bankDetails.bankName}
//               onChange={(e) => {
//                 const selectedBank = bankList.find(
//                   (bank) => bank.name === e.target.value
//                 );
//                 setBankDetails((prev) => ({
//                   ...prev,
//                   bankName: selectedBank?.name || "",
//                   bankCode: selectedBank?.code || "",
//                 }));
//               }}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
//               required
//             >
//               <option value="">
//                 {loadingBanks ? "Loading banks..." : "Select Bank"}
//               </option>
//               {bankList.map((bank) => (
//                 <option key={bank.code} value={bank.name}>
//                   {bank.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#0046A5] hover:bg-[#00357d] text-white py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center"
//           >
//             {loading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"}
//           </button>
//         </form>
//       </div>





//     {/* Transaction Pin Section   */}

//        {/* ✅ Buttons */}
//       {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="bg-[#0046A5] hover:bg-[#00398D] text-white px-6 py-3 rounded-lg w-full sm:w-auto"
//         >
//           Create QPay Transaction Pin
//         </button>
//         <button
//           onClick={() => setShowUpdateModal(true)}
//           className="bg-[#00B86B] hover:bg-[#00965A] text-white px-6 py-3 rounded-lg w-full sm:w-auto"
//         >
//           Update QPay Transaction Pin
//         </button>
//       </div> */}
//       {/* ✅ Create PIN Modal */}
//       {/* {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               Create Transaction PIN
//             </h2>
//             <input
//               type="password"
//               maxLength={4}
//               className="border p-2 w-full mb-3 rounded"
//               placeholder="Enter 4-digit PIN"
//               value={createPin}
//               onChange={(e) => setCreatePin(e.target.value.replace(/\D/g, ""))}
//             />
//             <input
//               type="password"
//               maxLength={4}
//               className="border p-2 w-full mb-4 rounded"
//               placeholder="Confirm 4-digit PIN"
//               value={createPinConfirm}
//               onChange={(e) =>
//                 setCreatePinConfirm(e.target.value.replace(/\D/g, ""))
//               }
//             />
//             <button
//               onClick={handleSetPin}
//               className="bg-[#0046A5] hover:bg-[#00398D] text-white px-4 py-2 rounded w-full mb-2"
//             >
//               Create
//             </button>
//             <button
//               onClick={() => setShowCreateModal(false)}
//               className="text-sm text-gray-500 underline w-full"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )} */}

//       {/* ✅ Update PIN Modal */}
//       {/* {showUpdateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               Update Transaction PIN
//             </h2>
//             <input
//               type="password"
//               maxLength={4}
//               className="border p-2 w-full mb-3 rounded"
//               placeholder="Enter Old PIN"
//               value={oldPin}
//               onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
//             />
//             <input
//               type="password"
//               maxLength={4}
//               className="border p-2 w-full mb-3 rounded"
//               placeholder="Enter New PIN"
//               value={newPin}
//               onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
//             />
//             <input
//               type="password"
//               maxLength={4}
//               className="border p-2 w-full mb-4 rounded"
//               placeholder="Confirm New PIN"
//               value={newPinConfirm}
//               onChange={(e) =>
//                 setNewPinConfirm(e.target.value.replace(/\D/g, ""))
//               }
//             />
//             <button
//               onClick={handleUpdatePin}
//               className="bg-[#00B86B] hover:bg-[#00965A] text-white px-4 py-2 rounded w-full mb-2"
//             >
//               Update
//             </button>
//             <button
//               onClick={() => setShowUpdateModal(false)}
//               className="text-sm text-gray-500 underline w-full"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )} */}




//       {/* Profile Info Section */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           🧑‍💼 Profile Information
//         </h2>
//         <p className="text-gray-500 mb-4">
//           This section will allow updating your personal and business details.
//         </p>
//         <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed">
//           Coming Soon
//         </button>
//       </div>


//       {/* change password  */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
//     <h3 className="font-semibold text-lg mb-4">Change Password</h3>
//     <form onSubmit={handleChangePassword} className="space-y-4">
//         <input
//         type="password"
//         placeholder="Current Password"
//         value={currentPassword}
//         onChange={(e) => setCurrentPassword(e.target.value)}
//         className="border p-2 rounded w-full"
//         required
//         />
//     <input
//       type="password"
//       placeholder="New Password"
//       value={newPassword}
//       onChange={(e) => setNewPassword(e.target.value)}
//       className="border p-2 rounded w-full"
//       required
//     />
//     <input
//       type="password"
//       placeholder="Confirm New Password"
//       value={confirmNewPassword}
//       onChange={(e) => setConfirmNewPassword(e.target.value)}
//       className="border p-2 rounded w-full"
//       required
//     />
//     <button
//       type="submit"
//       disabled={loadingPassword}
//       className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded-lg shadow"
//     >
//       {loadingPassword ? 'Changing...' : 'Change Password'}
//     </button>
//   </form>
// </div>

// {/* <div className="p-4">
//       <h2 className="text-lg font-bold">Currency Settings</h2>
//       <select
//         value={currency}
//         onChange={(e) => switchCurrency(e.target.value)}
//         className="border rounded p-2"
//       >
//         <option value="NGN">₦ - Nigerian Naira</option>
//         <option value="GBP">£ - British Pound</option>
//         <option value="USD">$ - USD (Dollar)</option>
//         <option value="EUR">€ - Euro</option>
//       </select>
//     </div> */}

//     <div className="p-6 bg-white rounded-2xl mt-9 shadow-lg border border-gray-100 max-w-md">
//   <h2 className="text-xl font-bold text-[#0046A5] mb-4">
//     💱 Currency Settings
//   </h2>
//   <p className="text-sm text-gray-500 mb-3">
//     Choose your preferred currency for invoices & receipts.
//   </p>
//   <select
//     value={currency}
//     onChange={(e) => switchCurrency(e.target.value)}
//     className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00B86B] focus:border-[#0046A5] transition-all text-gray-700 font-medium"
//   >
//     <option value="NGN">₦ - Nigerian Naira</option>
//     <option value="GBP">£ - British Pound</option>
//     <option value="USD">$ - US Dollar</option>
//     <option value="EUR">€ - Euro</option>
//     <option value="TRY">₺ - Turkish Lira</option>
//   </select>
// </div>


// {/* image upload */}

// <div className="max-w-2xl mx-auto p-6">
//       <Card className="border border-gray-100">
//         <CardContent className="flex flex-col items-center">
//           <h2 className="text-2xl font-bold text-[#0046A5] mb-6">
//             Update Profile Photo
//           </h2>
//           {/* Avatar Preview */}
//           <div className="mb-6">
//             <img
//               src={preview || avatarUrl || "/default-avatar.png"}
//               alt=""
//               className="w-32 h-32 rounded-full border-4 border-[#0046A5] object-cover shadow-md"
//             />
//           </div>
//           {/* File Input */}
//           {/* <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="mb-4"
//           /> */}
//           {/* Upload Button */}
//           {/* <Button
//             onClick={handleUpload}
//             disabled={loading}
//             className="bg-[#0046A5] hover:bg-[#003a8c] text-white w-full md:w-auto shadow"
//           >
//             {loading ? "Uploading..." : "Upload Photo"}
//           </Button> */}

//           {/* File Picker (styled + centered) */}
// <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
//   <label
//     htmlFor="file-upload"
//     className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg shadow-sm cursor-pointer hover:border-[#0046A5] hover:text-[#0046A5] transition"
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-5 w-5 mr-2 text-[#0046A5]"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//       />
//     </svg>
//     Choose Photo
//   </label>
//   <input
//     type="file"
//     id="file-upload"
//     accept="image/*"
//     onChange={handleFileChange}
//     className="hidden"
//   />
//   {/* Upload Button */}
//   <Button
//     onClick={handleUpload}
//     disabled={loading}
//     className="bg-[#0046A5] hover:bg-[#003A8C] text-white shadow"
//   >
//     {loading ? "Uploading..." : "Upload Photo"}
//   </Button>
// </div>
//         </CardContent>
//       </Card>
//     </div>



// {/* Back to Dashboard button */}
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

//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, Landmark, Globe, Camera, 
  ArrowLeft, Check, Loader2, Save, Key 
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { uploadAvatar } from "../utils/upload";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    accountName: "", accountNumber: "", bankName: "", bankCode: "",
  });

  // Password State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Profile Photo State
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { currency, switchCurrency } = useCurrency();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBanks(true);
      try {
        const [bankRes, accountRes] = await Promise.all([
          axios.get(`${API}/api/banks`),
          axios.get(`${API}/api/users/account-details`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (bankRes.data?.banks) setBankList(bankRes.data.banks);
        if (accountRes.data) setBankDetails(accountRes.data);
      } catch (err) {
        toast.error("Failed to sync settings");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchData();
  }, [token]);

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API}/api/users/account-details`, bankDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Payout details updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("Passwords don't match");
    setLoadingPassword(true);
    try {
      await axios.put(`${API}/api/users/change-password`, 
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await uploadAvatar(selectedFile, token);
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "payout", label: "Payouts", icon: Landmark },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-2 px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          </div>

          {/* Premium Tab Bar */}
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-[#0028AE]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0028AE] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <img 
                      src={preview || "/default-avatar.png"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-slate-50 shadow-inner"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                      <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setPreview(URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 mb-1">Business Identity</h3>
                    <p className="text-slate-400 text-sm font-medium mb-4">Your avatar will appear on official receipts and invoices.</p>
                    {selectedFile && (
                       <button onClick={handleUpload} className="px-6 py-2 bg-[#0028AE] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto md:mx-0">
                         {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save New Photo
                       </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Globe size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Localization</h3>
                </div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => switchCurrency(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold text-slate-700 outline-none"
                >
                  <option value="NGN">₦ Nigerian Naira (NGN)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* PAYOUT TAB */}
          {activeTab === "payout" && (activeTab === "payout" && (
            <motion.div key="payout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleBankSubmit} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-[#0028AE] rounded-lg"><Landmark size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Payout Destination</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder</label>
                    <input 
                      type="text" 
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      placeholder="e.g. John Enterprises"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input 
                      type="text" 
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      placeholder="0000000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Financial Institution</label>
                  <select 
                    value={bankDetails.bankName}
                    onChange={(e) => {
                      const b = bankList.find(x => x.name === e.target.value);
                      setBankDetails({...bankDetails, bankName: b.name, bankCode: b.code});
                    }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                  >
                    <option value="">{loadingBanks ? "Fetching Banks..." : "Select Bank"}</option>
                    {bankList.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Save Settlement Details
                </button>
              </form>
            </motion.div>
          ))}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Key size={20} /></div>
                  <h3 className="text-lg font-black text-slate-900">Change Password</h3>
                </div>

                <div className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="Current Password"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="password" 
                      placeholder="New Password"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#0028AE] transition-all font-bold"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loadingPassword} className="w-full py-4 bg-[#0028AE] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
                  {loadingPassword ? <Loader2 className="animate-spin" size={16} /> : "Update Security Credentials"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button onClick={() => navigate("/dashboard")} className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#0028AE] to-[#00A6FA] text-white flex items-center justify-center rounded-full shadow-2xl z-50 font-black text-xl hover:scale-110 active:scale-95 transition-all">Q</button>
    </div>
  );
}
