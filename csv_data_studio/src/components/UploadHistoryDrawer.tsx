import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Database, Table, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { UploadHistoryItem } from '../types/snowflake';
import { fetchUploadHistory } from '../services/snowflakeApi';

interface UploadHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadHistoryDrawer: React.FC<UploadHistoryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [historyItems, setHistoryItems] = useState<UploadHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUploadHistory();
      setHistoryItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-[#060608]/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-screen max-w-md bg-[#0c0c12] border-l border-white/10 shadow-2xl p-6 flex flex-col relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Snowflake Upload History
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Metadata & Ingestion Audit Log
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={loadHistory}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Refresh History"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ingestion Logs List */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 custom-scrollbar pr-1">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-all space-y-2 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors">
                        {item.datasetName}
                      </h4>
                      <p className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 mt-0.5">
                        <Table className="w-3 h-3" /> {item.snowflakeTableName}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 ${
                      item.status === 'SUCCESS' 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {item.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                      )}
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Rows Imported</span>
                      <strong className="text-gray-200">{item.rowsImported.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Columns</span>
                      <strong className="text-gray-200">{item.columnsImported}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {new Date(item.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-teal-400">{item.durationMs} ms</span>
                  </div>
                </div>
              ))}

              {historyItems.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <Database className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                  <p>No Snowflake ingestion history recorded yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 text-center text-[10px] text-gray-500 font-mono">
              Audit Logs • Snowflake Ingestion Engine
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
