package com.antigravity.snowflake.service;

import com.antigravity.snowflake.dto.DatasetPreviewResponse;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CsvParsingService {

    private static final Logger log = LoggerFactory.getLogger(CsvParsingService.class);

    public DatasetPreviewResponse parseAndPreview(MultipartFile file) throws Exception {
        log.info("CSV received: {}", file.getOriginalFilename());

        if (file.isEmpty() || file.getSize() == 0) {
            throw new IllegalArgumentException("Empty CSV file.");
        }

        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
        return parseContent(content, file.getOriginalFilename(), file.getSize());
    }

    public DatasetPreviewResponse parseContent(String csvContent, String fileName, long fileSize) throws Exception {
        if (csvContent == null || csvContent.trim().isEmpty()) {
            throw new IllegalArgumentException("CSV file is empty.");
        }

        CSVParser parser;
        try {
            parser = CSVParser.parse(
                    new StringReader(csvContent),
                    CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setIgnoreHeaderCase(false).setTrim(true).build());
        } catch (Exception e) {
            log.error("CSV parsing failed: Corrupted CSV format", e);
            throw new IllegalArgumentException("Corrupted CSV file: Unable to parse structure.");
        }

        List<String> headers = new ArrayList<>();
        Set<String> headerCheckSet = new HashSet<>();

        Map<String, Integer> headerMap = parser.getHeaderMap();
        if (headerMap == null || headerMap.isEmpty()) {
            throw new IllegalArgumentException("Invalid header: No columns found in CSV header line.");
        }

        for (Map.Entry<String, Integer> entry : headerMap.entrySet()) {
            String h = entry.getKey() != null ? entry.getKey().trim() : "";
            if (h.isBlank()) {
                throw new IllegalArgumentException("Invalid header: Header column name cannot be empty.");
            }
            if (headerCheckSet.contains(h.toLowerCase())) {
                throw new IllegalArgumentException("Duplicate column names detected in CSV header: '" + h + "'");
            }
            headerCheckSet.add(h.toLowerCase());
            headers.add(h);
        }

        List<Map<String, String>> rows = new ArrayList<>();
        Map<String, List<String>> colValuesMap = new HashMap<>();
        headers.forEach(h -> colValuesMap.put(h, new ArrayList<>()));

        for (CSVRecord record : parser) {
            Map<String, String> rowMap = new LinkedHashMap<>();
            for (String header : headers) {
                String val = record.isSet(header) ? record.get(header) : "";
                rowMap.put(header, val);
                colValuesMap.get(header).add(val);
            }
            rows.add(rowMap);
        }

        if (rows.isEmpty()) {
            throw new IllegalArgumentException("CSV file is empty: No data rows found.");
        }

        log.info("CSV parsed: {} headers detected, {} rows read", headers.size(), rows.size());

        Map<String, String> columnTypes = new LinkedHashMap<>();
        for (String header : headers) {
            columnTypes.put(header, inferSqlType(colValuesMap.get(header)));
        }

        List<Map<String, String>> previewRows = rows.subList(0, Math.min(rows.size(), 50));

        return DatasetPreviewResponse.builder()
                .fileName(fileName != null ? fileName : "dataset.csv")
                .fileSize(fileSize > 0 ? fileSize : csvContent.getBytes(StandardCharsets.UTF_8).length)
                .rowCount(rows.size())
                .columnCount(headers.size())
                .headers(headers)
                .columnTypes(columnTypes)
                .previewRows(previewRows)
                .build();
    }

    public String inferSqlType(List<String> values) {
        List<String> nonNulls = values.stream()
                .filter(v -> v != null && !v.trim().isEmpty())
                .toList();

        if (nonNulls.isEmpty()) return "STRING";

        boolean isInt = true;
        boolean isFloat = true;
        boolean isBool = true;
        boolean isDate = true;
        boolean isTimestamp = true;

        for (String v : nonNulls) {
            String str = v.trim();

            // Check boolean
            if (!str.equalsIgnoreCase("true") && !str.equalsIgnoreCase("false") && !str.equals("1") && !str.equals("0")) {
                isBool = false;
            }

            // Check integer
            if (isInt) {
                try {
                    Long.parseLong(str);
                } catch (NumberFormatException e) {
                    isInt = false;
                }
            }

            // Check float
            if (isFloat) {
                try {
                    Double.parseDouble(str);
                } catch (NumberFormatException e) {
                    isFloat = false;
                }
            }

            // Check date (YYYY-MM-DD or MM/DD/YYYY)
            if (isDate) {
                if (!tryParseDate(str)) {
                    isDate = false;
                }
            }

            // Check timestamp
            if (isTimestamp) {
                if (!tryParseTimestamp(str)) {
                    isTimestamp = false;
                }
            }
        }

        if (isInt) return "INTEGER";
        if (isFloat) return "FLOAT";
        if (isBool) return "BOOLEAN";
        if (isDate) return "DATE";
        if (isTimestamp) return "TIMESTAMP";
        return "STRING";
    }

    private boolean tryParseDate(String str) {
        try {
            LocalDate.parse(str);
            return true;
        } catch (Exception e1) {
            try {
                LocalDate.parse(str, DateTimeFormatter.ofPattern("M/d/yyyy"));
                return true;
            } catch (Exception e2) {
                return false;
            }
        }
    }

    private boolean tryParseTimestamp(String str) {
        try {
            LocalDateTime.parse(str.replace(" ", "T"));
            return true;
        } catch (Exception e1) {
            try {
                LocalDateTime.parse(str, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                return true;
            } catch (Exception e2) {
                return false;
            }
        }
    }

    public String sanitizeTableName(String fileName) {
        if (fileName == null || fileName.isBlank()) return "UPLOADED_DATASET";
        String nameWithoutExt = fileName.replaceAll("(?i)\\.csv$", "");
        String sanitized = nameWithoutExt.replaceAll("[^a-zA-Z0-9_]", "_").toUpperCase();
        if (Character.isDigit(sanitized.charAt(0))) {
            sanitized = "TABLE_" + sanitized;
        }
        return sanitized;
    }
}
