package com.antigravity.snowflake.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetPreviewResponse {
    private String fileName;
    private long fileSize;
    private long rowCount;
    private int columnCount;
    private List<String> headers;
    private Map<String, String> columnTypes; // Header -> SQL Type (INTEGER, FLOAT, BOOLEAN, DATE, TIMESTAMP, STRING)
    private List<Map<String, String>> previewRows;
}
