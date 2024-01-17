// NewsItem.js

import React from 'react';
import './css/NewsPage.css'; // Import the CSS file for NewsItem

const NewsItem = ({ article, onClick }) => {
  console.log('Rendering NewsItem for article:', article);

  return (
    <div className="news-item-container" onClick={onClick}>
      <h3 className="news-item-title">{article?.headline}</h3>
      <p className="news-item-date">{article?.publicationDate}</p>
      <p className="news-item-summary">{article?.summary}</p>
    </div>
  );
};

export default NewsItem;
