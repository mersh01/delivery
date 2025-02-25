import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../components/Usercontext'; // Import the context
import config from '../config'; // Import the configuration file

// Import Swiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

// Menu component for displaying menu items
const Menu = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');

  const { id: restaurantId } = useParams(); // Get the restaurant ID from the URL
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to add item to cart
  const addToCart = (menuItemId, quantity) => {
    const cartItem = {
      user_id: user_id,
      menu_item_id: menuItemId,
      quantity: quantity,
    };

    axios.post(`${config.backendUrl}/add_to_cart`, cartItem)
      .then(response => {
        if (response.data.status === 'success') {
          toast.success(response.data.message || 'Item added to cart!');
          setCart([...cart, cartItem]);  // Update the cart state
        } else {
          toast.error(response.data.message || 'Failed to add item to cart');
        }
      })
      .catch(error => {
        console.error(error);
        toast.error('An error occurred while adding to the cart');
      });
  };

  // Helper function to show the quantity dialog
  const handleAddToCart = (item) => {
    const quantity = prompt(`Enter quantity for ${item.name}:`, '1');
    const parsedQuantity = parseInt(quantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      addToCart(item.id, parsedQuantity);
    } else {
      toast.error('Invalid quantity');
    }
  };

  useEffect(() => {
    setUser({ user_id });
  }, [user_id, setUser]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true); // Start loading when fetching starts
        const response = await axios.get(
          `${config.backendUrl}/get_menu?restaurant_id=${restaurantId}`
        );
        console.log(response.data); // Log the data to check the structure
        if (response.status === 200 && response.data.length > 0) {
          setMenuItems(response.data);
        } else {
          setMenuItems([]);  // If no data, ensure menuItems is empty
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load menu');
        setMenuItems([]);  // In case of error, empty the menuItems array
      } finally {
        setLoading(false);  // Stop loading
      }
    };
    

    fetchMenu();
  }, [restaurantId]);  // Only run when restaurantId changes

  return (
    <>
      <Navbars />
      <div style={styles.appContainer}>
        <div style={styles.container}>
          <h1>Menu</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={styles.menuContainer}>
              {menuItems.length > 0 ? (
                menuItems.map(item => (
                  <div key={item.id} style={styles.menuItemCard}>
                    {/* Image Slider */}
                    {item.image_paths && item.image_paths.length > 0 ? (
  <Swiper
    navigation={true}
    modules={[Navigation]}
    spaceBetween={10}
    slidesPerView={1}
    style={styles.swiperContainer}
  >
    {item.image_paths.map((image, index) => (
      <SwiperSlide key={index}>
        <img
          src={image}
          alt={item.name}
          style={styles.menuImage}
        />
      </SwiperSlide>
    ))}
  </Swiper>
) : (
  <p>No Image Available</p>  // Fallback message when there are no images
)}

                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    <button onClick={() => handleAddToCart(item)} style={styles.addButton}>
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <p>No menu items available.</p>
              )}
            </div>
          )}
          <ToastContainer />
        </div>
        <Footer />
      </div>
    </>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',  // Ensure the page takes the full height of the screen
  },
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '80px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    flex: 1,  // Take the available space between navbar and footer
  },
  menuContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  menuItemCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  swiperContainer: {
    width: '100%',
    height: '200px',
    borderRadius: '10px',
  },
  menuImage: {
    width: '100%', // Make the image responsive
    height: '200px', // Set fixed height
    objectFit: 'cover', // Crop image if necessary
    borderRadius: '10px', // Match card styling
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#5cb85c',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Menu;