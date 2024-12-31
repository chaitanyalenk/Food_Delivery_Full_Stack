import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import homepagebackground from '../assests/homepage.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function HomePage() {
  // State variables to store data
  const [restaurants, setRestaurants] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const navigate = useNavigate();
  // Fetch restaurants and related data on component mount
  useEffect(() => {
    // Assuming JWT token is stored in localStorage (you can adjust this as per your auth system)
    const token = localStorage.getItem('token');

    axios
      .get('https://fooddeliveryapp-38or.onrender.com/restaurants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const restaurantData = response.data;
        setRestaurants(restaurantData);
        console.log(restaurantData);
        // Extracting top 6 restaurants by rating
        const sortedRestaurants = restaurantData.sort((a, b) => b.rating - a.rating).slice(0, 6);
        setTopDeals(sortedRestaurants);

        // Extract categories and count their frequency
        const categoryCount = {};
        restaurantData.forEach((restaurant) => {
          restaurant.menu.forEach((item) => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
          });
        });

        // Sorting categories by frequency
        const sortedCategories = Object.entries(categoryCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([category]) => category);

        setTopCategories(sortedCategories);

      })
      .catch((error) => {
        console.error('Error fetching restaurant data:', error);
      });
  }, []);

  // Card style
  const cardStyle = {
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
  };

  const cardImgStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  };

  return (
    <div className="container mt-5">
      {/* Cover section with search bar */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '60vh',
          backgroundImage: `url(${homepagebackground})`,
          backgroundSize: 'cover',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
        
        </div>
      </div>

      {/* Exciting Deals */}
      <div className="exciting-deals mt-5">
        <h2>Exciting Deals and Offers</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {topDeals.slice(0, 3).map((restaurant) => (
            <div style={{ width: '30%' }} key={restaurant._id}>
              <div
                className="card"
                style={cardStyle}
                onMouseOver={(e) => (e.currentTarget.style = { ...cardStyle, ...cardHoverStyle })}
                onMouseOut={(e) => (e.currentTarget.style = cardStyle)}
              >
                <img
                  src={`https://fooddeliveryapp-38or.onrender.com${restaurant.image_url}`}
                  alt={restaurant.restaurant_name}
                  style={cardImgStyle}

                />

                <div className="card-body">
                  {/* Display the deal */}
                  <p>{restaurant.deals[0]}</p> {/* You can modify which deal to show based on your requirements */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 'bold' }}>{restaurant.restaurant_name}</p>
                    <p>{restaurant.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Popular Categories */}
      <div className="order-categories mt-5">
        <h2>Order Popular Categories</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {topCategories.map((category, index) => (
            <div style={{ width: '15%' }} key={index}>
              <div
                className="card"
                style={cardStyle}
                onMouseOver={(e) => (e.currentTarget.style = { ...cardStyle, ...cardHoverStyle })}
                onMouseOut={(e) => (e.currentTarget.style = cardStyle)}
              >
                <img
                  src={`https://fooddeliveryapp-38or.onrender.com/images/${category}.jpg`}
                  alt={category}
                  style={cardImgStyle}
                  onError={(e) => { e.target.src = '/default_category.jpg'; }}
                />

                <div className="card-body">
                  <h5 className="card-title">{category}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Restaurants */}
      <div className="popular-restaurants mt-5">
        <h2>Popular Restaurants</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {restaurants.slice(0, 6).map((restaurant) => (
            <div style={{ width: '15%' }} key={restaurant._id}>
              <div
                className="card"
                style={cardStyle}
                onMouseOver={(e) => (e.currentTarget.style = { ...cardStyle, ...cardHoverStyle })}
                onMouseOut={(e) => (e.currentTarget.style = cardStyle)}
              >
                <img
                  src={`https://fooddeliveryapp-38or.onrender.com/images${restaurant.image_url}`}
                  alt={restaurant.restaurant_name}
                  style={cardImgStyle}
                  onError={(e) => { e.target.src = '/default_image.jpg'; }}
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)} 
                 
                />

                <div className="card-body">
                  <p style={{ fontWeight: 'bold' }}>{restaurant.restaurant_name}({restaurant.rating})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
