import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClipboardCheck, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [nextPage, setNextPage] = useState('');
  const [menuActive, setMenuActive] = useState(false); // For toggling the menu on mobile
  const navigate = useNavigate();

  // Function to handle the login request (username & password)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.backendUrl}/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setUserId(response.data.user_id);
        setShowLogin(false);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('username', response.data.username);
        navigate(`/${nextPage}`, { state: { user_id: response.data.user_id } });
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
      setNextPage(page);
      setShowLogin(true);
    } else {
      navigate(`/${page}`, { state: { userId } });
    }
  };

  // Function to toggle the menu on mobile
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div>
      <nav>
        {/* Hamburger icon for mobile */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          {menuActive ? <FaTimes /> : <FaBars />}
        </div>

        {/* Left-side links */}
        <ul className={`left-links ${menuActive ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuActive(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuActive(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuActive(false)}>Contact</Link></li>
          <li><Link to="/help" onClick={() => setMenuActive(false)}>Help</Link></li>
          <li><Link to="/login" onClick={() => setMenuActive(false)}>Order</Link></li>
        </ul>

        {/* Right-side icons */}
        <ul className="right-icons">
          <li>
            <FaShoppingCart
              style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
              onClick={() => handleIconClick('Cart')}
            />
          </li>
          <li>
            <FaClipboardCheck
              style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
              onClick={() => handleIconClick('Placedorder')}
            />
          </li>
        </ul>
      </nav>

      {/* Conditional rendering for login form */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-form">
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;