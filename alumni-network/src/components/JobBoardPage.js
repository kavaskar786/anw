import React, { useState, useEffect } from 'react';
import './css/JobBoardPage.css';
import Footer from './Footer';

function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };
  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        console.error('Failed to fetch jobs:', data.message);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const currentUserId = getUserId();
    e.preventDefault();
    try {
      if (editId) {
        // Update existing job if editId is set
        await fetch(`http://localhost:5000/api/jobs/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        setEditId(null); // Reset editId after updating
      } else {
        // Add new job if editId is not set
        await fetch('http://localhost:5000/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formData, userId: currentUserId }) // Include userId in the request body
        });
      }
      setFormData({
        title: '',
        company: '',
        location: '',
        description: ''
      });
      fetchJobs(); // Fetch updated jobs after adding or updating a job
    } catch (error) {
      console.error('Error adding/updating job:', error);
    }
  };
  

  const handleEdit = (job) => {
    setFormData({ ...job });
    setEditId(job.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE'
      });
      fetchJobs(); // Fetch updated jobs after deleting a job
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div>
      <section id="job-listings" className='p-5 job'>
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <input type="text" id="job" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
            <input type="text"id="job" name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} required />
            <input type="text" id="job"name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} required />
            <textarea name="description"id="job" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
            <button type="submit">{editId ? 'Update Job' : 'Add Job'}</button>
          </form>


          {jobs.map(job => (
            <article className="job-listing" key={job.id}>
              <h2>{job.title}</h2>
              <p>Company: {job.company}</p>
              <p>Location: {job.location}</p>
              <p>Description: {job.description}</p>
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job.id)}>Delete</button>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default JobBoardPage;
