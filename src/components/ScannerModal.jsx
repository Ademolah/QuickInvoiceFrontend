
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Zap } from 'lucide-react';

const ScannerModal = ({ onScan, onClose }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    const config = { 
      fps: 15,
      qrbox: { width: 280, height: 160 },
      aspectRatio: 1.777778,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true 
      },
      // 🚀 SURGICAL FIX: Force facingMode inside constraints as well
      videoConstraints: {
        facingMode: { exact: "environment" }, 
        focusMode: "continuous",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      }
    };

    const startCamera = async () => {
      try {
        // Attempt to start with exact back camera
        await html5QrCode.start(
          { facingMode: { exact: "environment" } }, 
          config, 
          (decodedText) => {
            if (navigator.vibrate) navigator.vibrate(100);
            onScan(decodedText);
          },
          () => {} 
        );
      } catch (err) {
        // Fallback: If "exact" fails (e.g. on desktop with no back cam), try normal environment
        try {
          await html5QrCode.start({ facingMode: "environment" }, config, (text) => onScan(text), () => {});
        } catch (secondErr) {
          console.error("Camera Error: ", secondErr);
        }
      }
    };

    const timer = setTimeout(startCamera, 300);

    return () => {
      clearTimeout(timer);
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
        
        <div className="relative w-full aspect-video min-h-[300px] bg-black flex items-center justify-center overflow-hidden">
          <div id="reader" className="w-full h-full" />
          
          {/* 🚀 THE SCANNING GUIDE: Added a visible border to help you align */}
          <div className="absolute inset-0 border-[2px] border-blue-500/30 m-12 rounded-xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
          <div className="flex justify-between items-center pointer-events-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
               <Zap size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
            <button onClick={onClose} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white pointer-events-auto">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
             <p className="text-white font-black text-xs uppercase tracking-[0.2em] bg-blue-600/80 px-4 py-2 rounded-full shadow-lg">
               Ready to Scan
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;