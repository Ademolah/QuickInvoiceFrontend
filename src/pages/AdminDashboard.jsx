/* eslint-disable react-hooks/exhaustive-deps */


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CreditCard, MessageSquare, Activity, 
   ChevronRight, ArrowUpRight, LogOut, Menu, X, FileText, CheckCircle , RefreshCw , ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';



const API = "https://quickinvoice-backend-1.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);  
  const socket = io("https://quickinvoice-backend-1.onrender.com");
  
  // 📊 Initialize stats to match backend keys
  const [stats, setStats] = useState({ 
    totalEntities: 0, 
    totalVolume: 0, 
    totalInvoices: 0, 
    totalReceipts: 0,
    platformHealth: "Loading..." 
  });


  // ⚡ FETCH PLATFORM AUDIT FEED
    // ⚡ FETCH PLATFORM AUDIT FEED
const fetchPlatformFeed = async () => {
  try {
    setLoadingActivities(true);
    const token = localStorage.getItem("token");

    // We add the Date.now() query param to force the browser to skip its cache
    const res = await axios.get(`${API}/api/admin/platform-feed?cb=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.success) {
      console.log("Feed Updated:", res.data.feed.length, "items");
      setActivities(res.data.feed);
    }
  } catch (err) {
    console.error("Error fetching audit logs:", err);
  } finally {
    setLoadingActivities(false);
  }
};

    // Initial Load
    useEffect(() => {
    fetchPlatformFeed();
    
    // OPTIONAL: Auto-refresh every 60 seconds for that "Live" feel
    const interval = setInterval(fetchPlatformFeed, 60000);
    return () => clearInterval(interval);
    }, []);

  const handleSelectThread = async (thread) => {
  setSelectedThread(thread);
  
  // Update UI immediately (Optimistic UI)
  setThreads(prev => prev.map(t => 
    t._id === thread._id ? { ...t, messages: t.messages.map(m => ({ ...m, isRead: true })) } : t
  ));

  // Tell the backend to clear the unread status
  await axios.post(`${API}/api/admin/support/mark-read`, { ticketId: thread._id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};



  const [threads, setThreads] = useState([]);
const [replyText, setReplyText] = useState("");
const [selectedThread, setSelectedThread] = useState(null);

// Fetch threads on load
useEffect(() => {
const fetchThreads = async () => {
    const res = await axios.get(`${API}/api/admin/support/threads`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setThreads(res.data.threads);
};
fetchThreads();
}, []);

const handleAdminReply = async (ticketId) => {
  if (!replyText.trim()) return;
  
  const originalText = replyText;
  setReplyText(""); // Clear immediately for snappiness

  try {
    const res = await axios.post(`${API}/api/admin/support/reply`, { 
      ticketId, 
      text: originalText 
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (res.data.success) {
      // Update the local threads state so your reply shows up in the sidebar
      setThreads(prev => prev.map(t => {
        if (t._id === ticketId) {
          return {
            ...t,
            messages: [...t.messages, res.data.message],
            lastMessageAt: new Date(),
            status: 'open' // Move from pending to open
          };
        }
        return t;
      }));
    }
  } catch (err) { 
    console.error("Reply failed");
    setReplyText(originalText); // Restore text if it fails
  }
};

  // 🚀 Fetch stats from the new backend endpoint
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await axios.get(`${API}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin metrics:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
  // Listen for real-time messages
  socket.on('new_support_message', (data) => {
    setThreads((prevThreads) => {
      // Find the thread and move it to the top, updating the last message
      const otherThreads = prevThreads.filter(t => t._id !== data.ticketId);
      const targetThread = prevThreads.find(t => t._id === data.ticketId);
      
      if (targetThread) {
        targetThread.messages.push(data.message);
        targetThread.lastMessageAt = new Date();
        return [targetThread, ...otherThreads];
      }
      return prevThreads; // Or fetch fresh if it's a brand new thread
    });

    // Optional: Play a subtle "ping" sound for that premium feel
    // new Audio('/notification.mp3').play();
  });

  return () => socket.off('new_support_message');
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-600/20">Q</div>
        <h1 className="text-white font-black tracking-tighter uppercase text-sm">Command Center</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        <NavItem icon={<Activity size={18} />} label="Overview" active />
        <NavItem icon={<Users size={18} />} label="User Registry" />
        <NavItem icon={<CreditCard size={18} />} label="Revenue" />
        <NavItem icon={<MessageSquare size={18} />} label="Support Hub" badge="4" />
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
          <p className="text-[10px] font-black text-blue-400 uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${stats.platformHealth === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-xs text-white font-bold tracking-tight">Node-01: {stats.platformHealth}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#001325] overflow-hidden">
      
      {/* Sidebar logic remains identical (Desktop & Mobile Drawer) */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-[#001325] p-8 h-full flex-shrink-0">
        <SidebarContent />
        </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-y-0 left-0 w-72 bg-[#001325] p-8 flex flex-col">
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white/50"><X /></button>
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">Operations Hub</h2>
              <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">Platform Control v1.0</p>
            </div>
          </div>
          <div className="h-12 px-4 md:px-6 bg-white rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">A</div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Admin Access</span>
          </div>
        </header>

        {/* 📊 UPDATED KPI GRID (Now 4-5 Columns or Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          <StatCard icon={<Users />} label="Total Entities" value={stats.totalEntities} trend="+Live" />
          <StatCard icon={<CreditCard />} label="Total Volume" value={formatCurrency(stats.totalVolume)} trend="Real-time" color="emerald" />
          <StatCard icon={<FileText />} label="Total Invoices" value={stats.totalInvoices} trend="Platform" color="blue" />
          <StatCard icon={<CheckCircle />} label="Total Receipts" value={stats.totalReceipts} trend="Verified" color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
         {/* USER REGISTRY TABLE (Recent Activity) */}
<section className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col h-[650px]">
  <div className="flex justify-between items-center mb-8">
    <div>
      <h3 className="font-black uppercase text-sm tracking-widest text-[#001325]">Platform Audit</h3>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time System Heartbeat</p>
    </div>
    
    <button 
      onClick={(e) => {
        e.preventDefault();
        fetchPlatformFeed();
      }}
      className={`p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all group ${loadingActivities ? 'bg-slate-50' : ''}`}
    >
      <RefreshCw size={16} className={`text-slate-400 group-hover:text-blue-600 transition-colors ${loadingActivities ? 'animate-spin' : ''}`} />
    </button>
  </div>

  <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-2">
    {loadingActivities && activities.length === 0 ? (
      [1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 w-full bg-slate-50 animate-pulse rounded-[2rem]" />
      ))
    ) : activities.length > 0 ? (
      activities.map((log) => {
        // 🚀 LIVE CALCULATION: Checks if log is under 2 minutes old to keep it "Live" on refresh
        const logTime = new Date(log.createdAt).getTime();
        const currentTime = new Date().getTime();
        const isLive = (currentTime - logTime) < 120000; 
        
        const displayTag = log.userName?.includes('@') 
          ? log.userName.split('@')[0] 
          : log.userName?.split(' ')[0] || "User";

        return (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={log._id} 
            className="flex items-center justify-between p-5 hover:bg-slate-50/80 rounded-[2rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110 ${
                  log.category === 'finance' ? 'bg-emerald-50 text-emerald-600' : 
                  log.category === 'auth' ? 'bg-blue-50 text-blue-600' : 
                  log.category === 'support' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {log.category === 'finance' ? <CreditCard size={18} /> : 
                   log.category === 'auth' ? <ShieldCheck size={18} /> : 
                   log.category === 'support' ? <MessageSquare size={18} /> : <Activity size={18} />}
                </div>
                {isLive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xs uppercase text-slate-700 tracking-tight flex items-center gap-2 truncate">
                    {log.action} 
                    {isLive && (
                      <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">
                        Live Now
                      </span>
                    )}
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-blue-500 font-black">
                    @{displayTag.toLowerCase()}
                  </span>
                  <span className="text-[9px] text-slate-300">•</span>
                  
                  {/* 📍 THE "POS" BADGE: Shows exact endpoint location */}
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded uppercase tracking-tighter truncate max-w-[220px] border border-slate-200/50">
                    {log.metadata?.route?.replace('/api/', '').replace(/\//g, ' > ') || 'system'}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </motion.div>
        );
      })
    ) : (
      <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] font-bold uppercase tracking-[0.2em]">
        <Activity size={40} className="mb-4 text-slate-400" />
        No activity detected yet
      </div>
    )}
  </div>
</section>

          {/* 💬 MINI-CHAT FEED */}
<section className="bg-[#001325] rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-blue-900/20">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-600 rounded-xl"><MessageSquare size={18} /></div>
      <h3 className="font-black uppercase text-sm tracking-widest">QuickSupport Feed</h3>
    </div>
    {/* Dynamic count of pending tickets */}
    <span className="text-[10px] font-black bg-rose-500 px-3 py-1 rounded-full">
      {threads.filter(t => t.status === 'pending').length} New
    </span>
  </div>

  <div className="space-y-4 h-[350px] overflow-y-auto no-scrollbar mb-6">
    {threads.length > 0 ? threads.map((thread) => {
      // Check if there are any unread messages from the user
      const hasUnread = thread.messages.some(m => m.sender === 'user' && !m.isRead);
      
      return (
        <div 
          key={thread._id} 
          onClick={() => handleSelectThread(thread)} // 👈 Updated this
          className={`bg-white/5 border p-5 rounded-[2rem] cursor-pointer transition-all relative group ${
            selectedThread?._id === thread._id 
              ? 'border-blue-500 bg-white/10' 
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          {/* Unread Indicator Dot */}
          {hasUnread && (
            <div className="absolute top-5 right-5 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
              {thread.userId?.name || thread.businessContext || "Client"}
            </span>
            <span className="text-[9px] opacity-40 uppercase font-bold">
            {thread.lastMessageAt ? (
                new Date(thread.lastMessageAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
                })
            ) : (
                "Just now" // Fallback for new threads
            )}
            </span>
          </div>
          <p className={`text-xs leading-relaxed truncate ${hasUnread ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
            {thread.messages[thread.messages.length - 1]?.text}
          </p>
        </div>
      );
    }) : (
      <div className="h-full flex flex-col items-center justify-center opacity-20">
        <MessageSquare size={40} className="mb-2" />
        <p className="text-xs font-black uppercase tracking-widest">Quiet for now</p>
      </div>
    )}
  </div>

  {/* REPLY BOX */}
  {selectedThread && (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
      <textarea 
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs focus:outline-none focus:border-blue-500 transition-all text-white placeholder-white/20 no-scrollbar resize-none"
        placeholder={`Reply to ${selectedThread.userId?.name || 'Client'}...`}
        rows="3"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAdminReply(selectedThread._id);
          }
        }}
      />
      <button 
        onClick={() => handleAdminReply(selectedThread._id)}
        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
      >
        Send Response
      </button>
    </motion.div>
  )}
</section>
        </div>
      </main>


              

    </div>
  );
};

// ... StatCard and NavItem components remain the same as previous version
// 🧩 HELPER COMPONENTS (Paste these at the bottom of the file)

const StatCard = ({ icon, label, value, trend, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-wider">
          {trend} <ArrowUpRight size={12} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black text-[#001325] tracking-tighter">
          {value || 0}
        </h3>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-[#001325] group-hover:scale-110 transition-transform duration-700">
        {React.cloneElement(icon, { size: 100 })}
      </div>
    </motion.div>
  );
};

const NavItem = ({ icon, label, active, badge }) => (
  <div 
    className={`flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-500 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`${active ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`}>
        {icon}
      </span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
    {badge && (
      <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg min-w-[20px] text-center shadow-lg shadow-rose-500/20">
        {badge}
      </span>
    )}
  </div>
);

export default AdminDashboard;