import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaClipboardCheck, FaBars, FaTimes } from 'react-icons/fa';
import { UserContext } from './Usercontext';

function Navbars() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = React.useState(false);

  const handleIconClick = (page) => {
    if (user.user_id) {
      navigate(`/${page}`, { state: { user_id: user.user_id } });
    } else {
      console.log('User not authenticated');
    }
  };

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
    </div>
  );
}

export default Navbars;