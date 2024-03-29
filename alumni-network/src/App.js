// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ProfilePage from './components/ProfilePage';
import DirectoryPage from './components/DirectoryPage';
import EventsPage from './components/EventsPage';
import NewsPage from './components/NewsPage';
import JobBoardPage from './components/JobBoardPage';
import DiscussionForumPage from './components/DiscussionForumPage';
import MentorshipProgramPage from './components/MentorshipProgramPage';
import SettingsPage from './components/SettingsPage';
import ContactUsPage from './components/ContactUsPage';
import NewEventFormPage from './components/NewEventFormPage';
import Gallery from './components/GalleryPage';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const App = () => {
  return (
    <Router>
      <div className='nav1'>
        <div>
        <center><Navigation /></center>
      </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<NewEventFormPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/jobboard" element={<JobBoardPage />} />
          <Route path="/discussion" element={<DiscussionForumPage />} />
          <Route path="/mentorship" element={<MentorshipProgramPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
