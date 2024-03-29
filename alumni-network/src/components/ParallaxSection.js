// ParallaxSection.js

import React, { useRef, useEffect } from 'react';
import './css/ParallaxSection.css';

const ParallaxSection = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const parallaxScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const parallaxOffset = parallaxRef.current.offsetTop;
      const parallaxSpeed = 0.5; // Adjust this value to control the parallax speed

      parallaxRef.current.style.backgroundPositionY = `${(scrollTop - parallaxOffset) * parallaxSpeed}px`;
    };

    window.addEventListener('scroll', parallaxScroll);

    return () => {
      window.removeEventListener('scroll', parallaxScroll);
    };
  }, []);

  return (
    <section className="parallax-section" ref={parallaxRef}>
      <div className="parallax-content">
        <h2>Experience the Parallax Effect</h2>
        <p>This is a simple parallax section. Scroll down to see the effect!</p>
      </div>
    </section>
  );
};

export default ParallaxSection;
