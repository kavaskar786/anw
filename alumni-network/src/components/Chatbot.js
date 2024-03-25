import React from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import axios from 'axios';

const Chatbot = () => {

  const handleNewUserMessage = async (newMessage) => {
    try {
      // Make a request to the Simsimi API
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(newMessage)}&lc=en`);
      
      // Extract and display response
      addResponseMessage(response.data.success ? response.data.messages[0].response : "I'm sorry, I couldn't understand that.");
    } catch (error) {
      console.error('Error processing message:', error);
      addResponseMessage("I'm sorry, there was an error processing your message.");
    }
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Alumni Network Chatbot"
      subtitle="Ask me anything!"
    />
  );
};

export default Chatbot;
