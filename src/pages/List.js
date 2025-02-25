import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import ReactLoading from 'react-loading';
import { UserContext } from '../components/Usercontext';
import config from '../config';

// Helper function to fetch restaurants or shops
const fetchData = async (latitude, longitude, category = '', type = 'restaurant') => {
  let url = `${config.backendUrl}/restaurants?latitude=${latitude}&longitude=${longitude}`;
  if (type === 'shop') {
    url = `${config.backendUrl}/shops?user_lat=${latitude}&user_lng=${longitude}&category=${category}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const List = () => {
  const { setUser } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('restaurant');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('user_id');
  const username = searchParams.get('username');
  const navigate = useNavigate();

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
          setError('');
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          setError('Unable to fetch location. Please enable location access.');
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
          setError('');
          const data = await fetchData(latitude, longitude, category, type);
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
    setCategory(e.target.value);
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    if (selectedType === 'shop') {
      setCategory('1');
    } else {
      setCategory('');
    }
  };

  const goToCart = () => {
    navigate('/cart', { state: { user_id, username } });
  };

  return (
    <>
      <Navbars />
      <Container>
        <Title>Discover Restaurants & Shops Near You</Title>

        <CartButton onClick={goToCart}>🛒 View Cart</CartButton>

        <FilterContainer>
          <Label htmlFor="type">Type: </Label>
          <Select id="type" value={type} onChange={handleTypeChange}>
            <option value="restaurant">Restaurant</option>
            <option value="shop">Shop</option>
          </Select>

          {type === 'shop' && (
            <>
              <Label htmlFor="category">Category: </Label>
              <Select id="category" value={category} onChange={handleCategoryChange}>
                <option value="1">Clothing</option>
                <option value="2">Shoes</option>
                <option value="3">Electronics</option>
                <option value="4">All Categories</option>
              </Select>
            </>
          )}
        </FilterContainer>

        {loading && (
          <SpinnerContainer>
            <ReactLoading type="spin" color="#FF6B6B" height={50} width={50} />
          </SpinnerContainer>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PlacesContainer>
          {places.length > 0 ? (
            places.map((place) => (
              <PlaceCard key={place.id}>
                <LinkToMenu
                  to={{
                    pathname: place.type === 'shop' ? `/shopmenu/${place.id}` : `/menu/${place.id}`,
                    search: `?user_id=${user_id || 'default_user_id'}&username=${username || 'Guest'}`,
                  }}
                >
                  {/* Use the image URL from the database */}
                  <PlaceImage
                    src={place.path ? `${config.imageBaseUrl}/${place.path}` : `${config.imageBaseUrl}/default.jpg`}
                    alt={place.name}
                  />
                  <PlaceName>{place.name}</PlaceName>
                  <PlaceDescription>{place.description}</PlaceDescription>
                  <PlaceAddress>{place.address}</PlaceAddress>
                  {place.distance && (
                    <PlaceDistance>{parseFloat(place.distance).toFixed(2)} km away</PlaceDistance>
                  )}
                </LinkToMenu>
              </PlaceCard>
            ))
          ) : (
            !loading && !error && <NoPlacesText>No {type}s found in your area.</NoPlacesText>
          )}
        </PlacesContainer>
      </Container>
      <Footer />
    </>
  );
};

export default List;

// Styled Components (unchanged)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  margin-top: 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const CartButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4757;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin: 20px 0;
`;

const PlacesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
`;

const PlaceCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const LinkToMenu = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const PlaceName = styled.h2`
  font-size: 1.25rem;
  margin: 10px;
  color: #333;
`;

const PlaceDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 10px 10px;
`;

const PlaceAddress = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin: 0 10px 10px;
`;

const PlaceDistance = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin: 0 10px 10px;
  display: block;
`;

const NoPlacesText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin-top: 20px;
`;