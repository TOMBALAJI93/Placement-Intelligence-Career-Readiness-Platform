package com.antigravity.snowflake.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResultResponse {
    private String database;
    private String schema;
    private String table;
    private long rowsImported;
    private String connectionStatus; // "Connected"
    private boolean verified;
    private boolean success;
    private long verificationCount;
    private long executionTimeMs;
    private String status; // SUCCESS, FAILED
    private String message;
    private Long historyId;
    private String uploadedBy;
    private LocalDateTime uploadDate;
}
