package com.uav.iotbackend.controller;

import com.uav.iotbackend.dto.ReadingRequest;
import com.uav.iotbackend.dto.ReadingResponse;
import com.uav.iotbackend.exception.BadRequestException;
import com.uav.iotbackend.exception.NotFoundException;
import com.uav.iotbackend.service.ReadingService;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/readings")
@RequiredArgsConstructor
public class ReadingController {

    private final ReadingService readingService;
    private final Validator validator;

    /** Nhận 1 bản ghi đo từ gateway */
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody ReadingRequest req) {
        var result = readingService.save(req);
        HttpStatus status = result.duplicated() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(Map.of(
                "status", result.duplicated() ? "duplicate" : "created",
                "id", result.reading().getId(),
                "measurementId", result.reading().getMeasurementId()));
    }

    /** Nhận nhiều bản ghi 1 lần (đồng bộ dữ liệu offline). Bản lỗi không làm hỏng cả lô. */
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> createBatch(@RequestBody List<ReadingRequest> items) {
        int created = 0, duplicated = 0;
        List<Map<String, String>> failed = new ArrayList<>();

        for (ReadingRequest item : items) {
            var violations = validator.validate(item);
            if (!violations.isEmpty()) {
                var v = violations.iterator().next();
                failed.add(Map.of("measurementId", String.valueOf(item.measurementId()),
                        "error", v.getPropertyPath() + ": " + v.getMessage()));
                continue;
            }
            try {
                if (readingService.save(item).duplicated()) duplicated++;
                else created++;
            } catch (NotFoundException | BadRequestException e) {
                failed.add(Map.of("measurementId", item.measurementId(), "error", e.getMessage()));
            }
        }
        return ResponseEntity.ok(Map.of(
                "total", items.size(), "created", created,
                "duplicated", duplicated, "failed", failed));
    }

    /** Xem lại dữ liệu đã lưu */
    @GetMapping
    public List<ReadingResponse> list(@RequestParam(required = false) String deviceCode,
                                      @RequestParam(defaultValue = "50") int limit) {
        return readingService.list(deviceCode, limit).stream().map(ReadingResponse::from).toList();
    }
} 