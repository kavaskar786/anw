// JobBoardPage.js

import React from 'react';
import './css/JobBoardPage.css';

const JobBoardPage = () => {
  // Placeholder job data (replace with actual job data)
  const jobData = [
    { id: 1, title: 'Software Engineer', company: 'TechCo', location: 'San Francisco, CA' },
    { id: 2, title: 'Marketing Specialist', company: 'MarketingPro', location: 'New York, NY' },
    // Add more job listings as needed
  ];

  return (
    <div>
      <h2>Job Board Page</h2>
      {jobData.map((job) => (
        <div key={job.id} className="job-entry">
          <h3>{job.title}</h3>
          <p>Company: {job.company}</p>
          <p>Location: {job.location}</p>
          {/* Add more job details as needed */}
        </div>
      ))}
    </div>
  );
};

export default JobBoardPage;
