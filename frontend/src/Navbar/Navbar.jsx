import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';
import navProfile from '../components/Assets/pic/nav-profile.png';
import Loader from '../Loader';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItem } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = (menuName) => {
        setMenu(menuName);
    };

    const handleAdminClick = () => {
        navigate('/Admin');
        setDropdownOpen(false);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search/${searchTerm}`);
        }
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace('/');
    };

    return (
        <div className='navbar'>
            {isLoading && <Loader />}

            <Link to="/" className='nav-logo' onClick={() => setMenu("shop")}>
                <img src={logo} alt="logo" />
            </Link>

            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Search item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='search' onClick={handleSearchClick}>Search</button>
            </div>

            <ul className="nav-menu">
                <li onClick={() => handleMenuClick("shop")}>
                    <Link to='/'>Home</Link>
                    {menu === "shop" && <hr />}
                </li>
                <li onClick={() => handleMenuClick("mens")}>
                    <Link to='/mens'>Men</Link>
                    {menu === "mens" && <hr />}
                </li>
                <li onClick={() => handleMenuClick("womens")}>
               
                    <Link to='/womens'>Women</Link>
                    {menu === "womens" && <hr />}
                </li>
                <li onClick={() => handleMenuClick("kids")}>
                    <Link to='/kids'>Kids</Link>
                    {menu === "kids" && <hr />}
                </li>
            </ul>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token') ? (
                    <div className="profile-dropdown">
                        <img
                            src={navProfile}
                            alt="Profile"
                            className="profile-icon"
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                                    <button>Profile</button>
                                </Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/login'>
                        <button className='login'>Login</button>
                    </Link>
                )}

                <button className='new-button' onClick={handleAdminClick}>Admin panel</button>

                <Link to='/cart' onClick={() => setDropdownOpen(false)}>
                    <img className='cart-img' src={cart_icon} alt="Cart" />
                </Link>

                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    );
}

export default Navbar;
