
/**
 * Data synchronization utility for offline support
 */

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  collection: string;
  data: any;
  timestamp: number;
}

class DataSyncManager {
  private queue: SyncQueueItem[];
  private isSyncing: boolean;
  private syncInterval: NodeJS.Timeout | null;

  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.syncInterval = null;
  }

  /**
   * Add operation to sync queue
   */
  async addToQueue(
    operation: 'create' | 'update' | 'delete',
    collection: string,
    data: any
  ): Promise<void> {
    const item: SyncQueueItem = {
      id: `${Date.now()}_${Math.random()}`,
      operation,
      collection,
      data,
      timestamp: Date.now(),
    };

    this.queue.push(item);
    console.log(`Added to sync queue: ${operation} ${collection}`);
  }

  /**
   * Process sync queue
   */
  async processQueue(): Promise<void> {
    if (this.isSyncing || this.queue.length === 0) {
      return;
    }

    this.isSyncing = true;
    console.log(`Processing ${this.queue.length} items in sync queue...`);

    const itemsToProcess = [...this.queue];
    this.queue = [];

    for (const item of itemsToProcess) {
      try {
        // Here you would implement actual sync logic with backend
        console.log(`Synced: ${item.operation} ${item.collection}`);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        // Re-add to queue
        this.queue.push(item);
      }
    }

    this.isSyncing = false;
  }

  /**
   * Start automatic sync
   */
  startAutoSync(intervalMs: number = 60000): void {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    console.log('Auto-sync started');
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      isSyncing: this.isSyncing,
      autoSyncEnabled: this.syncInterval !== null,
    };
  }

  /**
   * Clear sync queue
   */
  clearQueue(): void {
    this.queue = [];
    console.log('Sync queue cleared');
  }
}

// Export singleton instance
export const dataSync = new DataSyncManager();

// Start auto-sync
dataSync.startAutoSync();
