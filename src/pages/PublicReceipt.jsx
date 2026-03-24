import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import axios from "axios";


const API = "https://quickinvoice-backend-1.onrender.com"

const PublicReceipt = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const [sale, setSale] = useState(null);

  useEffect(() => {
    // Fetch the specific sale from your backend
    const fetchSale = async () => {
      try {
        const res = await axios.get(`${API}/api/pos/receipt/${id}`);
        setSale(res.data.sale);
      } catch (err) {
        console.error("Receipt not found");
      }
    };
    fetchSale();
  }, [id]);

  if (!sale) return <div className="p-10 text-center font-black">Loading Receipt...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-xl p-8 h-fit border border-slate-100">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
             <Store size={32} />
           </div>
           <h1 className="text-2xl font-black text-slate-800">QuickInvoice</h1>
           <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Official Receipt</p>
        </div>

        <div className="space-y-4 border-b border-dashed pb-6 mb-6">
           <div className="flex justify-between text-sm"><span className="text-slate-400">Date:</span> <span className="font-bold">{new Date(sale.createdAt).toLocaleDateString()}</span></div>
           <div className="flex justify-between text-sm"><span className="text-slate-400">Order ID:</span> <span className="font-bold">#{sale.receiptNumber}</span></div>
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-4 mb-8">
          {sale.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
               <div>
                 <p className="font-bold text-slate-800">{item.name}</p>
                 <p className="text-[10px] text-slate-400">{item.quantity} x N{item.unitPrice.toLocaleString()}</p>
               </div>
               <p className="font-black text-slate-800 font-mono">N{item.subtotal.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
           <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Total Paid</p>
           <p className="text-3xl font-black">N{sale.totalAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicReceipt;