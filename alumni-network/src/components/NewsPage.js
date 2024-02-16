// NewsPage.js

import React from 'react';
import Footer from '../components/Footer';
import './css/NewsPage.css';

const NewsPage = () => {
  return (
    <div>
    <div className="news-page-container">
      <div className="news-content">
        <h1>News and Updates</h1>
        <div className="news-item">
          <h2>Exciting Announcement</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed mauris et risus tincidunt
            fringilla vel eget justo.
          </p>
        </div>
        <div className="news-item">
          <h2>New Feature Release</h2>
          <p>
            Curabitur vel dolor eu eros bibendum sagittis. Aliquam erat volutpat. Quisque ut est sem.
          </p>
        </div>
        {/* Add more news items as needed */}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default NewsPage;
