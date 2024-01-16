// AlumniProfileCard.js

import React from 'react';

const AlumniProfileCard = ({ alumni }) => {
  return (
    <div className="profile-card">
      <img
        src={alumni.profileImage} // Assuming each alumni object has a profileImage property
        alt={`${alumni.name}'s profile`}
        className="profile-image"
      />
      <div className="profile-details">
        <h3>{alumni.name}</h3>
        <p>{alumni.degree}</p>
        <p>{alumni.graduationYear}</p>
        {/* Add more details based on your data */}
      </div>
    </div>
  );
};

export default AlumniProfileCard;
