import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const location = useLocation();
  const platformCharges = 5.0; // Example static platform charges
  const deliveryCharges = 2.0; // Example static delivery charges
  const navigate = useNavigate();
  const { cart, total } = location.state || {}; // Access the cart and total from state
  console.log(cart, total);
  const userId = localStorage.getItem('user_id'); // Assuming user ID is stored in localStorage
  const restaurantId = "abccccc"; // Assuming restaurant ID is stored in localStorage

  // Calculate the total price
  const calculateTotal = () => {
    return (parseFloat(total) + platformCharges + deliveryCharges).toFixed(2); // Ensure total is a float
  };

  // Handle address change
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // Handle payment option change
  const handlePaymentChange = (e) => {
    setPaymentOption(e.target.value);
  };

  // Handle the confirmation of the payment
  const handleConfirmPayment = async () => {
    // Prepare order details
    const order = {
      user_id: userId,
      restaurant_id: restaurantId,
      items: cart.map(item => ({
        item_id: item.name, // Assuming name is the unique identifier for item
        quantity: item.quantity,
        price: parseFloat(item.price), // Ensure price is a float
        subtotal: (parseFloat(item.price) * item.quantity).toFixed(2), // Ensure subtotal is a float
      })),
      total_price: parseFloat(calculateTotal()), // Ensure total is a float
      status: 'Completed',
      order_date: new Date().toISOString(),
      delivery_address: address,
      payment_method: paymentOption
    };

    try {
      // Send POST request to store order details in the database
      await axios.post('https://fooddeliveryapp-38or.onrender.com/orders', order, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });

      // Show payment success with a loading icon
      Swal.fire({
        title: 'Processing Payment...',
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Simulate payment success with a delay of 3 seconds
      setTimeout(() => {
        Swal.fire({
          title: 'Payment Successful!',
          icon: 'success',
          timer: 2000, // 2 seconds for success message
          showConfirmButton: false,
        }).then(() => {
          Swal.fire({
            title: 'Order Placed!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000, // 2 seconds for order placed message
          }).then(() => {
            navigate('/'); // Navigate to home page after success
          });
        });
      }, 3000); // Simulate 3 seconds of loading time

    } catch (error) {
      console.error("Error while placing the order:", error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue placing your order. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle the go back button
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>

      <div className="mb-4">
        <h3>Review Your Order</h3>
        <ul className="list-group">
          {cart.map((item) => (
            <li key={item.name} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <span>{item.name}</span>
                <span className="ml-2 text-muted">
                  (x{item.quantity}) - ${(parseFloat(item.price) * item.quantity).toFixed(2)} {/* Subtotal per item */}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 d-flex justify-content-between">
          <strong>Subtotal:</strong>
          <span>${(parseFloat(cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0))).toFixed(2)}</span> {/* Subtotal of all items */}
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <strong>Platform Charges:</strong>
          <span>${platformCharges}</span>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <strong>Delivery Charges:</strong>
          <span>${deliveryCharges}</span>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <strong>Total:</strong>
          <span>${calculateTotal()}</span> {/* Final total with charges */}
        </div>
      </div>

      <div className="mb-4">
        <h3>Delivery Address</h3>
        <textarea
          className="form-control"
          rows="3"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter your delivery address"
        />
      </div>

      <div className="mb-4">
        <h3>Payment Options</h3>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="paymentOption1"
            name="paymentOption"
            value="creditCard"
            checked={paymentOption === 'creditCard'}
            onChange={handlePaymentChange}
          />
          <label className="form-check-label" htmlFor="paymentOption1">
            Credit Card
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="paymentOption2"
            name="paymentOption"
            value="paypal"
            checked={paymentOption === 'paypal'}
            onChange={handlePaymentChange}
          />
          <label className="form-check-label" htmlFor="paymentOption2">
            PayPal
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="paymentOption3"
            name="paymentOption"
            value="cod"
            checked={paymentOption === 'cod'}
            onChange={handlePaymentChange}
          />
          <label className="form-check-label" htmlFor="paymentOption3">
            Cash on Delivery
          </label>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={handleGoBack}>
          Go Back
        </button>
        <button className="btn btn-primary" onClick={handleConfirmPayment}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
