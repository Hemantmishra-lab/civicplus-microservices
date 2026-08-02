package com.hemant.civicplus.complaintservice.controller;

import com.hemant.civicplus.complaintservice.application.ComplaintService;
import com.hemant.civicplus.complaintservice.dto.ComplaintResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ComplaintControllerTest {

    @Mock
    private ComplaintService complaintService;

    @InjectMocks
    private ComplaintController complaintController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAssignedComplaints() {
        // Arrange
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);

        when(authentication.getName()).thenReturn("100");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        ComplaintResponse response = ComplaintResponse.builder()
                .id(1L)
                .title("Assigned Complaint")
                .assignedTo(100L)
                .build();
        when(complaintService.getAssignedComplaints(100L)).thenReturn(Collections.singletonList(response));

        // Act
        ResponseEntity<List<ComplaintResponse>> result = complaintController.getAssignedComplaints();

        // Assert
        assertEquals(200, result.getStatusCode().value());
        List<ComplaintResponse> body = java.util.Objects.requireNonNull(result.getBody());
        assertEquals(1, body.size());
        assertEquals("Assigned Complaint", body.get(0).getTitle());
    }
}
