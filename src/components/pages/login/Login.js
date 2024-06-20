import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import 'boxicons';
import '../../../App.css'; 
import DatePicker from 'react-datepicker'; // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Import default styles for DatePicker

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ fullName: '', phoneNumber: '', password: '', dob: new Date() });
    const datePickerRef = useRef(null); // Ref for DatePicker component

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowLogin(false);
    };

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value });
    };

    const handleRegisterInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm({ ...registerForm, [name]: value });
    };

    const handleDateChange = (date) => {
        setRegisterForm({ ...registerForm, dob: date });
    };

    const handleCalendarIconClick = () => {
        datePickerRef.current.setFocus();
    };

    return (
        <div className="form-container">
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

                {showLogin ? (
                    <div className="login-form">
                        <div className="form-title">
                            <span>Sign In</span>
                        </div>
                        <div className="form-inputs">
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Username"
                                    name="username"
                                    value={loginForm.username}
                                    onChange={handleLoginInputChange}
                                    required />
                                <i className="bx bx-user icon"></i>
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginInputChange}
                                    required />
                                <i className="bx bx-lock-alt icon"></i>
                            </div>
                            <div className="forgot-pass">
                                <a href="#">Forgot Password?</a>
                            </div>
                            <div className="input-box">
                                <button className="input-submit">
                                    <span>Sign In</span>
                                    <i className="bx bx-right-arrow-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div className="social-login">
                            <i className="bx bxl-google"></i>
                            <i className="bx bxl-facebook"></i>
                            <i className="bx bxl-github"></i>
                            <i className="bx bxl-twitter"></i>
                        </div>
                    </div>
                ) : (
                    <div className="register-form">
                        <div className="form-title">
                            <span>Create Account</span>
                        </div>
                        <div className="form-inputs">
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Full Name"
                                    name="fullName"
                                    value={registerForm.fullName}
                                    onChange={handleRegisterInputChange}
                                    required />
                                <i className="bx bx-user icon"></i>
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Phone Number"
                                    name="phoneNumber"
                                    value={registerForm.phoneNumber}
                                    onChange={handleRegisterInputChange}
                                    required />
                                <i className="bx bx-mobile icon"></i>
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Password"
                                    name="password"
                                    value={registerForm.password}
                                    onChange={handleRegisterInputChange}
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
                            <div className="input-box">
                                <button className="input-submit">
                                    <span>Sign Up</span>
                                    <i className="bx bx-right-arrow-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div className="social-login">
                            <i className="bx bxl-google"></i>
                            <i className="bx bxl-facebook"></i>
                            <i className="bx bxl-github"></i>
                            <i className="bx bxl-twitter"></i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
