import React, { useState, useEffect } from 'react';
import { Download, X} from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Catch native PWA install prompt event (Chrome, Edge, Android, Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide automatically if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Show banner after user scrolls down past 300px
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("App is preparing or already installed. If on iOS Safari, tap Share > Add to Home Screen.");
      return;
    }

    // Trigger native browser install dialog immediately
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center justify-between gap-4">
        
        {/* Subtle Brand Accent Glow */}
        <div className="absolute -left-10 -top-10 w-28 h-28 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Left Side Info */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-md shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-400 animate-bounce" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-sm text-white tracking-wide">QuickInvoice App</h4>
            </div>
            <p className="text-xs text-slate-400">Install for faster, offline access</p>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            Install App
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}