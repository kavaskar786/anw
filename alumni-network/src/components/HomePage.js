// HomePage.js

import React, { useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import './css/HomePage.css'; // Import the CSS file for styling
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';





// all available props
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const HomePage = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const parallaxScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const parallaxOffset = parallaxRef.current.offsetTop;
      const parallaxSpeed = 0.5; // Adjust this value to control the parallax speed

      parallaxRef.current.style.backgroundPositionY = `${(scrollTop - parallaxOffset) * parallaxSpeed}px`;
    };

    window.addEventListener('scroll', parallaxScroll);

    return () => {
      window.removeEventListener('scroll', parallaxScroll);
    };
  }, []);


  return (
    <div>
      <div className="homepage-container" ref={parallaxRef} style={{ background: `url('https://i.imghippo.com/files/5OqjQ1711506134.png')`, backgroundSize: 'cover' }}>
        <div className="homepage-content">
          <div className='homepage_text'>
          <h1>Welcome to the Alumni Network!</h1>
          <p>This is the homepage of our alumni networking web app.</p>
          <p>Feel free to explore and connect with fellow alumni.</p>
          </div>
          <ThemeProvider theme={theme}>
            <ChatBot
              headerTitle="Speech Synthesis"
              speechSynthesis={{ enable: true, lang: 'en' }}
              steps={[
                {
                  id: '1',
                  message: 'What is your name?',
                  trigger: '2',
                },
                {
                  id: '2',
                  user: true,
                  trigger: '3',
                },
                {
                  id: '3',
                  message: 'Hi {previousValue}, nice to meet you!',
                  end: true,
                },
              ]}
              floating={true}
            />
          </ThemeProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
