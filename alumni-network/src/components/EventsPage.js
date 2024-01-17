// EventsPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
//import NewEventFormPage from './NewEventFormPage';
import './css/EventsPage.css';

const EventsPage = () => {
  const [eventsData] = useState([]);


  // const handleAddEvent = (newEventData) => {
  //   setEventsData((prevEvents) => [...prevEvents, newEventData]);
  // };

  return (
    <div>
      <div className="events-page-container">
        <h1>Upcoming Events</h1>
        <div className="events-list">
          {eventsData.map((event, index) => (
            <div key={index} className="event-item">
              <h2>{event.title}</h2>
              <p>Date: {event.date}</p>
              <p>Time: {event.time}</p>
              <p>Location: {event.location}</p>
              <p>{event.description}</p>
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                RSVP or Register
              </a>
            </div>
          ))}
        </div>
        <Link to="/events/new" className="add-event-link">
          Add New Event
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
