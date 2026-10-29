import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, RefreshCw, Upload, Database, Layers } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CSVUploader } from './components/CSVUploader';
import { SampleDatasets } from './components/SampleDatasets';
import { LoadingOverlay } from './components/LoadingOverlay';
import { DatasetSummary } from './components/DatasetSummary';
import { SearchBar } from './components/SearchBar';
import { ColumnSelector } from './components/ColumnSelector';
import { DataTable } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { FutureModulesPreview } from './components/FutureModulesPreview';
import { SnowflakeImportModal } from './components/SnowflakeImportModal';
import { ImportProgressOverlay } from './components/ImportProgressOverlay';
import { ImportSuccessModal } from './components/ImportSuccessModal';
import { UploadHistoryDrawer } from './components/UploadHistoryDrawer';
import type { CSVRow, DatasetMeta, ColumnMeta, SortConfig, PaginationState, SampleDataset } from './types/dataset';
import type { ImportTargetConfig, ImportResponse } from './types/snowflake';
import { parseCSVString } from './utils/csvParser';
import { importToSnowflake } from './services/snowflakeApi';
import Papa from 'papaparse';

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');
  const [data, setData] = useState<CSVRow[] | null>(null);
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [columns, setColumns] = useState<ColumnMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25 });

  // Snowflake Ingestion States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [targetTableName, setTargetTableName] = useState('');
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

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

  const handleResetDataset = () => {
    setData(null);
    setMeta(null);
    setColumns([]);
    setSearchTerm('');
    setSortConfig(null);
    setPagination({ page: 1, pageSize: 25 });
  };

  const handleToggleColumn = (colName: string) => {
    setColumns(prev =>
      prev.map(col => (col.name === colName ? { ...col, isVisible: !col.isVisible } : col))
    );
  };

  const handleToggleAllColumns = (visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, isVisible: visible })));
  };

  const handleSort = (columnName: string) => {
    setSortConfig(prev => {
      if (prev?.column === columnName) {
        if (prev.direction === 'asc') {
          return { column: columnName, direction: 'desc' };
        }
        return null;
      }
      return { column: columnName, direction: 'asc' };
    });
  };

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

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);

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

  // Trigger Snowflake Ingestion
  const handleStartSnowflakeImport = async (config: ImportTargetConfig) => {
    if (!meta || !data) return;
    setIsImportModalOpen(false);
    setTargetTableName(config.targetTableName);
    setIsIngesting(true);

    try {
      const res = await importToSnowflake(meta, data, config);
      setImportResult(res);
    } catch (err) {
      console.error('Snowflake ingestion error:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060608] text-gray-100 relative selection:bg-teal-500 selection:text-black">
      {/* Background Radial Lights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar Header */}
      <Navbar
        datasetName={meta?.fileName}
        rowCount={data?.length}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
      />

      {/* Processing Spinner Overlay */}
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay
            fileName={loadingFileName}
            statusText="Parsing & Schema Detection..."
          />
        )}

        {isIngesting && (
          <ImportProgressOverlay
            tableName={targetTableName}
            rowCount={meta?.rowCount || 0}
          />
        )}
      </AnimatePresence>

      {/* Snowflake Modals & Drawers */}
      {meta && (
        <SnowflakeImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          meta={meta}
          onStartImport={handleStartSnowflakeImport}
        />
      )}

      <ImportSuccessModal
        result={importResult}
        onClose={() => setImportResult(null)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
      />

      <UploadHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-400/20 to-indigo-500/20 border border-teal-500/30 text-teal-300">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-display text-white tracking-tight">
                    CSV Data Studio
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-400 font-medium flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" /> Snowflake ETL
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload any CSV dataset for dynamic schema detection, data preview & direct Snowflake table ingestion.
                </p>
              </div>
            </div>
          </div>

          {data && (
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Database className="w-4 h-4 text-cyan-300" />
                <span>Import to Snowflake</span>
              </button>

              <button
                onClick={handleResetDataset}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload Different CSV</span>
              </button>
            </div>
          )}
        </div>

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
            {meta && <DatasetSummary meta={meta} />}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
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
                  className="p-2.5 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset Filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <DataTable
              data={paginatedData}
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              searchTerm={searchTerm}
            />

            <Pagination
              pagination={pagination}
              totalRows={filteredData.length}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
            />

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
      </main>

      {/* Standalone Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 bg-[#060608]/80 text-center text-xs text-gray-500 font-mono">
        <p>Antigravity CSV Studio • Snowflake Ingestion & Data Pipeline</p>
      </footer>
    </div>
  );
}

export default App;
