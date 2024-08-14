import React, { useState, useEffect, useRef, useContext } from 'react';
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle menu toggle

    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleMenuClick = (menuName) => {
        setMenu(menuName);
    };

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            setIsLoggedIn(true);
            fetch('https://backend-beryl-nu-15.vercel.app/getUserRole', {
                headers: {
                    'auth-token': token,
                },
            })
            .then(response => response.json())
            .then(data => setIsAdmin(data.isAdmin))
            .catch(error => console.error('Error fetching user role:', error));
        }
    }, []);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            navigate(`/search/${searchTerm}`);
        }
    }, [searchTerm, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setSearchTerm(""); // Clear search input
                setDropdownOpen(false); // Close dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAdminClick = () => {
        navigate('/Admin');
        setDropdownOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
    };

    return (
        <div className='navbar'>
            {isLoading && <Loader />}

            <Link to="/" className='nav-logo' onClick={() => setMenu("shop")}>
                <img src={logo} alt="logo" />
            </Link>
            <button className="nav-toggle" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <div className="wrap-input-17" ref={searchRef}>
                <div className="search-box">
                    <button className="btn-search">🔍</button>
                    <input
                        type="text"
                        className="input-search"
                        placeholder="Type to Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
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
                {isLoggedIn ? (
                    <>
                        <div className="profile-dropdown" ref={dropdownRef}>
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
                                    <Link to="/order" onClick={() => setDropdownOpen(false)}>
                                        <button>My order</button>
                                    </Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                        {isAdmin && (
                            <button className="btn-101" onClick={handleAdminClick}>
                                Admin panel
                                <svg>
                                    <defs>
                                        <filter id="glow">
                                            <fegaussianblur result="coloredBlur" stddeviation="5"></fegaussianblur>
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
                        )}
                        <Link to='/cart' onClick={() => setDropdownOpen(false)}>
                            <img className='cart-img' src={cart_icon} alt="Cart" />
                        </Link>

                        <div className="nav-cart-count">{getTotalCartItem()}</div>
                    </>
                ) : (
                    <Link to='/login'>
                        <button className='login'>Login</button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;
