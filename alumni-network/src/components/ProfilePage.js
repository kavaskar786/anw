// ProfilePage.js

import React from 'react';
import './css/ProfilePage.css'; // Import the CSS file for styling

const ProfilePage = () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <div className="profile-details">
        <div>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
};

export default ProfilePage;
