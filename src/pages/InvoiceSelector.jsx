import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, Search, Filter,  } from 'lucide-react';
import axios from 'axios';


const API = 'https://quickinvoice-backend-1.onrender.com';

const InvoiceSelector = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API}/api/invoices`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setInvoices(data.data || data); // Adjust based on your API wrapper
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv._id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <p className="text-[#0028AE] font-black text-xs uppercase tracking-[4px] mb-2">
          Document Studio
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
          Select Invoice for <span className="text-[#0028AE]">Work Summary</span>
        </h1>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by client or invoice ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0028AE] focus:border-transparent outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Invoices Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0028AE]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((inv) => (
              <div 
                key={inv._id}
                className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {inv.status}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">ID: ...{inv._id.slice(-6)}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                    {inv.clientName}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">{inv.clientEmail}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Amount Billed</p>
                    <p className="text-xl font-black text-slate-900">
                      ₦{inv.total.toLocaleString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/create-summary/${inv._id}`, { state: { invoice: inv } })}
                    className="p-4 bg-[#001325] text-white rounded-2xl hover:bg-[#0028AE] transition-all group-hover:scale-105"
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredInvoices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No invoices found</h3>
            <p className="text-slate-500">Try adjusting your search or create a new invoice first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceSelector;