// NewsPage.js

import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import './css/NewsPage.css'; // Import the CSS file for NewsPage

const NewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFunction();
        setNews(data || []); // Set an empty array if data is undefined
      } catch (error) {
        console.error('Error fetching news data:', error);
        setNews([]); // Set an empty array in case of an error
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  console.log(news);

  return (
    <div className="news-page-container">
      <h2 className="news-page-title">News and Updates</h2>
      <div className="news-list-container">
        {news.map(article => (
          <NewsItem
            key={article.id}
            article={article}
            onClick={() => handleArticleClick(article)}
          />
        ))}
      </div>
    </div>
  );
};

const handleArticleClick = (article) => {
  console.log('Article clicked:', article);
};

const fetchDataFunction = async () => {
  try {
    // Replace this with your actual data fetching logic
    const response = await fetch('https://api.example.com/news');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Re-throw the error to be caught in the useEffect
  }
};

export default NewsPage;
