import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from "../components/Assets/svg-viewer.svg";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';
import { ShopContext } from '../components/Context/ShopContext';
import navProfile from '../components/Assets/pic/nav-profile.png';
import Loader from '../Loader'; // Assuming you have a Loader component


const Navbar = () => {
    const initialMenu = localStorage.getItem('selectedMenu') || "shop";
    const [menu, setMenu] = useState(initialMenu);
    const { getTotalCartItem, setAll_Product } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate();
    const params = useParams();

    const fetchProducts = async (category) => {
        setLoading(true); // Start loading indicator
        try {
            let url = 'https://backend-beryl-nu-15.vercel.app/allproducts';
            if (category && category !== 'shop') {
                url += `/${category}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setAll_Product(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); 
        }
    };
    
    useEffect(() => {
        fetchProducts(menu);
    }, [menu]);

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

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        localStorage.setItem('selectedMenu', menuItem);
        navigate(menuItem === 'shop' ? '/' : `/${menuItem}`);
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
            
            <Link to="/" className='nav-logo' onClick={() => handleMenuClick("shop")}>
                <img src={logo} alt="logo" />          
            </Link>

            <input type="text" placeholder="Search item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button className='search' onClick={handleSearchClick}>Search</button>

            <div className="nav-menu">
                <li onClick={() => handleMenuClick("shop")}>
                    <Link style={{ textDecoration: 'none' }} to='/'>Home</Link>
                    {menu === "shop" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("mens")}>
                    <Link style={{ textDecoration: 'none' }} to='/mens'>Men</Link>
                    {menu === "mens" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("womens")}>
                    <Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link>
                    {menu === "womens" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("kids")}>
                    <Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>
                    {menu === "kids" ? <hr /> : <></>}
                </li>
            </div>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token') ? (
                    <div className="profile-dropdown">
                        <img src={navProfile} alt="Profile" className="profile-icon" onClick={toggleDropdown} />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" onClick={() => setDropdownOpen(false)}><button>Profile</button></Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/login'><button className='login'>Login</button></Link>
                )}

                <button className='new-button' onClick={handleAdminClick}>Admin panel</button>
                
                <Link to='/cart' onClick={() => setDropdownOpen(false)}>
                    <img className='cart-img' src={cart_icon} alt="" />
                </Link>
                
                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    );
}

export default Navbar;
