// LoginPage.js

import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './css/LoginPage.css'; // Import the CSS file for styling
import Footer from '../components/Footer';
import axios from 'axios';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  //const [error,setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

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
      const response = await axios.post('http://localhost:5000/login', {
        usernameOrEmail,
        password,
      });

      const { success, userId } = response.data;

      if (success) {
        // Encrypt and set user ID in local storage
        const encryptedUserId = btoa(userId); // Using simple base64 encoding for demonstration
        localStorage.setItem('userId', encryptedUserId);

        setShowSuccessPopup(true);

        await delay(500);


        navigate('/');
        await delay(500);
        window.location.reload();


        const isAuthenticated = true; // Replace with actual authentication logic

        if (isAuthenticated) {
          if (rememberMe) {
            localStorage.setItem('userData', JSON.stringify({ usernameOrEmail, userId }));
          }
          console.log('User authenticated!');
        } else {
          alert('Invalid username/email or password. Please try again.');
        }
      } else {
        alert('Invalid username/email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid username/email or password. Please try again.');
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
    <div>
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
        {showSuccessPopup && (
        <div className="scs_pp">
          <p className="scs_p">Login successful!</p>
          <button onClick={() => setShowSuccessPopup(false)} className="scs_btn">Close</button>
        </div>
      )}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default LoginPage;
