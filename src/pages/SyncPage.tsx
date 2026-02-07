import { useState, useEffect } from 'react';
import { syncAllContent } from '../services/syncService';
import { db } from '../firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

interface CacheStatus {
  totalDocs: number;
  lastSynced: string | null;
}

const SyncPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const loadCacheStatus = async () => {
    setLoadingStatus(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'contentful_cache'));
      let latestSync: Date | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.syncedAt) {
          const syncDate = new Date(data.syncedAt);
          if (!latestSync || syncDate > latestSync) {
            latestSync = syncDate;
          }
        }
      });

      setCacheStatus({
        totalDocs: querySnapshot.size,
        lastSynced: latestSync ? latestSync.toLocaleString() : null,
      });
    } catch (error) {
      console.error('Failed to load cache status:', error);
      setCacheStatus({ totalDocs: 0, lastSynced: null });
    }
    setLoadingStatus(false);
  };

  useEffect(() => {
    loadCacheStatus();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setLogs([]);

    try {
      await syncAllContent((msg) => {
        setLogs((prev) => [...prev, msg]);
      });
      await loadCacheStatus();
    } catch (err: any) {
      setLogs((prev) => [...prev, `Fatal error: ${err?.message ?? err}`]);
    }

    setSyncing(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white px-6 pt-32 pb-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Content Sync
        </h1>
        <p className="text-gray-400 mb-8">
          Pull latest content from Contentful into Firebase cache. Visitors will
          see cached content, saving Contentful API bandwidth.
        </p>

        {!loadingStatus && cacheStatus && (
          <div className="bg-[#1a1d27] border border-gray-800 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold mb-3">Cache Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total cached documents:</span>
                <span className="font-semibold text-emerald-400">
                  {cacheStatus.totalDocs}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last synced:</span>
                <span className="font-semibold">
                  {cacheStatus.lastSynced || 'Never'}
                </span>
              </div>
            </div>
          </div>
        )}

        {loadingStatus && (
          <div className="bg-[#1a1d27] border border-gray-800 rounded-xl p-5 mb-6">
            <p className="text-gray-400">Loading cache status...</p>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-white text-[#0f1117] font-semibold py-2.5 px-8 rounded-lg
                     hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors mb-8"
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>

        {logs.length > 0 && (
          <div className="bg-[#1a1d27] border border-gray-800 rounded-xl p-5 font-mono text-sm leading-relaxed max-h-[28rem] overflow-y-auto">
            {logs.map((line, i) => (
              <div
                key={i}
                className={`py-0.5 ${
                  line.startsWith('  Done')
                    ? 'text-emerald-400'
                    : line.startsWith('  Failed')
                      ? 'text-red-400'
                      : line.includes('complete')
                        ? 'text-emerald-300 font-semibold mt-2'
                        : 'text-gray-300'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncPage;
