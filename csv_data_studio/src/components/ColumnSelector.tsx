import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, SlidersHorizontal, CheckSquare, Square, Search, X } from 'lucide-react';
import type { ColumnMeta } from '../types/dataset';

interface ColumnSelectorProps {
  columns: ColumnMeta[];
  onToggleColumn: (colName: string) => void;
  onToggleAll: (visible: boolean) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onToggleColumn,
  onToggleAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const visibleCount = columns.filter(c => c.isVisible).length;
  const filteredColumns = columns.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-teal-500/40 rounded-xl text-xs font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
        <span>Columns ({visibleCount}/{columns.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute right-0 mt-2 w-72 bg-[#0e0e14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 p-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Toggle Columns
                  </h4>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative my-3">
                <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter columns..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[11px]">
                <button
                  onClick={() => onToggleAll(true)}
                  className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare className="w-3 h-3" /> Select All
                </button>
                <button
                  onClick={() => onToggleAll(false)}
                  className="text-gray-400 hover:text-gray-200 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3" /> Deselect All
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredColumns.map((col) => (
                  <label
                    key={col.name}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      col.isVisible 
                        ? 'bg-teal-500/10 text-teal-200 border border-teal-500/20' 
                        : 'hover:bg-white/5 text-gray-400 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={col.isVisible}
                        onChange={() => onToggleColumn(col.name)}
                        className="rounded border-gray-600 text-teal-500 focus:ring-teal-400 bg-black/40 cursor-pointer"
                      />
                      <span className="truncate" title={col.name}>{col.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-gray-500">
                      {col.type}
                    </span>
                  </label>
                ))}

                {filteredColumns.length === 0 && (
                  <p className="text-center text-xs text-gray-500 py-4">No matching columns</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
