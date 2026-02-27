/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import api from "../utils/api";

// // const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

// export default function Client() {
//   const [clients, setClients] = useState([]);
//   const navigate = useNavigate();

//   const handleSelectClient = (client) => {
//     navigate("/invoices/new", { state: { client } });
//   };

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API}/api/clients`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setClients(res.data);
//       } catch (error) {
//         console.error("Error fetching clients:", error);
//       }
//     };

//     fetchClients();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Clients</h1>
//       <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
//         <thead className="bg-[#0046A5]">
//           <tr>
//             <th className="p-2 text-left text-white">Name</th>
//             <th className="p-2 text-left text-white">Phone</th>
//             <th className="p-2 text-left text-white">Email</th>
//             <th className="p-2 text-left text-white">Paid Status</th>
//             {/* <th className="p-2 text-left text-white">New Invoice</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {clients.map((client, idx) => (
//             <tr key={idx} onClick={() => handleSelectClient(client)} className="border-t">
//               <td className="p-2">{client.name}</td>
//               <td className="p-2">{client.phone}</td>
//               <td className="p-2">{client.email}</td>
//               <td className="p-2">
//                 {client.paid_status ? (
//                   <span className="text-green-600 font-medium">Paid</span>
//                 ) : (
//                   <span className="text-red-600 font-medium">Unpaid</span>
//                 )}

            
//               </td>
//               {/* <td className="p-2">
//               <button
//                 onClick={() => handleSelectClient(client)}
//                 className="bg-[#0046A5] text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//               >
//                 Create Invoice
//               </button>
//             </td> */}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Back to Dashboard button */}
//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="px-6 py-3 bg-gradient-to-r from-[#0028AE] to-[#00A6FA] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//         >
//           Q
//         </button>
//       </div>
      
//         {/* <button
//           onClick={() => navigate("/dashboard")}
//           className="fixed bottom-4 left-1/2  bg-[#0046A5] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-green-700 transition"
//         >
//           Q
//         </button> */}

//     </div> 
//   );
// }


import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Search, Mail, Phone, Plus, 
  ArrowLeft, ChevronRight, MoreVertical, FilePlus 
} from "lucide-react";

const API = "https://quickinvoice-backend-1.onrender.com";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // Filter logic for searching
  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const handleSelectClient = (client) => {
    navigate("/invoices/new", { state: { client } });
  };

  // Helper for generating consistent colors for avatars
  const getAvatarColor = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600', 'bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Dynamic Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <button onClick={() => navigate("/dashboard")} className="p-1 -ml-1 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-slate-600" />
               </button>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clients</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">Manage your relationships and billing</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0028AE]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="py-20 text-center opacity-40">
            <div className="w-10 h-10 border-4 border-[#0028AE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-black text-xs uppercase tracking-widest">Loading Directory...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-black text-xl">No clients found</h3>
            <p className="text-slate-400 mt-2 font-medium">Try a different search or add a new client.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredClients.map((client, idx) => (
                <motion.div
                  key={client._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${getAvatarColor(client.name)}`}>
                      {client.name.charAt(0)}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      client.paid_status 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {client.paid_status ? 'Good Standing' : 'Pending Dues'}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight truncate">
                    {client.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Mail size={14} />
                      <span className="truncate">{client.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Phone size={14} />
                      <span>{client.phone || "No phone"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleSelectClient(client)}
                      className="flex-1 bg-[#0028AE] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00A6FA] transition-colors"
                    >
                      <FilePlus size={14} /> Create Invoice
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Persistent Floating Q Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all font-black text-xl z-50"
      >
        Q
      </button>
    </div>
  );
}