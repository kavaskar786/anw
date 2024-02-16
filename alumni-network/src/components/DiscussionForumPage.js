// DiscussionForumPage.js

import React from 'react';
import Footer from '../components/Footer';
import './css/DiscussionForumPage.css';

const DiscussionForumPage = () => {
  return (
    <div>
    <div className="discussion-forum-container">
      <div className="discussion-content">
        <h1>Discussion Forum</h1>
        <div className="discussion-topic">
          <h2>Topic 1: General Discussion</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed mauris et risus tincidunt
            fringilla vel eget justo.
          </p>
        </div>
        <div className="discussion-topic">
          <h2>Topic 2: Coding Challenges</h2>
          <p>
            Curabitur vel dolor eu eros bibendum sagittis. Aliquam erat volutpat. Quisque ut est sem.
          </p>
        </div>
        {/* Add more discussion topics as needed */}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default DiscussionForumPage;
