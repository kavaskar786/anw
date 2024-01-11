// HomePage.js

import React from 'react';
import Footer from '../components/Footer';
import './css/HomePage.css'; // Import the CSS file for stylingz

const HomePage = () => {
  return (
    <div>
    <div className="homepage-container">
      <div className="homepage-content">
        <h1>Welcome to the Alumni Network!</h1>
        <p>This is the homepage of our alumni networking web app.</p>
        <p>Feel free to explore and connect with fellow alumni.</p>
      </div>
    </div>
      <Footer />
      </div>
  );
};

export default HomePage;
