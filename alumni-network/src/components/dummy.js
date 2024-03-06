// ProfilePage.js

import React, { useState, useEffect } from 'react';
import './css/ProfilePage.css'; // Import the CSS file for styling
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
    bio: 'Passionate about connecting people through technology.',
    workExperience: [
      {
        jobTitle: 'Software Developer',
        company: 'Tech Solutions Inc.',
        year: '2018 - Present',
      },
      // Add more work experience entries as needed
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Example',
        year: '2014 - 2018',
      },
      // Add more education entries as needed
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'SQL'],
    // Add more user details as needed
    // For example: graduationYear, location, etc.
  });

  useEffect(() => {
    // Simulate fetching user details from a backend or API
    // In a real app, you would make an actual API call here
    const fetchData = async () => {
      try {
        // Simulate an API response with a delay
        const response = await fetch('https://api.example.com/user'); // Replace with your actual API endpoint
        const userData = await response.json();

        // Update the user state with fetched data
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className='prof_cont'>
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.profilePicture} alt="Profile" />
        <h1>{user.firstName} {user.lastName}</h1>
        <p>Email: {user.email}</p>
      </div>

      <div className="profile-navigation">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#education">Education</a>
        <a href="#skills">Skills</a>
      </div>

      <div className="profile-content">
        <section className="about-section" id="about">
          <h2 className='text-heading'>About Me</h2>
          <p className='p-text'>{user.bio}</p>
        </section>
          
        <section className="experience-section" id="experience">
          <h2 className='text-heading'>Work Experience</h2>
          <ul>
            {user.workExperience.map((exp, index) => (
              <li key={index}>
                <strong>{exp.jobTitle}</strong> at {exp.company}, {exp.year}
              </li>
            ))}
          </ul>
        </section>

        <section className="education-section" id="education">
          <h2 className='text-heading'>Education</h2>
          <ul>
            {user.education.map((edu, index) => (
              <li key={index}>
                {edu.degree} at {edu.school}, {edu.year}
              </li>
            ))}
          </ul>
        </section>

        <section className="skills-section" id="skills">
          <h2 className='text-heading'>Skills</h2>
          <ul>
            {user.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ProfilePage;