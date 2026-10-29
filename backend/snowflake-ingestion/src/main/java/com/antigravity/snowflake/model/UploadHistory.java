package com.antigravity.snowflake.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "upload_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String datasetName;

    @Column(nullable = false)
    private String snowflakeTableName;

    @Column(nullable = false)
    private String uploadedBy;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    private long rowsImported;

    private int columnsImported;

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED, IN_PROGRESS

    private long durationMs;

    @Column(length = 2000)
    private String errorMessage;
}
