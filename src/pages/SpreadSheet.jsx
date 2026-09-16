import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, Plus, Trash2, ChevronLeft, ChevronRight, 
  Save, Loader2, Calendar as CalendarIcon, Filter
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API = "https://quickinvoice-backend-1.onrender.com"

// --- CUSTOM AIRBNB-STYLE DATE PICKER ---
const CustomDatePicker = ({ value, onChange, isExporting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateSelect = (day) => {
    // Build the date string manually to avoid UTC timezone shifts
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${paddedDay}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  if (isExporting) {
    return <div className="px-3 py-2.5 text-sm text-slate-900 font-inter font-medium">{value || '-'}</div>;
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-[#0028AE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0028AE]/20"
      >
        <span className="font-inter">{value || 'Select Date'}</span>
        <CalendarIcon className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-[999] top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 hover:bg-slate-50 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-clash font-semibold text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 hover:bg-slate-50 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 font-inter">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === currentDate.getMonth();
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium font-inter transition-all ${
                    isSelected 
                      ? 'bg-[#0028AE] text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


// --- SURGICAL FIX: PRINTABLE CELL COMPONENT ---
// This swaps inputs to native <div> elements during export so html2canvas renders text perfectly
const PrintableCell = ({ isExporting, value, onChange, placeholder, type = "text", className = "" }) => {
  if (isExporting) {
    return (
      <div className={`w-full px-3 py-2.5 text-sm text-slate-900 font-inter break-words min-h-[40px] ${className}`}>
        {value || '-'}
      </div>
    );
  }
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-inter focus:outline-none focus:border-[#0028AE] focus:ring-1 focus:ring-[#0028AE] transition-all placeholder:text-slate-400 ${className}`}
    />
  );
};


// --- MAIN SPREADSHEET COMPONENT ---
const SpreadSheet = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [rows, setRows] = useState([]);
  const [viewMode, setViewMode] = useState('all'); 

  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await axios.get(`${API}/api/spreadsheet`, getAuthHeaders());
        if (response.data.success && response.data.data.rows.length > 0) {
          setRows(response.data.data.rows);
        } else {
          handleAddRow();
        }
      } catch (error) {
        console.error('Error fetching ledger:', error);
        toast.error('Failed to load your spreadsheet data.');
        handleAddRow();
      } finally {
        setIsLoading(false);
      }
    };
    fetchLedger();
  }, []);

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      { id: Date.now().toString(), date: '', units: '', collector: '', description: '', sn: '', imei: '', remark: '' }
    ]);
  };

  const handleRemoveRow = async (id) => {
    if (rows.length === 1) return;
    
    // 1. Remove from screen immediately for snappy UI
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
    
    // 2. Auto-sync the deletion to the database in the background
    try {
      await axios.put(`${API}/api/spreadsheet/sync`, { rows: updatedRows }, getAuthHeaders());
      toast.success('Row permanently deleted');
    } catch (error) {
      console.error('Failed to sync deletion:', error);
      toast.error('Deleted locally, but failed to sync to database.');
    }
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const saveToast = toast.loading('Saving ledger securely...');
    
    try {
      await axios.put(`${API}/api/spreadsheet/sync`, { rows }, getAuthHeaders());
      toast.success('Spreadsheet saved successfully!', { id: saveToast });
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save changes. Please try again.', { id: saveToast });
    } finally {
      setIsSaving(false);
    }
  };

 const handleExportPDF = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading('Styling and Generating PDF...');
    
    try {
      // Create a small delay using a Promise instead of setTimeout 
      // so React has time to swap inputs to text, but keeps the async chain intact
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const canvas = await html2canvas(tableRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Standard import usage fallback in case { jsPDF } is misbehaving
      const doc = new jsPDF('l', 'mm', 'a4'); 
      const imgData = canvas.toDataURL('image/jpeg', 1.0); 
      
      doc.addImage(imgData, 'JPEG', 0, 10, imgWidth, imgHeight);
      doc.save(`QuickInvoice-Ledger-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('Spreadsheet Downloaded!', { id: toastId });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Failed to generate PDF', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const filteredRows = useMemo(() => {
    if (viewMode === 'all') return rows;
    const today = new Date();
    
    return rows.filter(row => {
      if (!row.date) return true; 
      const rowDate = new Date(row.date);
      
      if (viewMode === 'day') {
        return rowDate.toDateString() === today.toDateString();
      }
      if (viewMode === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return rowDate >= weekAgo && rowDate <= today;
      }
      if (viewMode === 'month') {
        return rowDate.getMonth() === today.getMonth() && rowDate.getFullYear() === today.getFullYear();
      }
      return true;
    });
  }, [rows, viewMode]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#0028AE] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8 font-inter pb-32">
      
      <div className="max-w-[1400px] mx-auto mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="md:hidden inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-clash font-semibold text-slate-900 tracking-tight">
              Inventory Ledger
            </h1>
            <p className="text-base text-slate-500 mt-2 font-inter max-w-xl">
              Track and document items moving through your sales pipeline. Changes require manual saving.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleSave}
              disabled={isSaving || isExporting}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0028AE] rounded-xl hover:bg-[#001f8a] transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Data'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {!isExporting && (
          <div className="mt-8 flex items-center gap-2 bg-slate-200/50 p-1 rounded-xl w-max border border-slate-200 overflow-x-auto max-w-full hide-scrollbar">
            <div className="pl-3 pr-1 text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            {['all', 'day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-5 py-1.5 text-sm font-medium rounded-lg capitalize transition-all duration-200 whitespace-nowrap ${
                  viewMode === mode
                    ? 'bg-white text-[#0028AE] shadow-sm scale-100 ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800 scale-95 hover:scale-100'
                }`}
              >
                {mode === 'all' ? 'All Time' : `This ${mode}`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div ref={tableRef} className={`min-w-[1200px] pb-72 ${isExporting ? 'p-8' : 'p-6'}`}>
            
            {isExporting && (
              <div className="mb-8 border-b border-slate-200 pb-4">
                 <h2 className="text-2xl font-clash font-semibold text-slate-900">Active Sales Ledger</h2>
                 <p className="text-sm font-medium text-slate-500 font-inter mt-1">Generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-48">Date</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-24">Units</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-64">Description</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[200px]">Collector</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-44">S/N</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-44">IMEI</th>
                  <th className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[150px]">Remark</th>
                  {!isExporting && <th className="px-3 pb-3 text-xs font-semibold uppercase text-slate-400 w-12 text-center"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-2 align-top">
                      <CustomDatePicker 
                        value={row.date} 
                        onChange={(val) => handleChange(row.id, 'date', val)} 
                        isExporting={isExporting}
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        type="number"
                        placeholder="0"
                        value={row.units}
                        onChange={(e) => handleChange(row.id, 'units', e.target.value)}
                        isExporting={isExporting}
                        className="text-center font-medium"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        placeholder="e.g. MacBook Pro M3"
                        value={row.description}
                        onChange={(e) => handleChange(row.id, 'description', e.target.value)}
                        isExporting={isExporting}
                        className="font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        placeholder="Collector Name"
                        value={row.collector}
                        onChange={(e) => handleChange(row.id, 'collector', e.target.value)}
                        isExporting={isExporting}
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        placeholder="Serial No."
                        value={row.sn}
                        onChange={(e) => handleChange(row.id, 'sn', e.target.value)}
                        isExporting={isExporting}
                        className="font-mono text-xs uppercase"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        placeholder="IMEI Number"
                        value={row.imei}
                        onChange={(e) => handleChange(row.id, 'imei', e.target.value)}
                        isExporting={isExporting}
                        className="font-mono text-xs"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <PrintableCell
                        placeholder="Add remark..."
                        value={row.remark}
                        onChange={(e) => handleChange(row.id, 'remark', e.target.value)}
                        isExporting={isExporting}
                      />
                    </td>
                    
                    {!isExporting && (
                      <td className="p-2 align-top text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={rows.length === 1}
                          className="mt-1.5 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0028AE] hover:text-[#001f8a] transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add new row
          </button>
        </div>

      </div>
    </div>
  );
};

export default SpreadSheet;