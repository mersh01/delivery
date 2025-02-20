import React from 'react';
import './about.css'; // Import custom styles for the About page
import missionImage from '../assets/mission.jpg'; // Adjust path based on actual location
import deliveryIcon from '../assets/delivery-icon.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <>
    {/* Navbar rendered outside help-container */}
    <Navbar />
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p className="about-subtitle">
          Delivering convenience, speed, and satisfaction right to your doorstep.
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3>Who We Are</h3>
          <p>
            Our app aims to revolutionize delivery services by providing fast, reliable, and user-friendly solutions. 
            Whether you're ordering food, clothing, or electronics, we bring it right to your door with unmatched efficiency.
          </p>
        </div>

        <div className="about-section mission-section">
          <div className="mission-image">
            <img src={missionImage} alt="Our Mission" />
          </div>
          <div className="mission-content">
            <h3>Our Mission</h3>
            <p>
              We are committed to providing the best service to our customers with a focus on speed and customer satisfaction. 
              Our mission is to seamlessly connect people with the things they need, ensuring a hassle-free experience.
            </p>
          </div>
        </div>

        <div className="about-features">
          <div className="feature">
            <img src={deliveryIcon} alt="Fast Delivery" />
            <h4>Fast Delivery</h4>
            <p>Experience lightning-fast deliveries with our streamlined logistics and efficient network.</p>
          </div>
          <div className="feature">
            <img src={deliveryIcon} alt="Wide Variety" />
            <h4>Wide Variety</h4>
            <p>Order from an extensive selection of restaurants, shops, and categories, all in one place.</p>
          </div>
          <div className="feature">
            <img src={deliveryIcon} alt="Customer Satisfaction" />
            <h4>Customer Satisfaction</h4>
            <p>Our priority is you. We strive to ensure a delightful and smooth delivery experience every time.</p>
          </div>
        </div>
      </div>
    </div>
     {/* Navbar rendered outside help-container */}
     <Footer />
    </>
  );
}

export default About;
