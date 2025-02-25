import React, { useState, useEffect, useCallback, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './placedorder.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import { UserContext } from '../components/Usercontext';
import config from '../config'; // Import the configuration file

const Placedorder = () => {
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const { user_id, username } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user orders from API
  const fetchUserOrders = useCallback(async () => {
    try {
      console.log('Sending user_id:', user_id);
      const response = await fetch(`${config.backendUrl}/get_order_items?user_id=${user_id}`);
      const data = await response.json(); // Parse the JSON response
      console.log('API Response:', data);

      if (data.success) {
        // Sort orders by the shortest time gap first (ascending)
        const sortedOrders = data.orders.sort((a, b) => {
          const timeA = calculateTimeGapInSeconds(a.created_at);
          const timeB = calculateTimeGapInSeconds(b.created_at);
          return timeA - timeB; // Sort in ascending order (shortest time first)
        });

        setOrders(sortedOrders); // Set the sorted orders
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    setUser({ user_id, username });
  }, [user_id, username, setUser]);

  // Fetch orders when component mounts or when user_id changes
  useEffect(() => {
    console.log('User ID before API call:', user_id);
    fetchUserOrders();
  }, [fetchUserOrders, user_id]);

  // Function to calculate time gap in seconds (for sorting)
  const calculateTimeGapInSeconds = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const difference = now - orderTime; // Difference in milliseconds

    const seconds = Math.floor(difference / 1000); // Convert to seconds
    return seconds;
  };

  // Function to format time gap for display (in a human-readable format)
  const formatTimeGap = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Convert to minutes
    const hours = Math.floor(minutes / 60); // Convert to hours
    const days = Math.floor(hours / 24); // Convert to days

    if (seconds < 60) {
      return `${seconds} second(s) ago`; // Less than 1 minute
    } else if (minutes < 60) {
      return `${minutes} minute(s) ago`; // Less than 1 hour
    } else if (hours < 24) {
      return `${hours} hour(s) ago`; // Less than 1 day
    } else {
      return `${days} day(s) ago`; // 1 day or more
    }
  };

  // Navigate to cart screen
  const navigateToCart = () => {
    navigate('/cart', { state: { user_id, username } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (orders.length === 0) return <div>You have not ordered yet.</div>;

  return (
    <>
      <Navbars />
      <div className="order-screen">
        <header>
          <h1>Your Orders</h1>
          <button onClick={navigateToCart}>Go to Cart</button>
        </header>

        <div className="orders-list">
          {orders.map((order, index) => {
            const totalPrice = parseFloat(order.total_price);
            const deliveryFee = parseFloat(order.delivery_fee);
            const timeGapInSeconds = calculateTimeGapInSeconds(order.created_at); // Calculate the time gap in seconds
            const formattedTimeGap = formatTimeGap(timeGapInSeconds); // Format the time gap for display
            const storeName = order.store_name;
            const orderType = order.order_type === 'restaurant' ? 'Restaurant' : 'Shop';

            return (
              <div className="order-card" key={index}>
                <h3>Confirmation Code: {order.confirmation_code || 'N/A'}</h3>
                <p>{orderType}: {storeName}</p>
                <p>Time Ago: {formattedTimeGap}</p> {/* Display the formatted time gap */}
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
                <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>

                <h4>Order Items:</h4>
                <ul>
                  {order.items.map((item, index) => {
                    const itemPrice = parseFloat(item.price);
                    return (
                      <li key={index}>
                        <p>{item.name} (Quantity: {item.quantity}) - ${itemPrice.toFixed(2)}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Placedorder;