export interface UploadHistoryItem {
  id: number;
  datasetName: string;
  snowflakeTableName: string;
  uploadedBy: string;
  uploadDate: string;
  rowsImported: number;
  columnsImported: number;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  durationMs: number;
  verified?: boolean;
  errorMessage?: string;
}

export interface ImportTargetConfig {
  targetTableName: string;
  warehouse: string;
  database: string;
  schema: string;
  role: string;
  createTableIfNotExists: boolean;
}

export interface ImportResponse {
  database: string;
  schema: string;
  table: string;
  rowsImported: number;
  connectionStatus: string;
  verified: boolean;
  success?: boolean;
  columnsImported?: number;
  verificationCount?: number;
  executionTimeMs?: number;
  status?: 'SUCCESS' | 'FAILED';
  message?: string;
  historyId?: number;
  uploadedBy?: string;
  uploadDate?: string;
}
