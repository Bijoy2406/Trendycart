import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';
import navProfile from '../components/Assets/pic/nav-profile.png';
import Loader from '../Loader';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItem } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleMenuClick = (menuName) => {
        setMenu(menuName);
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh-token');
            if (!refreshToken) throw new Error('No refresh token available');
  
            const response = await fetch('https://backend-beryl-nu-15.vercel.app/token', {
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
            toast.error('Session expired, please log in again.');
            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            
        }
    };

    const verifyTokenAndFetchUserRole = async () => {
        try {
            let token = localStorage.getItem('auth-token');
            if (!token) {
                token = await refreshAccessToken();
            }
            if (token) {
                const response = await fetch('https://backend-beryl-nu-15.vercel.app/getUserRole', {
                    headers: { 'auth-token': token },
                });
                if (response.status === 401) { // Unauthorized, token might be invalid
                    token = await refreshAccessToken(); // Attempt to refresh the token
                    if (token) {
                        const retryResponse = await fetch('https://backend-beryl-nu-15.vercel.app/getUserRole', {
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
            toast.error('Session expired, please log in again.');
            
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        window.location.replace('/'); // This will reload the page
    };

    useEffect(() => {
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
                {localStorage.getItem('auth-token') ? (
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
                ) : (
                    <Link to='/login'>
                        <button className='login'>Login</button>
                    </Link>
                )}
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
            </div>
        </div>
    );
};

export default Navbar;
