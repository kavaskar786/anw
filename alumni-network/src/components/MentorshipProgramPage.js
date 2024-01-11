// MentorshipProgramPage.js

import React from 'react';
import './css/MentorshipProgramPage.css';

const MentorshipProgramPage = () => {
  // Placeholder mentorship program data (replace with actual data)
  const mentorshipData = [
    { id: 1, mentor: 'John Doe', expertise: 'Software Development', availability: 'Available' },
    { id: 2, mentor: 'Jane Smith', expertise: 'Marketing Strategy', availability: 'Limited' },
    // Add more mentorship program entries as needed
  ];

  return (
    <div>
      <h2>Mentorship Program Page</h2>
      {mentorshipData.map((entry) => (
        <div key={entry.id} className="mentorship-entry">
          <h3>{entry.mentor}</h3>
          <p>Expertise: {entry.expertise}</p>
          <p>Availability: {entry.availability}</p>
          {/* Add more mentorship program details as needed */}
        </div>
      ))}
    </div>
  );
};

export default MentorshipProgramPage;
