-- Add a trigger to automatically set up guide training progress when a module is purchased
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_module_purchase_creation
AFTER INSERT ON ModulePurchases
FOR EACH ROW
BEGIN
  DECLARE guide_id INT;
  
  -- Find guide_id for the user who purchased the module
  SELECT pg.guide_id INTO guide_id
  FROM ParkGuides pg
  WHERE pg.user_id = NEW.user_id
  LIMIT 1;
  
  -- If guide_id found, insert a record into GuideTrainingProgress
  IF guide_id IS NOT NULL THEN
    INSERT IGNORE INTO GuideTrainingProgress
      (guide_id, module_id, status, start_date)
    VALUES
      (guide_id, NEW.module_id, 'in_progress', CURRENT_DATE());
  END IF;
END //
DELIMITER ;

-- Add sample module purchases for testing
INSERT IGNORE INTO ModulePurchases
(user_id, module_id, payment_id, purchase_date, is_active, status, completion_percentage)
VALUES
-- Assuming user_id 1 is a park guide with existing credentials
(1, 1, 1, NOW(), TRUE, 'active', 0.00),  -- Park Guide Basics (free module)
(1, 3, 2, NOW(), TRUE, 'active', 25.00); -- Wildlife Interaction Guidelines (partially completed)

-- Add sample quiz attempts for testing
INSERT IGNORE INTO QuizAttempts 
(quiz_id, user_id, guide_id, start_time, end_time, score, passed, attempt_number)
VALUES
-- Assuming user_id 1 has guide_id 1
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 85, TRUE, 1),
(3, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 60, FALSE, 1),
(3, 1, 1, NOW(), NULL, NULL, NULL, 2);
