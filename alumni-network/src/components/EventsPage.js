// EventsPage.js

import React from 'react';
import './css/EventsPage.css'; // Import the CSS file for styling

const EventsPage = () => {
  const eventsData = [
    { id: 1, title: 'Networking Mixer', date: '2024-05-15', location: 'Virtual Event' },
    { id: 2, title: 'Career Workshop', date: '2024-06-10', location: 'Conference Room A' },
    // Add more events as needed
  ];

  return (
    <div className="events-container">
      <h2>Events Page</h2>
      {eventsData.map((event) => (
        <div key={event.id} className="event-entry">
          <h3>{event.title}</h3>
          <p>Date: {event.date}</p>
          <p>Location: {event.location}</p>
          {/* Add more event details as needed */}
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
