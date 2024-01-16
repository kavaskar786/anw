// LoginPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async () => {
    const { usernameOrEmail, password, rememberMe } = loginData;

    if (!usernameOrEmail.trim() || !password.trim()) {
      // Display a popup alert for the validation error
      alert('Please enter both username or email and password.');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call for authentication (replace with actual authentication logic)
      const isAuthenticated = false; // Replace with actual authentication logic

      if (isAuthenticated) {
        if (rememberMe) {
          localStorage.setItem('userData', JSON.stringify({ usernameOrEmail }));
        }
        console.log('User authenticated!');
      } else {
        // Display a popup alert for authentication error
        alert('Invalid username/email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      // Display a popup alert for general error
      alert('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2>Login Page</h2>
        <form>
          <div>
            <label htmlFor="usernameOrEmail">Username or Email:</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={loginData.usernameOrEmail}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button type="button" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          New user? <Link to="/registration">Register here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
