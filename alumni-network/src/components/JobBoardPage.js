
import React from 'react'
import './css/JobBoardPage.css';
import Footer from './Footer';
function JobBoardPage() {
  return (
    <div>
      <section id="job-listings" className='p-5  job'>
        <div className='container'>
          <article className="job-listing ">
            <center><h2>Software Developer</h2></center>
            <p>Company: Tech Solutions Inc.</p>
            <p>Location: City, State</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <pre>

            </pre>
            <center><button>Apply Now</button></center>
          </article>

          <article className="job-listing">
            <center><h2>Marketing Specialist</h2></center>
            <p>Company: Marketing Pros LLC</p>
            <p>Location: City, State</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <pre>
              
              </pre>
            <center><button>Apply Now</button></center>
          </article>
        </div>


      </section>
      <Footer />
    </div>
  )
}

export default JobBoardPage
