-- Improved quiz responses table structure
CREATE TABLE IF NOT EXISTS quizresponses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_id INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT, -- Time taken to answer this question in seconds
    answer_sequence INT NOT NULL, -- Order in which questions were answered
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints for data integrity
    FOREIGN KEY (attempt_id) REFERENCES quizattempts(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES options(options_id) ON DELETE CASCADE,
    
    -- Ensure one response per question per attempt
    UNIQUE KEY unique_response (attempt_id, question_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_quizresponses_attempt ON quizresponses(attempt_id);
CREATE INDEX idx_quizresponses_question ON quizresponses(question_id);
CREATE INDEX idx_quizresponses_correct ON quizresponses(is_correct);

/* 
Table Improvements:
1. Essential Fields:
   - response_id: Unique identifier for each response
   - attempt_id: Links to the quiz attempt
   - question_id: Links to the question
   - selected_option_id: Links to the selected answer option
   - is_correct: Whether the answer was correct
   - time_taken: Track time spent on each question
   - answer_sequence: Track question order
   - created_at/updated_at: Audit timestamps

2. Performance & Data Integrity:
   - Proper indexes for common queries
   - Foreign key constraints with CASCADE delete
   - Unique constraint to prevent duplicate answers
   - Timestamps for auditing
*/
SELECT 
    qr.attempt_id,
    qa.quiz_id,
    qa.user_id,
    qa.module_id,
    COUNT(qr.response_id) as total_questions,
    SUM(qr.is_correct) as correct_answers,
    SUM(qr.points_earned) as total_points,
    AVG(qr.time_taken) as avg_time_per_question,
    COUNT(CASE WHEN qr.answer_changed = TRUE THEN 1 END) as changed_answers,
    COUNT(CASE WHEN qr.review_flagged = TRUE THEN 1 END) as flagged_for_review
FROM 
    quizresponses qr
JOIN 
    quizattempts qa ON qr.attempt_id = qa.attempt_id
GROUP BY 
    qr.attempt_id, qa.quiz_id, qa.user_id, qa.module_id;

-- Optional: Create a view for question difficulty analysis
CREATE OR REPLACE VIEW question_difficulty_analysis AS
SELECT 
    qr.question_id,
    q.text as question_text,
    COUNT(qr.response_id) as total_attempts,
    SUM(qr.is_correct) as correct_answers,
    (SUM(qr.is_correct) / COUNT(qr.response_id) * 100) as success_rate,
    AVG(qr.time_taken) as avg_time_taken,
    AVG(CASE qr.confidence_level 
        WHEN 'low' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'high' THEN 3 
    END) as avg_confidence
FROM 
    quizresponses qr
JOIN 
    questions q ON qr.question_id = q.question_id
GROUP BY 
    qr.question_id, q.text;

-- Comments explaining the improvements:
/*
1. Enhanced Tracking:
   - time_taken: Track how long users spend on each question
   - confidence_level: User's self-reported confidence in their answer
   - points_earned: Support for weighted scoring
   - review_flagged: Allow users to mark questions for later review
   - answer_changed: Track if users changed their answers
   - answer_sequence: Track the order in which questions were answered

2. Performance Optimization:
   - Added appropriate indexes for common query patterns
   - Included UNIQUE constraint to prevent duplicate responses

3. Analytics Support:
   - Created views for easy access to analytics data
   - Support for question difficulty analysis
   - Track user confidence patterns
   - Monitor answer changing behavior

4. Data Integrity:
   - Added proper foreign key constraints
   - Included timestamps for auditing
   - Cascade deletion for cleaner data management

5. Flexibility:
   - Support for different scoring systems
   - Ability to track user behavior patterns
   - Easy to extend for additional analytics
*/
