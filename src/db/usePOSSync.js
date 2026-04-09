import { useEffect, useState, useCallback } from 'react';
import { db } from './posDb';
import axios from 'axios';


const API = 'https://quickinvoice-backend-1.onrender.com'

export const usePosSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = useCallback(async () => {
    const count = await db.pendingSales.count();
    setPendingCount(count);
  }, []);

  const syncOfflineData = useCallback(async () => {
    // Basic guards
    if (isSyncing || !navigator.onLine) return;
    
    const offlineSales = await db.pendingSales.toArray();
    if (offlineSales.length === 0) return;

    setIsSyncing(true);
    try {
      const token = localStorage.getItem("token");
      
      // We send all pending sales in one batch to our bulk controller
      const response = await axios.post(`${API}/api/pos/process`, 
        { sales: offlineSales },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.summary) {
        const { synced, duplicates } = response.data.summary;
        const allProcessed = [...synced, ...duplicates];

        // Clear only the IDs the server confirmed it received
        await db.pendingSales.where('clientTxnId').anyOf(allProcessed).delete();
        console.log(`✅ POS Sync: ${allProcessed.length} sales processed.`);
      }
    } catch (error) {
      console.error('❌ POS Sync Error:', error.response?.data?.message || error.message);
    } finally {
      setIsSyncing(false);
      updatePendingCount();
    }
  }, [isSyncing, updatePendingCount]);

  useEffect(() => {
    updatePendingCount();

    // 1. Listen for network recovery
    window.addEventListener('online', syncOfflineData);
    
    // 2. Heartbeat: Check for stuck sales every 30 seconds
    const heartbeat = setInterval(() => {
      if (pendingCount > 0) syncOfflineData();
    }, 30000);

    return () => {
      window.removeEventListener('online', syncOfflineData);
      clearInterval(heartbeat);
    };
  }, [pendingCount, syncOfflineData, updatePendingCount]);

  return { isSyncing, pendingCount, syncOfflineData, updatePendingCount };
};