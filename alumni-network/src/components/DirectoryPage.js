import React, { useState, useEffect } from 'react';
import './css/DirectoryPage.css';
import Footer from '../components/Footer';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);



  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (searchTerm.trim() === '') {
          setSearchResults([]); // Clear results if the search term is empty
          return;
        }

        const currentUserId = getUserId();

        const response = await fetch(`http://localhost:5000/users/search?username=${searchTerm}&currentUserId=${currentUserId}`);
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.users);
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Delay the search to avoid making too many requests while typing
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delaySearch); // Clear the timeout on component unmount
  }, [searchTerm]);

  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };

  const handleFollow = async (targetUserId) => {
    try {
      const currentUserId = getUserId();
  
      const response = await fetch('http://localhost:5000/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId, targetUserId: String(targetUserId) }), // Convert targetUserId to a string
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log('User followed successfully.');
        // Update the follow status in the search results
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user.id === targetUserId ? { ...user, isFollowing: true } : user
          )
        );
      } else {
        console.error('Error following user:', data.message);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  const handleUnfollow = async (targetUserId) => {
    try {
      const currentUserId = getUserId();

      const response = await fetch('http://localhost:5000/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId, targetUserId: String(targetUserId) }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('User unfollowed successfully.');
        // Update the follow status in the search results
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user.id === targetUserId ? { ...user, isFollowing: false } : user
          )
        );
      } else {
        console.error('Error unfollowing user:', data.message);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  const handleRequestMentorship = async (targetUserId) => {
    try {
      const currentUserId = getUserId();

      const response = await fetch('http://localhost:5000/request-mentorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId,  targetUserId: String(targetUserId) }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Mentorship requested successfully.');
        // Update the mentorship status in the search results
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user.id === targetUserId
              ? { ...user, isMentorshipRequested: true }
              : user
          )
        );
      } else {
        console.error('Error requesting mentorship:', data.message);
      }
    } catch (error) {
      console.error('Error requesting mentorship:', error);
    }
  };

  return (
    <div>
      <div className="Directcont">
        <div className='content'>
          <center>
            <h2 className="directory-heading">Alumni Directory</h2>
          </center>
          <div className="directory-search-bar">
            <input
              type="text"
              placeholder="Search by name, graduation year, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="directory-search-input"
            />
          </div>

          {searchResults.length > 0 && (
            <ul className="directory-results-list">
              {searchResults.map((user) => (
                
                <li key={user.id} className="directory-results-item">
                  <div className="user-card">
                    <img
                      src={user.profilePicture || 'default-profile-image-url'} // Provide a default image URL
                      alt={`Profile of ${user.username}`}
                      className="user-profile-picture"
                    />
                    <p>{user.username}</p>
                    <p>{user.firstName} {user.lastName}</p>
                    <p>{user.role}</p>
                    <div className="user-skills">
                      {user.skills ? user.skills : 'Skills not available'}
                    </div>

                    <div className='button-container'>  
                    {user.isFollowing ? (
                      <button className='follow-button' onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                      ) : (
                        <button className='follow-button' onClick={() => handleFollow(user.id)}>Follow</button>
                        )}
                     {user.role === 'staff' || user.role === 'alumni' ? (
                       <button
                       className='request-mentorship-button'
                       onClick={() => handleRequestMentorship(user.id)}
                       disabled={user.isMentorshipRequested}
                       >
                        {user.isMentorshipRequested ? 'Requested' : 'Request Mentorship'}
                      </button>
                    ) : null}
                    </div>
                    {/* Add more user details as needed */}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {searchResults.length === 0 && searchTerm.trim() !== '' && (
            <center>
              <p className="directory-no-results">No results found.</p>
            </center>
          )}
        </div>
         
      </div>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
