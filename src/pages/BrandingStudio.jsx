import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
   Save, Lock, CheckCircle2, Sparkles, 
  Eye, Settings2, Loader2, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import InvoiceRenderer from '../components/InvoiceRenderer';


const API = "http://localhost:4000";

const BrandingStudio = () => {
  // --- 1. CORE STATE ---
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    headerColor: '#0028AE',
    accentColor: '#001325',
    selectedTemplate: 'minimalist',
    removeWatermark: false
    });
  const [activeTab, setActiveTab] = useState('design');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // --- 2. THE AUTHENTICATION BRIDGE ---
  const getAuthHeader = () => {
    const userInfo = localStorage.getItem('token');
    if (!userInfo) return {};
    
    // Attempting to parse if it's a JSON object, otherwise treating as raw string
    try {
      const parsed = JSON.parse(userInfo);
      const token = parsed.token || parsed; 
      return { Authorization: `Bearer ${token}` };
    } catch (e) {
      return { Authorization: `Bearer ${userInfo}` };
    }
  };

  // --- 3. DATA FETCHING (On Mount) ---
 useEffect(() => {
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API}/api/users/me`, { headers: getAuthHeader() });
      
      setUser(data);

      if (data.brandSettings) {
        // Map the backend data to the frontend state correctly
        setSettings({
          headerColor: data.brandSettings.headerColor || '#0028AE',
          accentColor: data.brandSettings.accentColor || '#001325',
          selectedTemplate: data.brandSettings.selectedTemplate || 'minimalist',
          removeWatermark: data.brandSettings.removeWatermark || false,
        });
      }
    } catch (err) {
      console.error("Hydration Failed:", err);
      setError("Failed to sync your brand identity.");
    } finally {
      setIsLoading(false);
    }
  };
  fetchUser();
}, []);
  // --- 4. UPDATE HANDLERS ---
  const handleUpdate = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };



const handleSaveIdentity = async () => {
  setIsSaving(true);

  // 1. Determine Tier
  const isPremium = user?.plan === 'pro' || user?.plan === 'enterprise';

  // 2. Build a "Sanitized" payload that won't trigger the Backend Guardian
  let sanitizedPayload = {};

  if (isPremium) {
    // Premium users can send everything
    sanitizedPayload = { ...settings };
  } else {
    // Basic users: We ONLY send the template if it's 'modern' 
    // and we STRIP colors/watermark to avoid the 403
    sanitizedPayload = {
      selectedTemplate: 'minimalist', // Match the backend's expected free string
      removeWatermark: false
    };
    // Note: We omit headerColor/accentColor entirely so Guard #3 doesn't trigger
  }

  try {
    const { data } = await axios.patch(
    `${API}/api/users/branding`, 
    sanitizedPayload, 
    { headers: getAuthHeader() }
  );
  
  // FIXED: Merge the new data with the existing user state
  setUser(prevUser => ({
    ...prevUser,      // Keep existing data (like plan, email, id)
    ...data.user,     // Overwrite with updated user data from backend
    brandSettings: data.brandSettings || data.user?.brandSettings // Double-check targeting
  }));

  toast.success("Brand Identity Synchronized Successfully.");
  } catch (err) {
    const message = err.response?.data?.message || "Guardian Block: Unauthorized update.";
    toast.error(message);
  } finally {
    setIsSaving(false);
  }
};

  // --- 5. LOADING & ERROR STATES (Premium Feel) ---
  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white flex-col gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Authenticating Studio...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full flex items-center justify-center bg-white p-6 text-center">
      <div className="max-w-xs space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <p className="font-black text-slate-900 uppercase text-xs tracking-widest">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold text-xs underline uppercase">Try Again</button>
      </div>
    </div>
  );

  const isPro = user?.plan === 'pro' || user?.plan=== 'enterprise';

  return (
  <div className="flex flex-col lg:flex-row h-screen bg-[#F8FAFC] overflow-hidden font-sans">
    
    {/* --- MOBILE NAVIGATION --- */}
    {/* Increased height and padding for touch-targets */}
    <nav className="lg:hidden flex bg-white border-b border-slate-200 sticky top-0 z-50 h-16 shadow-sm">
      <button 
        onClick={() => setActiveTab('design')} 
        className={`flex-1 flex items-center justify-center gap-2 transition-all ${activeTab === 'design' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600 font-black' : 'text-slate-400 font-bold'}`}
      >
        <Settings2 size={20} />
        <span className="text-[11px] uppercase tracking-tighter">Design</span>
      </button>
      <button 
        onClick={() => setActiveTab('preview')} 
        className={`flex-1 flex items-center justify-center gap-2 transition-all ${activeTab === 'preview' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600 font-black' : 'text-slate-400 font-bold'}`}
      >
        <Eye size={20} />
        <span className="text-[11px] uppercase tracking-tighter">Preview</span>
      </button>
    </nav>

    {/* --- CONTROL CONSOLE (LEFT) --- */}
<aside className={`
  ${activeTab === 'design' ? 'flex' : 'hidden'} 
  lg:flex flex-col w-full lg:w-[420px] bg-white border-r border-slate-200 shadow-2xl z-40 relative h-full
`}>
  
  {/* 1. Header Section: Static (shrink-0) */}
  <div className="p-6 lg:p-8 border-b border-slate-100 bg-white shrink-0">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Sparkles className="text-blue-600" size={18} />
        <span className="text-[10px] font-black uppercase tracking-[3px] text-blue-600">
          {user?.plan || 'Basic'} Tier
        </span>
      </div>
      <div className="flex gap-1">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
      </div>
    </div>
    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Identity Studio</h1>
    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Invoice Customization Engine</p>
  </div>

  {/* 2. Scrollable Content Area: (flex-1) takes all middle space */}
  <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 custom-scrollbar">
    
    {/* Section 1: Template Selection */}
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layout Engine</h3>
        {!isPro && <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded font-black tracking-tighter">PRO FEATURES LOCKED</span>}
      </div>
      
      <div className="space-y-3">
        {['minimalist', 'institutional', 'zenith'].map((t) => {
          const isLocked = !isPro && t !== 'minimalist';
          const isActive = settings.selectedTemplate === t;
          return (
            <button
              key={t}
              disabled={isSaving}
              onClick={() => {
                if (isLocked) return alert("Upgrade to Pro to unlock this template!");
                handleUpdate('selectedTemplate', t);
              }}
              className={`w-full group relative overflow-hidden text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${isActive ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-300'} ${isLocked ? 'cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-black capitalize ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>{t}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t === 'minimalist' ? 'Free for all users' : 'Premium Layout'}</span>
              </div>
              {isActive ? <CheckCircle2 size={22} className="text-blue-600" /> : isLocked ? <Lock size={16} className="text-slate-300" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
            </button>
          );
        })}
      </div>
    </section>

    {/* Section 2: Palette */}
    {/* Section 2: Palette Engine */}
<section className="space-y-4">
  <div className="flex flex-col">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Header Branding Theme</h3>
    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Select a curated identity or inject a custom hex.</p>
  </div>
  
  {/* The 10 Curated Swatches */}
  <div className="grid grid-cols-5 gap-2.5">
    {PREMIUM_PALETTES.map((palette) => {
      const isActive = settings?.headerColor === palette.value;
      return (
        <button
          key={palette.name}
          type="button"
          onClick={() => handleUpdate('headerColor', palette.value)}
          style={{ background: palette.value }}
          title={palette.name}
          className={`h-10 w-full rounded-xl transition-all relative border flex items-center justify-center shadow-sm
            ${isActive ? 'scale-110 ring-2 ring-blue-600 ring-offset-2 border-transparent' : 'border-slate-200/60 hover:scale-105'}
          `}
        >
          {isActive && (
            <CheckCircle2 size={14} className="text-white mix-blend-difference font-bold" />
          )}
        </button>
      );
    })}
  </div>

  {/* Custom Color Overrides (Advanced) */}
  <div className="grid grid-cols-2 gap-4 pt-2">
    <div>
      <label className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">Accent Match</label>
      <div className="relative h-10 w-full">
        <input 
          type="color" 
          value={settings?.accentColor || '#001325'} 
          onChange={(e) => handleUpdate('accentColor', e.target.value)} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div style={{ backgroundColor: settings?.accentColor }} className="w-full h-full rounded-xl border border-slate-200 flex items-center justify-center">
          <span className="text-[9px] font-mono font-black mix-blend-difference text-white uppercase">{settings?.accentColor}</span>
        </div>
      </div>
    </div>
    
    <div>
      <label className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">Custom Header</label>
      <div className="relative h-10 w-full">
        <input 
          type="color" 
          // Defaulting safely if headerColor currently holds a linear-gradient string
          value={settings?.headerColor?.startsWith('linear') ? '#0028AE' : settings?.headerColor} 
          onChange={(e) => handleUpdate('headerColor', e.target.value)} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div style={{ background: settings?.headerColor }} className="w-full h-full rounded-xl border border-slate-200 flex items-center justify-center">
          <span className="text-[9px] font-mono font-black mix-blend-difference text-white uppercase">
            {settings?.headerColor?.startsWith('linear') ? 'Gradient' : settings?.headerColor}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

    {/* Section 3: Watermark Control */}
    <section>
      <div 
        onClick={() => {
          if(!isPro) return alert("Upgrade to Pro to remove the QuickInvoice watermark.");
          handleUpdate('removeWatermark', !settings.removeWatermark);
        }}
        className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${settings.removeWatermark ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-white'} ${!isPro && 'opacity-60 border-dashed'}`}
      >
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Remove Watermark</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">White-Labeling</span>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.removeWatermark ? 'bg-blue-600' : 'bg-slate-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.removeWatermark ? 'left-7' : 'left-1'}`} />
        </div>
      </div>
    </section>
  </div>

  {/* 3. Action Dock: Static (shrink-0) - This will NEVER overlap the content */}
  <div className="p-6 lg:p-8 border-t border-slate-100 bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
    <button 
      disabled={isSaving}
      onClick={handleSaveIdentity}
      className={`w-full py-4 rounded-2xl font-black text-[11px] tracking-[3px] uppercase transition-all shadow-xl flex items-center justify-center gap-3 ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#001325] hover:bg-blue-700 text-white active:scale-[0.98]'}`}
    >
      {isSaving ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Updating...</span>
        </div>
      ) : (
        <><Save size={18} className="text-blue-400" /> Save Identity</>
      )}
    </button>
  </div>
</aside>

    {/* --- PREVIEW PANEL (RIGHT) --- */}
    <main className={`
      ${activeTab === 'preview' ? 'flex' : 'hidden'} 
      lg:flex flex-1 bg-slate-100 overflow-y-auto p-4 lg:p-12 justify-center items-start lg:items-center relative
    `}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-300 blur-[120px]" />
      </div>

      <motion.div 
        key={settings.selectedTemplate}
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[750px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] relative min-h-[600px] lg:min-h-[900px] flex flex-col z-10 rounded-sm lg:rounded-none overflow-hidden"
      >
        <InvoiceRenderer settings={settings} user={user} />
        
        {/* Dynamic Watermark */}
        {!settings.removeWatermark && (
          <div className="mt-auto py-10 flex flex-col items-center opacity-25 grayscale select-none border-t border-slate-50 border-dashed">
            <p className="text-[8px] font-black uppercase tracking-[6px] text-slate-900 mb-1">Generated via QuickInvoice</p>
            <p className="text-[7px] font-bold uppercase tracking-[2px] text-slate-500 italic">One Platform • All Businesses</p>
          </div>
        )}
      </motion.div>
    </main>

  </div>
)};




<InvoiceRenderer settings="{settings}" user="{user}"/>


const PREMIUM_PALETTES = [
  { name: "Classic Navy", value: "#0028AE", type: "solid" },
  { name: "Deep Onyx", value: "#001325", type: "solid" },
  { name: "Emerald Trust", value: "#0F5132", type: "solid" },
  { name: "Royal Amethyst", value: "#563D7C", type: "solid" },
  { name: "Crimson Bold", value: "#DC3545", type: "solid" },
  // --- Premium Mixed Gradients ---
  { name: "Aurora Sky", value: "linear-gradient(135deg, #0028AE 0%, #6610F2 100%)", type: "gradient" },
  { name: "Nordic Frost", value: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", type: "gradient" },
  { name: "Sunset Executive", value: "linear-gradient(135deg, #311042 0%, #79154A 100%)", type: "gradient" },
  { name: "Forest Premium", value: "linear-gradient(135deg, #0A2F1D 0%, #198754 100%)", type: "gradient" },
  { name: "Cyber Steel", value: "linear-gradient(135deg, #0F172A 0%, #334155 100%)", type: "gradient" }
];


export default BrandingStudio;

