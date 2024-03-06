const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const axios = require('axios');
const path = require('path');  
const imgbbUploader = require('imgbb-uploader');
const nodemailer = require('nodemailer');


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
      
    }

    if (result.length > 0) {
      // User authenticated
      // return res.json({ success: true, message: 'Login successful' });
      const userId = result[0].id;
      // Return user ID upon successful login
      return res.json({ success: true, userId });
    } else {
      // Invalid credentials
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  // Attempt to insert user into the database
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Duplicate entry error (username or email already exists)
        return res.status(400).json({ success: false, message: 'Username or email already exists. Please try another.' });
      }
      console.error('Error during registration:', err);
      return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }

    console.log('User registered successfully');
    return res.status(200).json({ success: true, message: 'Registration successful!' });
  });
});


//route for profile page


app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ success: false, message: 'Error fetching user details' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        const user = results;
        console.log(results);
        res.status(200).json({ success: true, user });
      }
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save the uploaded files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const IMG_BB_API_KEY = '7cfa46f799a26a51c49494e14e9ebd27';

// Handle image uploads to ImgBB
app.post('/uploadImage/:userId', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    console.log(file);
    // Use imgbb-uploader to upload the image to ImgBB
    const imgbbResponse = await imgbbUploader(IMG_BB_API_KEY,"D:/freelancing/anw/alumni-network/backend/uploads/"+file.filename);
    console.log(imgbbResponse.url)
    if (imgbbResponse.url) {
      const imagePath = imgbbResponse.url;

      // Save imagePath in the database for the user
      // Update the user's profile picture field with imagePath
      db.query('UPDATE users SET profilePicture=? WHERE id=?', [imagePath, userId]);

      res.json({ success: true, imagePath });
    } else {
      console.error('Error uploading image to ImgBB:', imgbbResponse);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


//popup update of profile
// Update user profile route
app.put('/updateProfile/:userId', async (req, res) => {
  const userId = req.params.userId;
  const {
    firstName,
    lastName,
    profilePicture,
    bio,
    education,
    workExperience,
    skills,
    // Add additional fields as needed
  } = req.body;

  try {
    // Update the user profile data in the database
    db.query(
      'UPDATE users SET firstName=?, lastName=?, profilePicture=?, bio=?, education=?, workExperience=?, skills=? WHERE id=?',
      [firstName, lastName, profilePicture, bio, JSON.stringify(education), JSON.stringify(workExperience), JSON.stringify(skills), userId]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/send-email', (req, res) => {
  const { name, email, graduationYear, major, message } = req.body;

  // Create a nodemailer transporter using your email credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'letsfreelancenow@gmail.com', // Replace with your Gmail address
      pass: 'tuyf yfck urvt tadb', // Replace with your Gmail password
    },
  });

  // Set up the email details
  const mailOptions = {
    from: email, // Sender address
    to: 'kavaskarsundaramoorthi@gmail.com', // Recipient address
    subject: 'New Contact Form Submission',
    text: `
      Name: ${name}
      Email: ${email}
      Graduation Year: ${graduationYear}
      Major: ${major}
      Message: ${message}
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email Sent');
    }
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
