// HomePage.js

import React from 'react';
import Slider from 'react-slick';
import Footer from '../components/Footer';
import './css/HomePage.css'; // Import the CSS file for styling

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  // Sample data for image carousel
  const carouselData = [
    { type: 'event', imageUrl: 'https://wowslider.com/sliders/demo-93/data1/images/lake.jpg' },
    { type: 'profile', imageUrl: 'https://wowslider.com/sliders/demo-93/data1/images/lake.jpg' },
    { type: 'event', imageUrl: 'https://wowslider.com/sliders/demo-93/data1/images/lake.jpg' },
    { type: 'profile', imageUrl: 'https://wowslider.com/sliders/demo-93/data1/images/lake.jpg' },
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
          {/* Image Carousel */}
          <div className="carousel-section">
            <Slider {...carouselSettings}>
              {carouselData.map((item, index) => (
                <div key={index}>
                  <img src={item.imageUrl} alt="" />
                </div>
              ))}
            </Slider>
          </div>
          <pre>

            
          </pre>
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
