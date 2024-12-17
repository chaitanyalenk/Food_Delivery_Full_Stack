import React, { useState } from 'react';
import signupbackground from '../assests/signupbackground.png';
import kfc from '../assests/kfc.png';
import Mcd from '../assests/Mcd.png';
import burgerking from '../assests/burgerking.png';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error signing up');
      }

      // Redirect to login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };


  return (
    <div className="signup-page" style={{ minHeight: '100vh', overflowY: 'auto' }}>
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
            height: 'auto',
            position: 'absolute',
            top: '65%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h2 className="text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label fw-bold">
                Mobile Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button type="submit" className="btn btn-primary w-30">
                Sign Up
              </button>
              <button type="button" className="btn btn-secondary w-30" onClick={() => navigate('/login')}>
                Login
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

export default SignupPage;
