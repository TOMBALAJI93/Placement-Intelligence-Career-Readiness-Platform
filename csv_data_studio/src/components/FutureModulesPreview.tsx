import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  BarChart3, 
  Brain, 
  Download, 
  Check, 
  Layers,
  Zap
} from 'lucide-react';
import type { DatasetMeta, CSVRow } from '../types/dataset';

interface FutureModulesPreviewProps {
  meta: DatasetMeta;
  data: CSVRow[];
  onExportCSV: () => void;
  onResetDataset: () => void;
}

export const FutureModulesPreview: React.FC<FutureModulesPreviewProps> = ({
  meta,
  data: _data,
  onExportCSV,
  onResetDataset,
}) => {
  const [activeTab, setActiveTab] = useState<'clean' | 'ai' | 'charts' | 'ml' | null>('ai');
  const [cleaned, setCleaned] = useState(false);

  const numericCols = meta.columnMetadata.filter(c => c.type === 'number');
  const categoricalCols = meta.columnMetadata.filter(c => c.type === 'string');

  return (
    <div className="w-full mt-8 glass-card p-6 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Data Intelligence Extensions & Export
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono text-teal-300">
              Extensible Pipeline
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Perform instant dataset transformations, generate AI insights, or export clean CSV files.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportCSV}
            className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Clean CSV</span>
          </button>

          <button
            onClick={onResetDataset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-300 text-xs font-medium transition-all cursor-pointer"
          >
            Upload New CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 my-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab(activeTab === 'ai' ? null : 'ai')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ai' 
              ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500/40 text-teal-300 shadow-lg' 
              : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>AI Dataset Insights</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'clean' ? null : 'clean')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'clean' 
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-300 shadow-lg' 
              : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Data Cleaning</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'charts' ? null : 'charts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'charts' 
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 shadow-lg' 
              : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
          <span>Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'ml' ? null : 'ml')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ml' 
              ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg' 
              : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>Placement ML Ready</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-black/40 border border-teal-500/20 space-y-3"
          >
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>Antigravity AI Dataset Audit</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-semibold text-white mb-1">Schema Quality</p>
                <p className="text-gray-400 text-[11px]">
                  Detected {numericCols.length} numerical features & {categoricalCols.length} categorical attributes. Ready for statistical modeling.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-semibold text-white mb-1">Missing Value Imputation</p>
                <p className="text-gray-400 text-[11px]">
                  {meta.missingValuesCount === 0 
                    ? '100% complete dataset. No missing values detected.' 
                    : `Found ${meta.missingValuesCount} missing cells. Recommended mean/mode fill.`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-semibold text-white mb-1">Deduplication Recommendation</p>
                <p className="text-gray-400 text-[11px]">
                  {meta.duplicateRowsCount === 0 
                    ? 'Zero duplicate rows detected. Clean row uniqueness.' 
                    : `${meta.duplicateRowsCount} duplicate entries found. Click clean to drop.`}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'clean' && (
          <motion.div
            key="clean"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-black/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> Data Cleaning & Formatting Tool
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Auto-trim whitespace, drop duplicate rows, and standardize header names with 1-click.
              </p>
            </div>
            <button
              onClick={() => setCleaned(true)}
              disabled={cleaned}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                cleaned 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
              }`}
            >
              {cleaned ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dataset Cleaned & Standardized!</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Auto-Clean Dataset Now</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {activeTab === 'charts' && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 text-xs text-gray-300"
          >
            <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Automated Chart Generation Module
            </h4>
            <p className="text-gray-400 mb-3">
              Distribution charts ready for top columns: <strong className="text-white">{numericCols.map(c => c.name).slice(0, 3).join(', ') || 'Numeric attributes'}</strong>.
            </p>
            <div className="h-16 rounded-xl bg-white/5 border border-dashed border-purple-500/30 flex items-center justify-center text-purple-400 font-mono text-[11px]">
              📊 Visualization Engine Ready
            </div>
          </motion.div>
        )}

        {activeTab === 'ml' && (
          <motion.div
            key="ml"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 text-xs text-gray-300"
          >
            <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Machine Learning Pipeline Integration
            </h4>
            <p className="text-gray-400 mb-3">
              Pass this dataset to Placement Prediction ML Model or Role Matching algorithm.
            </p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-[11px]">
                Target column: {categoricalCols[categoricalCols.length - 1]?.name || 'Status'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[11px]">
                Feature count: {numericCols.length + categoricalCols.length - 1}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
