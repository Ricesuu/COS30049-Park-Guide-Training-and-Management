-- Master SQL script for Park Guide Training and Management
-- This script runs all necessary database setup scripts in the correct order

-- Base database schema
SOURCE database.sql;

-- Module and quiz system
SOURCE simple_module_purchase.sql;
SOURCE simple_quiz_system.sql;

-- Sample data
SOURCE sample_module_data.sql;
SOURCE module_purchase_trigger.sql;

-- Verify setup
SELECT 'Database setup complete!' as message;
SELECT COUNT(*) as module_count FROM TrainingModules;
SELECT COUNT(*) as quiz_count FROM Quizzes;
SELECT COUNT(*) as question_count FROM QuizQuestions;
