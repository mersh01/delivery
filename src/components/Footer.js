import React from "react";
import "../App.css"; // Make sure this import is present if it's not already

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Media Links */}
        <div className="footer-social">
          <a href="https://t.me/mersh01" target="_blank" rel="noopener noreferrer" className="social-link telegram">
            Telegram
          </a>
          <a href="https://www.facebook.com/feye.feyee.7" target="_blank" rel="noopener noreferrer" className="social-link facebook">
            Facebook
          </a>
          <a href="https://www.instagram.com/meraolfeye?igsh=Yzd3NTBzd3JvOTV6" target="_blank" rel="noopener noreferrer" className="social-link instagram">
            Instagram
          </a>
        </div>

        {/* Copyright Text */}
        <p className="footer-text">
          &copy; {new Date().getFullYear()} All rights reserved. LMPixels.
        </p>
      </div>
    </footer>
  );
};

export default Footer;