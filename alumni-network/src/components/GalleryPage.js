import React from 'react';
import '../components/css/Gallery.css'; // Make sure to create a corresponding CSS file for styling
import Slider from 'react-slick';
// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


 // Sample data for image carousel
 const carouselData = [
  { type: 'event', imageUrl: 'https://i.imghippo.com/files/gL3IW1711475415.png' },
  { type: 'profile', imageUrl: 'https://i.imghippo.com/files/mLQze1711475557.png' },
  { type: 'event', imageUrl: 'https://i.imghippo.com/files/4dfld1711475499.png' },
  { type: 'profile', imageUrl: 'https://i.imghippo.com/files/E2dNr1711474083.jpg' },
];

// Slick carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
};

const Gallery = () => {
  return (
    <div className="gallery-bg">
    <div className='gallery-container'>
        {/* Image Carousel */}
        <div className="carousel-section">
            <Slider {...carouselSettings}>
              {carouselData.map((item, index) => (
                <div key={index}>
                  <img src={item.imageUrl} alt="" />
                </div>
              ))}
            </Slider>
          </div>
    <div className="gallery">
       
      <div className="image-container">

        <img src="https://images.shiksha.com/mediadata/images/1532895148php6I9hS8.png" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFitlup_zVE-9D_eIFJB0aN8Q2jdR0s0JTIQ&usqp=CAU" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://alumni.christuniversity.in/uploads/photogallery/medium/DSC_0062.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://ncr.christuniversity.in/uploads/division/medium/279938448_2023-06-21_04-32-55.png" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9o0aHaAQc0sVAySWO57j5ybeIslT-3LpzwwuQNgEGuRkmYhu6mu-wvTOoLcMAHwLCFSY&usqp=CAU" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/departments/medium/1239557901_2020-12-21_11-01-16.jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/userfiles/123(1).jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://alumni.christuniversity.in/uploads/photogallery/medium/DSC_0831.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/photogallery/medium/DSC_0332.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/photogallery/medium/DSC_0220.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/ourachievements/medium/test1_20230818030838..jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/photogallery/medium/IMG_5447.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://media.getmyuni.com/assets/images/articles/content/articles-2ac97db752dcc5c26cb72f9509f301dd.webp" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://www.careerindia.com/college-photos/375x275/1221/christ-university-bangalore-group-learning_1465207526.jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://www.sathyabama.ac.in/sites/default/files/inline-images/FEP_linkedin.png" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://www.christjuniorcollege.in/img/all-imgs/academics/departments/English.webp" alt="Image3" />
    </div> 
<div className="image-container">
        <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202006/BC-BCA-1.jpeg?size=690:388" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://alumni.christuniversity.in/uploads/photogallery/medium/DSC05130.JPG" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/201605/bc-bca-may30-7_647_051916091538.jpg?VersionId=4q08jA4zS9rHVYT.MQ4O9prZMv0wr8ge" alt="Image3" />
      </div>

 <div className="image-container">
        <img src="https://christuniversity.in/uploads/userfiles/overviewstatistics(1).jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://christuniversity.in/uploads/photogallery/medium/DSC_9883.JPG" alt="Image3" />
      </div> 
<div className="image-container">
        <img src="https://christuniversity.in/uploads/departments/medium/1260744837_2020-12-21_10-48-36.jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://m.christuniversity.in/images/1676007634_2020-09-18_12-15-15.jpg" alt="Image3" />
      </div>
 <div className="image-container">
        <img src="https://m.christuniversity.in/images/facPUB.jpg" alt="Image3" />
      </div>

    </div>
    </div>
    </div>
  );
};

export default Gallery;