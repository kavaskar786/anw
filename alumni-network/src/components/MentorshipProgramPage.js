// Import React and useState, useEffect hooks
import React, { useState, useEffect } from 'react';
import './css/MentorshipProgramPage.css';
import Footer from '../components/Footer';

// MentorshipPage component
const MentorshipPage = () => {
  // State variables
  const [requests, setRequests] = useState([]);
  const [head, setHead] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teachingSchedule: 'Everyday',
    subject: '',
    hoursPerDay: '',
    timings: '',
    gmeetLink: '' // Added gmeetLink to the formData
  });
  const [mentorshipDetails, setMentorshipDetails] = useState([]);

  // Function to get the current user's ID from localStorage
  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };

  // useEffect hook to fetch mentorship requests on component mount
  useEffect(() => {
    fetchRequests();
    fetchMentorshipDetails();
  }, []);

  // Function to fetch mentorship requests based on user's role
  const fetchRequests = async () => {
    try {
      const userId = getUserId();
      const roleResponse = await fetch(`http://localhost:5000/api/currentUser/role?userId=${userId}`);
      const { role } = await roleResponse.json();
      let requestsResponse;
      if (role === 'staff' || role === 'alumni') {
        setHead("Requested mentees");
        requestsResponse = await fetch(`http://localhost:5000/api/mentorship/mentees?userId=${userId}`);
      } else {
        setHead("Requested mentors");
        requestsResponse = await fetch(`http://localhost:5000/api/mentorship/mentors?userId=${userId}`);
      }
      const requestsData = await requestsResponse.json();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching mentorship requests:', error);
    }
  };

  const fetchMentorshipDetails = async () => {
    try {
      const userId = getUserId();
      const mentorshipResponse = await fetch(`http://localhost:5000/api/mentorship/detailss?userId=${userId}`);
      const detailsData = await mentorshipResponse.json();
      setMentorshipDetails(detailsData);
    } catch (error) {
      console.error('Error fetching mentorship details:', error);
    }
  };

  // Function to handle accepting a mentorship request
  const handleAcceptRequest = async (id) => {
    setShowForm(true);
    setFormData({ ...formData, mentees: id });
  };

  // Function to handle form input change
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleFormSubmit = async () => {
    try {
      const userId = getUserId();
      const mentorshipData = { ...formData, mentor: userId };
      await fetch('http://localhost:5000/api/mentorship/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mentorshipData)
      });
      setShowForm(false);
      fetchRequests();
      fetchMentorshipDetails();
    } catch (error) {
      console.error('Error submitting mentorship details:', error);
    }
  };

  // Function to handle deleting a mentorship request
  const handleRemoveRequest = async (removedUserId) => {
    try {
      const userId = getUserId();
      const roleResponse = await fetch(`http://localhost:5000/api/currentUser/role?userId=${userId}`);
      const { role } = await roleResponse.json();

      const removeResponse = await fetch('http://localhost:5000/api/mentorship/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, removedUserId, role })
      });

      if (removeResponse.ok) {
        // Refresh the requests after successful removal
        fetchRequests();
      } else {
        console.error('Failed to remove requested mentee/mentor');
      }
    } catch (error) {
      console.error('Error removing requested mentee/mentor:', error);
    }
  };

  const handleFinishMentorship = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mentorship/details/finish?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Remove the finished mentorship from the local state
        setMentorshipDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
      } else {
        console.error('Failed to finish mentorship:', response.statusText);
      }
      fetchRequests();
      fetchMentorshipDetails();
    } catch (error) {
      console.error('Error finishing mentorship:', error);
    }
  };

  const handleOpenGMeetLink = (link) => {
    window.open(link, '_blank');
  };


  // Return JSX
  return (
    <div>

    <div className='mentorship-container'>
    <div className='mentorship-content'>
      <h1>Mentorship Requests</h1>
      <div>
      <h3>{head}</h3>
        {requests.map(request => (
          <div key={request.id} className='ment'>
            {console.log(request)}
            <div className='req_cont'>
            <div className='req_img'>
              <img src={request.profilePicture} alt="Profile Picture" />
            </div>
            <div className='req_details'>
            <p>Name: {request.firstName}{" "}{request.lastName}</p>
            <p>Username: {request.username}</p>
            <p>Email: {request.email}</p>
            <p>Skills: {request.skills}</p>
            </div>
            </div>
            {head === "Requested mentees" ? (
              <div className='req_buttons'>
                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                <button onClick={() => handleRemoveRequest(request.id)}>Delete</button>
              </div>
            ) : (
              <div className='req_buttons'>
              <button onClick={() => handleRemoveRequest(request.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
       {/* Mentorship Details Table */}
       <div className='mentorship-details'>
        <h3>Mentorship Details</h3>
        <table>
          <thead>
            <tr>
              <th>Mentor--Mentee</th>
              <th>Teaching Schedule</th>
              <th>Subject</th>
              <th>Hours Per Day</th>
              <th>Timings</th>
              <th>GMeet Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mentorshipDetails.map(detail => (
              <tr key={detail.id}>
                <td>{detail.mentor_id}/{detail.mentee_id}</td>
                {console.log(detail.mentor_id)}
                <td>{detail.teaching_schedule}</td>
                <td>{detail.subject}</td>
                <td>{detail.hours_per_day}</td>
                <td>{detail.timings}</td>
                <td>
                  {console.log(detail)}
                  <button onClick={() => handleOpenGMeetLink(detail.gmeet_link)}>GMeet</button>
                </td>
                <td>
                  <button onClick={() => handleFinishMentorship(detail.id)}>Finish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mentorship Form Modal */}
      {showForm && (
        <div className='mentorship-form-modal'>
          <div className='mentorship-form-content'>
            <span className="close" onClick={() => setShowForm(false)}>hello</span>
            <h2>Enter Mentorship Details</h2>
            <label htmlFor="teachingSchedule">Teaching Schedule:</label>
            <select id="teachingSchedule" name="teachingSchedule" value={formData.teachingSchedule} onChange={handleFormChange}>
              <option value="Everyday">Everyday</option>
              <option value="Only on working days">Only on working days</option>
              <option value="Only on weekends">Only on weekends</option>
            </select>
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleFormChange} />
            <label htmlFor="hoursPerDay">Hours Per Day:</label>
            <input type="number" id="hoursPerDay" name="hoursPerDay" value={formData.hoursPerDay} onChange={handleFormChange} />
            <label htmlFor="timings">Exact Timings:</label>
            <input type="text" id="timings" name="timings" value={formData.timings} onChange={handleFormChange} />
            {/* Input field for Google Meet link */}
            <label htmlFor="gmeetLink">Google Meet Link:</label>
            <input type="text" id="gmeetLink" name="gmeetLink" value={formData.gmeetLink} onChange={handleFormChange} />
            <button onClick={handleFormSubmit} type='submit'>Submit</button>
          </div>
        </div>
      )}
    </div>
    </div>
    <Footer />
    </div>
    
  );
};

// Export the MentorshipPage component
export default MentorshipPage;
