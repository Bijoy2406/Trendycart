import React, { useEffect, useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom'; // Import Link
import './order.css';
import '../../Navbar/Navbar.css';
import Loader from '../../Loader'; // Import your Loader component

const Order = ({ order, orderIndex }) => { // Receive orderIndex as a prop
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate(); // Initialize useNavigate
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://backend-beryl-nu-15.vercel.app/getorders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Result from /getorders:", result);

                if (result.success) {
                    setOrders(result.orders);
                } else {
                    console.error('Error fetching orders:', result.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleProductClick = (productId) => {
        setIsLoading(true); // Show loader when a product is clicked

        // Simulate a delay for demonstration purposes (remove in production)
        setTimeout(() => {
            setIsLoading(false); // Hide loader after data is fetched (replace with actual data fetching logic)
            navigate(`/product/${productId}`); // Navigate to the product details page
        }, 1000); 
    };

    if (orders.length === 0) {
        return <div>You have no past orders.</div>;
    }

    return (
        <div className="order-container">
            <h2>Your Orders</h2>
            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="order-card">
                    <div className="order-details">
                        {order.products.map((product, productIndex) => (
                            <div key={productIndex} onClick={() => handleProductClick(product.productId.id)}> 
                                {/* Use onClick to handle navigation and loader */}
                                <div className="product-info">
                                    <img src={product.productId.image} alt={product.productId.name} className="order-product-image" />
                                    <p>Product Name: {product.productId.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: {product.price}</p>
                                </div>
                            </div>
                        ))}
                        <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    </div>
                    <hr />
                </div>
            ))}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="btn-101">
                    Continue Shopping
                    <svg>
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur result="coloredBlur" stddeviation="5"></feGaussianBlur>
                                <femerge>
                                    <femergenode in="coloredBlur"></femergenode>
                                    <femergenode in="coloredBlur"></femergenode>
                                    <femergenode in="coloredBlur"></femergenode>
                                    <femergenode in="SourceGraphic"></femergenode>
                                </femerge>
                            </filter>
                        </defs>
                        <rect />
                    </svg>
                </button>
            </Link>
            {isLoading && <Loader />} {/* Show loader when isLoading is true */}
        </div>
    );
};

export default Order;
