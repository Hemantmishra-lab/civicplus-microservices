package com.hemant.civicplus.mediaservice.controller;

import com.hemant.civicplus.mediaservice.application.MediaService;
import com.hemant.civicplus.mediaservice.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = mediaService.uploadFile(file);
        String downloadUrl = "/api/v1/media/download/" + fileName;
        return ResponseEntity.ok(
                UploadResponse.builder()
                        .fileName(fileName)
                        .downloadUrl(downloadUrl)
                        .build()
        );
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileName) {
        InputStream is = mediaService.downloadFile(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(is));
    }
}
