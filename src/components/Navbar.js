import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClipboardCheck, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [nextPage, setNextPage] = useState('');
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/login`, { username, password }, { headers: { 'Content-Type': 'application/json' } });

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

  // Handle Icon Click
  const handleIconClick = (page) => {
    if (!userId) {
      setNextPage(page);
      setShowLogin(true);
    } else {
      navigate(`/${page}`, { state: { userId } });
    }
  };

  return (
    <div>
      <nav>
        {/* Hamburger Menu (Hidden on large screens) */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Left Side Navigation Links */}
        <ul className={`left-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          <li><Link to="/help" onClick={closeMenu}>Help</Link></li>
          <li><Link to="/login" onClick={closeMenu}>Order</Link></li>
        </ul>

        {/* Right Side Icons (Never Duplicate) */}
        <ul className="right-icons">
          <li>
            <FaShoppingCart style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }} onClick={() => handleIconClick('Cart')} />
          </li>
          <li>
            <FaClipboardCheck style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }} onClick={() => handleIconClick('Placedorder')} />
          </li>
        </ul>
      </nav>

      {/* Conditional Login Form */}
      {showLogin && (
        <div className="login-popup">
          <div className="login-box">
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
