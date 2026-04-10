
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle,  } from 'lucide-react';

const GlobalAlert = ({ isOpen, message, type = 'error', onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-3xl border border-slate-100"
        >
          {/* Top Progress Bar for visual flair */}
          <div className={`h-1.5 w-full ${type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
          
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-4 ${type === 'error' ? 'bg-red-50' : 'bg-amber-50'}`}>
                {type === 'error' ? (
                  <XCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                )}
              </div>
              
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                {type === 'error' ? 'Something went wrong' : 'Attention Required'}
              </h3>
              
              <p className="text-slate-500 leading-relaxed font-medium mb-8">
                {message || "We encountered an unexpected issue. Please check your inputs and try again."}
              </p>

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-colors active:scale-[0.98]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalAlert;