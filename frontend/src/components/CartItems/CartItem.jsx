import React, { useContext } from 'react';
import './CartItem.css';
import { ShopContext } from '../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItem = () => {
    const {getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

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
                                <img
                                    src={remove_icon}
                                    onClick={() => removeFromCart(e.id)}
                                    alt="Remove"
                                    className='cartitem-remove-icon'
                                />
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
                <div class="vertical-line"></div>
                <div className="cartitem-promocode">
                        <p>If you have a promo code ,Enter it here</p>
                        <div className="cartitem-promo-box">
                            <input type="text" placeholder='Promo Code'/>
                            <button>Submit</button>
                        </div>
                    </div>

            </div>
        </div>
    );
};

export default CartItem;


