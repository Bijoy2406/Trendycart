import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Productdisplay.css';
import { ShopContext } from '../Context/ShopContext';
import RelatedProduct from '../RelatedProduct/RelatedProduct';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Productdisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const { all_product } = useContext(ShopContext);
    const [userRating, setUserRating] = useState(0);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1); // State for quantity selection
    const quantitySelectRef = useRef(null); // Ref for the select element    
    const [selectSize, setSelectSize] = useState(1); // State to manage select size
    const location = useLocation(); // Access location to get buyNowProduct
    const [selectedSize, setSelectedSize] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {


        // Initialize ratings script
        const script = document.createElement('script');
        script.src = `${process.env.PUBLIC_URL}/script.js`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.initializeRatings) {
                window.initializeRatings(product.id);
            }
        };

        const cartClick = (event) => {
            event.preventDefault();
            let button = event.currentTarget;
            button.classList.add('clicked');

            // Reset system: Remove 'clicked' class after 2 seconds
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 3000);
        };
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', cartClick);

            return () => {
                document.body.removeChild(script);
                cartButton.removeEventListener('click', cartClick);
            };
        }
    }, [product._id]);


    useEffect(() => {
        setSelectedSize(null);
    }, [product]);





    const handleRateProduct = async (rating) => {
        try {
            const response = await fetch('/rateproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ productId: product._id, rating })
            });
            const data = await response.json();
            if (data.success) {
                setUserRating(rating);
            } else {
                console.error('Failed to rate product:', data.message);
            }
        } catch (error) {
            console.error('Error rating product:', error);
        }
    };

    const handleQuantityChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10);
        setQuantity(selectedValue); // Update the selected quantity
        setSelectSize(1); // Collapse the dropdown after selection
    };

    const handleAddToCart = (productId, event) => {
        event.preventDefault();
        const token = localStorage.getItem('auth-token');

        if (!selectedSize && product.sizes.length > 0) {
            toast.error("Please select a size");
            return;
        }

        if (!token) {
            navigate('/login');
        } else {
            addToCart(productId, quantity, selectedSize); // Call addToCart only once
        }
    };

    const handleBuyNow = (productId, event) => {
        event.preventDefault();
        const token = localStorage.getItem('auth-token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (!selectedSize && product.sizes.length > 0) {
            toast.error("Please select a size");
            return;
        }

        navigate('/payment', {
            state: {
                buyNowProduct: {
                    productId: product._id,
                    quantity,
                    name: product.name,
                    price: product.new_price,
                    image: product.image,
                    selectedSize: selectedSize
                }
            }
        });
    };


    const isLoggedIn = !!localStorage.getItem('auth-token');

    const handleFocus = () => {
        setSelectSize(5); // Expand the dropdown to show 5 options
    };

    const handleBlur = () => {
        setSelectSize(1); // Collapse the dropdown back to 1 option
    };
    const handleSizeSelect = (size) => {
        if (product.sizes.includes(size)) {
            const currentScrollPosition = window.pageYOffset;
            setSelectedSize((prevSize) => {
                setTimeout(() => {
                    window.scrollTo(0, currentScrollPosition);
                }, 0);
                return prevSize === size ? null : size;
            });
        }
    };

    return (
        <div className="productdisplay" data-product-id={product.id}>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>

                {/* Rating system integration */}
                <div className="rating-container">
                    <div className="info">
                        <div className="emoji"></div>
                        <div className="status"></div>
                    </div>
                    <div className="rating_stars">
                        {[5, 4, 3, 2, 1].map(starRating => (
                            <div
                                key={starRating}
                                className={`star ${userRating === starRating ? 'selected' : ''}`}
                                onClick={() => handleRateProduct(starRating)}
                                data-rate={starRating}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="productdisplay-right-quantity">
                    <div className="quantity-selector">
                        <span className="quantity-label">Quantity:</span>
                        <div className="quantity-controls">
                            <select
                                id={`quantity-${product.id}`}
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="quantity-input"
                                size={selectSize} // Control the size dynamically
                                onFocus={handleFocus} // Expand on focus
                                onBlur={handleBlur} // Collapse on blur
                                ref={quantitySelectRef} // Reference to select element
                            >
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>
                </div>

                {/* Conditional Button/Message Display */}
                {isLoggedIn ? (
                    <div className="btnwallet">
                        <button className="cart-button" onClick={(event) => handleAddToCart(product.id, event)}>
                            <span className="add-to-cart">Add to cart</span>
                            <span className="added">Added</span>
                            <i className="fas fa-shopping-cart"></i>
                            <i className="fas fa-box"></i>
                        </button>
                        <button className="button" onClick={(event) => handleBuyNow(product.id, event)}>
                            <span className="button__text">
                                <span>Buy</span>
                            </span>
                            <svg className="button__svg" role="presentational" viewBox="0 0 600 600">
                                <defs>
                                    <clipPath id="myClip">
                                        <rect x="0" y="0" width="100%" height="50%" />
                                    </clipPath>
                                </defs>
                                <g clipPath="url(#myClip)">
                                    <g id="money">
                                        <path d="M441.9,116.54h-162c-4.66,0-8.49,4.34-8.62,9.83l.85,278.17,178.37,2V126.37C450.38,120.89,446.56,116.52,441.9,116.54Z" fill="#699e64" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                        <path d="M424.73,165.49c-10-2.53-17.38-12-17.68-24H316.44c-.09,11.58-7,21.53-16.62,23.94-3.24.92-5.54,4.29-5.62,8.21V376.54H430.1V173.71C430.15,169.83,427.93,166.43,424.73,165.49Z" fill="#699e64" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                    </g>
                                    <g id="creditcard">
                                        <path d="M372.12,181.59H210.9c-4.64,0-8.45,4.34-8.58,9.83l.85,278.17,177.49,2V191.42C380.55,185.94,376.75,181.57,372.12,181.59Z" fill="#a76fe2" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                        <path d="M347.55,261.85H332.22c-3.73,0-6.76-3.58-6.76-8v-35.2c0-4.42,3-8,6.76-8h15.33c3.73,0,6.76,3.58,6.76,8v35.2C354.31,258.27,351.28,261.85,347.55,261.85Z" fill="#ffdc67" />
                                        <path d="M249.73,183.76h28.85v274.8H249.73Z" fill="#323c44" />
                                    </g>
                                </g>
                                <g id="wallet">
                                    <path d="M478,288.23h-337A28.93,28.93,0,0,0,112,317.14V546.2a29,29,0,0,0,28.94,28.95H478a29,29,0,0,0,28.95-28.94h0v-229A29,29,0,0,0,478,288.23Z" fill="#a4bdc1" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                    <path d="M512.83,382.71H416.71a28.93,28.93,0,0,0-28.95,28.94h0V467.8a29,29,0,0,0,28.95,28.95h96.12a19.31,19.31,0,0,0,19.3-19.3V402a19.3,19.3,0,0,0-19.3-19.3Z" fill="#a4bdc1" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                    <path d="M451.46,435.79v7.88a14.48,14.48,0,1,1-29,0v-7.9a14.48,14.48,0,0,1,29,0Z" fill="#a4bdc1" stroke="#323c44" strokeMiterlimit="10" strokeWidth="14" />
                                    <path d="M147.87,541.93V320.84c-.05-13.2,8.25-21.51,21.62-24.27a42.71,42.71,0,0,1,7.14-1.32l-29.36-.63a67.77,67.77,0,0,0-9.13.45c-13.37,2.75-20.32,12.57-20.27,25.77l.38,221.24c-1.57,15.44,8.15,27.08,25.34,26.1l33-.19c-15.9,0-28.78-10.58-28.76-25.93Z" fill="#7b8f91" />
                                    <path d="M148.16,343.22a6,6,0,0,0-6,6v92a6,6,0,0,0,12,0v-92A6,6,0,0,0,148.16,343.22Z" fill="#323c44" />
                                </g>
                            </svg>

                        </button>
                    </div>
                ) : (
                    <p className='login-prompt'>
                        Please <Link to='/login' style={{ color: 'red' }}>login</Link> to add this item to your cart or to buy it.
                    </p>

                )}

                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ৳{product.old_price}
                    </div>
                    <div className="productdisplay-right-price-new">
                        ৳{product.new_price}
                    </div>
                </div>
                <div className='stock'>
                    <h1>In Stock</h1>
                </div>

                <div className="productdisplay-right-description">
                    <p>Description</p>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size-options" ref={scrollRef}>
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <div
                                key={size}
                                className={`size-option ${selectedSize === size ? 'selected' : ''} ${product.sizes.includes(size) ? 'available' : 'disabled'}`}
                                onClick={() => handleSizeSelect(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            {all_product && (
                <RelatedProduct all_product={all_product} category={product.category} currentProductId={product.id} />
            )}
        </div>
    );
}

export default Productdisplay;
