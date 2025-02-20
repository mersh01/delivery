import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import styled from 'styled-components';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import ReactLoading from 'react-loading'; // Import for loading spinner
import { UserContext } from '../components/Usercontext'; // Import the context

// Helper function to fetch restaurants or shops
const fetchData = async (latitude, longitude, category = '', type = 'restaurant') => {
  let url = `http://localhost:5000/restaurants?latitude=${latitude}&longitude=${longitude}`;
  console.log("Fetching data for type:", type);

  if (type === 'shop') {
    url = `http://localhost:5000/shops?user_lat=${latitude}&user_lng=${longitude}&category=${category}`;
  }


  console.log("Request URL:", url); // Debugging the final URL
  const response = await fetch(url);
  const data = await response.json();
  console.log("API Response:", data); // Log the response to check the structure
  return data;
};

const List = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('restaurant');  // Track the type (restaurant or shop)
  const [latitude, setLatitude] = useState(null); // Store latitude dynamically
  const [longitude, setLongitude] = useState(null); // Store longitude dynamically
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');
  const username = searchParams.get('username');
  const navigate = useNavigate(); // Use navigate for navigation
  console.log('userIds:', user_id);

  useEffect(() => {
    setUser({ user_id, username });
  }, [user_id, username, setUser]);

  // Get user's geolocation dynamically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(''); // Clear the error on success
          setLoading(false);
          console.log('Location fetched: ', position.coords);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Permission denied. Please enable location in browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location unavailable. Try again later.');
              break;
            case error.TIMEOUT:
              setError('Request timed out. Try again.');
              break;
            default:
              setError('Geolocation failed. Please check your settings.');
          }
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    const getPlaces = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          setLoading(true);
          setError('');  // Reset the error before attempting to fetch data
          const data = await fetchData(latitude || 0, longitude || 0, category, type);
  
          if (data.success) {
            const places = data.restaurants || data.shops || [];
            const placesWithType = places.map(place => ({
              ...place,
              type: type
            }));
            setPlaces(placesWithType);
          } else {
            setError(data.message || 'Failed to fetch data');
            setPlaces([]); 
          }
        } catch (err) {
          setError('Failed to fetch data.');
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      }
    };

    getPlaces();
  }, [latitude, longitude, category, type]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);  // Update category and fetch filtered shops
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
  
    // If switching to 'shop', default the category to 'Clothing' (value: '1')
    if (selectedType === 'shop') {
      setCategory('1');
    } else {
      setCategory('');  // Reset category if it's not a shop
    }
  };

  // Handle Cart Button Click
  const goToCart = () => {
    navigate('/cart', { state: { user_id, username } });
  };
  
  return (
    <>
      <Navbars />

      <Container>
        <Title>Choose a Restaurant or Shop</Title>

        {/* Button to navigate to the Cart page */}
        <CartButton onClick={goToCart}>Go to Cart</CartButton>

        {/* Toggle between Restaurant and Shop */}
        <FilterContainer>
          <Label htmlFor="type">Select Type: </Label>
          <Select id="type" value={type} onChange={handleTypeChange}>
            <option value="restaurant">Restaurant</option>
            <option value="shop">Shop</option>
          </Select>
        </FilterContainer>

        {/* If the type is 'shop', show the category filter */}
        {type === 'shop' && (
          <FilterContainer>
            <Label htmlFor="category">Select Category: </Label>
            <Select id="category" value={category} onChange={handleCategoryChange}>
              <option value="1">Clothing</option>
              <option value="2">Shoes</option>
              <option value="3">Electronics</option>
              <option value="4">All Categories</option>
            </Select>
          </FilterContainer>
        )}

        {/* Loading spinner */}
        {loading && (
          <SpinnerContainer>
            <ReactLoading type="spin" color="#333" height={50} width={50} />
          </SpinnerContainer>
        )}

        {/* Error message display */}
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        {/* Horizontal scrollable container for Restaurants and Shops */}
        <PlacesContainer>
         <PlacesList>
  {places.length > 0 ? (
    places.map((place) => {
      return (
        <PlaceCard key={place.id}>
          <LinkToMenu
            to={{
              pathname: place.type === 'shop' ? `/shopmenu/${place.id}` : `/menu/${place.id}`,
              search: `?user_id=${user_id || 'default_user_id'}&username=${username || 'Guest'}`, // Pass default values if undefined
            }}
          >
            <PlaceName>{place.name} - {place.type || 'Shop'}</PlaceName>
            <PlaceDiscription>- {place.description}</PlaceDiscription>
            <PlaceAddress>- {place.address}</PlaceAddress>
            {place.distance && (
              <PlaceDistance>
                {parseFloat(place.distance).toFixed(3)} km away
              </PlaceDistance>
            )}
          </LinkToMenu>
        </PlaceCard>
      );
    })
  ) : (
    !loading && !error && (
      <NoPlacesText>
        No {type}s found in your area.
      </NoPlacesText>
    )
  )}
</PlacesList>

        </PlacesContainer>

      </Container>
      
      <Footer />
    </>
  );
};

export default List;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  padding: 50px;
`;

// Styled Cart Button
const CartButton = styled.button`
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

const PlacesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 10px;
`;

const PlacesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  list-style: none;
  min-width: 280px;
`;

const PlaceCard = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LinkToMenu = styled(Link)`
  text-decoration: none;
  color: #333;
`;

const PlaceName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const PlaceDiscription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 5px 0;
`;

const PlaceAddress = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin: 5px 0;
`;

const PlaceDistance = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const NoPlacesText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin-top: 20px;
`;
