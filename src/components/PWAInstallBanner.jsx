import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Monitor,
  Apple
} from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (PWA installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Capture standard PWA install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Track app installation completion
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger banner visibility upon scrolling down on landing page
  useEffect(() => {
    if (isDismissed || isInstalled) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerThreshold = 350; // Pixels scrolled down before banner pops up

      if (scrollPosition > triggerThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed, isInstalled]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show Apple Safari custom instructions modal
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback for browsers without native prompt support
      setShowIosModal(true);
      return;
    }

    // Show native install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isInstalled || (!isVisible && !showIosModal)) return null;

  return (
    <>
      {/* Floating Bottom Glassmorphic Banner */}
      <div 
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl transition-all duration-500 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/15 p-4 sm:p-5 shadow-2xl shadow-indigo-500/10 text-white">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Dismiss Button */}
          <button 
            onClick={handleDismiss}
            aria-label="Close banner"
            className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* QuickInvoice App Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            {/* Banner Text Content */}
            <div className="flex-1 text-center sm:text-left pr-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
                QuickInvoice App
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                Install QuickInvoice
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Fast offline access, real-time sync & instant invoice creation from your home screen.
              </p>
            </div>

            {/* Action CTA Button */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200"
              >
                <Download className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform" />
                <span>Install App</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS & Browser Safari Manual Installation Guide Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white overflow-hidden">
            
            {/* Modal Ambient Lights */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                {isIOS ? <Apple className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">How to Install</h3>
                <p className="text-xs text-slate-400">Add QuickInvoice to your Home Screen</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white mb-0.5">
                    {isIOS ? 'Tap the Share button' : 'Open Browser Options'}
                  </p>
                  <p className="text-slate-400">
                    {isIOS ? 'Tap the Share icon at the bottom of Safari browser.' : 'Click the 3 dots menu icon at the top corner.'}
                  </p>
                  {isIOS && (
                    <div className="mt-2 flex items-center gap-1.5 text-indigo-400 font-medium">
                      <Share className="w-4 h-4" /> Safari Share Bar
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white mb-0.5">Select "Add to Home Screen"</p>
                  <p className="text-slate-400">Scroll down the menu list and tap "Add to Home Screen".</p>
                  <div className="mt-2 flex items-center gap-1.5 text-indigo-400 font-medium">
                    <PlusSquare className="w-4 h-4" /> Add to Home Screen
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white mb-0.5">Launch & Enjoy</p>
                  <p className="text-slate-400">Open QuickInvoice directly from your home screen like a native application.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}