// HomePage.js

import React from 'react';
import Slider from 'react-slick';
import Footer from '../components/Footer';
import './css/HomePage.css'; // Import the CSS file for styling

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  // Sample data for combined carousel
  const carouselData = [
    { type: 'event', content: 'Event 1 - Date and Time' },
    { type: 'profile', content: 'Featured Alumni 1' },
    { type: 'event', content: 'Event 2 - Date and Time' },
    { type: 'profile', content: 'Featured Alumni 2' },
  ];

  // Slick carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div>
      <div className="homepage-container">
        <div className="homepage-content">
          {/* Combined Carousel */}
        <div className="carousel-section">
          <Slider {...carouselSettings}>
            {carouselData.map((item, index) => (
              <div key={index}>
                <p>{item.content}</p>
              </div>
            ))}
          </Slider>
        </div>
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
