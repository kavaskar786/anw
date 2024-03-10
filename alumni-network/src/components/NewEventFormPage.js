// NewEventFormPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './css/NewEventFormPage.css';

const NewEventFormPage = ({ onAddEvent }) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    registrationLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = getUserId();
  
    const eventDataWithUserId = { ...eventData, userId };
  
    try {
      const response = await fetch('http://localhost:5000/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDataWithUserId),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log('Event added successfully');
        navigate('/events');
      } else {
        console.error('Error adding event:', data.message);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };
  

  return (
    <div>
      <div className="new-event-form-page-container">
        <form onSubmit={handleSubmit} className="event-form">
          <h1>Add New Event</h1>
          <div className="form-group">
            <label htmlFor="title">Event Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="text"
              id="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registrationLink">Registration Link:</label>
            <input
              type="url"
              id="registrationLink"
              name="registrationLink"
              value={eventData.registrationLink}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Event</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewEventFormPage;
