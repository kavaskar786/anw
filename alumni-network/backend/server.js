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
  const query = `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?;`;
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
  const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?);`;
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Duplicate entry error (username or email already exists)
        return res.status(400).json({ success: false, message: 'Username or email already exists. Please try another.' });
      }
      console.error('Error during registration:', err);
      return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }

    // Execute additional queries to set default values for new columns
    const updateQueries = [
      'UPDATE users SET requested_mentors = "[]" WHERE requested_mentors IS NULL;',
      'UPDATE users SET requested_mentees = "[]" WHERE requested_mentees IS NULL;',
      'UPDATE users SET followers = "[]" WHERE followers IS NULL;',
      'UPDATE users SET following = "[]" WHERE following IS NULL;',
      'UPDATE users SET education = "[]" WHERE education IS NULL;',
      'UPDATE users SET workExperience = "[]" WHERE workExperience IS NULL;',
      'UPDATE users SET skills = "[]" WHERE skills IS NULL;'
    ];

    // Execute each update query
    updateQueries.forEach(query => {
      db.query(query, (updateErr) => {
        if (updateErr) {
          console.error('Error updating columns:', updateErr);
        }
      });
    });

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


app.post('/addEvent', (req, res) => {
  const { title, date, time, location, description, registrationLink, userId } = req.body;

  const sql = 'INSERT INTO events (title, date, time, location, description, registrationLink, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, date, time, location, description, registrationLink, userId], (err, result) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ success: false, message: 'Error adding event' });
    }

    res.status(200).json({ success: true, message: 'Event added successfully' });
  });
});

// Fetch all events
app.get('/events', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const query = 'SELECT * FROM events WHERE date >= ? ORDER BY date, time';
  db.query(query, [currentDate], (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ success: false, message: 'Error fetching events' });
    } else {
      res.status(200).json({ success: true, events: results });
    }
  });
});

app.put('/events/update/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { title, date, time, location, description, registrationLink } = req.body;

  // Convert the date to a MySQL-compatible format (YYYY-MM-DD)
  console.log(date)
  const query = 'UPDATE events SET title=?, date=?, time=?, location=?, description=?, registrationLink=? WHERE id=?';
  db.query(query, [title, date, time, location, description, registrationLink, eventId], (error) => {
    if (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ success: false, message: 'Error updating event' });
    } else {
      res.status(200).json({ success: true, message: 'Event updated successfully' });
    }
  });
});


// Delete an event
app.delete('/events/delete/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = 'DELETE FROM events WHERE id=?';
  db.query(query, [eventId], (error) => {
    if (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ success: false, message: 'Error deleting event' });
    } else {
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
    }
  });
});


app.get('/users/search', (req, res) => {
  const searchTerm = req.query.username;
  const currentUserId = req.query.currentUserId;

  if (!searchTerm || !currentUserId) {
    return res.status(400).json({ success: false, message: 'Invalid search term or current user ID' });
  }

  const searchQuery = `
    SELECT id, username, firstName, lastName, role, profilePicture,
    JSON_CONTAINS(followers, JSON_QUOTE(?)) as isFollowing,
    JSON_CONTAINS(requested_mentees, JSON_QUOTE(?)) as isMentorshipRequested
    FROM users
    WHERE username LIKE ? OR firstName LIKE ? OR lastName LIKE ?
  `;

  const searchPattern = `%${searchTerm}%`;

  db.query(searchQuery, [currentUserId, currentUserId, searchPattern, searchPattern, searchPattern], (searchErr, searchResults) => {
    if (searchErr) {
      console.error('Error executing search query:', searchErr);
      return res.status(500).json({ success: false, message: 'Error fetching users' });
    }

    res.status(200).json({ success: true, users: searchResults });
  });
});


// Endpoint for following a user
app.post('/follow', (req, res) => {
  const { currentUserId, targetUserId } = req.body;

  const followQuery = 'UPDATE users SET followers = JSON_ARRAY_APPEND(followers, "$", ?) WHERE id = ?';
  const followingQuery = 'UPDATE users SET following = JSON_ARRAY_APPEND(following, "$", ?) WHERE id = ?';

  db.query(followQuery, [currentUserId, targetUserId], (followErr) => {
    if (followErr) {
      console.error('Error following user:', followErr);
      return res.status(500).json({ success: false, message: 'Error following user' });
    }

    db.query(followingQuery, [targetUserId, currentUserId], (followingErr) => {
      if (followingErr) {
        console.error('Error updating following column:', followingErr);
        return res.status(500).json({ success: false, message: 'Error updating following column' });
      }

      res.json({ success: true, message: 'User followed successfully.' });
    });
  });
});

// Endpoint for unfollowing a user
app.post('/unfollow', (req, res) => {
  const { currentUserId, targetUserId } = req.body;

  const unfollowQuery = 'UPDATE users SET followers = JSON_REMOVE(followers, JSON_UNQUOTE(JSON_SEARCH(followers, "one", ?))) WHERE id = ?';
  const unfollowingQuery = 'UPDATE users SET following = JSON_REMOVE(following, JSON_UNQUOTE(JSON_SEARCH(following, "one", ?))) WHERE id = ?';
  console.log(currentUserId,targetUserId)
  db.query(unfollowQuery, [currentUserId, targetUserId], (unfollowErr) => {
    if (unfollowErr) {
      console.error('Error unfollowing user:', unfollowErr);
      return res.status(500).json({ success: false, message: 'Error unfollowing user' });
    }

    db.query(unfollowingQuery, [targetUserId, currentUserId], (unfollowingErr) => {
      if (unfollowingErr) {
        console.error('Error updating following column:', unfollowingErr);
        return res.status(500).json({ success: false, message: 'Error updating following column' });
      }

      res.json({ success: true, message: 'User unfollowed successfully.' });
    });
  });
});


const getUserId = () => {
  const encryptedUserId = localStorage.getItem('userId');
  const userId = encryptedUserId ? atob(encryptedUserId) : null;
  return userId;
};

// API to get discussion topics
app.get('/api/discussion/topics', (req, res) => {
  const query = 'SELECT * FROM discussion_topics';
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error fetching topics' });
    } else {
      res.status(200).json({ success: true, topics: results });
    }
  });
});

// API to add a new discussion topic
app.post('/api/discussion/add-topic', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO discussion_topics (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error adding topic' });
    } else {
      res.status(200).json({ success: true, message: 'Topic added successfully' });
    }
  });
});

app.post('/api/discussion/add-message', (req, res) => {
  const { topicId, message, userId } = req.body; // Extract userId from the request body
  const query = 'INSERT INTO chat_msgs (topic_id, user_id, message) VALUES (?, ?, ?)';
  db.query(query, [topicId, userId, message], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error adding message' });
    } else {
      res.status(200).json({ success: true, message: 'Message added successfully' });
    }
  });
});


app.get('/api/discussion/messages', (req, res) => {
  const { topicId } = req.query;
  const query = `
    SELECT chat_msgs.message, chat_msgs.user_id AS userId, users.username
    FROM chat_msgs
    INNER JOIN users ON chat_msgs.user_id = users.id
    WHERE chat_msgs.topic_id = ?;
  `;
  db.query(query, [topicId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error fetching messages' });
    } else {
      res.status(200).json({ success: true, messages: results });
    }
  });
});


app.post('/request-mentorship', (req, res) => {
  const { currentUserId, targetUserId } = req.body;

  const requestMentorshipQuery = 'UPDATE users SET requested_mentors = JSON_ARRAY_APPEND(requested_mentors, "$", ?) WHERE id = ?';
  const requestMenteeQuery = 'UPDATE users SET requested_mentees = JSON_ARRAY_APPEND(requested_mentees, "$", ?) WHERE id = ?';

  db.query(requestMentorshipQuery, [targetUserId, currentUserId], (mentorshipErr) => {
    if (mentorshipErr) {
      console.error('Error requesting mentorship:', mentorshipErr);
      return res.status(500).json({ success: false, message: 'Error requesting mentorship' });
    }

    db.query(requestMenteeQuery, [currentUserId, targetUserId], (menteeErr) => {
      if (menteeErr) {
        console.error('Error updating requested_mentees column:', menteeErr);
        return res.status(500).json({ success: false, message: 'Error updating requested_mentees column' });
      }

      res.json({ success: true, message: 'Mentorship requested successfully.' });
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
