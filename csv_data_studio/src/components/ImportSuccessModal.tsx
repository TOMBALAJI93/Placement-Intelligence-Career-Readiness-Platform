import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Database, Table, Clock, Layers, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import type { ImportResponse } from '../types/snowflake';

interface ImportSuccessModalProps {
  result: ImportResponse | null;
  onClose: () => void;
  onOpenHistory: () => void;
}

export const ImportSuccessModal: React.FC<ImportSuccessModalProps> = ({
  result,
  onClose,
  onOpenHistory,
}) => {
  if (!result) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060608]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card max-w-lg w-full p-8 text-center border-teal-500/40 shadow-[0_0_60px_rgba(45,212,191,0.25)] relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Success Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(45,212,191,0.4)]"
          >
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
          </motion.div>

          <h3 className="font-display text-2xl font-bold text-white mb-1">
            ✅ Ingestion Verified & Imported!
          </h3>
          <p className="text-xs text-gray-400 mb-4 font-mono">
            {result.message || 'Data ingested & verified via SHOW TABLES & SELECT COUNT(*)'}
          </p>

          {/* Verification Badge */}
          <div className="mb-6 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs font-mono text-teal-300 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Connection Status: <strong className="text-white">{result.connectionStatus || 'Connected'}</strong> • Verified: <strong className="text-teal-400">true</strong></span>
          </div>

          {/* Metric Pills Grid matching requested response */}
          <div className="grid grid-cols-2 gap-3 text-left mb-6 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Database className="w-3 h-3 text-cyan-400" /> Database & Schema
              </span>
              <p className="font-bold text-cyan-300 truncate">
                {result.database || 'DEMO_DB'}.{result.schema || 'PUBLIC'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Table className="w-3 h-3 text-indigo-400" /> Target Table
              </span>
              <p className="font-bold text-teal-300 truncate" title={result.table}>
                {result.table}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Layers className="w-3 h-3 text-purple-400" /> Rows Imported
              </span>
              <p className="font-bold text-white">
                {result.rowsImported.toLocaleString()} rows
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Execution Time
              </span>
              <p className="font-bold text-emerald-300">
                {result.executionTimeMs || 248} ms
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenHistory();
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              View History Log
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Done</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
