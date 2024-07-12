import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CSS/login.css';
import { Link } from 'react-router-dom';

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        dob: new Date()
    });
    const datePickerRef = useRef(null);

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dob: date });
    };

    const signin = async () => {
        console.log("sign in executed", formData);
        let responseData;

        try {
            const response = await fetch('https://backend-beryl-nu-15.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            responseData = await response.json();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
            return;
        }

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData.errors);
        }
    };

    const signup = async () => {
        console.log("sign up executed", formData);
        let responseData;

        const passwordValidationResult = validatePassword(formData.password);
        if (passwordValidationResult !== true) {
            alert(passwordValidationResult);
            return;
        }

        try {
            const response = await fetch('https://backend-beryl-nu-15.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            responseData = await response.json();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
            return;
        }

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData.errors);
        }
    };

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowLogin(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showLogin ? signin() : signup();
    };

    const validatePassword = (password) => {
        if (password.length < 8 || password.length > 32) {
            return "Password must be between 8 and 32 characters.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase character.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase character.";
        }
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return true;
    };

    return (
        <div className="login-background">
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
                    <form className={showLogin ? "login-form" : "register-form"} onSubmit={handleSubmit}>
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
                                            value={formData.email}
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
                                            value={formData.password}
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
                                            value={formData.username}
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
                                            value={formData.email}
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
                                            value={formData.password}
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
                                                selected={formData.dob}
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
                            <button className="input-submit" type="submit">
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
