import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Hash, AlertCircle, Sparkles } from 'lucide-react';
import type { CSVRow, ColumnMeta, SortConfig } from '../types/dataset';

interface DataTableProps {
  data: CSVRow[];
  columns: ColumnMeta[];
  sortConfig: SortConfig | null;
  onSort: (columnName: string) => void;
  searchTerm: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  sortConfig,
  onSort,
  searchTerm,
}) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingCol, setResizingCol] = useState<string | null>(null);

  const visibleColumns = columns.filter(c => c.isVisible);

  const handleMouseDown = (colName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingCol(colName);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - e.clientX;
      const newWidth = Math.max(90, (columnWidths[colName] || 160) + diff);
      setColumnWidths(prev => ({ ...prev, [colName]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setResizingCol(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderCellValue = (val: any) => {
    if (val === null || val === undefined || String(val).trim() === '') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          <AlertCircle className="w-2.5 h-2.5" /> null
        </span>
      );
    }

    const strVal = String(val);

    if (typeof val === 'boolean' || strVal === 'true' || strVal === 'false') {
      const isTrue = strVal.toLowerCase() === 'true';
      return (
        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
          isTrue ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
        }`}>
          {strVal.toUpperCase()}
        </span>
      );
    }

    if (typeof val === 'number') {
      return (
        <span className="font-mono text-teal-300 font-medium">
          {val.toLocaleString()}
        </span>
      );
    }

    return <span className="text-gray-200">{strVal}</span>;
  };

  if (visibleColumns.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-gray-400 my-4">
        <Sparkles className="w-8 h-8 text-teal-400 mx-auto mb-2 opacity-60" />
        <p className="text-sm font-semibold text-gray-300">All columns are hidden</p>
        <p className="text-xs text-gray-500 mt-1">Use the Column Selector above to toggle visible columns.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-gray-400 my-4">
        <p className="text-sm font-semibold text-gray-300">No matching records found</p>
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1">No rows matched search query &quot;{searchTerm}&quot;</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full glass-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden my-4 relative">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[#0b0b10]/95 backdrop-blur-md sticky top-0 z-20 border-b border-white/10 shadow-md">
            <tr>
              <th className="w-12 px-3 py-3 text-center text-[10px] font-mono text-gray-500 uppercase font-semibold border-r border-white/5">
                <Hash className="w-3 h-3 mx-auto text-gray-500" />
              </th>

              {visibleColumns.map((col) => {
                const isSorted = sortConfig?.column === col.name;
                const width = columnWidths[col.name] || 160;

                return (
                  <th
                    key={col.name}
                    style={{ width: `${width}px`, minWidth: `${width}px` }}
                    className="px-4 py-3 text-[11px] font-semibold text-gray-300 hover:text-white uppercase tracking-wider relative group border-r border-white/5 select-none transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSort(col.name)}
                        className="flex items-center gap-1.5 flex-1 text-left truncate focus:outline-none cursor-pointer"
                      >
                        <span className="truncate" title={col.name}>{col.name}</span>
                        {isSorted ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors" />
                        )}
                      </button>
                    </div>

                    <div
                      onMouseDown={(e) => handleMouseDown(col.name, e)}
                      className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-teal-400/80 transition-colors ${
                        resizingCol === col.name ? 'bg-teal-400' : 'bg-transparent'
                      }`}
                      title="Drag to resize column"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.04]">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`transition-colors duration-150 group ${
                  rowIndex % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'
                } hover:bg-teal-500/[0.08]`}
              >
                <td className="px-3 py-2.5 text-center font-mono text-[10px] text-gray-500 group-hover:text-teal-400 border-r border-white/5">
                  {rowIndex + 1}
                </td>

                {visibleColumns.map((col) => (
                  <td
                    key={col.name}
                    className="px-4 py-2.5 text-xs border-r border-white/5 truncate max-w-[300px]"
                    title={String(row[col.name] ?? '')}
                  >
                    {renderCellValue(row[col.name])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
