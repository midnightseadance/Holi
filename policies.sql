CREATE TABLE policies (
  policy_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  policy_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers_holi(id)
);

-- Sample data
INSERT INTO policies (customer_id, policy_type, start_date, end_date, due_date, total_amount)
VALUES 
  (1, 'Home Insurance', '2023-01-01', '2024-01-01', '2023-12-01', 1200.00),
  (1, 'Life Insurance', '2023-03-15', '2024-03-15', '2023-12-15', 850.50),
  (2, 'Home Insurance', '2023-02-01', '2024-02-01', '2023-11-01', 600.00);