import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CSS/login.css';
import { Link } from 'react-router-dom';
import Loader from '../loader_login'; // Import the Loader component

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', dob: new Date() });
    const [loading, setLoading] = useState(false); // Loading state
    const datePickerRef = useRef(null);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        if (showLogin) {
            setLoginForm({ ...loginForm, [name]: value });
        } else {
            setRegisterForm({ ...registerForm, [name]: value });
        }
    };

    const signin = async () => {
        console.log("sign in executed", loginForm);
        setLoading(true); // Show loader
        try {
            const response = await fetch('https://backend-beryl-nu-15.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm)
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth-token', data.token);
                window.location.replace("/");
            } else {
                alert(data.errors);
            }
        } catch (error) {
            console.error("Failed to fetch during signin:", error);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const signup = async () => {
        console.log("sign up executed", registerForm);
        setLoading(true); // Show loader
        try {
            const response = await fetch('https://backend-beryl-nu-15.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerForm.username,
                    email: registerForm.email,
                    password: registerForm.password,
                })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth-token', data.token);
                window.location.replace("/");
            } else {
                alert(data.errors);
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
                        <img src="/assets/img/stars.png" className="form-image stars" alt="stars" />
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
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Email"
                                            name="email"
                                            value={loginForm.email}
                                            onChange={changeHandler}
                                        />
                                        <i className="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="Password"
                                            name="password"
                                            value={loginForm.password}
                                            onChange={changeHandler}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                    </div>
                                    <div className="forgot-pass">
                                        <a href="#">Forgot Password?</a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Username"
                                            name="username"
                                            value={registerForm.username}
                                            onChange={changeHandler}
                                        />
                                        <i className="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Email"
                                            name="email"
                                            value={registerForm.email}
                                            onChange={changeHandler}
                                        />
                                        <i className="bx bx-mobile icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="Password"
                                            name="password"
                                            value={registerForm.password}
                                            onChange={changeHandler}
                                            required />
                                        <i className="bx bx-lock-alt icon"></i>
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
                                </div>
                            </>
                        )}
                        <div className="input-box">
                            <button className="input-submit" type="submit" disabled={loading}>
                                <span>Continue</span>
                                <i className="bx bx-right-arrow-alt"></i>
                            </button>
                        </div>
                        <div className="social-login">
                            <i className="bx bxl-google"></i>
                            <i className="bx bxl-facebook"></i>
                            <i className="bx bxl-github"></i>
                            <i className="bx bxl-twitter"></i>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
