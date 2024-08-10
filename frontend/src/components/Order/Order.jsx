import { useState, useEffect } from 'react';
import './Order.css'; // Optional: Add your styling file if you have one

const OrderPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch('https://backend-beryl-nu-15.vercel.app/getorder', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrderDetails(data.orders || []);
        } else {
          setError(data.message || 'Failed to fetch order details');
          setOrderDetails([]);
        }
      } catch (error) {
        setError('Error fetching order details');
        setOrderDetails([]);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchOrderDetails();
  }, []);

  return (
    <div className="order-page">
      <h1>Order Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orderDetails.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orderDetails.map(order => (
            <li key={order._id} className="order-item">
              <h2>Order ID: {order._id}</h2>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Total: ${order.total}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId} className="order-item-details">
                    <p>Product ID: {item.productId}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderPage;
