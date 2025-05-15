-- Quiz Database Structure for the Park Guide Training and Management System
-- Integrates with the module purchase system

-- This table will store quiz definitions that are tied to training modules
CREATE TABLE IF NOT EXISTS Quizzes (
  quiz_id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pass_percentage INT NOT NULL DEFAULT 70, -- Required percentage to pass
  time_limit_minutes INT NULL, -- Time limit in minutes (NULL for unlimited)
  attempts_allowed INT NOT NULL DEFAULT 3, -- Number of attempts allowed
  is_certification_quiz BOOLEAN DEFAULT FALSE, -- Whether passing this quiz grants certification
  is_module_completion_quiz BOOLEAN DEFAULT FALSE, -- Whether this quiz must be passed to complete the module
  sequence_number INT DEFAULT 1, -- For modules with multiple quizzes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id) ON DELETE CASCADE
);

-- This table stores individual questions for each quiz
CREATE TABLE IF NOT EXISTS QuizQuestions (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('multiple_choice', 'true_false', 'short_answer') NOT NULL,
  points INT NOT NULL DEFAULT 1, -- Points this question is worth
  explanation TEXT NULL, -- Optional explanation shown after answering
  sequence_number INT NOT NULL, -- Order of questions in the quiz
  difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- This table stores answer options for multiple choice and true/false questions
CREATE TABLE IF NOT EXISTS QuizAnswerOptions (
  option_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  sequence_number INT NOT NULL, -- Order of options for a question
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id) ON DELETE CASCADE
);

-- This table stores correct answers for short answer questions (with multiple possible correct answers)
CREATE TABLE IF NOT EXISTS QuizShortAnswers (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  answer_text TEXT NOT NULL,
  is_case_sensitive BOOLEAN NOT NULL DEFAULT FALSE, -- Whether the answer is case sensitive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id) ON DELETE CASCADE
);

-- This table tracks quiz attempts by park guides
CREATE TABLE IF NOT EXISTS QuizAttempts (
  attempt_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  user_id INT NOT NULL,
  guide_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL, -- NULL if not completed
  score INT NULL, -- NULL if not completed
  percentage DECIMAL(5,2) NULL, -- Score as percentage
  passed BOOLEAN NULL, -- NULL if not completed
  attempt_number INT NOT NULL, -- Which attempt this is (1st, 2nd, etc.)
  time_taken_seconds INT NULL, -- How long the quiz took in seconds
  ip_address VARCHAR(45) NULL, -- For security tracking
  device_info VARCHAR(255) NULL, -- For device tracking
  FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id)
);

-- This table stores individual answers for each question in a quiz attempt
CREATE TABLE IF NOT EXISTS QuizResponses (
  response_id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT NULL, -- For multiple choice/true-false questions
  text_response TEXT NULL, -- For short answer questions
  is_correct BOOLEAN NULL, -- Whether the answer was correct
  points_awarded INT NULL, -- Points awarded for this response
  response_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the response was submitted
  time_taken_seconds INT NULL, -- How long this specific question took
  FOREIGN KEY (attempt_id) REFERENCES QuizAttempts(attempt_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id),
  FOREIGN KEY (selected_option_id) REFERENCES QuizAnswerOptions(option_id)
);

-- This view combines quiz attempts with scores for easy reporting
CREATE VIEW QuizResults AS
SELECT 
  qa.attempt_id,
  qa.quiz_id,
  q.title AS quiz_title,
  qa.user_id,
  qa.guide_id,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  qa.attempt_number,  qa.start_time,
  qa.end_time,
  qa.score,
  qa.percentage,
  qa.passed,
  q.pass_percentage,
  qa.time_taken_seconds,
  q.module_id,
  tm.module_name,
  q.is_certification_quiz,
  q.is_module_completion_quiz
FROM QuizAttempts qa
JOIN Quizzes q ON qa.quiz_id = q.quiz_id
JOIN TrainingModules tm ON q.module_id = tm.module_id
JOIN Users u ON qa.user_id = u.user_id;

-- View to track module completion status including quiz requirements
CREATE VIEW ModuleCompletionStatus AS
SELECT
  mp.user_id,
  mp.module_id,
  tm.module_name,
  mp.status AS purchase_status,
  mp.completion_percentage,
  CASE
    WHEN completion_quiz.quiz_id IS NULL THEN TRUE -- No completion quiz required
    WHEN passed_attempt.attempt_id IS NOT NULL THEN TRUE -- Has passed the completion quiz
    ELSE FALSE -- Has not passed the required quiz
  END AS module_requirements_completed,
  CASE
    WHEN cert_quiz.quiz_id IS NULL THEN FALSE -- No certification quiz available
    WHEN cert_passed.attempt_id IS NOT NULL THEN TRUE -- Has passed certification quiz
    ELSE FALSE -- Has not passed certification quiz
  END AS certification_eligible
FROM ModulePurchases mp
JOIN TrainingModules tm ON mp.module_id = tm.module_id
LEFT JOIN Quizzes completion_quiz ON tm.module_id = completion_quiz.module_id AND completion_quiz.is_module_completion_quiz = TRUE
LEFT JOIN (
  SELECT qa.quiz_id, MAX(qa.attempt_id) as attempt_id, qa.user_id
  FROM QuizAttempts qa
  WHERE qa.passed = TRUE
  GROUP BY qa.quiz_id, qa.user_id
) passed_attempt ON completion_quiz.quiz_id = passed_attempt.quiz_id AND mp.user_id = passed_attempt.user_id
LEFT JOIN Quizzes cert_quiz ON tm.module_id = cert_quiz.module_id AND cert_quiz.is_certification_quiz = TRUE
LEFT JOIN (
  SELECT qa.quiz_id, MAX(qa.attempt_id) as attempt_id, qa.user_id
  FROM QuizAttempts qa
  WHERE qa.passed = TRUE
  GROUP BY qa.quiz_id, qa.user_id
) cert_passed ON cert_quiz.quiz_id = cert_passed.quiz_id AND mp.user_id = cert_passed.user_id
WHERE mp.status = 'active' AND mp.is_active = TRUE;

-- Trigger to update GuideTrainingProgress when a quiz is passed
DELIMITER //
CREATE TRIGGER after_quiz_completion
AFTER UPDATE ON QuizAttempts
FOR EACH ROW
BEGIN
  DECLARE module_id_val INT;
  DECLARE guide_progress_id INT;
  DECLARE is_completion_quiz BOOLEAN;
  
  IF NEW.passed = TRUE AND (OLD.passed IS NULL OR OLD.passed = FALSE) THEN
    -- Get the module_id and check if this is a completion quiz
    SELECT q.module_id, q.is_module_completion_quiz INTO module_id_val, is_completion_quiz 
    FROM Quizzes q WHERE q.quiz_id = NEW.quiz_id;
    
    -- If this is a completion quiz, update the module progress
    IF is_completion_quiz THEN
      -- Check if there's an existing progress record
      SELECT progress_id INTO guide_progress_id 
      FROM GuideTrainingProgress 
      WHERE guide_id = NEW.guide_id AND module_id = module_id_val;
      
      IF guide_progress_id IS NOT NULL THEN
        -- Update existing progress record
        UPDATE GuideTrainingProgress 
        SET status = 'Completed', completion_date = CURDATE()
        WHERE progress_id = guide_progress_id;
        
        -- Also update the ModulePurchases completion percentage
        UPDATE ModulePurchases
        SET completion_percentage = 100.00
        WHERE user_id = NEW.user_id AND module_id = module_id_val;
      ELSE
        -- Create new progress record
        INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date)
        VALUES (NEW.guide_id, module_id_val, 'Completed', CURDATE());
        
        -- Also update the ModulePurchases completion percentage
        UPDATE ModulePurchases
        SET completion_percentage = 100.00
        WHERE user_id = NEW.user_id AND module_id = module_id_val;
      END IF;
      
      -- Log the completion in audit log
      INSERT INTO SystemAuditLog (
        action_type,
        table_name,
        record_id,
        action_description,
        performed_by
      ) VALUES (
        'MODULE_COMPLETED',
        'GuideTrainingProgress',
        guide_progress_id,
        CONCAT('Module ', module_id_val, ' completed by guide ', NEW.guide_id, ' after passing quiz ', NEW.quiz_id),
        NEW.user_id
      );
    END IF;
    
    -- If this is a certification quiz, trigger the certification process
    IF (SELECT is_certification_quiz FROM Quizzes WHERE quiz_id = NEW.quiz_id) THEN
      -- Add certification record with appropriate dates
      INSERT INTO Certifications (
        guide_id,
        module_id,
        issued_date,
        expiry_date
      ) VALUES (
        NEW.guide_id,
        module_id_val,
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 2 YEAR) -- 2-year certification validity
      ) ON DUPLICATE KEY UPDATE 
        issued_date = CURDATE(),
        expiry_date = DATE_ADD(CURDATE(), INTERVAL 2 YEAR);
      
      -- Log the certification in audit log
      INSERT INTO SystemAuditLog (
        action_type,
        table_name,
        record_id,
        action_description,
        performed_by
      ) VALUES (
        'CERTIFICATION_ISSUED',
        'Certifications',
        LAST_INSERT_ID(),
        CONCAT('Certification for module ', module_id_val, ' issued to guide ', NEW.guide_id, ' after passing quiz ', NEW.quiz_id),
        NEW.user_id
      );
    END IF;
  END IF;
END //
DELIMITER ;

-- Sample data for quizzes and testing
INSERT INTO Quizzes (module_id, title, description, pass_percentage, time_limit_minutes, attempts_allowed, is_certification_quiz, is_module_completion_quiz)
VALUES
-- Basic Park Safety module quizzes
((SELECT module_id FROM TrainingModules WHERE module_name = 'Basic Park Safety'), 
 'Basic Park Safety Assessment', 
 'Test your knowledge of fundamental park safety procedures', 
 70, 30, 3, FALSE, TRUE),

-- Emergency First Aid quizzes
((SELECT module_id FROM TrainingModules WHERE module_name = 'Emergency First Aid'), 
 'Emergency First Aid Mid-Module Quiz', 
 'Check your understanding of emergency first aid concepts covered so far', 
 60, 20, 3, FALSE, FALSE),
 
((SELECT module_id FROM TrainingModules WHERE module_name = 'Emergency First Aid'), 
 'Emergency First Aid Certification Exam', 
 'Final certification exam for the Emergency First Aid module', 
 80, 60, 2, TRUE, TRUE);

-- Sample questions for Basic Park Safety quiz
INSERT INTO QuizQuestions (quiz_id, question_text, question_type, points, explanation, sequence_number, difficulty_level)
VALUES
((SELECT quiz_id FROM Quizzes WHERE title = 'Basic Park Safety Assessment'), 
 'What is the first step in responding to a lost visitor report?', 
 'multiple_choice', 2, 'Always collect information before taking action to ensure an effective response.', 1, 'easy'),

((SELECT quiz_id FROM Quizzes WHERE title = 'Basic Park Safety Assessment'), 
 'True or False: It is safe to approach wildlife to take photographs as long as you remain quiet.', 
 'true_false', 1, 'Never approach wildlife - this endangers both the animals and visitors.', 2, 'easy'),

((SELECT quiz_id FROM Quizzes WHERE title = 'Basic Park Safety Assessment'), 
 'List three essential items that should be in a park guide\'s emergency kit.', 
 'short_answer', 3, 'First aid supplies, communication device, and navigation tools are always essential.', 3, 'medium');

-- Sample answer options for multiple choice question
INSERT INTO QuizAnswerOptions (question_id, option_text, is_correct, sequence_number)
VALUES
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step in responding to a lost visitor report?'), 
 'Immediately begin searching the area', FALSE, 1),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step in responding to a lost visitor report?'), 
 'Alert the park rangers only', FALSE, 2),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step in responding to a lost visitor report?'), 
 'Gather information about the missing person and last known location', TRUE, 3),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'What is the first step in responding to a lost visitor report?'), 
 'Close the park to visitors', FALSE, 4);

-- Sample answer options for true/false question
INSERT INTO QuizAnswerOptions (question_id, option_text, is_correct, sequence_number)
VALUES
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'True or False: It is safe to approach wildlife%'), 
 'True', FALSE, 1),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'True or False: It is safe to approach wildlife%'), 
 'False', TRUE, 2);

-- Sample accepted answers for short answer question
INSERT INTO QuizShortAnswers (question_id, answer_text, is_case_sensitive)
VALUES
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'first aid kit', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'map', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'compass', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'GPS', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'whistle', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'flashlight', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'radio', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'water', FALSE),
 
((SELECT question_id FROM QuizQuestions WHERE question_text LIKE 'List three essential items%'), 
 'emergency blanket', FALSE);
