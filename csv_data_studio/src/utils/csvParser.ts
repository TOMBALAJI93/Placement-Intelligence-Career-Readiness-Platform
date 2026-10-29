import Papa from 'papaparse';
import type { CSVParseResult, CSVRow } from '../types/dataset';
import { computeDatasetStats } from './statsCalculator';

export function isValidCSVFile(file: File): boolean {
  return file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
}

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    if (!isValidCSVFile(file)) {
      resolve({
        success: false,
        error: 'Please upload a valid CSV file.',
      });
      return;
    }

    if (file.size === 0) {
      resolve({
        success: false,
        error: 'CSV file is empty.',
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0 && results.data.length === 0) {
          resolve({
            success: false,
            error: 'Unable to parse CSV.',
          });
          return;
        }

        const data = (results.data as CSVRow[]).filter(row => {
          return Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '');
        });

        if (data.length === 0) {
          resolve({
            success: false,
            error: 'CSV file is empty.',
          });
          return;
        }

        const headers = results.meta.fields || Object.keys(data[0] || {});

        if (headers.length === 0) {
          resolve({
            success: false,
            error: 'Unable to detect columns in CSV.',
          });
          return;
        }

        const meta = computeDatasetStats(file.name, file.size, data, headers);

        resolve({
          success: true,
          data,
          meta,
        });
      },
      error: () => {
        resolve({
          success: false,
          error: 'Unable to parse CSV.',
        });
      },
    });
  });
}

export function parseCSVString(csvString: string, fileName: string): CSVParseResult {
  if (!csvString || csvString.trim() === '') {
    return {
      success: false,
      error: 'CSV file is empty.',
    };
  }

  try {
    const results = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      transformHeader: (header: string) => header.trim(),
    });

    const data = (results.data as CSVRow[]).filter(row => {
      return Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '');
    });

    if (data.length === 0) {
      return {
        success: false,
        error: 'CSV file is empty.',
      };
    }

    const headers = results.meta.fields || Object.keys(data[0] || {});
    const fileSize = new Blob([csvString]).size;
    const meta = computeDatasetStats(fileName, fileSize, data, headers);

    return {
      success: true,
      data,
      meta,
    };
  } catch {
    return {
      success: false,
      error: 'Unable to parse CSV.',
    };
  }
}
