-- Make first_name and last_name nullable so profile auto-creation works without requiring user input
ALTER TABLE user_profiles MODIFY COLUMN first_name VARCHAR(100) NULL;
ALTER TABLE user_profiles MODIFY COLUMN last_name VARCHAR(100) NULL;
