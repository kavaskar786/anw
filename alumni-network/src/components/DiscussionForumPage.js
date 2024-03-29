import React, { useRef, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import './css/DiscussionForumPage.css';


const DiscussionForumPage = () => {
  const [newPost, setNewPost] = useState('');
  const [discussionTopics, setDiscussionTopics] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const messagesRef = useRef(null);


  useEffect(() => {
    // Fetch discussion topics from the server
    fetch('http://localhost:5000/api/discussion/topics')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDiscussionTopics(data.topics);
        } else {
          console.error('Error fetching topics:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching topics:', error));
  if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, []);
      

  const getUserId = () => {
    const encryptedUserId = localStorage.getItem('userId');
    const userId = encryptedUserId ? atob(encryptedUserId) : null;
    return userId;
  };

  const handleAddTopic = () => {
    if (newPost.trim() !== '' && newTitle.trim() !== '') {
      // Add a new discussion topic with user input for title and content
      fetch('http://localhost:5000/api/discussion/add-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, content: newPost }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Refresh the discussion topics
            fetch('http://localhost:5000/api/discussion/topics')
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  setDiscussionTopics(data.topics);
                } else {
                  console.error('Error fetching topics:', data.message);
                }
              })
              .catch((error) => console.error('Error fetching topics:', error));
  
              // Clear the new post and new title inputs
              setNewPost('');
              setNewTitle('');
          } else {
            console.error('Error adding topic:', data.message);
          }
        })
        .catch((error) => console.error('Error adding topic:', error));
    }
  };

  const handleSendMessage = async () => {
    try {
      const currentUserId = getUserId(); // Get the current user's ID using the getUserId function

      const response = await fetch('http://localhost:5000/api/discussion/add-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: selectedTopic.id,
          message: messageInput,
          userId: currentUserId, // Pass the user ID to the server
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update chat messages after sending a new message
        fetchChatMessages(selectedTopic.id);
        setMessageInput('');
      } else {
        console.error('Error sending message:', data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const fetchChatMessages = (topicId) => {
    fetch(`http://localhost:5000/api/discussion/messages?topicId=${topicId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setChatMessages(data.messages);
        } else {
          console.error('Error fetching messages:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  const handleTopicClick = (topic) => {
    // Set the selected topic
    setSelectedTopic(topic);

    // Fetch chat messages for the selected topic
    fetchChatMessages(topic.id);

    // Display the message popup
    setShowMessagePopup(true);
  };
  return (
    <div>
    <div className="discussion-forum-container">
      <div className="discussion-content">
        <h1>Discussion Forum</h1>

        {/* New Post and Title Inputs */}
        <input
            type="text"
            placeholder="Enter the title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        <div className="new-post-container">
          <textarea
            placeholder="Write your new post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
 
          <button onClick={handleAddTopic}>Post</button>
        </div>

        {/* Display discussion topics */}
        {discussionTopics.map((topic, index) => (
          <div key={index} className="discussion-topic" onClick={() => handleTopicClick(topic)}>
            <h2>{topic.title}</h2>
            <p>{topic.content}</p>
          </div>
        ))}
        
        {/* Message popup */}
        {showMessagePopup && selectedTopic && (
          <div className="message-popup">
            <div className="message-popup-content">
              <h2>{selectedTopic.title}</h2>
              <div className="message-container" ref={messagesRef}>
                {chatMessages.map((chatMsg, index) => (
                  <div key={index} className={`message ${parseInt(chatMsg.userId) === parseInt(getUserId()) ? 'sent' : 'received'}`}>
                    <p className='msg_test'>{chatMsg.username}: {chatMsg.message}</p>
                  </div>
                ))}
              </div>
              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
              <button className="close-button" onClick={() => setShowMessagePopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
    <Footer />
    </div>
  );
};

export default DiscussionForumPage;
