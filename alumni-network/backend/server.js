const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2132',
  database: 'proj',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Replace this with your actual authentication logic
  // Example: Check if usernameOrEmail and password match a record in the users table
  const query = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?';
  db.query(query, [usernameOrEmail, usernameOrEmail, password], (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length > 0) {
      // User authenticated
      return res.json({ success: true, message: 'Login successful' });
    } else {
      // Invalid credentials
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  // Replace this with your actual registration logic
  // Example: Insert new user into the users table
  const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [username, email, password, role], (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Registration successful
    return res.json({ success: true, message: 'Registration successful' });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
