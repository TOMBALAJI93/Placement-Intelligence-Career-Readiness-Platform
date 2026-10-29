import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Database, Cpu, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  fileName?: string;
  statusText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  fileName = 'dataset.csv',
  statusText = 'Parsing Dataset...'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060608]/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-md w-full p-8 text-center border-teal-500/30 shadow-[0_0_50px_rgba(45,212,191,0.2)] relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Scanner Graphic */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse border border-white/10" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-teal-400 border-r-indigo-400"
          />
          <Database className="w-8 h-8 text-teal-400 relative z-10" />
        </div>

        <h3 className="font-display text-xl font-bold text-gradient mb-1">
          {statusText}
        </h3>
        <p className="text-xs text-gray-400 mb-6 font-mono truncate px-4">
          Processing {fileName}
        </p>

        {/* Dynamic Progress Indicator */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6 border border-white/10 p-0.5 relative">
          <motion.div
            initial={{ width: '5%' }}
            animate={{ width: ['10%', '65%', '95%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.8)]"
          />
        </div>

        {/* Step details */}
        <div className="space-y-2 text-left bg-black/30 p-3.5 rounded-xl border border-white/5 text-xs text-gray-400">
          <div className="flex items-center gap-2 text-teal-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>PapaParse engine analyzing CSV structure...</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Detecting headers & data types dynamically...</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calculating dataset health & memory size...</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
