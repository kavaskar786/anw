// RegisterPage.js

import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './css/RegisterPage.css';
import axios from 'axios';

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // New field for user role
  });

  const [error, setError] = useState('');
  const  navigate= useNavigate(); // Get the history object
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation example
    if (!registerData.username.trim() || !registerData.email.trim() || !registerData.password.trim() || !registerData.confirmPassword.trim() || !registerData.role) {
      setError('Please fill in all fields.');
      return;
    }

    // Additional validation logic (e.g., password confirmation)

    // If validation passes, proceed with registration
    console.log('Registration data:', registerData);

    // Clear the error state
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/register', registerData);

      console.log(response.data);
      // Handle success or redirect to another page
      if (response.data.success) {
        setShowSuccessPopup(true);
        await delay(1500);
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Username or email already exists. Please try another.');
      } else {
        console.error('Error during registration:', error);
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div>
    <div className="register-page-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Create an Account</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={registerData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select your role</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" id="registerButton">
          Register
        </button>
      </form>
      <p id="loginLink">
        Already have an account? <Link to="/login" id="loginLink">Login here</Link>.
      </p>

      {showSuccessPopup && (
        <div className="success-popup">
          <p>Registration successful!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default RegisterPage;
