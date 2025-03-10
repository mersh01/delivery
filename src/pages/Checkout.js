import React, { useState, useEffect, useContext, useCallback } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './cart.css';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbars from '../components/Navbars';
import { UserContext } from '../components/Usercontext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../config'; // Import the configuration file
import { FaSearch } from 'react-icons/fa'; // Import search icon
import { debounce } from 'lodash'; // Import debounce function

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CheckoutContainer = styled.div`
  padding: 20px;
  padding-top: 80px; /* Add padding-top to account for the navbar height */

  @media (min-width: 768px) {
    padding: 50px;
    padding-top: 100px; /* Adjust for larger screens if needed */
  }

  @media (min-width: 1024px) {
    padding: 100px;
    padding-top: 120px; /* Adjust for larger screens if needed */
  }
`;

const Card = styled.div`
  elevation: 5;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  font-size: 20px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Button = styled.button`
  background-color: #FF5722;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-top: 20px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 300px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  position: relative;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
`;

// Component to update the map view
const UpdateMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const { user_id, totalPrice } = location.state || {};
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(8.9083371); // Default latitude
  const [longitude, setLongitude] = useState(38.8100753); // Default longitude
  const [coordinates, setCoordinates] = useState(''); // Store latitude and longitude as a string
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Loading state for placing order
  const [deliveryFee, setDeliveryFee] = useState(0.0); // Delivery fee
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control the payment modal
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    setUser({ user_id });
  }, [user_id, setUser]);

  // Function to fetch address from coordinates
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        return data.display_name; // Returns the full address
      }
      return `${lat}, ${lng}`; // Fallback to coordinates if address is not found
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${lat}, ${lng}`; // Fallback to coordinates on error
    }
  };

  // Function to calculate delivery fee dynamically
  const calculateDeliveryFee = async (lat, lng) => {
    try {
      const response = await axios.post(`${config.backendUrl}/update_locations`, {
        user_id: user_id,
        latitude: lat,
        longitude: lng,
        total_price: totalPrice,
      });

      if (response.status === 200) {
        return response.data.total_delivery_fee; // Return the delivery fee from the API
      } else {
        throw new Error('Failed to calculate delivery fee');
      }
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      return 0.0; // Fallback to $0.0 if the API call fails
    }
  };

  // Update coordinates, address, and delivery fee when marker is dragged
  const handleMarkerDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLatitude(lat);
    setLongitude(lng);
    setCoordinates(`${lat},${lng}`); // Store latitude and longitude as a string
    const newAddress = await fetchAddressFromCoordinates(lat, lng);
    setAddress(newAddress);
    const fee = await calculateDeliveryFee(lat, lng); // Calculate delivery fee dynamically
    setDeliveryFee(fee);
    console.log("Marker dragged to:", { lat, lng, address: newAddress, deliveryFee: fee });
  };

  // Function to update location and delivery fee
  const updateLocationAndFee = async (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setCoordinates(`${lat},${lng}`); // Store latitude and longitude as a string
    const newAddress = await fetchAddressFromCoordinates(lat, lng);
    setAddress(newAddress);
    const fee = await calculateDeliveryFee(lat, lng); // Calculate delivery fee dynamically
    setDeliveryFee(fee);
  };

  // Geolocation to get the user's current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          await updateLocationAndFee(lat, long); // Update location and delivery fee
        },
        (error) => {
          console.error('Error fetching location: ', error);
          alert('Error fetching your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  // Share location button handler
  const shareLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          await updateLocationAndFee(lat, long); // Update location and delivery fee
          alert("Location updated successfully!");
        },
        (error) => {
          console.error('Error fetching location: ', error);
          alert('Error fetching your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          await updateLocationAndFee(parseFloat(lat), parseFloat(lon)); // Update location and delivery fee
        } else {
          alert('No results found for the search query.');
        }
      } catch (error) {
        console.error('Error searching for place:', error);
        alert('Error searching for place.');
      }
    }, 500), // Debounce delay of 500ms
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query); // Trigger debounced search
  };

  // Handle payment method selection
  const handlePaymentMethod = async (method) => {
    setShowPaymentModal(false);

    if (method === 'cash') {
      await placeOrder();
    } else if (method === 'transfer') {
      navigate('/paymentpage', { state: { user_id, totalPrice: totalPrice + deliveryFee } });
    }
  };

  // Place order
  const placeOrder = async () => {
    if (coordinates === '') {
      alert("Please share your location first.");
      return;
    }

    setIsPlacingOrder(true); // Disable the button to prevent multiple submissions
    const confirmationCode = generateRandomCode();

    try {
      const cartResponse = await axios.get(`${config.backendUrl}/get_cartss?user_id=${user_id}`);

      if (cartResponse.status === 200 && cartResponse.data.success) {
        const formattedCartItems = formatCartItems(cartResponse.data.items);

        const response = await axios.post(`${config.backendUrl}/place-order`, {
          user_id: user_id,
          location: coordinates, // Send latitude and longitude as a string
          confirmation_code: confirmationCode,
          cart_items: formattedCartItems,
        });

        if (response.status === 200) {
          const clearCartResponse = await axios.post(`${config.backendUrl}/clear_cart`, { user_id: user_id });

          if (clearCartResponse.status === 200) {
            navigate('/placedorder', { state: { user_id } });
            alert("Order placed successfully!");
          }
        } else {
          alert("Failed to place order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error: " + error.message);
    } finally {
      setIsPlacingOrder(false); // Enable the button again
    }
  };

  const generateRandomCode = () => {
    const characters = '0123456789';
    return Array.from({ length: 6 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  };

  const formatCartItems = (cartItems) => {
    return cartItems.map(item => {
      if (item.type === 'restaurant') {
        return {
          type: 'restaurant',
          menu_item_id: item.item_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
          restaurant_id: item.restaurant_id,
          restaurant_name: item.restaurant_name,
        };
      } else if (item.type === 'shop') {
        return {
          type: 'shop',
          item_id: item.item_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
          shop_id: item.shop_id,
          shop_name: item.shop_name,
        };
      }
      return item;
    });
  };

  return (
    <>
      <Navbars />
      <CheckoutContainer>
        <Title>Checkout</Title>
        <Card>
          <p>Select or Share your Location</p>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search for a place..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <SearchIcon />
          </SearchContainer>
          <div style={{ height: '300px', width: '100%' }}>
            <MapContainer
              center={[latitude, longitude]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[latitude, longitude]}
                draggable
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              >
                <Popup>Your selected location</Popup>
              </Marker>
              <UpdateMapView center={[latitude, longitude]} />
            </MapContainer>
          </div>
          <p>{`Address: ${address}`}</p>
          <p>{`Coordinates: ${coordinates}`}</p>

          <Button onClick={shareLocation} disabled={!latitude || !longitude}>
            Share Location
          </Button>

          {/* Displaying the delivery fee and total price */}
          <p>{`Delivery Fee: ${deliveryFee.toFixed(2)}`}</p>
          <p>{`Total Price: ${(totalPrice + deliveryFee).toFixed(2)}`}</p>

          <Button onClick={() => setShowPaymentModal(true)} disabled={!coordinates || isPlacingOrder}>
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </Button>

          {/* Payment method selection modal */}
          {showPaymentModal && (
            <ModalOverlay>
              <ModalContent>
                <h2>Select Payment Method</h2>
                <Button onClick={() => handlePaymentMethod('cash')}>Cash</Button>
                <Button onClick={() => handlePaymentMethod('transfer')}>Transfer</Button>
              </ModalContent>
            </ModalOverlay>
          )}
        </Card>
      </CheckoutContainer>
      <Footer />
    </>
  );
};

export default Checkout;