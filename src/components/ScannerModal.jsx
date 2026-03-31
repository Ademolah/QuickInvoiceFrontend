import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Zap } from 'lucide-react';

const ScannerModal = ({ onScan, onClose }) => {
  useEffect(() => {
    // 1. Initialize Scanner
    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 10, 
      qrbox: { width: 280, height: 160 }, // Landscape box for barcodes
      aspectRatio: 1.777778
    });

    scanner.render(
      (decodedText) => {
        // 2. Success! Vibrate and send data back
        if (navigator.vibrate) navigator.vibrate(100);
        onScan(decodedText);
      },
      (error) => {
        // We ignore errors during scanning to keep the feed smooth
      }
    );

    // 3. Cleanup on close
    return () => {
      scanner.clear().catch(err => console.error("Scanner cleanup failed", err));
    };
  }, [onScan]);

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