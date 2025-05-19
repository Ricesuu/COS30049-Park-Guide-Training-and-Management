-- Database Fix Script for Park Guide Training and Management
-- This script addresses the following issues:
-- 1. Missing rating columns in the VisitorFeedback table
-- 2. Circular dependency between quizzes and trainingmodules tables
-- 3. Inconsistent primary key naming in quizzes table

-- ========== FIX VISITOR FEEDBACK TABLE ==========
-- Add missing rating columns to the VisitorFeedback table
ALTER TABLE `visitorfeedback` 
ADD COLUMN IF NOT EXISTS `language_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS `knowledge_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS `organization_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS `engagement_rating` INT NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS `safety_rating` INT NOT NULL DEFAULT 3;

-- ========== FIX CIRCULAR DEPENDENCY ==========
-- First, remove foreign key constraint from trainingmodules table to quizzes table
SET @constraintName = (
    SELECT CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_NAME = 'trainingmodules' 
    AND COLUMN_NAME = 'quiz_id' 
    AND REFERENCED_TABLE_NAME = 'quizzes'
    AND TABLE_SCHEMA = DATABASE()
);

SET @dropFKSQL = IF(@constraintName IS NOT NULL, 
                    CONCAT('ALTER TABLE `trainingmodules` DROP FOREIGN KEY ', @constraintName),
                    'SELECT 1');

PREPARE stmt FROM @dropFKSQL;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Determine if quizzes table needs id column adjustment
-- Some versions have quiz_id as primary key, others have id
SET @column_id_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'quizzes' 
    AND COLUMN_NAME = 'id'
    AND TABLE_SCHEMA = DATABASE()
);

-- If id column doesn't exist but quiz_id does, we need to adapt
SET @alter_quizzes_sql = IF(@column_id_exists = 0, 
                          'ALTER TABLE `quizzes` CHANGE COLUMN `quiz_id` `id` INT(11) NOT NULL AUTO_INCREMENT',
                          'SELECT 1');

PREPARE stmt FROM @alter_quizzes_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sure id is the primary key on quizzes table
ALTER TABLE `quizzes` ADD PRIMARY KEY IF NOT EXISTS (`id`);

-- Now update the foreign key in trainingmodules to reference the correct column
ALTER TABLE `trainingmodules` 
ADD CONSTRAINT `fk_trainingmodules_quizzes` 
FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE SET NULL;

-- ========== FIX DATA INCONSISTENCY ISSUES ==========
-- Update column names to match case sensitivity across the database
-- This ensures the API can properly access the data

-- Update any module_id references in quizzes if needed
SET @module_id_in_quizzes = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'quizzes' 
    AND COLUMN_NAME = 'module_id'
    AND TABLE_SCHEMA = DATABASE()
);

-- If module_id exists in quizzes table, disable foreign keys temporarily to prevent errors
SET @disable_fk = IF(@module_id_in_quizzes > 0, 'SET FOREIGN_KEY_CHECKS = 0', 'SELECT 1');
PREPARE stmt FROM @disable_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Run the fix only if module_id exists
SET @fix_module_id_sql = IF(@module_id_in_quizzes > 0,
                            'ALTER TABLE `quizzes` DROP COLUMN `module_id`',
                            'SELECT 1');

PREPARE stmt FROM @fix_module_id_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ========== COMPLETION MESSAGE ==========
SELECT 'Database fix script completed successfully' AS Status;
