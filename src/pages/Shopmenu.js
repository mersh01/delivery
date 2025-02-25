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

const Shopmenu = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');
  console.log('userId:', user_id);
  const { id: shopId } = useParams();
  const [carts, setCarts] = useState([]);  // Declare state for the cart
  const [items, setItems] = useState([]); // Track items in the menu
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // For enlarged image

  // Function to add item to cart
  const addToCart = (ItemId, quantity) => {
    const cartItem = {
      user_id: user_id,
      item_id: ItemId,
      quantity: quantity,
    };
    console.log('Sending to PHP:', cartItem);  // Debug log

    axios.post(`${config.backendUrl}/shop_add_to_cart`, cartItem)
      .then(response => {
        if (response.data.status === 'success') {
          toast.success(response.data.message || 'Item added to cart!');
          setCarts([...carts, cartItem]);  // Update the cart state
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
          `${config.backendUrl}/get_items_by_shop?shopId=${shopId}`
        );

        console.log('API Response:', response.data);
        if (response.status === 200 && response.data.length > 0) {
          setItems(response.data);
        } else {
          setItems([]);  // If no data, ensure menuItems is empty
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load menu');
        setItems([]);  // In case of error, empty the menuItems array
      } finally {
        setLoading(false);  // Stop loading
      }
    };
    fetchMenu();
  }, [shopId]);


  // Define the constructImageUrl function
  const constructImageUrl = (imagePath) => {
    const baseUrl = 'http://localhost/food_ordering_api/uploads/';
    
    console.log('Original imagePath:', imagePath);

    if (imagePath) {
      if (imagePath.startsWith('http://10.0.2.2')) {
        const replacedUrl = imagePath.replace('http://10.0.2.2', 'http://localhost');
        console.log('Replaced 10.0.2.2 with localhost:', replacedUrl);
        return replacedUrl;
      }

      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log('Final URL (absolute):', imagePath);
        return imagePath;
      }

      const constructedUrl = `${baseUrl}${imagePath}`;
      console.log('Constructed URL using baseUrl:', constructedUrl);
      return constructedUrl;
    }

    console.log('No image available, returning null.');
    return null;
  };

  // Define the toggleImageSize function
  const toggleImageSize = (imageUrl) => {
    setSelectedImage(selectedImage === imageUrl ? null : imageUrl);
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
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>
                    {isNaN(Number(item.price)) || Number(item.price) <= 0
                      ? 'Price not available'
                      : `$${Number(item.price).toFixed(2)}`}
                  </p>

                  {item.image_url && (
                    <img
                      src={constructImageUrl(item.image_url)}
                      alt={item.name}
                      style={{
                        ...styles.itemImage,
                        ...(selectedImage === constructImageUrl(item.image_url) && styles.enlargedImage),
                      }}
                      onClick={() => toggleImageSize(constructImageUrl(item.image_url))}
                    />
                  )}

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
          <button style={styles.cartButton}>Go to Cart</button>
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
    padding: '20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    minHeight: '100vh',
  },
  Container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  itemImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  enlargedImage: {
    width: '400px',
    height: '400px',
    objectFit: 'cover',
  },
};

export default Shopmenu;
