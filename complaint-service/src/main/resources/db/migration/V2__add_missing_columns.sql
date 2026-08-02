-- Add columns missing from V1 to complaints table
-- These columns were already added manually; using stored procedures to make this idempotent
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

CREATE PROCEDURE AddColumnIfNotExists()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='complaints' AND COLUMN_NAME='area') THEN
        ALTER TABLE complaints ADD COLUMN area VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='complaints' AND COLUMN_NAME='district') THEN
        ALTER TABLE complaints ADD COLUMN district VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='complaints' AND COLUMN_NAME='assigned_department_id') THEN
        ALTER TABLE complaints ADD COLUMN assigned_department_id BIGINT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='complaints' AND COLUMN_NAME='assigned_officer_id') THEN
        ALTER TABLE complaints ADD COLUMN assigned_officer_id BIGINT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='complaints' AND COLUMN_NAME='current_hierarchy_level') THEN
        ALTER TABLE complaints ADD COLUMN current_hierarchy_level VARCHAR(50);
    END IF;
END;

CALL AddColumnIfNotExists();
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- Create internal_complaints table if not exists
CREATE TABLE IF NOT EXISTS internal_complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filed_by_user_id BIGINT NOT NULL,
    filed_by_role VARCHAR(50) NOT NULL,
    assigned_to_user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
