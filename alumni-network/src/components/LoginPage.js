// LoginPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    const { usernameOrEmail, password } = loginData;

    // Simple validation example
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please enter both username or email and password.');
      return;
    }

    // Additional validation logic (e.g., email format validation)

    // If validation passes, proceed with login
    console.log('Login data:', loginData);

    // Clear the error state
    setError('');
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
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
      <p>
        New user? <Link to="/registration">Register here</Link>.
      </p>
    </div>
    </div>
  );
};

export default LoginPage;
