import React, { useState, useEffect } from 'react';
import './css/ProfilePage.css';
import Footer from '../components/Footer'; 

const ProfilePage = () => {
  const availableSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'HTML',
    'CSS',
    'SQL',
    // Add more skills as needed
  ];

  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
    bio: 'Passionate about connecting people through technology.',
    workExperience: [],
    education: [],
    skills: [],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [newEducation, setNewEducation] = useState({ school: '', degree: '', year: '' });
  const [newExperience, setNewExperience] = useState({ jobTitle: '', company: '', year: '' });
  const [newSkill, setNewSkill] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();

        if (userId) {
          const response = await fetch(`http://localhost:5000/user/${userId}`);
          const userData = await response.json();
          const userData1 = userData.user[0];

          if (!userData1.firstName || !userData1.lastName || !userData1.profilePicture || !userData1.bio || !userData1.skills || !userData1.education || !userData1.workExperience) {
            setShowPopup(true);
          }
          else {
            // Parse the JSON strings into arrays
            userData1.education = JSON.parse(userData1.education);
            userData1.workExperience = JSON.parse(userData1.workExperience);
            userData1.skills = JSON.parse(userData1.skills);

            setUser((prevUser) => ({ ...prevUser, ...userData1 }));
          }
        } 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  
  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      const userId = getUserId();
      const response = await fetch(`http://localhost:5000/uploadImage/${userId}`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Update the user profile picture and close the popup
        setUser((prevUser) => ({ ...prevUser, profilePicture: result.imagePath }));
        setShowImageUpload(false);
      } else {
        console.error('Failed to upload image:', result.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  

  const handleRemoveSkill = (index) => {
    setUser((prevUser) => {
      const updatedSkills = [...prevUser.skills];
      updatedSkills.splice(index, 1);
      return {
        ...prevUser,
        skills: updatedSkills,
      };
    });
    updateBackend();
  };

  const handleAddExperience = () => {
    // Validate and add a new work experience entry
    if (newExperience.jobTitle && newExperience.company && newExperience.year) {
      setUser((prevUser) => ({
        ...prevUser,
        workExperience: [...prevUser.workExperience, newExperience],
      }));
      setNewExperience({ jobTitle: '', company: '', year: '' });
      updateBackend();
    } else {
      alert('Please fill in all fields for work experience.');
    }
  };

  const handleEditExperience = (index) => {
    const updatedExperience = promptExperienceDetails(user.workExperience[index]);
    if (updatedExperience) {
      setUser((prevUser) => ({
        ...prevUser,
        workExperience: [
          ...prevUser.workExperience.slice(0, index),
          updatedExperience,
          ...prevUser.workExperience.slice(index + 1),
        ],
      }));
      updateBackend();
    }
  };

  const handleDeleteExperience = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      workExperience: [...prevUser.workExperience.slice(0, index), ...prevUser.workExperience.slice(index + 1)],
    }));
    updateBackend();
  };

  const promptExperienceDetails = (defaultValues = { jobTitle: '', company: '', year: '' }) => {
    const jobTitle = prompt('Enter Job Title:', defaultValues.jobTitle);
    const company = prompt('Enter Company:', defaultValues.company);
    const year = prompt('Enter Year:', defaultValues.year);
    return jobTitle && company && year ? { jobTitle, company, year } : null;
  };

  const handleAddEducation = () => {
    // Validate and add a new education entry
    if (newEducation.school && newEducation.degree && newEducation.year) {
      setUser((prevUser) => ({
        ...prevUser,
        education: [...prevUser.education, newEducation],
      }));
      setNewEducation({ school: '', degree: '', year: '' });
      updateBackend();
    } else {
      alert('Please fill in all fields for education.');
    }
  };

  const handleEditEducation = (index) => {
    const updatedEducation = promptEducationDetails(user.education[index]);
    if (updatedEducation) {
      setUser((prevUser) => ({
        ...prevUser,
        education: [
          ...prevUser.education.slice(0, index),
          updatedEducation,
          ...prevUser.education.slice(index + 1),
        ],
      }));
      updateBackend();
    }
  };

  const handleDeleteEducation = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      education: [...prevUser.education.slice(0, index), ...prevUser.education.slice(index + 1)],
    }));
    updateBackend();
  };

  const promptEducationDetails = (defaultValues = { school: '', degree: '', year: '' }) => {
    const school = prompt('Enter School:', defaultValues.school);
    const degree = prompt('Enter Degree:', defaultValues.degree);
    const year = prompt('Enter Year:', defaultValues.year);
    return school && degree && year ? { school, degree, year } : null;
  };

  const handleAddSkill = () => {
    // Validate and add a new skill
    if (newSkill) {
      setUser((prevUser) => ({
        ...prevUser,
        skills: [...prevUser.skills, newSkill],
      }));
      setNewSkill('');
      updateBackend();
    } else {
      alert('Please select a skill.');
    }
  };

  const handleDeleteSkill = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      skills: [...prevUser.skills.slice(0, index), ...prevUser.skills.slice(index + 1)],
    }));
    updateBackend();
  };

  const updateBackend = async () => {
    try {
      const userId = getUserId();
      let educationJSON = user.education;
      let workExperienceJSON = user.workExperience;
      let skillsJSON = user.skills;

      // Check if the properties are in array format and convert to JSON
      if (Array.isArray(user.education)) {
        educationJSON = JSON.stringify(user.education);
      }

      if (Array.isArray(user.workExperience)) {
        workExperienceJSON = JSON.stringify(user.workExperience);
      }

      if (Array.isArray(user.skills)) {
        skillsJSON = JSON.stringify(user.skills);
      }
      // Send a request to update the user details
      const response = await fetch(`http://localhost:5000/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          bio: user.bio,
          education: educationJSON,
          workExperience: workExperienceJSON,
          skills: skillsJSON,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('Failed to update user details:', result.message);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleUpdateDetails = async (updatedData) => {
    try {
      const userId = getUserId();
      let educationJSON = user.education;
      let workExperienceJSON = user.workExperience;
      let skillsJSON = user.skills;

      // Check if the properties are in array format and convert to JSON
      if (Array.isArray(user.education)) {
        educationJSON = JSON.stringify(user.education);
      }

      if (Array.isArray(user.workExperience)) {
        workExperienceJSON = JSON.stringify(user.workExperience);
      }

      if (Array.isArray(user.skills)) {
        skillsJSON = JSON.stringify(user.skills);
      }

      const response = await fetch(`http://localhost:5000/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedData,
          education: educationJSON,
          workExperience: workExperienceJSON,
          skills: skillsJSON,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedData,
        }));

        setShowPopup(false);
      } else {
        console.error('Failed to update user details:', result.message);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="prof_cont">
      {showPopup && (
        <div className="popup">
          <h2>Complete Your Profile</h2>
          <p>It looks like some details are missing from your profile. Please provide the missing information.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedData = {
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                profilePicture: e.target.profilePicture.value,
                bio: e.target.bio.value,
                education: user.education,
                workExperience: user.workExperience,
                skills: user.skills,
              };
              handleUpdateDetails(updatedData);
            }}
          >
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required />

            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required />

            <div className='profile-pic'>
            <label htmlFor="profilePicture">Profile Picture URL:</label>
            <input type="text" id="profilePicture" name="profilePicture" value={user.profilePicture}  disabled />
            </div>

            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" name="bio" required></textarea>

            {/* Dropdown for Skills */}
            <label htmlFor="skills">Skills:</label>
            {user.skills !== null && user.skills !== undefined && Array.isArray(user.skills) && user.skills.length > 0? (
              <div>
                {user.skills.map((skill, index) => (
                  <div key={index}>
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                
                <select value={newSkill} onChange={(e) => setNewSkill(e.target.value)}>
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
            ) : (
              <div>
                <p>No skills data available.</p>
                <select value={newSkill} onChange={(e) => setNewSkill(e.target.value)}>
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
            )}

            {/* Table for Education */}
            <label>Education:</label>
            {user.education !== null && user.education !== undefined && Array.isArray(user.education) && user.education.length > 0? (
              <table>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Degree</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.education.map((edu, index) => (
                    <tr key={index}>
                      <td>{edu.school}</td>
                      <td>{edu.degree}</td>
                      <td>{edu.year}</td>
                      <td>
                        <button onClick={() => handleEditEducation(index)}>Edit</button>
                        <button onClick={() => handleDeleteEducation(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {/* Table row for adding new education entry */}
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={newEducation.school}
                        onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={handleAddEducation}>
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <p>No education data available.</p>
                <table>
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Degree</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table row for adding new education entry */}
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={newEducation.school}
                          onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={handleAddEducation}>
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Table for Work Experience */}
            <label>Work Experience:</label>
            {user.workExperience !== null && user.workExperience !== undefined && Array.isArray(user.workExperience) && user.workExperience.length > 0? (
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.workExperience.map((exp, index) => (
                    <tr key={index}>
                      <td>{exp.jobTitle}</td>
                      <td>{exp.company}</td>
                      <td>{exp.year}</td>
                      <td>
                        <button onClick={() => handleEditExperience(index)}>Edit</button>
                        <button onClick={() => handleDeleteExperience(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {/* Table row for adding new work experience entry */}
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={newExperience.jobTitle}
                        onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newExperience.year}
                        onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={handleAddExperience}>
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <p>No work experience data available.</p>
                <table>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table row for adding new work experience entry */}
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={newExperience.jobTitle}
                          onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newExperience.year}
                          onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={handleAddExperience}>
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}

      <div className="content_cont">
        <div className="profile_cont">
          <div className="profile_pic_cont">
            {console.log("alumni-network/backend/images/"+user.profilePicture)}
            <img src={user.profilePicture} alt="Profile" />
            <pre>
              
            </pre>
            <center><button type="button" className='edit-image-btn' onClick={() => setShowImageUpload(true)}>Edit image</button></center>
            {showImageUpload && (
                    <div className="popup">
                      <h2>Edit Profile Picture</h2>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      <button onClick={handleImageUpload}>Upload</button>
                      <button onClick={() => setShowImageUpload(false)}>Cancel</button>
                    </div>
                  )}

          </div>
          <div className="name_cont">
            <h1>
              {user.firstName} {user.lastName}
            </h1>
          </div>
          <div className="bio_cont">
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="details_cont">
          <div className="skills_cont">
            <h2>Skills</h2>
            {user.skills !== null && user.skills !== undefined && Array.isArray(user.skills) && user.skills.length > 0? (
              <div>
                {user.skills.map((skill, index) => (
                  <div key={index}>
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleDeleteSkill(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                
                <select value={newSkill} onChange={(e) => setNewSkill(e.target.value)}>
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
            ) : (
              <div>
                <p>No skills data available.</p>
                <select value={newSkill} onChange={(e) => setNewSkill(e.target.value)}>
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
            )}
          </div>

          <div className="education_cont">
            <h2>Education</h2>
            {user.education !== null && user.education !== undefined  && Array.isArray(user.workExperience) && user.workExperience.length? (
              <table>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Degree</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.education.map((edu, index) => (
                    <tr key={index}>
                      <td>{edu.school}</td>
                      <td>{edu.degree}</td>
                      <td>{edu.year}</td>
                      <td>
                        <button type="button" onClick={() => handleEditEducation(index)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDeleteEducation(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Table row for adding new education entry */}
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={newEducation.school}
                        onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={handleAddEducation}>
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <p>No education data available.</p>
                <table>
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Degree</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table row for adding new education entry */}
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={newEducation.school}
                          onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={handleAddEducation}>
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="experience_cont">
            <h2>Work Experience</h2>
            {user.workExperience !== null && user.workExperience !== undefined  && Array.isArray(user.workExperience) && user.workExperience.length? (
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.workExperience.map((exp, index) => (
                    <tr key={index}>
                      <td>{exp.jobTitle}</td>
                      <td>{exp.company}</td>
                      <td>{exp.year}</td>
                      <td>
                        <button type="button" onClick={() => handleEditExperience(index)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDeleteExperience(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Table row for adding new work experience entry */}
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={newExperience.jobTitle}
                        onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newExperience.year}
                        onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={handleAddExperience}>
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <p>No work experience data available.</p>
                <table>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table row for adding new work experience entry */}
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={newExperience.jobTitle}
                          onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newExperience.year}
                          onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={handleAddExperience}>
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
