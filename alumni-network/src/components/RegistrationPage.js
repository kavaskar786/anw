import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './css/RegisterPage.css';
import axios from 'axios';
import { IoMdMail } from "react-icons/io";
import { FaUser, FaLock } from 'react-icons/fa';

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
  });


  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Invalid email address');
      return;
    }

    // Password complexity check
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(registerData.password)) {
      setError('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    // Username length validation
    if (registerData.username.length < 4 || registerData.username.length > 20) {
      setError('Username must be between 4 and 20 characters long.');
      return;
    }

    // Role selection validation
    if (!['student', 'staff', 'alumni'].includes(registerData.role)) {
      setError('Please select a valid role.');
      return;
    }
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
        <div className='reg_cont'>
          <form onSubmit={handleSubmit} className="register-form">
            <center>
              <h1>Create an Account</h1>
            </center>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="Registerusername"
                  name="username"
                  value={registerData.username}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="Registeremail"
                  name="email"
                  value={registerData.email}
                  onChange={handleChange}
                  required
                />
                <IoMdMail className="icom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  id="registerpassword"
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  minLength={8} // Example of password length validation
                  required
                />
                <FaLock className="icom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  minLength={8} // Example of password length validation
                  required
                />
                <FaLock className="icom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <div className="input-with-icon">
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
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
