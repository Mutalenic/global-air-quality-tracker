import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Download } from 'lucide-react';
import { useServiceWorker } from '../../hooks/useServiceWorker';

export const OfflineIndicator: React.FC = () => {
  const { isOffline, updateAvailable, updateServiceWorker } = useServiceWorker();

  return (
    <AnimatePresence>
      {/* Offline Indicator */}
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">
                You&apos;re offline. Some features may be limited.
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Retry</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Update Available Banner */}
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-[100] bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <span className="font-medium">
                Update available! Get the latest features.
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={updateServiceWorker}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Update Now
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
