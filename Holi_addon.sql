
CREATE TABLE policy_addons(
  addon_id INT AUTO_INCREMENT PRIMARY KEY,
  policy_id INT NOT NULL,
  addon_name VARCHAR(100) NOT NULL COMMENT 'UI display name (e.g., "Earthquake Protection")',
  coverage_amount DECIMAL(10,2) NOT NULL,
  additional_premium DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

-- For Home Policy (Policy ID 1 - Customer: Ramesh Patel)
INSERT INTO policy_addons
(policy_id, addon_name, coverage_amount, additional_premium) VALUES
(1, 'Earthquake Protection', 500000.00, 350.00),
(1, 'Luxury Item Coverage',  200000.00, 150.00);

-- For Life Policy (Policy ID 2 - Customer: Priya Sharma)
INSERT INTO policy_addons
(policy_id, addon_name, coverage_amount, additional_premium) VALUES
(2, 'Critical Illness Payout', 300000.00, 200.00);

-- For Home Policy (Policy ID 5 - Customer: Arjun Iyer)
INSERT INTO policy_addons
(policy_id, addon_name, coverage_amount, additional_premium) VALUES
(5, 'Flood Damage Shield', 400000.00, 300.00),
(5, 'Home Emergency Assistance', 5000.00, 75.00);
DESC policy_addons;