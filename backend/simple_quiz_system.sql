-- Basic Quiz System for Park Guide Training and Management
-- Simplified version with just the essential tables

-- 1. Create table for quizzes
CREATE TABLE IF NOT EXISTS Quizzes (
  quiz_id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pass_percentage INT NOT NULL DEFAULT 70,
  attempts_allowed INT NOT NULL DEFAULT 3,
  is_certification_quiz BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id) ON DELETE CASCADE
);

-- 2. Create table for quiz questions
CREATE TABLE IF NOT EXISTS QuizQuestions (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('multiple_choice', 'true_false', 'short_answer') NOT NULL,
  points INT NOT NULL DEFAULT 1,
  sequence_number INT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- 3. Create table for answer options
CREATE TABLE IF NOT EXISTS QuizAnswerOptions (
  option_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  sequence_number INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id) ON DELETE CASCADE
);

-- 4. Create table for quiz attempts
CREATE TABLE IF NOT EXISTS QuizAttempts (
  attempt_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  user_id INT NOT NULL,
  guide_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  score INT NULL,
  passed BOOLEAN NULL,
  attempt_number INT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id)
);

-- 5. Create table for quiz responses
CREATE TABLE IF NOT EXISTS QuizResponses (
  response_id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT NULL,
  text_response TEXT NULL,
  is_correct BOOLEAN NULL,
  points_awarded INT NULL,
  FOREIGN KEY (attempt_id) REFERENCES QuizAttempts(attempt_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id),
  FOREIGN KEY (selected_option_id) REFERENCES QuizAnswerOptions(option_id)
);

-- 6. Simple trigger to update module completion when quiz is passed
DELIMITER //
CREATE TRIGGER after_quiz_completion
AFTER UPDATE ON QuizAttempts
FOR EACH ROW
BEGIN
  DECLARE module_id_val INT;
  
  IF NEW.passed = TRUE AND (OLD.passed IS NULL OR OLD.passed = FALSE) THEN
    -- Get the module_id for this quiz
    SELECT module_id INTO module_id_val FROM Quizzes WHERE quiz_id = NEW.quiz_id;
    
    -- Update module progress
    UPDATE GuideTrainingProgress 
    SET status = 'Completed', completion_date = CURDATE()
    WHERE guide_id = NEW.guide_id AND module_id = module_id_val;
    
    -- If progress record doesn't exist, create it
    IF ROW_COUNT() = 0 THEN
      INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date)
      VALUES (NEW.guide_id, module_id_val, 'Completed', CURDATE());
    END IF;
    
    -- Also update completion percentage in ModulePurchases
    UPDATE ModulePurchases mp
    JOIN Users u ON u.user_id = mp.user_id
    JOIN ParkGuides pg ON pg.user_id = u.user_id
    SET mp.completion_percentage = 100.00
    WHERE pg.guide_id = NEW.guide_id AND mp.module_id = module_id_val;
  END IF;
END //
DELIMITER ;

-- 7. Sample quiz data for Basic Park Safety
INSERT INTO Quizzes (module_id, title, description, pass_percentage)
VALUES (
  (SELECT module_id FROM TrainingModules WHERE module_name = 'Basic Park Safety'),
  'Basic Park Safety Assessment',
  'Test your knowledge of fundamental park safety procedures',
  70
);

-- 8. Sample questions 
INSERT INTO QuizQuestions (quiz_id, question_text, question_type, points, sequence_number)
VALUES
((SELECT quiz_id FROM Quizzes WHERE title = 'Basic Park Safety Assessment'),
 'What is the first step in responding to a lost visitor report?',
 'multiple_choice', 
 2,
 1),
 
((SELECT quiz_id FROM Quizzes WHERE title = 'Basic Park Safety Assessment'),
 'True or False: It is safe to approach wildlife to take photographs as long as you remain quiet.',
 'true_false',
 1,
 2);

-- 9. Sample answer options
INSERT INTO QuizAnswerOptions (question_id, option_text, is_correct, sequence_number)
VALUES
-- Options for the first question
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step%'),
 'Immediately begin searching the area',
 FALSE,
 1),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step%'),
 'Alert the park rangers only',
 FALSE,
 2),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step%'),
 'Gather information about the missing person and last known location',
 TRUE,
 3),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step%'),
 'Close the park to visitors',
 FALSE,
 4),

-- Options for the second question
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'True or False%'),
 'True',
 FALSE,
 1),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'True or False%'),
 'False',
 TRUE,
 2);
