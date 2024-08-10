import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItem.css';
import { ShopContext } from '../Context/ShopContext';

const CartItem = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    const handleApplyPromoCode = () => {
        const tenPercentCodes = ['SAVE10', 'DISCOUNT10', 'TENOFF'];
        const twentyPercentCodes = ['SAVE20', 'DISCOUNT20', 'TWENTYOFF'];

        if (tenPercentCodes.includes(promoCode.toUpperCase())) {
            setDiscount(0.1); // 10% discount
            setPopupMessage('Promo code applied successfully! You got 10% off.');
        } else if (twentyPercentCodes.includes(promoCode.toUpperCase())) {
            setDiscount(0.2); // 20% discount
            setPopupMessage('Promo code applied successfully! You got 20% off.');
        } else {
            setDiscount(0); // Invalid code
            setPopupMessage('Invalid promo code. Please try again.');
        }
        setShowPopup(true); // Show the popup
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const navigate = useNavigate();

    const handleProceedToCheckout = () => {
        navigate('/payment'); // Replace with your payment page route
    };

    const totalAmount = getTotalCartAmount();
    const discountedTotal = totalAmount - (totalAmount * discount);
    

    return (
        <div className='cartitems'>
            <div className="cartitem-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitem-format">
                                <img src={e.image} alt={e.name} className='carticon-product-con' />
                                <p>{e.name}</p>
                                <p>{e.new_price}</p>
                                <button className='quantity-button'>{cartItems[e.id]}</button>
                                <p>{cartItems[e.id] * e.new_price}</p>
                                <div className="wrap-delete">
                                    <button className="button-delete" onClick={() => removeFromCart(e.id)}>
                                        <span className="text">Delete</span>
                                        <span className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitem-down">
                <div className="cartitem-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className='cartitem-total-item'>
                            <p>Subtotal</p>
                            <p>{totalAmount.toFixed(2)}</p>
                        </div>
                        <div className='cartitem-total-item'>
                            <p>Discount</p>
                            <p>{(totalAmount * discount).toFixed(2)}</p>
                        </div>
                        <div className="cartitem-total-item">
                            <p>Shipping Fee</p>
                            <p id='free'>Free</p>
                            <hr />
                        </div>
                        <hr />
                        <div className="cartitem-total-item">
                            <h3>Total</h3>
                            <h3>{discountedTotal.toFixed(2)}</h3>
                        </div>
                        <button onClick={handleProceedToCheckout}>Proceed to checkout</button>
                    </div>
                </div>
                <div className="vertical-line"></div>
                <div className="cartitem-promocode">
                    <p>If you have a promo code, enter it here:</p>
                    <div className="cartitem-promo-box">
                        <input type="text" placeholder='Promo Code' value={promoCode} onChange={handlePromoCodeChange} />
                        <button onClick={handleApplyPromoCode}>Submit</button>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup-cart">
                    <div className="popup-content-cart">
                        <p>{popupMessage}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartItem;
