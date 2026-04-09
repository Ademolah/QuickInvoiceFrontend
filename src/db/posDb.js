import Dexie from 'dexie';

export const db = new Dexie('QuickInvoice_POS_Pro');

db.version(1).stores({
  // _id is the MongoDB ID for easy mapping
  products: '_id, name, sku, category', 
  // id is auto-incremented for the local queue
  // clientTxnId is the unique key for the backend
  pendingSales: '++id, clientTxnId, status', 
  // Cache for recently completed sales for the 'Recent Transactions' view
  syncedSales: 'clientTxnId, offlineCreatedAt' 
});