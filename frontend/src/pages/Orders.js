import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios for making HTTP requests

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the JWT token from localStorage or context
    const token = localStorage.getItem('token');  // Adjust as needed for your app
    const userId = localStorage.getItem('user_id');

    // Fetch user orders from the API
    axios
      .get(`https://fooddeliveryapp-38or.onrender.com/orders/user/${userId}`, { // Replace USER_ID with actual user ID
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching orders');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div className="list-group-item" key={order._id}>
              <h5>Order ID: {order._id}</h5>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Price:</strong> ${order.total_price}</p>
              <p><strong>Order Date:</strong> {order.order_date}</p>
              <h6>Items:</h6>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.item_id} (x{item.quantity}) - ${item.price} each
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
