CREATE DATABASE IF NOT EXISTS park_guide_management;
USE park_guide_management;

-- ==============================================
-- Table: User
CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'park_guide', 'visitor') NOT NULL,
  phone_number VARCHAR(20),
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
-- Table: Training Modules Table
CREATE TABLE IF NOT EXISTS TrainingModules (
  module_id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  duration INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    sensor_type ENUM('temperature', 'humidity', 'motion') NOT NULL,
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
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
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
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_method ENUM('debit_card', 'digital_wallet') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ==============================================





-- DUMMY DATA

-- Dummy Users Data
INSERT INTO Users (first_name, last_name, email, password_hash, role, phone_number) VALUES
('Alice', 'Brown', 'alice.brown@example.com', 'abc123hashed', 'visitor', '1234567890'),
('Bob', 'Smith', 'bob.smith@example.com', 'xyz456hashed', 'park_guide', '9876543210'),
('Charlie', 'Johnson', 'charlie.johnson@example.com', 'def789hashed', 'admin', NULL),
('David', 'Williams', 'david.williams@example.com', 'ghi101hashed', 'visitor', '5555555555'),
('Eva', 'Taylor', 'eva.taylor@example.com', 'jkl202hashed', 'park_guide', '4444444444');
SELECT * from Users;





-- Dummy Park Guides Data
INSERT INTO ParkGuides (user_id, certification_status, license_expiry_date, assigned_park) VALUES
((SELECT user_id FROM Users WHERE email = 'bob.smith@example.com'), 'certified', '2025-12-31', 'Bako National Park'),
((SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com'), 'pending', NULL, 'Semenggoh Wildlife Centre');
SELECT * from ParkGuides;





-- Dummy Training Modules Data
INSERT INTO TrainingModules (module_name, description, duration) VALUES
('Basic Park Safety', 'Covers fundamental safety procedures for park environments.', 120),
('Advanced Navigation Techniques', 'Teaches the use of GPS, maps, and compass for navigation.', 180),
('Wildlife Interaction Guidelines', 'How to safely interact with and manage wildlife encounters.', 150),
('Emergency First Aid', 'Provides essential first aid training for emergencies.', 240),
('Environmental Conservation', 'Focuses on sustainable practices and environmental awareness.', 90);
SELECT * from TrainingModules;





-- Dummy Guide Training Progress Data
INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date) VALUES
((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Basic Park Safety'), 'Completed', '2025-04-01'),

((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Advanced Navigation Techniques'), 'in progress', NULL),

((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Wildlife Interaction Guidelines'), 'Completed', '2025-03-15'),

((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Emergency First Aid'), 'in progress', NULL);
SELECT * from GuideTrainingProgress;





-- Dummy Multi-License Training Exemptions Data
INSERT INTO MultiLicenseTrainingExemptions (guide_id, training_id, exempted_training_id) VALUES
((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Basic Park Safety'), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Advanced Navigation Techniques')),

((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Wildlife Interaction Guidelines'), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Emergency First Aid'));
SELECT * from MultiLicenseTrainingExemptions;





-- Dummy Certifications Data
INSERT INTO Certifications (guide_id, module_id, issued_date, expiry_date) VALUES
-- Certification for Bob Smith: "Basic Park Safety"
((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Basic Park Safety'), '2025-04-01', '2026-04-01'),

-- Certification for Eva Taylor: "Wildlife Interaction Guidelines"
((SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 (SELECT module_id FROM TrainingModules WHERE module_name = 'Wildlife Interaction Guidelines'), '2025-03-15', '2026-03-15');
SELECT * from Certifications;



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
INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value, recorded_at) VALUES
-- Temperature and motion sensors in Bako National Park
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'temperature', '29.5', '2025-04-07 08:00:00'),
((SELECT park_id FROM Parks WHERE park_name = 'Bako National Park'), 'motion', 'detected', '2025-04-07 10:15:00'),

-- Humidity sensors in Semenggoh Wildlife Centre
((SELECT park_id FROM Parks WHERE park_name = 'Semenggoh Wildlife Centre'), 'humidity', '70%', '2025-04-07 09:30:00');
SELECT * from IoTMonitoring;





-- Dummy Visitor Feedback Data
INSERT INTO VisitorFeedback (visitor_id, guide_id, rating, comment) VALUES
-- Feedback for Bob Smith
((SELECT user_id FROM Users WHERE email = 'david.williams@example.com'), 
 (SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 5, 'Bob was an amazing guide! Very knowledgeable and friendly.'),

((SELECT user_id FROM Users WHERE email = 'alice.brown@example.com'), 
 (SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'bob.smith@example.com')), 
 4, 'Great experience, but the tour could have been a bit longer.'),

-- Feedback for Eva Taylor
((SELECT user_id FROM Users WHERE email = 'david.williams@example.com'), 
 (SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 3, 'Eva was good, but the group size made it hard to interact.'),

((SELECT user_id FROM Users WHERE email = 'alice.brown@example.com'), 
 (SELECT guide_id FROM ParkGuides WHERE user_id = (SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com')), 
 5, 'Eva was fantastic! She made the experience unforgettable.');
SELECT * from VisitorFeedback;





-- Dummy Payment Transactions Data
INSERT INTO PaymentTransactions (user_id, amount, payment_status, payment_method, transaction_date) VALUES
-- Payment for certification fees by Bob Smith
((SELECT user_id FROM Users WHERE email = 'bob.smith@example.com'), 150.00, 'completed', 'debit_card', '2025-04-01 09:00:00'),

-- Payment for advanced training course by Eva Taylor
((SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com'), 200.00, 'completed', 'digital_wallet', '2025-04-02 14:30:00'),

-- Pending payment for certification renewal by Bob Smith
((SELECT user_id FROM Users WHERE email = 'bob.smith@example.com'), 120.00, 'pending', 'digital_wallet', '2025-04-03 10:45:00'),

-- Failed payment for new training module by Eva Taylor
((SELECT user_id FROM Users WHERE email = 'eva.taylor@example.com'), 180.00, 'failed', 'debit_card', '2025-04-04 16:15:00'),

-- Payment for certification fees by Alice Brown (New applicant)
((SELECT user_id FROM Users WHERE email = 'alice.brown@example.com'), 100.00, 'completed', 'debit_card', '2025-04-05 08:20:00');
SELECT * from PaymentTransactions;



