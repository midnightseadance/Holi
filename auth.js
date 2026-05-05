const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your actual username
  password: 'root123', // Replace with your actual password
  database: 'insurance_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// =============================================
// PASSWORD MIGRATION FUNCTION (RUN ONCE)
// =============================================
async function migratePasswordsToBcrypt() {
  console.log('Starting password migration...');
  
  try {
    const [users] = await pool.query('SELECT id, password_hash FROM customers_holi');
    
    for (const user of users) {
      // Skip already hashed passwords (starting with $2b$)
      if (user.password_hash.startsWith('$2b$')) {
        console.log(`Skipping already hashed password for user ${user.id}`);
        continue;
      }
      
      const hashedPassword = await bcrypt.hash(user.password_hash, 10);
      await pool.query(
        'UPDATE customers_holi SET password_hash = ? WHERE id = ?',
        [hashedPassword, user.id]
      );
      console.log(`Updated password for user ${user.id}`);
    }
    
    console.log('Password migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Uncomment this line to run the migration ONCE, then comment it back
// migratePasswordsToBcrypt();

// =============================================
// API ENDPOINTS
// =============================================

// Signup endpoint with enhanced validation
app.post('/api/signup', async (req, res) => {
  try {
    const { customer_name, email, password } = req.body;
    
    // Validate input
    if (!customer_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Password length validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM customers_holi WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO customers_holi (customer_name, email, password_hash) VALUES (?, ?, ?)',
      [customer_name, email.toLowerCase(), password_hash]
    );

    res.status(201).json({ 
      message: 'Registration successful',
      userId: result.insertId,
      customerName: customer_name,
      email: email.toLowerCase()
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM customers_holi WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    res.json({ 
      message: 'Login successful',
      userId: user.id,
      customerName: user.customer_name,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// User profile endpoint
app.get('/api/user/:userId', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, customer_name, email FROM customers_holi WHERE id = ?',
      [req.params.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Policies endpoint
// In auth.js, replace the existing policies endpoint with this:
app.get('/api/policies/:customerId', async (req, res) => {
    try {
        const [policies] = await pool.query(`
            SELECT 
                policy_id as id,
                policy_type as policy_name,
                start_date,
                end_date,
                due_date,
                total_amount as amount_due,
                CASE
                    WHEN CURDATE() > end_date THEN 'Expired'
                    WHEN CURDATE() > due_date THEN 'Overdue'
                    ELSE 'Active'
                END as status
            FROM policies 
            WHERE customer_id = ?
            ORDER BY due_date ASC
        `, [req.params.customerId]);
        
        res.json(policies);
    } catch (error) {
        console.error('Error fetching policies:', error);
        res.status(500).json({ error: 'Server error fetching policies' });
    }
});

// =============================================
// SERVER START
// =============================================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});