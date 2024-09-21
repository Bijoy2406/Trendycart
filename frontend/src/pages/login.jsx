import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CSS/login.css';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../loader_login'; // Import the Loader component
import { fetchWithToken } from '../Utils/authUtils';
import PasswordChecklist from "react-password-checklist";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', dob: new Date() });
    const [loading, setLoading] = useState(false); // Loading state
    const datePickerRef = useRef(null);
    const [isPasswordValid, setIsPasswordValid] = useState(false); // Password validity state
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        if (showLogin) {
            setLoginForm({ ...loginForm, [name]: value });
        } else {
            setRegisterForm({ ...registerForm, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const signin = async () => {
        console.log("sign in executed");
        setLoading(true); // Show loader 
        try {
            const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm)
            });

            if (!response.ok) {  // Check if response status is not OK (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const user = data.user;
                if (user && user.isAdmin && !user.isApprovedAdmin) {
                    toast.error('You are not approved as an admin yet.');
                } else {
                    localStorage.setItem('auth-token', data.token);
                    localStorage.setItem('refresh-token', data.refreshtoken); // Store refresh token
                    window.location.replace("/");
                }
            } else {
                toast.error(data.errors || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error("Failed to fetch during signin:", error);
            toast.error('An error occurred during login. Please try again.');
        } finally {
            setLoading(false); // Hide loader
        }
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
                body: JSON.stringify({ token: refreshToken })
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
            window.location.replace("/login");
        }
    };


    const signup = async () => {
        if (!isPasswordValid) {
            toast.error("Password does not meet the criteria.");
            return; // Exit the function if password criteria are not met
        }
        setLoading(true); // Show loader
        try {
            const response = await fetchWithToken('https://backend-beryl-nu-15.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerForm.username,
                    email: registerForm.email,
                    password: registerForm.password,
                    dob: registerForm.dob,  // Include DOB
                    location: registerForm.location,  // Include Location
                    isAdmin: registerForm.isAdmin || false
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Signup successful! Please check your email for a verification link.'); // Verification message
                setShowLogin(true); // Redirect to sign-in state
            } else {
                toast.error(data.errors);
            }
        } catch (error) {
            console.error("Failed to fetch during signup:", error);
        } finally {
            setLoading(false); // Hide loader
        }
    };



    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowLogin(false);
    };

    const handleDateChange = (date) => {
        setRegisterForm({ ...registerForm, dob: date });
    };

    const handleCalendarIconClick = () => {
        datePickerRef.current.setFocus();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (showLogin) {
            signin();
        } else {
            signup();
        }
    };
    const handlePasswordChange = (password) => {
        console.log("Password:", password); // Debugging password change
        setRegisterForm({ ...registerForm, password });
    };

    const handlePasswordValidityChange = (isValid) => {
        console.log("Is password valid:", isValid); // Debugging password validity
        setIsPasswordValid(isValid);
    };
    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Navigate to the forgot password page
    };

    return (
        <div className="login-background">
            {loading && <Loader />} {/* Render the loader when loading is true */}
            <div className={`form-container ${loading ? 'blurred' : ''}`}> {/* Optionally blur the form when loading */}
                <div className="col col-1" style={{ borderRadius: showLogin ? '0 30% 20% 0' : '0 20% 30% 0' }}>
                    <div className="image-layer">
                        <img src="/assets/img/white-outline.png" className="form-image-main" alt="main" />
                        <img src="/assets/img/dots.png" className="form-image dots" alt="dots" />
                        <img src="/assets/img/coin.png" className="form-image coin" alt="coin" />
                        <img src="/assets/img/spring.png" className="form-image spring" alt="spring" />
                        <img src="/assets/img/rocket.png" className="form-image rocket" alt="rocket" />
                        <img src="/assets/img/cloud.png" className="form-image cloud" alt="cloud" />
                        <img src="/assets/img/stars.png" className="form-image stars" alt="star" />
                    </div>
                    <Link to='/' className='home-icon'>
                        <i className="bx bx-home"></i>
                    </Link>
                    <p className="featured-words">Welcome To <span>Trendycart</span></p>
                </div>
                <div className="col col-2">
                    <div className="btn-box">
                        <button
                            className="btn btn-1"
                            onClick={handleLoginClick}
                            style={{ backgroundColor: showLogin ? '#21264D' : 'rgba(255, 255, 255, 0.2)' }}>
                            Sign In
                        </button>
                        <button
                            className="btn btn-2"
                            onClick={handleRegisterClick}
                            style={{ backgroundColor: showLogin ? 'rgba(255, 255, 255, 0.2)' : '#21264D' }}>
                            Sign Up
                        </button>
                    </div>

                    <form className={showLogin ? "login-form" : "register-form"} onSubmit={handleFormSubmit}>
                        <div className="form-title">
                            <span>{showLogin ? "Sign In" : "Create Account"}</span>
                        </div>
                        {showLogin ? (
                            <>
                                <div className="form-inputs">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="email"
                                            value={loginForm.email}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Email</label>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={loginForm.password}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Password</label>
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <i className="bx bx-hide"></i> : <i className="bx bx-show"></i>}
                                        </button>
                                    </div>

                                    <div className="forgot-pass">
                                        <a onClick={handleForgotPassword}>
                                            Forgot Password?
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-inputs">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="username"
                                            value={registerForm.username}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Username</label>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerForm.email}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Email</label>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={registerForm.password}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Password</label>
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <i className="bx bx-hide"></i> : <i className="bx bx-show"></i>}
                                        </button>
                                    </div>


                                    <div className="input-box">
                                        <label htmlFor="dob" className="label">Date of Birth</label>
                                        <div className="dob-container">
                                            <DatePicker
                                                ref={datePickerRef}
                                                id="dob"
                                                className="input-select"
                                                selected={registerForm.dob}
                                                onChange={handleDateChange}
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="Select Date"
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                            <FaRegCalendarAlt className="calendar-icon" onClick={handleCalendarIconClick} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="location"
                                            value={registerForm.location}
                                            onChange={changeHandler}
                                            required
                                        />
                                        <label>Location</label>
                                    </div>
                                </div>
                                <PasswordChecklist
                                    rules={["minLength", "specialChar", "number", "capital", "lowercase"]}
                                    minLength={8}
                                    value={registerForm.password}
                                    onChange={handlePasswordValidityChange} // Update password validity and show error toast
                                />
                            </>
                        )}
                        <div className="input-box">
                            <button
                                type="submit"
                                className={`input-submit ${showLogin ? 'login-btn' : 'signup-btn'}`}
                            >
                                {showLogin ? "Login" : "Sign Up"}
                                <i className="bx bx-right-arrow-alt"></i>
                            </button>
                        </div>

                
                    </form>
                </div>
                {!showLogin && (
                    <div className="admin-box">
                    <label className="admin-checkbox">
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={registerForm.isAdmin}
                            onChange={changeHandler}
                        />
                        <span className="admin-text">
                        &nbsp;&nbsp;&nbsp;&nbsp;Sign up<br />as an admin
                        </span>
                    </label>
                </div>                
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
