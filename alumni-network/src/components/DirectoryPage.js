// DirectoryPage.js

import React from 'react';
import './css/DirectoryPage.css'; // Import the CSS file for styling

const DirectoryPage = () => {
  const directoryData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    // Add more directory entries as needed
  ];

  return (
    <div className="directory-container">
      <h2>Directory Page</h2>
      {directoryData.map((entry) => (
        <div key={entry.id} className="directory-entry">
          <strong>{entry.name}</strong>
          <p>Email: {entry.email}</p>
          {/* Add more directory details as needed */}
        </div>
      ))}
    </div>
  );
};

export default DirectoryPage;
