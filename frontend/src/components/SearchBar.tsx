import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search all columns (e.g. name, ID, CGPA)..."
          className="w-full pl-10 pr-24 py-2.5 bg-card/60 backdrop-blur-xl border border-white/10 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-16 p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute right-2 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-teal-400 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>{filteredCount} / {totalCount}</span>
        </div>
      </div>
    </div>
  );
};
