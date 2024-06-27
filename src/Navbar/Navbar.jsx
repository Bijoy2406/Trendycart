import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../components/Assets/logo.png";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';

const Navbar = () => {

    const [menu,setMenu] = useState("shop");
    const {getTotalCartItem} =useContext(ShopContext);
    return (
        <div className='navbar'>           
            <div className='nav-logo'>
                <img src={logo} alt="logo" />
                <p>TRANDYCART</p>
            </div>
            <ul className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link style={{ textDecoration:'none'}} to='/'>Shop</Link>{menu =="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("mens")}}><Link style={{ textDecoration:'none'}} to='/mens'>Men</Link>{menu =="mens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("womens")}}><Link style={{ textDecoration:'none'}} to='/womens'>Women</Link>{menu =="womens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{ textDecoration:'none'}} to='/kids'>Kids</Link>{menu =="kids"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                <Link to='/login'><button>Login</button></Link>
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    );
}

export default Navbar;
