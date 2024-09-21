import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link
import './order.css';
import '../../Navbar/Navbar.css';
import Loader from '../../Loader'; // Import your Loader component
import { toast, ToastContainer } from 'react-toastify';

const Order = ({ order, orderIndex }) => { // Receive orderIndex as a prop
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // To access the order ID if passed

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh-token');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await fetch('https://backend-beryl-nu-15.vercel.app/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('auth-token', data.accessToken);
                return data.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            window.location.replace('/');
        }
    };

    const fetchWithToken = async (url, options = {}) => {
        let token = localStorage.getItem('auth-token');
        if (!token) {
            token = await refreshAccessToken();
        }

        if (!token) {
            throw new Error('No valid token available');
        }

        const fetchOptions = { ...options };
        fetchOptions.headers = {
            ...fetchOptions.headers,
            'auth-token': token,
        };

        let response = await fetch(url, fetchOptions);

        if (response.status === 401) {
            token = await refreshAccessToken();
            if (token) {
                fetchOptions.headers['auth-token'] = token;
                response = await fetch(url, fetchOptions);
            }
        }

        return response;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/getorders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleProductClick = (productId) => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            navigate(`/product/${productId}`);
        }, 1000);
    };

    if (orders.length === 0) {
        return <div className='order-status'><p>You have no past orders.</p></div>;
    }

    return (
        <div className="order-container">
            <h2>Your Orders</h2>
            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="order-card">
                    <div className="order-details">
                        {order.products.map((product, productIndex) => (
                            <div key={productIndex} onClick={() => handleProductClick(product.productId.id)}>
                                <div className="product-info">
                                    <img src={product.productId.image} alt={product.productId.name} 
                                        className="order-product-image" />
                                    <p>Product Name: {product.productId.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: ৳{product.productId.new_price}</p>
                                    <p>Size: {product.selectedSize}</p> {/* Add this line */}
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
                                <feGaussianBlur result="coloredBlur" stdDeviation="5"></feGaussianBlur>
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
