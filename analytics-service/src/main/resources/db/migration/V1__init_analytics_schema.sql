CREATE TABLE complaint_stats (
    status VARCHAR(50) PRIMARY KEY,
    status_count BIGINT DEFAULT 0
);

-- Seed initial status variables
INSERT INTO complaint_stats (status, status_count) VALUES 
('SUBMITTED', 0),
('ASSIGNED', 0),
('IN_PROGRESS', 0),
('RESOLVED', 0),
('REJECTED', 0);
