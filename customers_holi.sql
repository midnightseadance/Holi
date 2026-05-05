use insurance_project;
CREATE TABLE customers_holi (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password_hash CHAR(60) NOT NULL
 
);
INSERT INTO customers_holi (`id`, `customer_name`, `email`, `password_hash`)
VALUES (1, 'Madhu', 'madhu23@gmail.com', '12345');
SELECT * FROM customers_holi;
INSERT INTO customers_holi (`customer_name`, `email`, `password_hash`) VALUES
('Raj Patel', 'raj.patel@example.com', 'hello123'),
('Priya Sharma', 'priya.sharma@example.com', 'welcome1'),
('Amit Singh', 'amit.singh@example.com', 'testpass'),
('Neha Gupta', 'neha.gupta@example.com', 'password1'),
('Vikram Joshi', 'vikram.joshi@example.com', 'demo1234'),
('Ananya Reddy', 'ananya.reddy@example.com', 'temp123'),
('Rohan Malhotra', 'rohan.malhotra@example.com', 'access1'),
('Divya Iyer', 'divya.iyer@example.com', 'pass1234'),
('Arjun Nair', 'arjun.nair@example.com', 'test1234'),
('Meera Desai', 'meera.desai@example.com', 'demo123');