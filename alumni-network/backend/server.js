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

app.get('/followers/:userId', (req, res) => {
  const userId = req.params.userId;
  
  
  // Query the database to fetch followers based on the userId
  const query = 'SELECT followers FROM users WHERE id = ?';
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching followers:', error);
      res.status(500).json({ success: false, message: 'Error fetching followers' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        // Extract followers from the database result
        console.log(results[0].followers);
       const followers = results[0].followers.length>0 ? results[0].followers : 0; // Parse followers from JSON string
        
        // Query the database to fetch details of followers
        const queryDetails = 'SELECT id, username, firstName, lastName, profilePicture FROM users WHERE id IN (?)';
        db.query(queryDetails, [followers], (detailsError, detailsResults) => {
          if (detailsError) {
            console.error('Error fetching followers details:', detailsError);
            res.status(500).json({ success: false, message: 'Error fetching followers details' });
          } else {
            console.log(detailsResults);
            res.status(200).json({ success: true, followers: detailsResults });
          }
        });
      }
    }
  });
});

app.get('/following/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT following FROM users WHERE id = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching following:', error);
      res.status(500).json({ success: false, message: 'Error fetching following' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        const followingIds = results[0].following.length>0 ? results[0].following : 0;
        console.log(followingIds);
        // Now you can use followingIds to fetch following details from the database
        const followingQuery = 'SELECT id, username, firstName, lastName, profilePicture FROM users WHERE id IN (?)';
        db.query(followingQuery, [followingIds], (followingError, followingResults) => {
          if (followingError) {
            console.error('Error fetching following details:', followingError);
            res.status(500).json({ success: false, message: 'Error fetching following details' });
          } else {
            res.status(200).json({ success: true, following: followingResults });
          }
        });
      }
    }
  });
});

// Import necessary modules

// Fetch messages between two users
app.get('/messages/:userId/:otherUserId', (req, res) => {
  const userId = req.params.userId;
  const otherUserId = req.params.otherUserId;

  // Fetch messages from the database for the given userId and otherUserId
  const query = 'SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY timestamp';
  db.query(query, [userId, otherUserId, otherUserId, userId], (error, results) => {
    if (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Error fetching messages' });
    } else {
      res.status(200).json({ success: true, messages: results });
    }
  });
});

// Send a message
app.post('/send-message', (req, res) => {
  const { senderId, receiverId, message } = req.body;

  // Insert the message into the database
  const query = 'INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)';
  db.query(query, [senderId, receiverId, message], (error) => {
    if (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, message: 'Error sending message' });
    } else {
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    }
  });
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
    SELECT id, username, firstName, lastName, role, profilePicture, skills,
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


//news page codes

app.get('/api/news1', (req, res) => {
  const query = 'SELECT * FROM news';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching news:', err);
      res.status(500).json({ success: false, message: 'Error fetching news' });
    } else {
      res.status(200).json({ success: true, news: results });
    }
  });
});


app.post('/api/news', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO news (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err, result) => {
    if (err) {
      console.error('Error adding news:', err);
      res.status(500).json({ success: false, message: 'Error adding news' });
    } else {
      res.status(200).json({ success: true, message: 'News added successfully', id: result.insertId });
    }
  });
});

app.put('/api/news/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const query = 'UPDATE news SET title=?, content=? WHERE id=?';
  db.query(query, [title, content, id], (err) => {
    if (err) {
      console.error('Error updating news:', err);
      res.status(500).json({ success: false, message: 'Error updating news' });
    } else {
      res.status(200).json({ success: true, message: 'News updated successfully' });
    }
  });
});

app.delete('/api/news/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM news WHERE id=?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting news:', err);
      res.status(500).json({ success: false, message: 'Error deleting news' });
    } else {
      res.status(200).json({ success: true, message: 'News deleted successfully' });
    }
  });
});



//job board

// Endpoint to get all jobs
app.get('/api/jobs', (req, res) => {
  const query = 'SELECT * FROM jobs';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ success: false, message: 'Error fetching jobs' });
    } else {
      res.status(200).json({ success: true, jobs: results });
    }
  });
});


// Add job
app.post('/api/jobs', (req, res) => {
  const { title, company, location, description, userId } = req.body;
  const query = 'INSERT INTO jobs (title, company, location, description, userId) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, company, location, description, userId], (err, result) => {
    if (err) {
      console.error('Error adding job:', err);
      res.status(500).json({ success: false, message: 'Error adding job' });
    } else {
      res.status(200).json({ success: true, message: 'Job added successfully', id: result.insertId });
    }
  });
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  const { title, company, location, description } = req.body;
  const query = 'UPDATE jobs SET title=?, company=?, location=?, description=? WHERE id=?';
  db.query(query, [title, company, location, description, id], (err) => {
    if (err) {
      console.error('Error updating job:', err);
      res.status(500).json({ success: false, message: 'Error updating job' });
    } else {
      res.status(200).json({ success: true, message: 'Job updated successfully' });
    }
  });
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM jobs WHERE id=?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting job:', err);
      res.status(500).json({ success: false, message: 'Error deleting job' });
    } else {
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    }
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

// // Get user details by ID
// app.get('/user/:id', (req, res) => {
//   const userId = req.params.id;

//   const query = 'SELECT * FROM users WHERE id = ?';

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user details:', error);
//       res.status(500).json({ success: false, message: 'Error fetching user details' });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ success: false, message: 'User not found' });
//       } else {
//         const user = results[0];
//         console.log(user);
//         res.status(200).json({ success: true, user });
//       }
//     }
//   });
// });

// // Delete mentor request
// app.delete('/user/:id/mentor/:mentorId', (req, res) => {
//   const userId = req.params.id;
//   const mentorId = req.params.mentorId;

//   // Check user's role
//   const roleQuery = 'SELECT role FROM users WHERE id = ?';

//   db.query(roleQuery, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user role:', error);
//       res.status(500).json({ success: false, message: 'Error fetching user role' });
//     } else {
//       const role = results[0].role;

//       // If user is a student, remove mentor from requested_mentors array
//       if (role === 'student') {
//         const updateQuery = 'UPDATE users SET requested_mentors = JSON_REMOVE(requested_mentors, JSON_UNQUOTE(JSON_SEARCH(requested_mentors, "one", ?))) WHERE id = ?';

//         db.query(updateQuery, [mentorId, userId], (updateError, updateResults) => {
//           if (updateError) {
//             console.error('Error removing mentor from requested_mentors:', updateError);
//             res.status(500).json({ success: false, message: 'Error removing mentor from requested_mentors' });
//           } else {
//             res.status(200).json({ success: true, message: 'Mentor request removed successfully' });
//           }
//         });
//       } else {
//         res.status(403).json({ success: false, message: 'Only students can remove mentor requests' });
//       }
//     }
//   });
// });


// Route to fetch current user's role
app.get('/api/currentUser/role', (req, res) => {
  const userId = req.query.userId; // Assuming userId is passed as query parameter
  const query = 'SELECT role FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user role:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.get('/api/mentorship/mentees', (req, res) => {
  const userId = req.query.userId; 
  const innerQuery = 'SELECT requested_mentees FROM users WHERE id = ?';
  
  db.query(innerQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching requested mentees:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Check if requested_mentees exists and has length
      console.log(results[0].requested_mentees.length)
      if (results[0].requested_mentees.length > 0) {
        const requestedMentees = results[0].requested_mentees;
        
        // Use the extracted values in the outer query
        const outerQuery = `
          SELECT * FROM users 
          WHERE id IN (${requestedMentees.map(id => `'${id}'`).join(',')})`;
        
        db.query(outerQuery, (err, mentees) => {
          if (err) {
            console.error('Error fetching requested mentees:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json(mentees);
          }
        });
      } else {
        // No requested mentees found
        res.status(200).json([]);
      }
    }
  });
});




app.get('/api/mentorship/mentors', (req, res) => {
  const userId = req.query.userId; 
  const innerQuery = 'SELECT requested_mentors FROM users WHERE id = ?';
  
  db.query(innerQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching requested mentors:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Check if requested_mentors exists and has length
      console.log(results[0].requested_mentors)
      if (results[0].requested_mentors.length > 0) {
        const requestedMentors = results[0].requested_mentors;
        
        // Use the extracted values in the outer query
        const outerQuery = `
          SELECT * FROM users 
          WHERE id IN (${requestedMentors.map(id => `'${id}'`).join(',')})`;
        
        db.query(outerQuery, (err, mentors) => {
          if (err) {
            console.error('Error fetching requested mentors:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json(mentors);
          }
        });
      } else {
        // No requested mentors found
        res.status(200).json([]);
      }
    }
  });
});

// Route to handle mentorship details submission
app.post('/api/mentorship/details', (req, res) => {
  const mentorshipData = req.body;

  // Extract mentor and mentee IDs from mentorshipData
  const { mentor, mentees, teachingSchedule, subject, hoursPerDay, timings, gmeetLink } = mentorshipData;

  // SQL query to insert mentorship details into mentorship_details table
  const insertQuery = `
    INSERT INTO mentorship_details (mentor_id, mentee_id, teaching_schedule, subject, hours_per_day, timings, gmeet_link)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [mentor, mentees, teachingSchedule, subject, hoursPerDay, timings, gmeetLink], (err, results) => {
    if (err) {
      console.error('Error inserting mentorship details:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Update requested_mentees and requested_mentors columns in users table
      const updateMentorQuery = `UPDATE users SET requested_mentees = JSON_REMOVE(requested_mentees, JSON_UNQUOTE(JSON_SEARCH(requested_mentees, 'one', ?))) WHERE id = ?`;
      const updateMenteeQuery = `UPDATE users SET requested_mentors = JSON_REMOVE(requested_mentors, JSON_UNQUOTE(JSON_SEARCH(requested_mentors, 'one', ?))) WHERE id = ?`;

      db.query(updateMentorQuery, [mentees, mentor], (err, mentorResult) => {
        if (err) {
          console.error('Error updating requested mentees:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          db.query(updateMenteeQuery, [mentor, mentees], (err, menteeResult) => {
            if (err) {
              console.error('Error updating requested mentors:', err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.status(200).json({ message: 'Mentorship details submitted successfully' });
            }
          });
        }
      });
    }
  });
});

// Route to fetch mentorship details for current user
app.get('/api/mentorship/detailss', (req, res) => {
  const userId = req.query.userId;
  const roleQuery = 'SELECT role FROM users WHERE id = ?';
  
  db.query(roleQuery, [userId], (err, roleResult) => {
    if (err) {
      console.error('Error fetching user role:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const role = roleResult[0].role;
      let fetchQuery, column;
      if (role === 'staff' || role === 'alumni') {
        column = 'mentor_id';
      } else {
        column = 'mentee_id';
      }
      fetchQuery = `
        SELECT * FROM mentorship_details 
        WHERE ${column} = ?`;
      
      db.query(fetchQuery, [userId], (err, details) => {
        if (err) {
          console.error('Error fetching mentorship details:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json(details);
        }
      });
    }
  });
});

// Route to handle removal of requested mentees or mentors
app.post('/api/mentorship/remove', (req, res) => {
  const { userId, removedUserId, role } = req.body;

  let updateColumn, removedColumn;
  if (role === 'staff' || role === 'alumni') {
    updateColumn = 'requested_mentees';
    removedColumn = 'requested_mentors';
  } else {
    updateColumn = 'requested_mentors';
    removedColumn = 'requested_mentees';
  }

  // Remove removedUserId from the current user's requested mentees/mentors
  const updateQuery = `UPDATE users SET ${updateColumn} = JSON_REMOVE(${updateColumn}, JSON_UNQUOTE(JSON_SEARCH(${updateColumn}, 'one', ?))) WHERE id = ?`;
  db.query(updateQuery, [removedUserId, userId], (err, result) => {
    if (err) {
      console.error('Error removing requested mentees/mentors:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Remove userId from the removed user's requested mentors/mentees
      const removeQuery = `UPDATE users SET ${removedColumn} = JSON_REMOVE(${removedColumn}, JSON_UNQUOTE(JSON_SEARCH(${removedColumn}, 'one', ?))) WHERE id = ?`;
      db.query(removeQuery, [userId, removedUserId], (err, result) => {
        if (err) {
          console.error('Error removing requested mentors/mentees:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json({ message: 'Requested mentees/mentors removed successfully' });
        }
      });
    }
  });
});

// Handle DELETE request to finish a mentorship
app.delete('/api/mentorship/details/finish', (req, res) => {
  const id = req.query.id;
  const query = 'DELETE FROM mentorship_details WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error finishing mentorship:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Mentorship finished successfully' });
    }
  });
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
