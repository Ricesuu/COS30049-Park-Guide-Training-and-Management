CREATE DATABASE IF NOT EXISTS park_guide_management;
USE park_guide_management;

-- ==============================================
-- Table: User
CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE, -- Firebase UID
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'park_guide') NOT NULL DEFAULT 'park_guide',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  failed_attempts INT DEFAULT 0,
  last_failed_attempt DATETIME DEFAULT NULL,
  locked_until DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- Table: Park Guides
CREATE TABLE IF NOT EXISTS ParkGuides (
  guide_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  certification_status ENUM('pending', 'certified', 'expired') DEFAULT 'pending',
  license_expiry_date DATE NULL, 
  assigned_park VARCHAR(255) NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ==============================================
-- Table: Questions Table
CREATE TABLE IF NOT EXISTS quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ==============================================
-- Table: Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quiz_id INT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'multiple-choice', 'true-false', etc.
  text TEXT NOT NULL,
  explanation TEXT,
  points INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);


-- ==============================================
-- Table: Options Table for Question Choices
CREATE TABLE IF NOT EXISTS options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);


-- ==============================================
-- Table: Training Modules Table
CREATE TABLE IF NOT EXISTS TrainingModules (
  module_id INT AUTO_INCREMENT PRIMARY KEY,
  module_code VARCHAR(10) NOT NULL UNIQUE,  
  module_name VARCHAR(255) NOT NULL,      
  description TEXT,            
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL,  
  aspect ENUM('language', 'knowledge', 'organization', 'engagement', 'safety') NOT NULL, 
  video_url VARCHAR(255),
  course_content LONGTEXT,
  quiz_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL
);

-- ==============================================
-- Table: Guide Training Progress Table
CREATE TABLE IF NOT EXISTS GuideTrainingProgress (
  progress_id INT AUTO_INCREMENT PRIMARY KEY,
  guide_id INT NOT NULL,
  module_id INT NOT NULL,
  status ENUM('in progress', 'Completed') DEFAULT 'in progress',
  completion_date DATE NULL,
  FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id),
  FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id)
);

-- ==============================================
-- Table: Multi-License Training Exemptions Table
CREATE TABLE IF NOT EXISTS MultiLicenseTrainingExemptions (
  exemption_id INT AUTO_INCREMENT PRIMARY KEY,
  guide_id INT NOT NULL,
  training_id INT NOT NULL,
  exempted_training_id INT NOT NULL,
  FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id),
  FOREIGN KEY (training_id) REFERENCES TrainingModules(module_id),
  FOREIGN KEY (exempted_training_id) REFERENCES TrainingModules(module_id)
);

-- ==============================================
-- Table: Certifications Table
CREATE TABLE IF NOT EXISTS Certifications (
  cert_id INT AUTO_INCREMENT PRIMARY KEY,
  guide_id INT NOT NULL,
  module_id INT NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id),
  FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id)
);

-- ==============================================
-- Table: Parks Table
CREATE TABLE IF NOT EXISTS Parks (
  park_id INT AUTO_INCREMENT PRIMARY KEY,
  park_name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  description TEXT NULL,
  wildlife TEXT NULL
);

-- ==============================================
-- Table: Guidebook Table
CREATE TABLE IF NOT EXISTS Guidebook (
  guidebook_id INT AUTO_INCREMENT PRIMARY KEY,
  park_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  multimedia_links TEXT NULL,
  FOREIGN KEY(park_id) REFERENCES Parks(park_id)
);

-- ==============================================
-- Table: IoT Monitoring Table
CREATE TABLE IF NOT EXISTS IoTMonitoring (
  sensor_id INT AUTO_INCREMENT PRIMARY KEY,
  park_id INT NOT NULL,
  sensor_type ENUM('temperature', 'humidity', 'soil moisture', 'motion') NOT NULL,
  recorded_value VARCHAR(255) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (park_id) REFERENCES Parks(park_id)
);

-- ==============================================
-- Table: Visitor Feedback Table
CREATE TABLE IF NOT EXISTS VisitorFeedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    guide_id INT NOT NULL,
    rating INT NOT NULL, -- Removed CHECK constraint
    comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Users(user_id),
    FOREIGN KEY (guide_id) REFERENCES ParkGuides(guide_id)
);

-- ==============================================
-- Table: Payment Transactions Table
CREATE TABLE IF NOT EXISTS PaymentTransactions (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    uid VARCHAR(255) NOT NULL,
    paymentPurpose VARCHAR(100) NOT NULL,
    paymentMethod ENUM('debit', 'credit', 'e_wallet') NOT NULL,
    amountPaid DECIMAL(10, 2) NOT NULL,
    receipt_image LONGBLOB NOT NULL,
    paymentStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ==============================================
-- Table: Alert Thresholds Table
CREATE TABLE IF NOT EXISTS AlertThresholds (
  threshold_id INT AUTO_INCREMENT PRIMARY KEY,
  sensor_type VARCHAR(50) NOT NULL,
  park_id INT NOT NULL,
  min_threshold FLOAT NULL,
  max_threshold FLOAT NULL,
  trigger_message VARCHAR(255) NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (park_id) REFERENCES Parks(park_id),
  UNIQUE KEY unique_threshold (sensor_type, park_id)
);

-- ==============================================
-- Table: Active Alerts Table
CREATE TABLE IF NOT EXISTS ActiveAlerts (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  park_id INT NOT NULL,
  sensor_type VARCHAR(50) NOT NULL,
  recorded_value VARCHAR(50) NOT NULL,
  threshold_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (park_id) REFERENCES Parks(park_id),
  FOREIGN KEY (threshold_id) REFERENCES AlertThresholds(threshold_id)
);




-- DUMMY DATA

-- Updated Dummy Users Data
INSERT INTO Users (uid, email, first_name, last_name, role, status) VALUES 
('vTJ6RpxoDeOP83TKZZjONPyUhX13', 'theadmin@gmail.com', 'Admin', 'Wong', 'admin', 'approved');

SELECT * from Users;





-- Dummy Park Guides Data



-- Dummy Quizzes Data
INSERT INTO quizzes (name, description) VALUES 
('Park Safety Basics', 'Essential safety guidelines for park visitors'),
('Wildlife Awareness', 'How to safely interact with park wildlife');

-- Dummy Questions for Quizzes
INSERT INTO questions (quiz_id, type, text, explanation, points) VALUES
(1, 'multiple-choice', 'What should you do if you encounter a bear in the park?', 'Backing away slowly while facing the bear is the safest approach. Running may trigger the bear''s chase instinct.', 1),
(1, 'true-false', 'It is safe to feed the wildlife in the park.', 'Feeding wildlife is dangerous for both animals and humans. It can cause animals to lose their natural fear of humans and become aggressive.', 2);

-- Dummy Options for questions
INSERT INTO options (question_id, text, is_correct) VALUES
(1, 'Run away as fast as possible', FALSE),
(1, 'Make loud noises and wave your arms', FALSE),
(1, 'Back away slowly while facing the bear', TRUE),
(1, 'Play dead immediately', FALSE),
(2, 'True', FALSE),
(2, 'False', TRUE);

-- Dummy Training Modules Data that reference the quizzes
INSERT INTO TrainingModules (module_code, module_name, description, difficulty, aspect, video_url, course_content, quiz_id) VALUES 
('SAF101', 'Safety Awareness Basics', 'Introduction to safety awareness in outdoor environments.', 'beginner', 'safety', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'This module covers the basics of safety awareness in outdoor environments.', 1),
('ENG202', 'Engagement Strategies', 'Techniques for engaging with park visitors effectively.', 'intermediate', 'engagement', 'https://www.youtube.com/watch?v=SsUn8aAbU6g', 'This module provides strategies for engaging with park visitors effectively.', 2);





-- Dummy Guide Training Progress Data





-- Dummy Multi-License Training Exemptions Data





-- Dummy Certifications Data




-- Dummy Parks Data
INSERT INTO Parks (park_name, location, description, wildlife) VALUES
('Bako National Park', 
 'Sarawak, Malaysia', 
 'Bako National Park is known for its diverse ecosystems, ranging from mangroves to rainforest, and its stunning coastline.', 
 'Proboscis monkeys, bearded pigs, otters, and various bird species'),

('Semenggoh Wildlife Centre', 
 'Kuching, Sarawak, Malaysia', 
 'Semenggoh Wildlife Centre is a sanctuary for rehabilitated orangutans, providing visitors with a chance to observe these magnificent creatures in their natural habitat.', 
 'Orangutans, gibbons, crocodiles, and local birdlife');
SELECT * from Parks;





-- Dummy Guidebook Data
INSERT INTO Guidebook (park_id, title, content, multimedia_links) VALUES
-- Guidebook for Bako National Park
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 
 'Exploring Bako National Park: A Visitor’s Guide', 
 'Discover the diverse ecosystems, flora, and fauna of Bako National Park. Includes tips for hiking, wildlife spotting, and safety precautions.', 
 'bako_guide_video_links, bako_maps_links'),

-- Guidebook for Semenggoh Wildlife Centre
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 
 'Semenggoh Wildlife Centre: Orangutan Conservation and Visitor Tips', 
 'Learn about the history, mission, and highlights of Semenggoh Wildlife Centre, with tips for observing wildlife responsibly and engaging in conservation efforts.', 
 'semenggoh_video_links, semenggoh_facts_links');
SELECT * from Guidebook;





-- Dummy IoT Monitoring Data
-- Add additional IoT monitoring data with proper timestamps for better chart visualization

-- Clear existing data if you want to start fresh (optional)
-- DELETE FROM IoTMonitoring;

-- Insert temperature data for Bako National Park (fluctuating through the day)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Today's temperature data with natural daily fluctuations
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '24.5', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '25.2', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '26.8', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '28.3', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '29.5', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '30.1', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '30.2', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '29.8', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '28.5', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '27.7', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Insert humidity data for Bako National Park (inverse to temperature)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Today's humidity data (inversely proportional to temperature)
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '75%', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '72%', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '68%', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '65%', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '62%', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '60%', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '61%', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '64%', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '68%', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', '71%', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Insert soil moisture data for Bako National Park (more stable through the day)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Today's soil moisture data (more stable, slight decrease through day)
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '42%', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '42%', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '41%', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '41%', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '40%', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '39%', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '38%', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '38%', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '37%', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', '37%', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Insert motion detection data for Bako National Park (sporadic throughout the day)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Today's motion detection data (sporadic detections)
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR + INTERVAL 10 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR + INTERVAL 20 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR + INTERVAL 45 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR + INTERVAL 20 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR + INTERVAL 40 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR + INTERVAL 10 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Insert data for Semenggoh Wildlife Centre
-- Temperature data
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Temperature data for Semenggoh (slightly cooler due to more tree coverage)
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '23.1', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '23.8', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '24.5', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '25.7', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '26.9', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '27.4', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '27.9', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '27.2', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '26.5', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', '25.8', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Humidity data
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Humidity data for Semenggoh (higher due to more vegetation)
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '82%', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '80%', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '78%', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '75%', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '72%', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '70%', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '71%', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '73%', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '76%', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '79%', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Soil moisture data
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Soil moisture data for Semenggoh (higher due to better water retention)
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '58%', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '57%', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '57%', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '56%', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '55%', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '54%', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '53%', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '53%', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '52%', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', '52%', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR);

-- Motion detection data (more frequent due to wildlife activity)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Motion detection data for Semenggoh (more frequent due to orangutans)
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR + INTERVAL 15 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 9 HOUR + INTERVAL 30 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR + INTERVAL 40 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 5 HOUR + INTERVAL 10 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 4 HOUR + INTERVAL 30 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR + INTERVAL 50 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 3 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 2 HOUR + INTERVAL 25 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'not detected', CURRENT_TIMESTAMP() - INTERVAL 1 HOUR + INTERVAL 15 MINUTE),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', 'detected', CURRENT_TIMESTAMP() - INTERVAL 45 MINUTE);

-- Also add historical data for yesterday to show trends
-- Add yesterday's data for Bako National Park (temperature only as example)
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES 
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '23.8', CURRENT_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 10 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '24.7', CURRENT_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 8 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '27.3', CURRENT_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 6 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '29.8', CURRENT_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 4 HOUR),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '28.1', CURRENT_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 2 HOUR);

-- Query to verify data was inserted
SELECT COUNT(*) AS total_records FROM IoTMonitoring;
SELECT * from IoTMonitoring;





-- Dummy Visitor Feedback Data






-- Dummy Payment Transactions Data






INSERT INTO AlertThresholds (park_id, sensor_type, min_threshold, max_threshold, trigger_message, severity) VALUES
-- Temperature thresholds
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', 15, 19, 'Temperature threshold exceeded', 'medium'),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'temperature', 16, 19, 'Temperature threshold exceeded', 'medium'),

-- Humidity thresholds
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'humidity', 50, 51, 'Humidity threshold exceeded', 'medium'),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', 60, 61, 'Humidity threshold exceeded', 'medium'),

-- Soil moisture thresholds
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'soil moisture', 30, 31, 'Soil moisture threshold exceeded', 'high'),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'soil moisture', 30, 31, 'Soil moisture threshold exceeded', 'high'),

-- Motion detection is handled differently - no min/max but presence/absence
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', NULL, NULL, 'Unauthorized motion detected', 'high'),
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'motion', NULL, NULL, 'Unauthorized motion detected', 'high');