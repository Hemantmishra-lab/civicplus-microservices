package com.hemant.civicplus.complaintservice.application;

import org.springframework.stereotype.Component;

@Component
public class CacheKeyGenerator {

    /**
     * Generates a deterministic Redis key based on search and pagination parameters.
     * Example Output: civic:issues:search:dept_3:area_downtown:status_OPEN:p_0:s_10
     */
    public String generateSearchKey(String status, String department, String area, int page, int size) {
        StringBuilder keyBuilder = new StringBuilder("civic:issues:search");
        
        if (department != null && !department.isEmpty()) {
            keyBuilder.append(":dept_").append(department);
        } else {
            keyBuilder.append(":dept_all");
        }
        
        if (area != null && !area.isEmpty()) {
            keyBuilder.append(":area_").append(area.replace(" ", "_"));
        } else {
            keyBuilder.append(":area_all");
        }
        
        if (status != null && !status.isEmpty()) {
            keyBuilder.append(":status_").append(status.toUpperCase());
        } else {
            keyBuilder.append(":status_all");
        }
        
        keyBuilder.append(":p_").append(page);
        keyBuilder.append(":s_").append(size);
        
        return keyBuilder.toString();
    }

    /**
     * Generates a deterministic Redis key for fetching assigned complaints.
     * Example Output: civic:issues:assigned:123
     */
    public String generateAssignedKey(Long officerId) {
        return "civic:issues:assigned:" + officerId;
    }

    public String generateCitizenKey(Long citizenId) {
        return "civic:issues:citizen:" + citizenId;
    }

    public String generateComplaintIdKey(Long id) {
        return "civic:issues:id:" + id;
    }

    public String generateAllKey() {
        return "civic:issues:all";
    }
}
