import type { CSVRow, ColumnMeta, ColumnDataType, DatasetMeta } from '../types/dataset';

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function inferColumnType(values: any[]): ColumnDataType {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
  if (nonNullValues.length === 0) return 'string';

  let isNumeric = true;
  let isBoolean = true;
  let isDate = true;

  for (const val of nonNullValues) {
    const str = String(val).trim();

    if (!['true', 'false', '1', '0', 'yes', 'no'].includes(str.toLowerCase())) {
      isBoolean = false;
    }

    if (isNaN(Number(str))) {
      isNumeric = false;
    }

    if (isDate) {
      const dateVal = Date.parse(str);
      if (isNaN(dateVal) || !isNaN(Number(str)) || str.length < 5) {
        isDate = false;
      }
    }
  }

  if (isNumeric) return 'number';
  if (isBoolean) return 'boolean';
  if (isDate) return 'date';
  return 'string';
}

export function computeDatasetStats(
  fileName: string,
  fileSize: number,
  data: CSVRow[],
  headers: string[]
): DatasetMeta {
  const rowCount = data.length;
  const columnCount = headers.length;

  let totalMissing = 0;
  const columnMetadata: ColumnMeta[] = [];

  headers.forEach(header => {
    const colValues = data.map(row => row[header]);
    let missingInCol = 0;
    const uniqueValues = new Set();

    colValues.forEach(val => {
      if (val === null || val === undefined || String(val).trim() === '') {
        missingInCol++;
        totalMissing++;
      } else {
        uniqueValues.add(String(val).trim());
      }
    });

    const colType = inferColumnType(colValues);

    columnMetadata.push({
      name: header,
      type: colType,
      missingCount: missingInCol,
      uniqueCount: uniqueValues.size,
      isVisible: true,
    });
  });

  const rowStrings = new Set<string>();
  let duplicateRowsCount = 0;

  data.forEach(row => {
    const str = JSON.stringify(row);
    if (rowStrings.has(str)) {
      duplicateRowsCount++;
    } else {
      rowStrings.add(str);
    }
  });

  const jsonSize = JSON.stringify(data).length;
  const estimatedMemory = formatBytes(jsonSize);

  return {
    fileName,
    fileSize,
    fileSizeFormatted: formatBytes(fileSize),
    rowCount,
    columnCount,
    uploadTime: 'Just now',
    missingValuesCount: totalMissing,
    duplicateRowsCount,
    estimatedMemory,
    columns: headers,
    columnMetadata,
  };
}
