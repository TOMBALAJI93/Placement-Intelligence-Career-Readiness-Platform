package com.antigravity.snowflake.controller;

import com.antigravity.snowflake.dto.DatasetPreviewResponse;
import com.antigravity.snowflake.dto.ImportRequest;
import com.antigravity.snowflake.dto.ImportResultResponse;
import com.antigravity.snowflake.model.UploadHistory;
import com.antigravity.snowflake.repository.UploadHistoryRepository;
import com.antigravity.snowflake.service.CsvParsingService;
import com.antigravity.snowflake.service.SnowflakeIngestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class IngestionController {

    private static final Logger log = LoggerFactory.getLogger(IngestionController.class);

    private final CsvParsingService csvParsingService;
    private final SnowflakeIngestionService snowflakeIngestionService;
    private final UploadHistoryRepository uploadHistoryRepository;

    public IngestionController(CsvParsingService csvParsingService,
                               SnowflakeIngestionService snowflakeIngestionService,
                               UploadHistoryRepository uploadHistoryRepository) {
        this.csvParsingService = csvParsingService;
        this.snowflakeIngestionService = snowflakeIngestionService;
        this.uploadHistoryRepository = uploadHistoryRepository;
    }

    /**
     * POST /api/upload
     * Accepts a MultipartFile, parses header schema and data types, and returns dataset preview metadata.
     */
    @PostMapping("/upload")
    public ResponseEntity<DatasetPreviewResponse> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        log.info("Received request POST /api/upload for file: {}", file != null ? file.getOriginalFilename() : "null");
        DatasetPreviewResponse response = csvParsingService.parseAndPreview(file);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/import
     * Imports previewed CSV into Snowflake (creates table automatically if needed, executes batch inserts, verifies table).
     */
    @PostMapping("/import")
    public ResponseEntity<ImportResultResponse> importDataset(@RequestBody ImportRequest request) throws Exception {
        log.info("Received request POST /api/import for file: {} -> target table: {}", request.getFileName(), request.getTargetTableName());

        if ((request.getRows() == null || request.getRows().isEmpty()) && request.getRawCsvContent() != null) {
            DatasetPreviewResponse preview = csvParsingService.parseContent(
                    request.getRawCsvContent(),
                    request.getFileName(),
                    0
            );
            request.setHeaders(preview.getHeaders());
            request.setColumnTypes(preview.getColumnTypes());
            request.setRows(preview.getPreviewRows());
        }

        ImportResultResponse result = snowflakeIngestionService.processImport(request);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.internalServerError().body(result);
        }
    }

    /**
     * GET /api/import/history
     * Returns uploaded datasets history logs.
     */
    @GetMapping({"/import/history", "/datasets"})
    public ResponseEntity<List<UploadHistory>> getImportHistory() {
        log.info("Received request GET /api/import/history");
        return ResponseEntity.ok(uploadHistoryRepository.findAllByOrderByUploadDateDesc());
    }

    /**
     * GET /api/datasets/{id}
     * Returns specific uploaded dataset history record.
     */
    @GetMapping("/datasets/{id}")
    public ResponseEntity<UploadHistory> getDatasetById(@PathVariable("id") Long id) {
        return uploadHistoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
