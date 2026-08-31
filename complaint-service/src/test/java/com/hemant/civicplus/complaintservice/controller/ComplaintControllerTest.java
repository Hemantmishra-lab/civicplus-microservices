package com.hemant.civicplus.complaintservice.controller;

import com.hemant.civicplus.complaintservice.application.ComplaintService;
import com.hemant.civicplus.complaintservice.dto.ComplaintResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ComplaintControllerTest {

    @Mock
    private ComplaintService complaintService;

    @InjectMocks
    private ComplaintController complaintController;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
        closeable.close();
    }

    @Test
    void testGetAssignedComplaints() {
        // Arrange
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);

        // Set up user identification details
        when(authentication.getName()).thenReturn("100");
        when(authentication.getPrincipal()).thenReturn(100L);

        // FIX: Mock authorities/roles so lines like authentication.getAuthorities().iterator().next() don't fail
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getAuthorities()).thenAnswer(invocation -> authorities);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        ComplaintResponse response = ComplaintResponse.builder()
                .id(1L)
                .title("Assigned Complaint")
                .assignedTo(100L)
                .build();

        when(complaintService.getAssignedComplaints(anyLong())).thenReturn(Collections.singletonList(response));

        // Act
        ResponseEntity<List<ComplaintResponse>> result = complaintController.getAssignedComplaints();

        // Assert
        assertEquals(200, result.getStatusCode().value());
        List<ComplaintResponse> body = Objects.requireNonNull(result.getBody());
        assertEquals(1, body.size());
        assertEquals("Assigned Complaint", body.get(0).getTitle());
    }
}
