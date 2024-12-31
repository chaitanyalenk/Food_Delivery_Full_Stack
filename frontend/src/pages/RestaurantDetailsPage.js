import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantDetailsPage() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/restaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRestaurant(response.data);
      } catch (error) {
        setError("Error fetching restaurant details: " + error.message);
        console.error("Error fetching restaurant details:", error);
      }
    };

    if (token) {
      fetchRestaurant();  
    } else {
      setError("No authentication token found.");
    }
  }, [id, token]);

  // Add dish to cart
  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingDishIndex = prevCart.findIndex(item => item.name === dish.name); // Use name for unique identification
      
      if (existingDishIndex > -1) {
        // If dish exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingDishIndex].quantity += 1;
        return updatedCart;
      } else {
        // If dish doesn't exist, add new dish
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
    setIsCartOpen(true);  // Open the cart when an item is added
  };

  // Remove dish from cart
  const removeFromCart = (dishName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== dishName)); // Filter by unique name
    
    // Close cart if no items left
    if (cart.length === 1) {
      setIsCartOpen(false);
    }
  };

  const changeQuantity = (dishName, action) => {
    setCart(prevCart => {
      // Check if the dish exists in the cart
      const existingDishIndex = prevCart.findIndex(item => item.name === dishName);
  
      if (existingDishIndex > -1) {
        // If dish exists in the cart, increment or decrement quantity
        const updatedCart = prevCart.map((item, index) => {
          if (index === existingDishIndex) {
            if (action === 'increment') {
              return { ...item, quantity: item.quantity + 1 };
            } else if (action === 'decrement' && item.quantity > 0) {
              return { ...item, quantity: item.quantity - 1 };
            }
          }
          return item;
        }).filter(item => item.quantity > 0); // Remove items with quantity <= 0
  
        return updatedCart;
      } else if (action === 'increment') {
        // If dish doesn't exist and action is 'increment', call addToCart
        const dish = restaurant.menu.find(item => item.name === dishName);
        if (dish) {
          addToCart(dish); // Add dish to cart with initial quantity of 1
        }
      }
  
      return prevCart; // Return the previous cart if no changes are made
    });
  
    // Close cart if no items left
    if (cart.length === 1 && action === 'decrement') {
      setIsCartOpen(false);
    }
  };

  // Calculate total cart amount
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Checkout handler (placeholder)
  const handleCheckout = () => {
    // Implement checkout logic here
    // Inside handleCheckout function
navigate('/checkout', { state: { cart, total: calculateTotal() } }); // Passing cart and total as state

  };

  return (
    <div className="container mt-5">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {restaurant ? (
        <div>
          {/* Restaurant Cover and Details */}
        <div 
  style={{
    display: 'flex',
    borderRadius: '8px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    overflow: 'hidden', 
    margin: '20px', 
    backgroundColor: '#fff'
  }}
>
  <img 
    src={`http://localhost:5000${restaurant.image_url}`} 
    alt={restaurant.restaurant_name} 
    style={{
      width: '70%', 
      height: '400px', 
      objectFit: 'cover',
      borderRight: '2px solid #ddd' 
    }} 
  />
  <div style={{ width: '30%', padding: '20px' }}>
    <h2 style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: 'bold' }}>{restaurant.restaurant_name}</h2>
    <p style={{ margin: '5px 0', fontSize: '16px' }}>{restaurant.address}</p>
    <p style={{ margin: '5px 0', fontSize: '16px' }}>Email: {restaurant.email}</p>
    <p style={{ margin: '5px 0', fontSize: '16px' }}>Phone: {restaurant.mobile}</p>
    <p style={{ margin: '5px 0', fontSize: '16px' }}>Rating: {restaurant.rating}</p>
  </div>
</div>


          {/* Menu Section */}
          <h3>Menu</h3>
          <div className="row">
            {restaurant.menu.map(dish => (
              <div className="col-md-4 mb-4" key={dish.name}> {/* Use name as key */}
                <div className="card">
                  <div className="card-body">
                    <h5>{dish.name}</h5>
                    <p>{dish.description}</p>
                    <p>Price: ${dish.price}</p>
                    <p>Rating: {dish.rating}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className="btn btn-danger" 
                        onClick={() => addToCart(dish)}
                      >
                        Add to Cart
                      </button>
                      {/* Quantity controls */}
                      <div className="d-flex align-items-center">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => changeQuantity(dish.name, 'decrement')}
                        >
                          -
                        </button>
                        <span className="mx-2">
                          {cart.find(item => item.name === dish.name)?.quantity || 0}
                        </span>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => changeQuantity(dish.name, 'increment')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading restaurant details...</p>
      )}

      {/* View Cart Button */}
      <button className="btn btn-primary mt-3" onClick={() => setIsCartOpen(true)}>
        View Cart
      </button>

      {/* Cart Off-Canvas */}
      {isCartOpen && (
        <div 
          className="offcanvas offcanvas-end show" 
          style={{ width: '400px', padding: '20px' }}
        >
          <div className="offcanvas-header">
            <h5>Cart</h5>
            <button 
              className="btn-close" 
              onClick={() => setIsCartOpen(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            {/* Conditional Rendering for Cart Content */}
            {cart.length > 0 ? (
              <div>
                <ul className="list-group">
                  {cart.map((item) => (
                    <li 
                      key={item.name} 
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <span>{item.name}</span>
                        <span className="ml-2 text-muted">
                          (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => removeFromCart(item.name)} 
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Total Amount */}
                <div className="mt-3 d-flex justify-content-between">
                  <strong>Total:</strong>
                  <span>${calculateTotal()}</span>
                </div>

                {/* Checkout Buttons */}
                <div className="mt-3 d-flex justify-content-between">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Close
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              // Show Empty Cart Message
              <p>Cart is empty. Order something!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDetailsPage;
