import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './css/EventsPage.css';

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
 const [selectedEvent, setSelectedEvent] = useState(null);
  
  
  useEffect(() => {
    // Fetch events from the server when the component mounts
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();

        if (data.success) {
          setEventsData(data.events);
        } else {
          console.error('Error fetching events:', data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Run this effect only once when the component mounts

  const handleEditClick = (event) => {
    setSelectedEvent(event);
  };

  const handlePopupClose = () => {
    setSelectedEvent(null);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Check if the date is valid before formatting
      return date.toISOString().split('T')[0];
    }
    return ''; // Return an empty string if the date is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // Log the name and value to check if they are correct
    
    setSelectedEvent((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/events/delete/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setEventsData((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      } else {
        console.error('Error deleting event:', data.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditSubmit = async (updatedEventData) => {
    try {
      updatedEventData= {...selectedEvent}
      // console.log(updatedEventData.date)
      // Format the date before sending it to the server
      updatedEventData.date = formatDate(updatedEventData.date);
  
      // Create a new object with only the relevant fields
      const updatedEventFields = {
        title: updatedEventData.title,
        date: updatedEventData.date,
        time: updatedEventData.time,
        location: updatedEventData.location,
        description: updatedEventData.description,
        registrationLink: updatedEventData.registrationLink,
      };
  
      const response = await fetch(`http://localhost:5000/events/update/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEventFields),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Update the events list with the edited event
        setEventsData((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? { ...event, ...updatedEventFields } : event
          )
        );
        // Close the edit popup
        handlePopupClose();
      } else {
        console.log('Error updating event:', data.message);
        // Handle error scenario, e.g., display an error message to the user
      }
    } catch (error) {
      console.log('Error updating event:', error);
      // Handle error scenario, e.g., display an error message to the user
    }
  };
  
  
  

  return (
    <div>
      <div className="events-page-container">
        <h1>Upcoming Events</h1>
        <div className="events-list">
          {eventsData.map((event, index) => (
            <div key={index} className="event-item">
              <h2>{event.title}</h2>
              <p>Date: {formatDate(event.date)}</p>
              <p>Time: {event.time}</p>
              <p>Location: {event.location}</p>
              <p>{event.description}</p>
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                RSVP or Register
              </a>
              <button onClick={() => handleEditClick(event)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          ))}
        </div>
        <Link to="/events/new" className="add-event-link">
          Add New Event
        </Link>
      </div>
      {selectedEvent && (
        <div className="edit-event-popup">
          <div className="popup-content">
            <span className="close" onClick={handlePopupClose}>
              &times;
            </span>
            <h2>Edit Event</h2>
            <form onSubmit={(e) => handleEditSubmit(e)}>
              <div className="form-group">
                <label htmlFor="title">Event Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={selectedEvent.title}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              {/* {console.log(selectedEvent.date)} */}
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formatDate(selectedEvent.date)}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={selectedEvent.time}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={selectedEvent.location}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={selectedEvent.description}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="registrationLink">Registration Link:</label>
                <input
                  type="url"
                  id="registrationLink"
                  name="registrationLink"
                  value={selectedEvent.registrationLink}
                  onChange={(e) => handleChange(e)}
                  required
                />
                
              </div>
              <button type="submit">Update Event</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EventsPage;
