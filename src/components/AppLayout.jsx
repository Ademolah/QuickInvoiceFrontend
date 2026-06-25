/* eslint-disable no-unused-vars */

// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const AppLayout = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const [isChecking, setIsChecking] = useState(true); // 🚀 THE KEY FIX
//   const location = useLocation();

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     setUserRole(role);
//     setIsChecking(false); // Stop checking once we have the role
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   // 1. Prevent "Flash" of wrong UI during refresh
//   if (isChecking) {
//     return <div className="h-screen w-screen bg-[#F8FAFC]" />; // Silent blank screen for a few milliseconds
//   }

//   // 2. Strict Admin Layout
//   if (userRole === "admin") {
//     return (
//       <div className="h-screen bg-[#F8FAFC] overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-y-auto overflow-x-hidden">
//           <Outlet context={{ setIsMobileMenuOpen }} />
//         </main>
//       </div>
//     );
//   }

//   // 3. Strict User Layout (Only if NOT admin)
//   return (
//     <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:block w-72 h-full flex-shrink-0">
//         <Sidebar />
//       </aside>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <div className="fixed inset-0 z-[100] lg:hidden">
//             <motion.div 
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             /* 🚀 THE FIX: Precise, smooth transition without the bounce */
//             transition={{ 
//               type: "tween", 
//               ease: "circOut", // or "easeInOut" for a more natural feel
//               duration: 0.3 
//             }}
//             className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl"
//           >
//             <Sidebar closeMenu={() => setIsMobileMenuOpen(false)} />
//           </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
//         <div className="flex-1 overflow-y-auto">
//           <Outlet context={{ setIsMobileMenuOpen }} /> 
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AppLayout;

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  // ✨ PREMIUM UX: Persist user workspace frame configurations across browser refreshes
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("qi_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("qi_sidebar_collapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setIsChecking(false); // Stop checking once we have the role
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 1. Prevent "Flash" of wrong UI during refresh
  if (isChecking) {
    return <div className="h-screen w-screen bg-[#F8FAFC]" />; 
  }

  // 2. Strict Admin Layout
  if (userRole === "admin") {
    return (
      <div className="h-screen bg-[#F8FAFC] overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ setIsMobileMenuOpen }} />
        </main>
      </div>
    );
  }

  // 3. Strict User Layout (Only if NOT admin)
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* Desktop Sidebar with fluid hardware-accelerated width morphing */}
      <aside className={`hidden lg:block h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-[80px]' : 'w-72'
      }`}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      </aside>

      {/* Mobile Sidebar Frame Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl"
            >
              {/* Force Mobile View to remain fully uncollapsed for operational clarity */}
              <Sidebar 
                isCollapsed={false} 
                closeMenu={() => setIsMobileMenuOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Window Framework Layout */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Passing collapse configuration context through to individual child routing layers if required */}
          <Outlet context={{ setIsMobileMenuOpen, isSidebarCollapsed }} /> 
        </div>
      </main>
    </div>
  );
};

export default AppLayout;