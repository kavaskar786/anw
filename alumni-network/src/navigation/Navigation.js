// Navigation.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('userId');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='parent1'>
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/">
          <img src="https://i.imghippo.com/files/1pJa21708615434.png" alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-center">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/directory">Directory</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/jobboard">Job Board</Link></li>
          <li><Link to="/discussion">Discussion Forum</Link></li>
          <li><Link to="/mentorship">Mentorship Program</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Render links based on user login status */}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="lgn_btn">Login</Link>
            <Link className="lgn_btn" to="/registration">Register</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link to="/profile" className="nav-icon">
              <i className="fas fa-user-circle"></i>
            </Link>
            <Link to="/settings" className="nav-icon">
              <i className="fas fa-cog"></i>
            </Link>
          </>
        )}
      </div>
    </nav>
    </div>
  );
};

export default Navigation;
