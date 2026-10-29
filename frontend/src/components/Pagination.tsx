import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationState } from '../types/dataset';

interface PaginationProps {
  pagination: PaginationState;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  totalRows,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalRows / pagination.pageSize) || 1;
  const startRow = totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endRow = Math.min(pagination.page * pagination.pageSize, totalRows);

  const pageOptions = [10, 25, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 px-2 border-t border-white/10 text-xs text-gray-400">
      {/* Row Count Footer */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-gray-300">
          Showing: <strong className="text-teal-400 font-semibold">{startRow}–{endRow}</strong> of <strong className="text-white font-semibold">{totalRows.toLocaleString()}</strong> rows
        </span>

        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5 ml-4">
          <span className="text-gray-500">Rows/page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-card/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-teal-500 font-mono"
          >
            {pageOptions.map((size) => (
              <option key={size} value={size} className="bg-[#0e0e14] text-white">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400 font-mono mr-2">
          Page {pagination.page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(1)}
          disabled={pagination.page === 1}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= totalPages}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={pagination.page >= totalPages}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
