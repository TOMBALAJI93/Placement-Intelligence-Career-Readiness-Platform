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
public class ImportRequest {
    private String fileName;
    private String targetTableName;
    private String uploadedBy;
    private boolean createTableIfNotExists;
    private List<String> headers;
    private Map<String, String> columnTypes;
    private List<Map<String, String>> rows;
    private String rawCsvContent;
}
