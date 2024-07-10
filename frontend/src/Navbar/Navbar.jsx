import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';

const Navbar = () => {
    const initialMenu = localStorage.getItem('selectedMenu') || "shop";
    const [menu, setMenu] = useState(initialMenu);
    const { getTotalCartItem, setAll_Product } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchProducts = async (category) => {
        let url = 'http://localhost:4001/products';
        if (category && category !== 'shop') {
            url += `/${category}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setAll_Product(data);
    };

    useEffect(() => {
        fetchProducts(menu);
    }, [menu]);

    const handleAdminClick = () => {
        navigate('/Admin');
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search/${searchTerm}`);
        }
    };

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        localStorage.setItem('selectedMenu', menuItem);
        if (menuItem === 'shop') {
            navigate('/');
        } else {
            navigate(`/${menuItem}`);
        }
        window.location.reload();
    };

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="logo" />          
            </div>

            <input type="text" placeholder="Search item..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className='search' onClick={handleSearchClick}>Search</button>
            <ul className="nav-menu">
                <li onClick={() => handleMenuClick("shop")}><Link key="home" style={{ textDecoration: 'none' }} to='/'>Home</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("mens")}><Link key="mens" style={{ textDecoration: 'none' }} to='/mens'>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("womens")}><Link key="womens" style={{ textDecoration: 'none' }} to='/womens'>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
                <li onClick={() => handleMenuClick("kids")}><Link key="kids" style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
            </ul>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ? <button className='logout' onClick={() => {localStorage.removeItem('auth-token'); window.location.replace('/')}}>Logout</button>
                : <Link to='/login'><button className='login'>Login</button></Link>} 
                <button className='new-button' onClick={handleAdminClick}>Admin panel</button>        
                <Link to='/cart'><img className='cart-img' src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    );
}

export default Navbar;
