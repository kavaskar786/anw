
import React from 'react'
import './css/JobBoardPage.css';
import Footer from './Footer';
function JobBoardPage() {
  return (
    <>
      <section id="job-listings" className='p-5  job'>
        <div className='container'>
          <article className="job-listing ">
            <h2>Software Developer</h2>
            <p>Company: Tech Solutions Inc.</p>
            <p>Location: City, State</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <button>Apply Now</button>
          </article>

          <article className="job-listing">
            <h2>Marketing Specialist</h2>
            <p>Company: Marketing Pros LLC</p>
            <p>Location: City, State</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <button>Apply Now</button>
          </article>
        </div>


      </section>
      <Footer />
    </>
  )
}

export default JobBoardPage
