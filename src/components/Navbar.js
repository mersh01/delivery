import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClipboardCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  // Correct usage of 'useNavigate'
import axios from 'axios';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [nextPage, setNextPage] = useState(''); // To store the page to navigate after login
  const navigate = useNavigate();

  
  // Function to handle the login request (username & password)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send request to the PHP backend for login authentication
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If login is successful (based on the backend response)
      if (response.data.success) {
        setUserId(response.data.user_id);  // Assuming the response includes user_id
        setShowLogin(false); // Hide the login popup
        localStorage.setItem('user_id', response.data.user_id); // Save user_id in local storage
        localStorage.setItem('username', response.data.username); // Save username
        navigate(`/${nextPage}`, { state: { user_id: response.data.user_id } });  // Navigate to the appropriate page
      } else {
        alert(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Function to handle the icon click
  const handleIconClick = (page) => {
    if (!userId) {
      setNextPage(page);  // Store the page to navigate after login
      setShowLogin(true);  // Show the login prompt if not authenticated
    } else {
      navigate(`/${page}`, { state: { userId } });  // Navigate directly if authenticated
    }
  };

  return (
    <div>
      <nav>
        <ul>
          {/* Left side links */}
          <ul className="left-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/help">Help</Link></li>
            <li><Link to="/login">Order</Link></li>
          </ul>

          {/* Right side icons */}
          <ul className="right-icons">
            <li>
              <FaShoppingCart
                style={{ fontSize: '24px',color: 'white', cursor: 'pointer' }}
                onClick={() => handleIconClick('Cart')}  // Navigate to Cart
              />
            </li>
            <li>
              <FaClipboardCheck
                style={{ fontSize: '24px',color: 'white', cursor: 'pointer' }}
                onClick={() => handleIconClick('Placedorder')}  // Navigate to Placedorders
              />
            </li>
          </ul>
        </ul>
      </nav>

      {/* Conditional rendering for login form */}
      {showLogin && (
  <div
    style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999, // Lower z-index for the backdrop to avoid blocking the navbar
      pointerEvents: 'none', // Disable interaction with the backdrop (so navbar and other content remain clickable)
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '300px',
        zIndex: 1000, // Higher z-index for the login form
        position: 'relative', // Make sure the form stays on top of the overlay
        pointerEvents: 'auto', // Enable interaction with the login dialog
      }}
    >
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          required
        />
        <button type="submit" style={{ padding: '8px',color: 'white', backgroundColor: 'red', width: '100%' }}>Login</button>
      </form>
    </div>
  </div>
)}


    </div>
  );
}

export default Navbar;
