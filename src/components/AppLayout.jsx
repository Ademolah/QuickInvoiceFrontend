// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const AppLayout = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:block w-72 h-full">
//         <Sidebar />
//       </div>

//       {/* Premium Mobile Sidebar Drawer */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <div className="fixed inset-0 z-[100] lg:hidden">
//             {/* Backdrop Blur */}
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsMobileMenuOpen(false)} 
//               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
//             />
            
//             {/* Sliding Panel */}
//             <motion.div 
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl"
//             >
//               <Sidebar closeMenu={() => setIsMobileMenuOpen(false)} />
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* NOTE: We removed the extra logo header here. 
//             The Dashboard.jsx header will now be the primary top element.
//         */}
//         <div className="flex-1 overflow-y-auto overflow-x-hidden">
//           <Outlet context={{ setIsMobileMenuOpen }} /> 
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AppLayout;



import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isChecking, setIsChecking] = useState(true); // 🚀 THE KEY FIX
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setIsChecking(false); // Stop checking once we have the role
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 1. Prevent "Flash" of wrong UI during refresh
  if (isChecking) {
    return <div className="h-screen w-screen bg-[#F8FAFC]" />; // Silent blank screen for a few milliseconds
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-full flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
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
              className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl"
            >
              <Sidebar closeMenu={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ setIsMobileMenuOpen }} /> 
        </div>
      </main>
    </div>
  );
};

export default AppLayout;