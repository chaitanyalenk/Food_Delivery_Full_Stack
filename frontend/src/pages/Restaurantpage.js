import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import pasta from '../assests/PastaCasuals.png'
function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  // Get the token from local storage
  const token = localStorage.getItem('token'); // Assuming you're storing the JWT token in localStorage

  // Fetching the restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,  // Adding the JWT token to the request header
          }
        });
        setRestaurants(response.data); // assuming the backend returns a list of restaurants
      } catch (error) {
        setError("Error fetching restaurants: " + error.message);
        console.error("Error fetching restaurants:", error);
      }
    };

    if (token) {
      fetchRestaurants();  // Only fetch if token is available
    } else {
      setError("No authentication token found.");
    }
  }, [token]);

  const cardStyle = {
    border: 'none',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
  };

  const cardImgStyle = {
    height: '200px',
    objectFit: 'cover'
  };

  const cardBodyStyle = {
    textAlign: 'center'
  };

  const cardTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };

  const cardTextStyle = {
    fontSize: '1rem',
    color: '#555'
  };

  const btnStyle = {
    fontSize: '1rem',
    padding: '10px 15px'
  };

  return (
    <div className="container mt-5">
      <h2>Restaurants</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}
      <div className="row">
        {restaurants.map(restaurant => (
          <div className="col-md-4 mb-4" key={restaurant._id}>
            <div
              className="card"
              style={cardStyle}
              onMouseOver={e => e.currentTarget.style = {...cardStyle, ...cardHoverStyle}} // Adding hover effect
              onMouseOut={e => e.currentTarget.style = cardStyle} // Removing hover effect
            >
              <img
                src={`http://localhost:5000${restaurant.image_url}`}
                alt={restaurant.restaurant_name}
                className="card-img-top"
                style={cardImgStyle}
                onError={(e) => { e.target.src = {pasta} }}
              />
              <div className="card-body" style={cardBodyStyle}>
                <h5 className="card-title" style={cardTitleStyle}>{restaurant.restaurant_name}</h5>
                <p className="card-text" style={cardTextStyle}>Rating: {restaurant.rating}</p>
                <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary" style={btnStyle}>View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantPage;
