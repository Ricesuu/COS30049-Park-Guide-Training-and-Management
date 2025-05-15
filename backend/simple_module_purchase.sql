-- Basic Module Purchase System for Park Guide Training and Management
-- Simplified version that works without permission issues
-- Add foreign key after column is created
ALTER TABLE PaymentTransactions 
ADD CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id);

-- 2. Create a simple table to track module purchases
CREATE TABLE IF NOT EXISTS ModulePurchases (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  module_id INT NOT NULL,
  payment_id INT NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  status ENUM('pending', 'active', 'revoked') DEFAULT 'pending',
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Constraints
  UNIQUE KEY unique_user_module (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES TrainingModules(module_id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES PaymentTransactions(payment_id) ON DELETE CASCADE
);

-- 3. Add pricing to modules
ALTER TABLE TrainingModules
ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- 4. Simple trigger to update purchase status when payment is approved
DELIMITER //
CREATE TRIGGER after_payment_approval
AFTER UPDATE ON PaymentTransactions
FOR EACH ROW
BEGIN
  IF NEW.paymentStatus = 'approved' AND OLD.paymentStatus = 'pending' AND NEW.module_id IS NOT NULL THEN
    UPDATE ModulePurchases
    SET status = 'active'
    WHERE payment_id = NEW.payment_id;
    
    -- Also track in training progress
    INSERT IGNORE INTO GuideTrainingProgress (
      guide_id, 
      module_id, 
      status
    )
    SELECT 
      pg.guide_id, 
      NEW.module_id, 
      'in progress'
    FROM ModulePurchases mp
    JOIN Users u ON mp.user_id = u.user_id
    JOIN ParkGuides pg ON u.user_id = pg.user_id
    WHERE mp.payment_id = NEW.payment_id;
  END IF;
END //
DELIMITER ;

-- 5. Simple view for module access
CREATE OR REPLACE VIEW UserModuleAccess AS
SELECT 
  mp.purchase_id,
  u.user_id,
  u.uid,
  u.first_name,
  u.last_name,
  tm.module_id,
  tm.module_name,
  tm.duration,
  mp.status,
  mp.purchase_date,
  mp.completion_percentage,
  pt.payment_id,
  pt.paymentStatus
FROM ModulePurchases mp
JOIN Users u ON mp.user_id = u.user_id
JOIN TrainingModules tm ON mp.module_id = tm.module_id
JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
WHERE mp.is_active = TRUE AND mp.status = 'active';

-- 6. Simple view for pending payments
CREATE OR REPLACE VIEW PendingModulePayments AS
SELECT
  pt.payment_id,
  u.user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email,
  tm.module_id,
  tm.module_name,
  pt.amountPaid,
  pt.paymentMethod,
  pt.transaction_date
FROM PaymentTransactions pt
JOIN Users u ON pt.user_id = u.user_id
JOIN TrainingModules tm ON pt.module_id = tm.module_id
WHERE pt.paymentStatus = 'pending' AND pt.module_id IS NOT NULL;

-- 7. Sample module pricing
UPDATE TrainingModules SET price = 49.99, is_premium = TRUE WHERE module_name = 'Advanced Navigation Techniques';
UPDATE TrainingModules SET price = 39.99, is_premium = TRUE WHERE module_name = 'Wildlife Interaction Guidelines';
UPDATE TrainingModules SET price = 69.99, is_premium = TRUE WHERE module_name = 'Emergency First Aid';
UPDATE TrainingModules SET price = 29.99, is_premium = TRUE WHERE module_name = 'Environmental Conservation';
UPDATE TrainingModules SET price = 0.00, is_premium = FALSE WHERE module_name = 'Basic Park Safety';
