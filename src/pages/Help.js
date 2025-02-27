import React from 'react';
import Slider from 'react-slick'; // Import React Slick for the carousel
import './help.css'; // Import custom styles for the Help page
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import config from '../config';

// Custom Next Arrow Component
const NextArrow = ({ onClick }) => (
  <div className="arrow next-arrow" onClick={onClick}>
    &#9654; {/* Right Arrow Icon */}
  </div>
);

// Custom Previous Arrow Component
const PrevArrow = ({ onClick }) => (
  <div className="arrow prev-arrow" onClick={onClick}>
    &#9664; {/* Left Arrow Icon */}
  </div>
);


function Help() {
  // Sample images and descriptions for the app tutorial
  const images = [
    {
      src: `${config.imageBaseUrl}/uploads/img_672cc9f5000887.27133820.jpg`,
      description: 'Step 1: Sign up or log in to your account to get started.',
    },
    {
      src: `${config.imageBaseUrl}/uploads/img_672cc9f5000887.27133820.jpg`,
      description: 'Step 2: Browse through available restaurants and shops using the navigation bar.',
    },
    {
      src: `${config.imageBaseUrl}/uploads/img_672cd8372d6486.57461626.jpg`,
      description: 'Step 3: Add items to your cart by selecting them from the available categories.',
    },
    {
      src: `${config.imageBaseUrl}/uploads/img_672cd8372d6486.57461626.jpg`,
      description: 'Step 4: Proceed to checkout after adding items to your cart, and enter your delivery details.',
    },
    {
      src: `${config.imageBaseUrl}/uploads/img_672cd8372d6486.57461626.jpg`,
      description: 'Step 5: Track your order in real-time and receive notifications when it’s on the way!',
    },
  ];

  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite loop
    speed: 500,
    slidesToShow: 3, // Default: 3 images
    slidesToScroll: 1, // Scroll one image at a time
    nextArrow: <NextArrow />, // Use custom next arrow
    prevArrow: <PrevArrow />, // Use custom previous arrow
    responsive: [
      {
        breakpoint: 1024, // Tablets and small laptops
        settings: {
          slidesToShow: 2, // Show 2 images
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Mobile screens
        settings: {
          slidesToShow: 1, // Show 1 image
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  
  return (
    <>
      {/* Navbar rendered outside help-container */}
      <Navbar />
      
      {/* Wrapper to prevent content from being hidden by navbar */}
      <div className="help-wrapper">
        <div className="help-container">
          <h1>How to Use the App</h1>
  
          {/* Image Carousel with descriptions */}
          <div className="carousel-container">
            <Slider {...settings}>
              {images.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img src={image.src} alt={`Step ${index + 1}`} className="carousel-image" />
                  <p className="carousel-description">{image.description}</p>
                </div>
              ))}
            </Slider>
          </div>
  
          <div className="help-section">
            <h2>Contact Us</h2>
            <p>
              If you need any assistance, you can reach out to our support team by 
              visiting our <Link to="/contact">Contact Us</Link> page.
            </p>
          </div>
        </div>
      </div>
  
      {/* Footer rendered outside help-container */}
      <Footer />
    </>
  );
  
}

export default Help;
