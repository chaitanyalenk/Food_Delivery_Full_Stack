import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Loginpage';
import SignupPage from './pages/Signuppage';
import HomePage from './pages/Homepages';
import RestaurantPage from './pages/Restaurantpage';
import CheckoutPage from './pages/Checkoutpage';
import PaymentPage from './pages/PaymentPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import Orders from './pages/Orders'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Checking authentication status on page load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

 

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user'); // Remove user data on logout
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
        {/* Redirecting to login if not authenticated */}
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />  // Pass setIsAuthenticated to LoginPage

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/restaurant" element={isAuthenticated ? <RestaurantPage /> : <Navigate to="/login" />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
        <Route path="/checkout" element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} />
        <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
