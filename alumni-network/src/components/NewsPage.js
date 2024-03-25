import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './css/NewsPage.css';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news1');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      } else {
        console.error('Failed to fetch news:', response.status);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleAddNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const data = await response.json();
        setNews([...news, { id: data.id, title, content }]);
        setTitle('');
        setContent('');
      } else {
        console.error('Failed to add news:', response.status);
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNews(news.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete news:', response.status);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleEditNews = async (id) => {
    try {
      const updatedTitle = prompt('Enter the updated title:');
      const updatedContent = prompt('Enter the updated content:');
      if (updatedTitle && updatedContent) {
        const response = await fetch(`http://localhost:5000/api/news/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
        });
        if (response.ok) {
          const updatedNews = news.map((item) =>
            item.id === id ? { ...item, title: updatedTitle, content: updatedContent } : item
          );
          setNews(updatedNews);
        } else {
          console.error('Failed to edit news:', response.status);
        }
      }
    } catch (error) {
      console.error('Error editing news:', error);
    }
  };

  return (
    <div>
      <div className="news-page-container">
        <div className="news-content">
          <h1>News and Updates</h1>
          <div className="news-item">
            <h2>Add News</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button onClick={handleAddNews}>Add News</button>
          </div>
          {news.map((item) => (
            <div className="news-item" key={item.id}>
              {editingId !== item.id ? (
                <>
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                  <button onClick={() => handleEditNews(item.id)}>Edit</button>
                  <button onClick={() => handleDeleteNews(item.id)}>Delete</button>
                </>
              ) : (
                <div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      setNews(news.map((n) => (n.id === item.id ? { ...n, title: e.target.value } : n)))
                    }
                  />
                  <textarea
                    value={item.content}
                    onChange={(e) =>
                      setNews(news.map((n) => (n.id === item.id ? { ...n, content: e.target.value } : n)))
                    }
                  ></textarea>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      handleEditNews(item.id);
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
