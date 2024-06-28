import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // import useNavigate
import logo from "../components/Assets/logo.png";
import cart_icon from "../components/Assets/cart_icon.png";
import './Navbar.css';

const Navbar = () => {
    const [menu,setMenu] = useState("shop");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // get the navigate function

    const handleSearchClick = () => {
        navigate(`/search/${searchTerm}`); // navigate to the search results page
    };

    return (
        <div className='navbar'>
            <input type="text" placeholder="Search item..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={handleSearchClick}>Search</button>           
            <div className='nav-logo'>
                <img src={logo} alt="logo" />
                <p>TRANDYCART</p>
            </div>
            <ul className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link style={{ textDecoration:'none'}} to='/'>Home</Link>{menu =="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("mens")}}><Link style={{ textDecoration:'none'}} to='/mens'>Men</Link>{menu =="mens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("womens")}}><Link style={{ textDecoration:'none'}} to='/womens'>Women</Link>{menu =="womens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{ textDecoration:'none'}} to='/kids'>Kids</Link>{menu =="kids"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                <Link to='/login'><button>Login</button></Link>
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">0</div>
            </div>
        </div>
    );
}

export default Navbar;
