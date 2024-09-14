import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';
import navProfile from '../components/Assets/pic/nav-profile.png';
import Loader from '../Loader';
import axios from 'axios';
const Navbar = () => {
    const [menu, setMenu] = useState('shop');
    const { getTotalCartItem } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // To get the current location
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleMenuClick = (menuName) => {
        setMenu(menuName);
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh-token');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await fetch('http://localhost:4001/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            const data = await response.json();

            if (data.accessToken) {
                localStorage.setItem('auth-token', data.accessToken); // Update access token
                return data.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);

            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            setIsLoggedIn(false);
            navigate('/'); // Navigate to the home page programmatically
        }
    };

    const verifyTokenAndFetchUserRole = async () => {
        try {
            let token = localStorage.getItem('auth-token');
            if (!token) {
                token = await refreshAccessToken();
            }
            if (token) {
                const response = await fetch('http://localhost:4001/getUserRole', {
                    headers: { 'auth-token': token },
                });
                if (response.status === 401) { // Unauthorized, token might be invalid
                    token = await refreshAccessToken(); // Attempt to refresh the token
                    if (token) {
                        const retryResponse = await fetch('http://localhost:4001/getUserRole', {
                            headers: { 'auth-token': token },
                        });
                        if (retryResponse.ok) {
                            const data = await retryResponse.json();
                            setIsAdmin(data.isAdmin);
                        } else {
                            throw new Error('Failed to authenticate');
                        }
                    }
                } else if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
                }
            } else {
                throw new Error('No valid token found');
            }
        } catch (error) {
            console.error('Error verifying token or fetching user role:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        setIsLoggedIn(false);
        navigate('/'); // Navigate to the home page programmatically
    };

    useEffect(() => {
        // Check if the user is logged in when the component mounts
        const token = localStorage.getItem('auth-token');
        setIsLoggedIn(!!token); // Set isLoggedIn based on the presence of the token

        verifyTokenAndFetchUserRole();
    }, []); // Empty dependency array to avoid re-rendering in a loop

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
                setSearchTerm("");
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty dependency array to avoid unnecessary re-renders

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let token = localStorage.getItem('auth-token');
                if (!token) {
                    setError('No auth token found');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:4001/profile', {
                    headers: {
                        'auth-token': token,
                    },
                });

                setProfilePictureURL(response.data.profilePicture || null); // Update profile picture URL
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Reload the page once after navigating to '/'
    useEffect(() => {
        const checkAndReload = () => {
            if (location.pathname === '/' && !sessionStorage.getItem('reloaded')) {
                sessionStorage.setItem('reloaded', 'true');
                window.location.reload();
            }
        };

        checkAndReload();
    }, [location.pathname]);

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

            <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
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
                                src={profilePictureURL || navProfile}
                                alt='Profile'
                                className='profile-icon'
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
                                            <feGaussianBlur result="coloredBlur" stdDeviation="5"></feGaussianBlur>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"></feMergeNode>
                                                <feMergeNode in="coloredBlur"></feMergeNode>
                                                <feMergeNode in="coloredBlur"></feMergeNode>
                                                <feMergeNode in="SourceGraphic"></feMergeNode>
                                            </feMerge>
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
};

export default Navbar;
  