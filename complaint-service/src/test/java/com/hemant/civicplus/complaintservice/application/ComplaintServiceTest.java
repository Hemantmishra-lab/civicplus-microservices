package com.hemant.civicplus.complaintservice.application;

import com.hemant.civicplus.complaintservice.domain.Complaint;
import com.hemant.civicplus.complaintservice.domain.Priority;
import com.hemant.civicplus.complaintservice.domain.ComplaintStatus;
import com.hemant.civicplus.complaintservice.dto.ComplaintResponse;
import com.hemant.civicplus.complaintservice.repository.ComplaintRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class ComplaintServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ComplaintService complaintService;

    @Mock
    private CacheKeyGenerator cacheKeyGenerator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAssignedComplaints() {
        // Arrange
        Long officerId = 100L;
        Complaint complaint = Complaint.builder()
                .id(1L)
                .title("Test Complaint")
                .description("Test Description")
                .status(ComplaintStatus.SUBMITTED)
                .priority(Priority.MEDIUM)
                .assignedTo(officerId)
                .images(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        when(complaintRepository.findByAssignedTo(officerId)).thenReturn(Collections.singletonList(complaint));

        // Act
        List<ComplaintResponse> responses = complaintService.getAssignedComplaints(officerId);

        // Assert
        assertEquals(1, responses.size());
        assertEquals("Test Complaint", responses.get(0).getTitle());
        assertEquals(officerId, responses.get(0).getAssignedTo());
    }
}
