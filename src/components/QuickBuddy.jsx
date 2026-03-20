import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Zap, Smile, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';


const API = "https://quickinvoice-backend-1.onrender.com"; // Ensure your port matches


const QuickBuddy = ({ user, activeBusiness }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [ticketId, setTicketId] = useState(null); // 🔑 The Room ID
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  

  // 1. Fetch Chat History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/support/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data._id) {
          setTicketId(res.data._id);
          setChat(res.data.messages || []);
        }
      } catch (err) {
        console.error("History recovery failed:", err);
      }
    };
    fetchHistory();
  }, []);

  // 2. Socket.io Real-Time Connection
  useEffect(() => {
    if (!ticketId) return;

    const socket = io(API);
    
    // 🛡️ Join the private room for this ticket
    socket.emit('join_chat', ticketId);

    // 📩 Listen for Admin replies
    socket.on('receive_reply', (data) => {
      setIsTyping(false);
      setChat(prev => [...prev, data.message]);
      
      // Optional: Sound notification
      // new Audio('/pop.mp3').play();
    });

    return () => socket.disconnect();
  }, [ticketId]);

  // 3. Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chat, isTyping]);

  const handleSend = async () => {
    if (!msg.trim()) return;
    
    const tempMsg = msg;
    setMsg(""); // Clear input immediately for "Premium" feel

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/api/support/send`, {
        text: tempMsg,
        context: {
          page: window.location.pathname,
          businessName: activeBusiness?.businessName || user?.businessName || "General",
          plan: user?.plan || "Standard"
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // Update ticketId if it's the first message
        if (!ticketId) setTicketId(res.data.ticket._id);
        setChat(res.data.ticket.messages);
      }
    } catch (err) {
      console.error("Support delivery failed:", err);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[1000] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, transition: { duration: 0.2 } }}
            className="mb-6 w-[380px] md:w-[420px] h-[600px] md:h-[650px] bg-white/90 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-[0_40px_80px_-15px_rgba(0,18,37,0.25)] flex flex-col overflow-hidden"
          >
            {/* 💎 PREMIUM HEADER */}
            <div className="p-8 bg-[#001325] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-[#0028AE] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles size={22} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em]">QuickSupport</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest">Priority Support Active</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 📍 CONTEXT BAR */}
            <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                  Secure Session: {activeBusiness?.businessName || "Active Dashboard"}
                </span>
              </div>
              <Zap size={12} className="text-amber-400" />
            </div>

            {/* 💬 CHAT AREA */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar bg-gradient-to-b from-white to-slate-50/50">
              {chat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="text-blue-600" size={24} />
                  </div>
                  <h5 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-2">How can we help today?</h5>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Send a message and a specialized agent will respond in real-time.</p>
                </div>
              )}
              {chat.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-[11px] font-bold leading-relaxed shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-[#0028AE] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ⌨️ INPUT AREA */}
            <div className="p-6 md:p-8 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your issue..."
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] pl-6 pr-12 py-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0028AE]/10 transition-all outline-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Smile size={18} className="cursor-pointer hover:text-slate-500 transition-colors" />
                  </div>
                </div>
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-[#001325] text-white rounded-2xl flex items-center justify-center hover:bg-[#0028AE] transition-all shadow-lg shadow-blue-900/10 active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔘 TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-[#001325] text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,40,174,0.3)] relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0028AE] to-blue-400 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
        </div>
        {!isOpen && chat.some(m => m.sender === 'admin' && !m.isRead) && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 border-4 border-[#F8FAFC] rounded-full flex items-center justify-center text-[10px] font-black text-white">
            !
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default QuickBuddy;