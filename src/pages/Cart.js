import React, { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cart.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbars from '../components/Navbars';
import Footer from '../components/Footer';
import { UserContext } from '../components/Usercontext'; // Import the context

const RestaurantItemList = ({ restaurantItems, removeItem }) => (
  <div className="restaurant-cart-section">
    <h2>Restaurant Items</h2>
    {Object.keys(restaurantItems).map((restaurantName) => (
      <div key={restaurantName} className="restaurant-section">
        <h3>{restaurantName}</h3>
        <ul>
          {restaurantItems[restaurantName].map((item) => (
            <li key={item.menu_item_id}>
              <div>
                <strong>{item.name}</strong> - ${item.price.toFixed(2)} x {item.quantity}
                <p>{item.description}</p>
              </div>
              <button
                onClick={() => removeItem('restaurant', item.menu_item_id, restaurantName)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ShopItemList = ({ shopItems, removeItem }) => (
  <div className="shop-cart-section">
    <h2>Shop Items</h2>
    {Object.keys(shopItems).map((shopName) => (
      <div key={shopName} className="shop-section">
        <h3>{shopName}</h3>
        <ul>
          {shopItems[shopName].map((item) => (
            <li key={item.item_id}>
              <div>
                <strong>{item.name}</strong> - ${item.price.toFixed(2)} x {item.quantity}
                <p>{item.description}</p>
              </div>
              <button
                onClick={() => removeItem('shop', item.item_id, shopName)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);


const Cart = () => {
  const { setUser } = useContext(UserContext); // Get the setUser function from context
  const location = useLocation();
  const { user_id, username } = location.state || {}; // Destructure user_id and username

  console.log('cartuserId:', user_id);  // Verify the value of user_id

  const [restaurantItems, setRestaurantItems] = useState({});
  const [shopItems, setShopItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items from the API
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_cart?user_id=${user_id}`);
      const jsonData = await response.json();

      if (jsonData.success) {
        let restaurantItems = {};
        let shopItems = {};
        let total = 0;

        jsonData.items.forEach(item => {
          if (item.restaurant_name) {
            const restaurantName = item.restaurant_name;
            if (!restaurantItems[restaurantName]) {
              restaurantItems[restaurantName] = [];
            }
            restaurantItems[restaurantName].push({
              menu_item_id: item.menu_item_id,
              quantity: item.quantity,
              price: parseFloat(item.price) || 0.0,
              name: item.name,
              description: item.description || '',
            });
          } else if (item.shop_name) {
            const shopName = item.shop_name;
            if (!shopItems[shopName]) {
              shopItems[shopName] = [];
            }
            shopItems[shopName].push({
              item_id: item.item_id,
              quantity: item.quantity,
              price: parseFloat(item.price) || 0.0,
              name: item.name,
              description: item.description || '',
            });
          }
        });

        // Calculate total price
        Object.values(restaurantItems).forEach(items => {
          items.forEach(item => {
            total += item.price * item.quantity;
          });
        });

        Object.values(shopItems).forEach(items => {
          items.forEach(item => {
            total += item.price * item.quantity;
          });
        });

        setRestaurantItems(restaurantItems);
        setShopItems(shopItems);
        setTotalPrice(total);
        setLoading(false);
      } else {
        toast.error("No items found in cart.");
        setLoading(false);
      }
    } catch (e) {
      toast.error(`Error: ${e}`);
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    setUser({ user_id, });
  }, [user_id, setUser]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalPrice, user_id, username } });
  };

  const removeItem = async (type, itemId, itemName) => {
    try {
      const response = await fetch('http://localhost:5000/remove_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure you're sending JSON
        },
        body: JSON.stringify({
          user_id: user_id.toString(),
          menu_item_id: itemId.toString(),
          type: type,
        }),
      });
  
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        toast.success(`${itemName} removed from cart.`);
        fetchCartItems();
      } else {
        toast.error(jsonResponse.message);
      }
    } catch (e) {
      toast.error(`Error: ${e}`);
    }
  };
  
  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <>
      <Navbars />
    <div className="cart-container">
      <h1>Your Cart</h1>
      {Object.keys(restaurantItems).length === 0 && Object.keys(shopItems).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <RestaurantItemList restaurantItems={restaurantItems} removeItem={removeItem} />
          <ShopItemList shopItems={shopItems} removeItem={removeItem} />

          <div className="total-price">
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
    <Footer />
    </>
  );
};

export default Cart;
