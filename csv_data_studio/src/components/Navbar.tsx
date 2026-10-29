import React from 'react';
import { Database, FileSpreadsheet, ShieldCheck, Zap, History } from 'lucide-react';

interface NavbarProps {
  datasetName?: string;
  rowCount?: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ datasetName, rowCount, onOpenHistory }) => {
  return (
    <header className="w-full border-b border-white/[0.08] bg-[#09090e]/80 backdrop-blur-2xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-500 p-0.5 shadow-[0_0_20px_rgba(45,212,191,0.25)]">
            <div className="w-full h-full bg-[#09090e] rounded-[10px] flex items-center justify-center">
              <Database className="w-5 h-5 text-teal-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-lg text-white tracking-tight">
                Antigravity <span className="text-gradient">CSV Studio</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono text-teal-300 font-semibold">
                Snowflake ETL Ready
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              Enterprise CSV Parser & Snowflake Ingestion Pipeline
            </p>
          </div>
        </div>

        {/* Live Status & History Button */}
        <div className="flex items-center gap-3">
          {datasetName ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs font-mono text-teal-300">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="font-semibold">{datasetName}</span>
              {rowCount !== undefined && (
                <span className="text-teal-400/70">({rowCount.toLocaleString()} rows)</span>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Ready for Upload</span>
            </div>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-mono text-indigo-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-semibold">Upload History</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline font-mono">Snowflake JDBC Ingestion</span>
          </div>
        </div>
      </div>
    </header>
  );
};
