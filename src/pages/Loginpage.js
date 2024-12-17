import React, { useState } from 'react';
import signupbackground from '../assests/signupbackground.png';
import kfc from '../assests/kfc.png';
import Mcd from '../assests/Mcd.png';
import burgerking from '../assests/burgerking.png';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsAuthenticated  }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const token = data.access_token;
      const userId = data.user_id;  // Extract userId from response
      // Store the token in localStorage or sessionStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', userId);
      // Redirect to the homepage
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  return (
    <div className="login-page" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <div
        style={{
          width: '100%',
          height: '80vh',
          backgroundImage: `url(${signupbackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          className="form-container"
          style={{
            width: '30%',
            position: 'absolute',
            top: '65%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button type="submit" className="btn btn-primary w-30">
                Login
              </button>
              <button type="button" className="btn btn-secondary w-30" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-5">
        <div className="about-section mt-5">
          <h3 className="text-center">Top Rated</h3>
          <div className="d-flex justify-content-center mt-3">
            <img src={burgerking} alt="Burger King" className="rounded m-2" />
            <img src={kfc} alt="KFC" className="rounded m-2" />
            <img src={Mcd} alt="Mc Donalds" className="rounded m-2" />
          </div>
        </div>
      </div>

      <footer className="footer mt-5 text-center text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px 0' }}>
        <p>&copy; 2024 Food Delivery Inc. | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default LoginPage;
