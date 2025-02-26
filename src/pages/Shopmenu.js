import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import { UserContext } from '../components/Usercontext'; // Import the context
import config from '../config'; // Import the configuration file
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const Shopmenu = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');
  const { id: shopId } = useParams();
  const [carts, setCarts] = useState([]); // Declare state for the cart
  const [items, setItems] = useState([]); // Track items in the menu
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // For enlarged image
  const navigate = useNavigate();

  // Add item to cart
  const addToCart = (ItemId, quantity) => {
    const cartItem = {
      user_id: user_id,
      item_id: ItemId,
      quantity: quantity,
    };

    axios
      .post(`${config.backendUrl}/shop_add_to_cart`, cartItem)
      .then((response) => {
        if (response.data.status === 'success') {
          toast.success(response.data.message || 'Item added to cart!');
          setCarts((prevCarts) => [...prevCarts, cartItem]); // Update the cart state
        } else {
          toast.error(response.data.message || 'Failed to add item to cart');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('An error occurred while adding to the cart');
      });
  };

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    const quantity = prompt(`Enter quantity for ${item.name}:`, '1');
    const parsedQuantity = parseInt(quantity, 10);

    if (quantity === null) {
      toast.info('Add to cart canceled');
      return;
    }

    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      addToCart(item.id, parsedQuantity);
    } else {
      toast.error('Invalid quantity. Please enter a positive number.');
    }
  };

  // Navigate to cart
  const handleGoToCart = () => {
    navigate(`/cart`, { state: { user_id: user.user_id } });
  };

  // Set user context
  useEffect(() => {
    setUser({ user_id });
  }, [user_id, setUser]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${config.backendUrl}/get_items_by_shop?shopId=${shopId}`
        );

        if (response.status === 200 && response.data.length > 0) {
          setItems(response.data);
        } else {
          setItems([]);
          toast.info('No menu items available.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load menu');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [shopId]);

  // Construct image URL
  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${config.backendUrl}/uploads/${imagePath}`;
  };

  return (
    <>
      <Navbars />
      <div style={styles.container}>
        <h1>Shop Menu</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.Container}>
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} style={styles.ItemCard}>
                  {!item.images || item.images.length === 0 ? (
                    <div style={styles.noImageMessage}>No images available</div>
                  ) : (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      style={styles.swiperContainer}
                      modules={[Navigation]}
                    >
                      {item.images.map((image, index) => (
                        <SwiperSlide key={`image-${index}`}>
                          <img
                            src={constructImageUrl(image)}
                            alt={`Image ${index}`}
                            style={styles.itemImage}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200'; // Fallback image
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>
                    {isNaN(Number(item.price)) || Number(item.price) <= 0
                      ? 'Price not available'
                      : `$${Number(item.price).toFixed(2)}`}
                  </p>
                  <button style={styles.addButton} onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No menu items available.</p>
            )}
          </div>
        )}
        <div style={styles.cartButtonContainer}>
          <button style={styles.cartButton} onClick={handleGoToCart}>
            Go to Cart
          </button>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '80px 20px 20px', // Added padding to top to avoid overlap with fixed navbar
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    minHeight: '100vh',
  },
  Container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Adjust column width for responsiveness
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  ItemCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#5cb85c',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cartButtonContainer: {
    marginTop: '20px',
  },
  cartButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  swiperContainer: {
    width: '100%',
    height: '200px',
    borderRadius: '10px',
  },
  itemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  noImageMessage: {
    fontSize: '16px',
    color: '#999',
    textAlign: 'center',
    padding: '20px',
  },
};

export default Shopmenu;
