import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, Shield, Cpu, Table, ArrowRight } from 'lucide-react';
import type { DatasetMeta } from '../types/dataset';
import type { ImportTargetConfig } from '../types/snowflake';

interface SnowflakeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: DatasetMeta;
  onStartImport: (config: ImportTargetConfig) => void;
}

export const SnowflakeImportModal: React.FC<SnowflakeImportModalProps> = ({
  isOpen,
  onClose,
  meta,
  onStartImport,
}) => {
  const defaultTableName = meta.fileName
    .replaceAll("(?i)\\.csv$", "")
    .replaceAll("[^a-zA-Z0-9_]", "_")
    .toUpperCase();

  const [tableName, setTableName] = useState(defaultTableName);
  const [warehouse] = useState('COMPUTE_WH');
  const [database] = useState('DEMO_DB');
  const [schema] = useState('PUBLIC');
  const [role] = useState('ACCOUNTADMIN');
  const [createTable, setCreateTable] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartImport({
      targetTableName: tableName.trim().toUpperCase() || 'UPLOADED_TABLE',
      warehouse,
      database,
      schema,
      role,
      createTableIfNotExists: createTable,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060608]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-card max-w-lg w-full p-6 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Snowflake Data Ingestion
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Target Table Configuration & Dynamic Schema
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Snowflake Table Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Target Snowflake Table Name
              </label>
              <div className="relative flex items-center">
                <Table className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  placeholder="e.g. EMPLOYEES_DATA"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-indigo-500/50 rounded-xl text-xs font-mono text-teal-300 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Uppercase letters and underscores only.</p>
            </div>

            {/* Connection Info Badges */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Warehouse:
                </span>
                <span className="text-white font-semibold">{warehouse}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Database & Schema:
                </span>
                <span className="text-teal-300 font-semibold">{database}.{schema}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" /> JDBC Role:
                </span>
                <span className="text-purple-300 font-semibold">{role}</span>
              </div>
            </div>

            {/* Inferred Column Schema Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-gray-300 font-semibold uppercase tracking-wider">
                <span>Inferred Snowflake Column Types</span>
                <span className="text-teal-400 font-mono">{meta.columnCount} Columns</span>
              </div>
              <div className="max-h-32 overflow-y-auto bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1 custom-scrollbar">
                {meta.columnMetadata.map(col => (
                  <div key={col.name} className="flex items-center justify-between text-[11px] font-mono py-0.5 px-2 rounded bg-white/[0.02]">
                    <span className="text-gray-300 truncate max-w-[180px]">{col.name}</span>
                    <span className="text-indigo-400 font-semibold">
                      {col.type === 'number' ? 'INTEGER / NUMBER' : col.type === 'boolean' ? 'BOOLEAN' : 'VARCHAR(16777216)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Table Toggle */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={createTable}
                onChange={(e) => setCreateTable(e.target.checked)}
                className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-400 bg-black/40"
              />
              <span>Auto-create table <strong className="text-white">{tableName}</strong> if it does not exist</span>
            </label>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Start Snowflake Ingestion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
