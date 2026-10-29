import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, RefreshCw, Upload } from 'lucide-react';
import { CSVUploader } from '../components/CSVUploader';
import { SampleDatasets } from '../components/SampleDatasets';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { DatasetSummary } from '../components/DatasetSummary';
import { SearchBar } from '../components/SearchBar';
import { ColumnSelector } from '../components/ColumnSelector';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { FutureModulesPreview } from '../components/FutureModulesPreview';
import type { CSVRow, DatasetMeta, ColumnMeta, SortConfig, PaginationState, SampleDataset } from '../types/dataset';
import { parseCSVString } from '../utils/csvParser';
import Papa from 'papaparse';

export const CSVUploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');
  const [data, setData] = useState<CSVRow[] | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [columns, setColumns] = useState<ColumnMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25 });

  // Handle uploading raw File
  const handleUploadStart = (fileName: string) => {
    setLoadingFileName(fileName);
    setIsLoading(true);
  };

  const handleUploadSuccess = (result: any) => {
    setIsLoading(false);
    if (result.data && result.meta) {
      setData(result.data);
      setMeta(result.meta);
      setColumns(result.meta.columnMetadata);
      setSearchTerm('');
      setSortConfig(null);
      setPagination({ page: 1, pageSize: 25 });
    }
  };

  const handleUploadError = (err: string) => {
    setIsLoading(false);
    console.error('CSV Parsing Error:', err);
  };

  // Handle selecting Sample Dataset
  const handleSelectSample = (sample: SampleDataset) => {
    handleUploadStart(sample.name + '.csv');
    setTimeout(() => {
      const result = parseCSVString(sample.csvString, `${sample.name}.csv`);
      if (result.success && result.data && result.meta) {
        setData(result.data);
        setMeta(result.meta);
        setColumns(result.meta.columnMetadata);
        setSearchTerm('');
        setSortConfig(null);
        setPagination({ page: 1, pageSize: 25 });
      }
      setIsLoading(false);
    }, 400);
  };

  // Reset current dataset to upload another
  const handleResetDataset = () => {
    setData(null);
    setMeta(null);
    setColumns([]);
    setSearchTerm('');
    setSortConfig(null);
    setPagination({ page: 1, pageSize: 25 });
  };

  // Column visibility toggle
  const handleToggleColumn = (colName: string) => {
    setColumns(prev =>
      prev.map(col => (col.name === colName ? { ...col, isVisible: !col.isVisible } : col))
    );
  };

  const handleToggleAllColumns = (visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, isVisible: visible })));
  };

  // Column sorting toggle
  const handleSort = (columnName: string) => {
    setSortConfig(prev => {
      if (prev?.column === columnName) {
        if (prev.direction === 'asc') {
          return { column: columnName, direction: 'desc' };
        }
        return null; // unsorted
      }
      return { column: columnName, direction: 'asc' };
    });
  };

  // Global search filtering across all columns
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // Column sorting execution
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.column];
      const valB = b[sortConfig.column];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (sortConfig.direction === 'asc') {
        return strA.localeCompare(strB);
      }
      return strB.localeCompare(strA);
    });
  }, [filteredData, sortConfig]);

  // Pagination slice
  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);

  // Export dataset to CSV download
  const handleExportCSV = () => {
    if (!data || !meta) return;
    const csvContent = Papa.unparse(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned_${meta.fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
      {/* Loading Spinner Overlay */}
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay
            fileName={loadingFileName}
            statusText="Parsing & Schema Detection..."
          />
        )}
      </AnimatePresence>

      {/* Main SaaS Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-400/20 to-indigo-500/20 border border-teal-500/30 text-teal-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                  CSV Data Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono text-teal-400 font-medium">
                  Dynamic Engine
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload any CSV dataset for automatic schema detection, dynamic table preview & statistical analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Top Header Controls */}
        {data && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleResetDataset}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Upload Different Dataset</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!data ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CSVUploader
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
          <SampleDatasets onSelectSample={handleSelectSample} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Dataset Summary Cards */}
          {meta && <DatasetSummary meta={meta} />}

          {/* Table Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/40 p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(term) => {
                setSearchTerm(term);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              filteredCount={filteredData.length}
              totalCount={data.length}
            />

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ColumnSelector
                columns={columns}
                onToggleColumn={handleToggleColumn}
                onToggleAll={handleToggleAllColumns}
              />

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortConfig(null);
                  setPagination({ page: 1, pageSize: 25 });
                }}
                className="p-2.5 bg-card/60 border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Dynamic Data Table */}
          <DataTable
            data={paginatedData}
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            searchTerm={searchTerm}
          />

          {/* Pagination Controls Footer */}
          <Pagination
            pagination={pagination}
            totalRows={filteredData.length}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
          />

          {/* Extensible Future Modules Bar */}
          {meta && (
            <FutureModulesPreview
              meta={meta}
              data={data}
              onExportCSV={handleExportCSV}
              onResetDataset={handleResetDataset}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};
