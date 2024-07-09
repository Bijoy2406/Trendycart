import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';
import Admin from '../pages/Admin/Admin';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItem } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleAdminClick = () => {
        navigate('/Admin'); // This will navigate to the Admin page
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search/${searchTerm}`);
        }
    };

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
    };

    return (
        <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt="logo" />          
        </div>

        <input type="text" placeholder="Search item..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className='search' onClick={handleSearchClick}>Search</button>
            <ul className="nav-menu">
                <li onClick={() => handleMenuClick("shop")}><Link style={{ textDecoration: 'none' }} to='/'>Home</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("mens")}><Link style={{ textDecoration: 'none' }} to='/mens'>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("womens")}><Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("kids")}><Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>

            </ul>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
                :<Link to='/login'><button className='login'>Login</button></Link>} 
                <button className='new-button' onClick={handleAdminClick}>Admin panel</button> {/* Add this line for your new button */}        
            <Link to='/cart'><img className='cart-img' src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    );
}

export default Navbar;
