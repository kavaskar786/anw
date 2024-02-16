// SettingsPage.js

import React, { useState } from 'react';
import Footer from '../components/Footer';
import './css/SettingsPage.css';

const SettingsPage = () => {
  const [settingsData, setSettingsData] = useState({
    username: 'exampleUser',
    email: 'user@example.com',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example
    if (!settingsData.newPassword.trim() || !settingsData.confirmNewPassword.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    // Additional validation logic (e.g., password confirmation)

    // If validation passes, proceed with updating settings
    console.log('Settings data:', settingsData);

    // Clear the error state
    setError('');
  };

  return (
    <div>
    <div className="settings-page-container">
      <form onSubmit={handleSubmit} className="settings-form">
        <h1>Account Settings</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={settingsData.username}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={settingsData.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={settingsData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={settingsData.confirmNewPassword}
            onChange={handleChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" id="updateSettingsButton">
          Update Settings
        </button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default SettingsPage;
