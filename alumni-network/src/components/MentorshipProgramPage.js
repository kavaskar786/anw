// MentorshipProgramPage.js

import React, { useState, useEffect } from 'react';
import './css/MentorshipProgramPage.css';
import Footer from '../components/Footer';

const MentorshipProgramPage = () => {
  const [mentors, setMentors] = useState([]);

  // Simulate fetching data from an API
  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchData = async () => {
      // Simulating API call or data retrieval.
      const response = await fetch('your_mentors_api_endpoint');
      const data = await response.json();

      setMentors(data);
    };

    fetchData();
  }, []);

  return (
    <div>
    <div className="mentCont">
    <div className="mentorship-container">
      <div className='ment_cont'>
      <h2 className="mentorship-header">Mentorship Program</h2>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <input type="text" placeholder="Search mentors" className="search-input" />
        <select className="filter-dropdown">
          <option value="">Filter by Industry</option>
          <option value="technology">Technology</option>
          {/* Add more industry options */}
        </select>
        <button className="filter-btn">Apply Filters</button>
      </div>

      {/* Mentor List Section */}
      <div className="mentor-list">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <img src={mentor.avatar} alt={`${mentor.name}'s Avatar`} className="mentor-avatar" />
            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-title">{mentor.title}</p>
            <p className="mentor-industry">{mentor.industry}</p>
            <button className="connect-btn">Connect</button>
          </div>
        ))}
      </div>
      </div>
    </div>
    </div>
    <Footer />
    </div>
  );
};

export default MentorshipProgramPage;
