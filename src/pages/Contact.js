import React, { useState } from 'react';
import './contact.css'; // Assuming you will create a CSS file for styles
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost/food_ordering_api/web/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Send formData directly without user_id
      });
  
      const responseData = await response.json(); // Parse response to check for the status
      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        alert(`Failed to send message: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  

  return (
    <>
      {/* Navbar rendered outside help-container */}
      <Navbar />
      <div className="contact-container">
        <div className="contact-box">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Please fill out the form below.</p>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
            />
            <button type="submit" className="form-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
      {/* Navbar rendered outside help-container */}
      <Footer />
    </>
  );
}

export default Contact;
