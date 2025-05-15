-- Sample Module Data for Park Guide Training and Management
-- This script adds sample modules and quiz data for testing the module system

-- 1. Add sample modules if they don't exist
INSERT IGNORE INTO TrainingModules 
(module_name, description, duration, price, is_premium) 
VALUES 
('Park Guide Basics', 'Learn the fundamentals of being an effective park guide, including communication skills, basic safety protocols, and visitor engagement techniques.', 60, 0.00, FALSE),
('Advanced Navigation Techniques', 'Master advanced navigation skills including GPS usage, map reading, and orientation in challenging terrains.', 120, 49.99, TRUE),
('Wildlife Interaction Guidelines', 'Learn proper protocols for wildlife encounters, identification of common species, and best practices for guiding visitors safely around wildlife.', 90, 39.99, TRUE),
('Emergency First Aid', 'Comprehensive emergency first aid training specific to outdoor and remote environments.', 180, 69.99, TRUE),
('Environmental Interpretation', 'Techniques for effective environmental storytelling and interpretation to enhance visitor experience.', 75, 29.99, TRUE),
('Cultural Heritage Preservation', 'Understanding and communicating the cultural significance of natural areas and historical sites within parks.', 60, 35.99, TRUE);

-- 2. Add sample quizzes for each module
INSERT IGNORE INTO Quizzes 
(module_id, title, description, pass_percentage, attempts_allowed, is_certification_quiz) 
VALUES 
(1, 'Park Guide Basics Assessment', 'Test your understanding of basic park guide principles and practices.', 70, 3, FALSE),
(2, 'Navigation Certification', 'Demonstrate your mastery of advanced navigation techniques.', 80, 2, TRUE),
(3, 'Wildlife Safety Assessment', 'Test your knowledge of wildlife safety protocols and species identification.', 75, 3, FALSE),
(4, 'First Aid Certification Exam', 'Comprehensive assessment of emergency first aid skills and knowledge.', 85, 2, TRUE),
(5, 'Interpretation Skills Quiz', 'Evaluate your environmental interpretation and presentation skills.', 70, 3, FALSE),
(6, 'Cultural Heritage Assessment', 'Test your understanding of cultural heritage significance and preservation.', 75, 3, FALSE);

-- 3. Add sample questions for the Park Guide Basics quiz
INSERT IGNORE INTO QuizQuestions 
(quiz_id, question_text, question_type, points, sequence_number) 
VALUES 
-- Park Guide Basics questions (Quiz ID 1)
(1, 'What is the primary role of a park guide?', 'multiple_choice', 1, 1),
(1, 'True or False: Park guides should always approach wildlife to provide a better viewing experience for visitors.', 'true_false', 1, 2),
(1, 'Which of the following should be included in a pre-hike safety briefing?', 'multiple_choice', 1, 3),
(1, 'True or False: It\'s appropriate to share personal opinions about controversial environmental issues during guided tours.', 'true_false', 1, 4),
(1, 'Which communication style is generally most effective for engaging visitors?', 'multiple_choice', 1, 5),

-- Navigation Certification questions (Quiz ID 2)
(2, 'Which of the following is NOT a component of a topographic map?', 'multiple_choice', 1, 1),
(2, 'True or False: When using a compass, magnetic north and true north are always identical.', 'true_false', 1, 2),
(2, 'What should you do if you become disoriented in the wilderness?', 'multiple_choice', 1, 3),
(2, 'True or False: GPS devices never lose signal or battery power in remote areas.', 'true_false', 1, 4),
(2, 'What is triangulation in the context of wilderness navigation?', 'multiple_choice', 1, 5);

-- 4. Add answer options for questions
INSERT IGNORE INTO QuizAnswerOptions 
(question_id, option_text, is_correct, sequence_number) 
VALUES 
-- Question 1 answers (Park Guide Basics)
(1, 'To enforce park rules strictly', FALSE, 1),
(1, 'To provide information and enhance visitor experience', TRUE, 2),
(1, 'To maintain park facilities', FALSE, 3),
(1, 'To conduct scientific research', FALSE, 4),

-- Question 2 answers (Park Guide Basics)
(2, 'True', FALSE, 1),
(2, 'False', TRUE, 2),

-- Question 3 answers (Park Guide Basics)
(3, 'Weather conditions only', FALSE, 1),
(3, 'Trail difficulty and duration', FALSE, 2),
(3, 'Wildlife hazards only', FALSE, 3),
(3, 'All of the above: weather, trail info, and potential hazards', TRUE, 4),

-- Question 4 answers (Park Guide Basics)
(4, 'True', FALSE, 1),
(4, 'False', TRUE, 2),

-- Question 5 answers (Park Guide Basics)
(5, 'Technical and jargon-heavy', FALSE, 1),
(5, 'Conversational with engaging stories and facts', TRUE, 2),
(5, 'Minimal interaction with visitors', FALSE, 3),
(5, 'Formal academic lecture style', FALSE, 4),

-- Question 6 answers (Navigation)
(6, 'Contour lines', FALSE, 1),
(6, 'Scale', FALSE, 2),
(6, 'Social media icons', TRUE, 3),
(6, 'Legend', FALSE, 4),

-- Question 7 answers (Navigation)
(7, 'True', FALSE, 1),
(7, 'False', TRUE, 2),

-- Question 8 answers (Navigation)
(8, 'Continue moving quickly to find a landmark', FALSE, 1),
(8, 'Split up from your group to cover more ground', FALSE, 2),
(8, 'Stop, stay calm, consult your map and compass', TRUE, 3),
(8, 'Immediately call for emergency rescue', FALSE, 4),

-- Question 9 answers (Navigation)
(9, 'True', FALSE, 1),
(9, 'False', TRUE, 2),

-- Question 10 answers (Navigation)
(10, 'Using three landmarks to determine your position', TRUE, 1),
(10, 'Walking in a triangle pattern to find your way back', FALSE, 2),
(10, 'Setting up three campsites to confuse predators', FALSE, 3),
(10, 'Making three distress signals simultaneously', FALSE, 4);
