/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Zap } from 'lucide-react';

const ScannerModal = ({ onScan, onClose }) => {
  useEffect(() => {
  // 1. Create the instance
  const scanner = new Html5QrcodeScanner("reader", { 
    fps: 10, 
    qrbox: { width: 280, height: 160 }, 
    aspectRatio: 1.777778,
    // Add this to skip the "Select Camera" screen and go straight to live feed
    rememberLastUsedCamera: true,
    supportedScanTypes: [0] // 0 means ONLY camera, no file uploads
  });

  // 2. Start with a tiny delay to ensure React has painted the 'reader' div
  const startScanner = setTimeout(() => {
    scanner.render(
      (decodedText) => {
        if (navigator.vibrate) navigator.vibrate(100);
        onScan(decodedText);
      },
      (error) => {
        // Just a placeholder for the scanner engine
      }
    );
  }, 100);

  // 3. Robust Cleanup
  return () => {
    clearTimeout(startScanner);
    scanner.clear().catch(err => {
      // We ignore the error if it was already cleared
      console.log("Scanner cleared successfully or already inactive.");
    });
  };
  // 🚀 IMPORTANT: Remove [onScan] from here to prevent constant restarts
  // We only want this scanner to start once when the modal opens.
}, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
        
        {/* SCANNER VIEWPORT */}
        <div id="reader" className="w-full h-full" />

        {/* OVERLAY UI */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
          <div className="flex justify-between items-center pointer-events-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
               <Zap size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
            <button onClick={onClose} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white hover:bg-red-500/50 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-1 bg-white/20 rounded-full animate-pulse" />
             <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Align barcode within frame</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;