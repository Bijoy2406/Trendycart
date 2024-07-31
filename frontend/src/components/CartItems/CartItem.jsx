import React, { useContext } from 'react';
import './CartItem.css';
import { ShopContext } from '../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItem = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

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
                            <p>{getTotalCartAmount()}</p>
                        </div>

                        <div className="cartitem-total-item">
                            <p>Shipping Fee</p>
                            <p id='free'>Free</p>
                            <hr />

                        </div>
                        <hr />
                        <div className="cartitem-total-item">
                            <h3>Total</h3>
                            <h3>{getTotalCartAmount()}</h3>
                        </div>
                        <button>Proceed to checkout</button>

                    </div>

                </div>
                <div className="vertical-line"></div>
                <div className="cartitem-promocode">
                    <p>If you have a promo code ,Enter it here</p>
                    <div className="cartitem-promo-box">
                        <input type="text" placeholder='Promo Code' />
                        <button>Submit</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartItem;


