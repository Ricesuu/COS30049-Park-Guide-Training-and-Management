-- Simple Manual Fix for phpMyAdmin
-- Park Guide Training and Management Database Fix
-- Copy and paste this entire script into phpMyAdmin SQL tab and execute

-- 1. Fix VisitorFeedback table by adding missing rating columns
ALTER TABLE `visitorfeedback` 
ADD COLUMN `language_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN `knowledge_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN `organization_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN `engagement_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN `safety_rating` INT NOT NULL DEFAULT 3;

-- 2. Fix TrainingModules foreign key reference to Quizzes table
-- First, drop the existing foreign key constraint (if it exists)
-- The script will automatically find and drop the constraint

-- Find foreign key constraint name
SELECT CONSTRAINT_NAME INTO @fk_name
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'trainingmodules'
AND REFERENCED_TABLE_NAME = 'quizzes'
AND TABLE_SCHEMA = DATABASE();

-- Prepare DROP FOREIGN KEY statement (only if constraint exists)
SET @sql = IF(@fk_name IS NOT NULL, 
              CONCAT('ALTER TABLE `trainingmodules` DROP FOREIGN KEY ', @fk_name),
              'SELECT 1');

-- Execute the prepared statement
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Fix quizzes table to ensure it has id as the primary key column
-- Check if we need to rename quiz_id to id
SELECT COUNT(*) INTO @has_id 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'quizzes'
AND COLUMN_NAME = 'id'
AND TABLE_SCHEMA = DATABASE();

SELECT COUNT(*) INTO @has_quiz_id
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'quizzes'
AND COLUMN_NAME = 'quiz_id'
AND TABLE_SCHEMA = DATABASE();

-- Create or rename column as needed
SET @column_fix_sql = CASE
    WHEN @has_id > 0 THEN 'SELECT 1' -- id exists, do nothing
    WHEN @has_quiz_id > 0 THEN 'ALTER TABLE `quizzes` CHANGE COLUMN `quiz_id` `id` INT(11) NOT NULL AUTO_INCREMENT'
    ELSE 'ALTER TABLE `quizzes` ADD COLUMN `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY'
END;

-- Execute the column fix
PREPARE stmt FROM @column_fix_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Set the primary key for the quizzes table
-- Note: This is safe to run even if id is already the primary key
SET @pk_sql = IF(@has_id = 0, 'ALTER TABLE `quizzes` ADD PRIMARY KEY (`id`)', 'SELECT 1');
PREPARE stmt FROM @pk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Re-add the foreign key constraint using the correct column name
ALTER TABLE `trainingmodules`
ADD CONSTRAINT `fk_trainingmodules_quizzes`
FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE SET NULL;

-- 6. Success message
SELECT 'Database fix completed successfully!' AS Result;
