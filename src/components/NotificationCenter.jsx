


// import React, { useState, useEffect } from 'react';
// import { Bell, Crown, Zap, CheckCircle2 } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function NotificationCenter() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();

//   // Guard for unreadCount
//   const unreadCount = Array.isArray(notifications) 
//     ? notifications.filter(n => !n.isRead).length 
//     : 0;

//   const fetchNotifications = async () => {
//     try {
//       const { data } = await axios.get('/api/notifications', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       // Ensure we only set state if data is an array
//       setNotifications(Array.isArray(data) ? data : []);
//     } catch (e) { 
//       console.error("Notification error", e);
//       setNotifications([]); // Fallback to empty array on error
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 60000 * 5); // Refresh every 5 mins
//     return () => clearInterval(interval);
//   }, []);

//   const handleOpen = async () => {
//     setIsOpen(!isOpen);
//     if (!isOpen && unreadCount > 0) {
//       try {
//         await axios.put('/api/notifications/read', {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setTimeout(fetchNotifications, 1000);
//       } catch (e) {
//         console.error("Error marking as read", e);
//       }
//     }
//   };

//   return (
//     <div className="relative">
//       <button 
//         onClick={handleOpen}
//         className="relative p-2 text-slate-400 hover:text-[#0028AE] transition-all hover:bg-slate-50 rounded-full"
//       >
//         <Bell size={20} />
//         {unreadCount > 0 && (
//           <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden transform origin-top-right transition-all">
//           <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
//             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Pro Intelligence</span>
//           </div>

//           <div className="max-h-[400px] overflow-y-auto">
//             {/* Guard for .map() - This was the crash point */}
//             {Array.isArray(notifications) && notifications.length > 0 ? (
//               notifications.map((n) => (
//                 <div key={n._id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
//                   <div className="flex gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                       n.type === 'PRO_EXPIRY' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
//                     }`}>
//                       {n.type === 'PRO_EXPIRY' ? <Crown size={14} /> : <Zap size={14} />}
//                     </div>
//                     <div>
//                       <p className="text-xs font-black text-slate-800 mb-1">{n.title}</p>
//                       <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{n.message}</p>
//                       <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
//                         {new Date(n.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-8 text-center">
//                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <CheckCircle2 size={20} className="text-slate-300" />
//                 </div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Everything is up to date</p>
//               </div>
//             )}
//           </div>
          
//           <button onClick={() => navigate('/billing')} className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
//             Manage Subscription
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Bell, Crown, Zap, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = "https://quickinvoice-backend-1.onrender.com";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Guarded unread count
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.isRead).length 
    : 0;

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error("Notification error", e);
      setNotifications([]); 
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000 * 5); 
    return () => clearInterval(interval);
  }, []);

  // Updated: Clear All Function
  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API}/api/notifications/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (e) {
      console.error("Error clearing all", e);
    }
  };

  // Updated: Mark Single Function
  const handleMarkSingleRead = async (id) => {
    try {
      await axios.put(`${API}/api/notifications/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (e) {
      console.error("Error marking single read", e);
    }
  };

  // Simplified handleOpen to just toggle visibility
  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-[#0028AE] transition-all hover:bg-slate-50 rounded-full"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Pro Intelligence</span>
            </div>
            {/* Surgical Addition: Clear All Button */}
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-black text-[#0028AE] hover:text-blue-800 uppercase tracking-tighter"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {/* Surgical Fix: Filter for unread only to make them "vanish" when cleared */}
            {Array.isArray(notifications) && notifications.filter(n => !n.isRead).length > 0 ? (
              notifications.filter(n => !n.isRead).map((n) => (
                <div key={n._id} className="group relative p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors bg-blue-50/30">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      n.type === 'PRO_EXPIRY' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {n.type === 'PRO_EXPIRY' ? <Crown size={14} /> : <Zap size={14} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-black text-slate-800 mb-1">{n.title}</p>
                        {/* Surgical Addition: Individual Checkmark (Visible on hover) */}
                        <button 
                          onClick={() => handleMarkSingleRead(n._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-500 transition-all"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed pr-4">{n.message}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={20} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Everything is up to date</p>
              </div>
            )}
          </div>
          
          <button onClick={() => navigate('/billing')} className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
            Manage Subscription
          </button>
        </div>
      )}
    </div>
  );
}