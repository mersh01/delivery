import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaClipboardCheck } from 'react-icons/fa';
import { UserContext } from './Usercontext'; // Import the context

function Navbars() {
  const { user } = useContext(UserContext); // Access the user information from context
  const navigate = useNavigate();

  // Function to handle the icon click
  const handleIconClick = (page) => {
    if (user.user_id) {
      navigate(`/${page}`, { state: { user_id: user.user_id } });
    } else {
      // Handle case where user_id might not be available
      console.log('User not authenticated');
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
        </ul>
      </nav>
    </div>
  );
}

export default Navbars;
