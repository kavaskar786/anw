// DirectoryPage.js

import React, { useState } from 'react';
import AlumniService from './AlumniProfileCard'; 
import './css/DirectoryPage.css';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const alumniData = await AlumniService.searchAlumni(searchTerm);
      setSearchResults(alumniData);
    } catch (error) {
      console.error('Error fetching alumni data:', error.message);
    }
  };

  return (
    <div className="Directcont">
    <div>
    <center>  <h2 className="directory-heading">Alumni Directory</h2></center>
      <div className="directory-search-bar">
        <input
          type="text"
          placeholder="Search by name, graduation year, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="directory-search-input"
        />
        <button onClick={handleSearch} className="directory-search-button">Search</button>
      </div>

      {searchResults.length > 0 ? (
        <ul className="directory-results-list">
          {searchResults.map((alumni) => (
            <li key={alumni.id} className="directory-results-item">
              <p>{alumni.name}</p>
              <p>{alumni.graduationYear}</p>
              <p>{alumni.location}</p>
            </li>
          ))}
        </ul>
      ) : (
       <center> <p className="directory-no-results">No results found.</p></center>
      )}
    </div>
    </div>
  );
};

export default DirectoryPage;
