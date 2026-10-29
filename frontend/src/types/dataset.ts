export type ColumnDataType = 'number' | 'string' | 'boolean' | 'date';

export type CSVRow = Record<string, any>;

export interface ColumnMeta {
  name: string;
  type: ColumnDataType;
  missingCount: number;
  uniqueCount: number;
  isVisible: boolean;
  width?: number;
}

export interface DatasetMeta {
  fileName: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string;
  rowCount: number;
  columnCount: number;
  uploadTime: string;
  missingValuesCount: number;
  duplicateRowsCount: number;
  estimatedMemory: string;
  columns: string[];
  columnMetadata: ColumnMeta[];
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface CSVParseResult {
  success: boolean;
  data?: CSVRow[];
  meta?: DatasetMeta;
  error?: string;
}

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  category: string;
  rowCount: number;
  colCount: number;
  csvString: string;
}
