// NewsPage.js

import React from 'react';
import './css/NewsPage.css';

const NewsPage = () => {
  // Placeholder news data (replace with actual news data)
  const newsData = [
    { id: 1, title: 'Latest Updates', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'New Features Added', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    // Add more news articles as needed
  ];

  return (
    <div>
      <h2>News Page</h2>
      {newsData.map((article) => (
        <div key={article.id} className="news-entry">
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          {/* Add more article details as needed */}
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
