import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; 
import './css/SettingsPage.css';

const SettingsPage = () => {
  const handleLogout = () => {
    // Remove user ID from local storage
    localStorage.removeItem('userId');
    // Reload the page to reflect the changes
    window.location.reload();
  };

  const userId = localStorage.getItem('userId');

  return (
    <div className='settings-container'>
    <div>
      {userId ? ( // Check if userId exists
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link> // Redirect to login page if userId does not exist
      )}
      <Footer />
    </div>
    </div>
  );
};

export default SettingsPage;
