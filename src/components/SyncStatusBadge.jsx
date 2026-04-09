import React from 'react';
import { RefreshCcw} from 'lucide-react'; // Ensure these are imported
import { usePosSync } from '../db/usePOSSync';

const SyncStatusBadge = () => {
  const { isSyncing, pendingCount, syncOfflineData } = usePosSync();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // 1. OFFLINE MODE: High Alert
  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-lg shadow-sm">
        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-[900] text-rose-600 uppercase tracking-tighter">Offline Mode</span>
      </div>
    );
  }

  // 2. PENDING/SYNCING MODE: Actionable Button
  if (pendingCount > 0) {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          syncOfflineData();
        }}
        disabled={isSyncing}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg shadow-sm hover:bg-amber-100 transition-all group active:scale-95"
        title="Click to force sync"
      >
        <RefreshCcw 
          size={10} 
          className={`text-amber-600 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
        />
        <span className="text-[9px] font-[900] text-amber-600 uppercase tracking-tighter">
          {isSyncing ? 'Syncing...' : `${pendingCount} Pending Sync`}
        </span>
      </button>
    );
  }

  // 3. FULLY SYNCED: Calm & Professional
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm transition-all duration-500">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
      <span className="text-[9px] font-[900] text-emerald-600 uppercase tracking-tighter">Cloud Synced</span>
    </div>
  );
};

export default SyncStatusBadge;