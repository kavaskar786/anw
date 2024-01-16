// ContactUsPage.js

import React, { useState } from 'react';
import './css/ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    graduationYear: '',
    major: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., sending an email or saving feedback
    // Simulate form submission success
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };

  return (
    <div className="background-container ">
    <div className="contact-container">
     <center><h2 className="contact-header">Contact Us</h2></center>
      <p className="contact-details">
        If you have any questions, feedback, or need assistance, please reach out to us. Alumni are always
        welcome to connect!
      </p>

      <p className="contact-details">
        You can also use the form below to contact us:
      </p>

      {formSubmitted ? (
        <div className="success-message">
          Thank you for reaching out! We'll get back to you soon.
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="graduationYear">Graduation Year:</label>
            <input
              type="text"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="major">Major:</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message:</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default ContactUsPage;
