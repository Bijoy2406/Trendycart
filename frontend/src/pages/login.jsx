import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CSS/login.css';
import { Link } from 'react-router-dom';
<<<<<<< HEAD

function Login() {
    const [showLogin, setShowLogin] = useState(true);
=======
import Loader_login from '../loader_login';

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [loading, setLoading] = useState(false);
>>>>>>> origin/basic
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', dob: new Date() });
    const datePickerRef = useRef(null);

<<<<<<< HEAD
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const signin = async () => {
        console.log("sign in executed", formData);
        let responseData;

        await fetch('http://localhost:4001/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
=======
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const login = async () => {
        if (!validateEmail(loginForm.email)) {
            alert("Invalid email format.");
            return;
        }

        console.log("Log in function executed with data:", loginForm); // Debug statement
        setLoading(true);
        
        let responseData;

        await fetch('https://backend-beryl-nu-15.vercel.app/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginForm)
>>>>>>> origin/basic
        }).then((response) => response.json()).then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData.errors);
        }
<<<<<<< HEAD
    };

    const signup = async () => {
        console.log("sign up executed", formData);
        let responseData;

        await fetch('http://localhost:4001/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
=======
        setLoading(false);
    };

    const signup = async () => {
        if (!validateEmail(registerForm.email)) {
            alert("Invalid email format.");
            return;
        }

        console.log("Sign up function executed with data:", registerForm); // Debug statement
        let responseData;

        const passwordValidationResult = validatePassword(registerForm.password);
        if (passwordValidationResult !== true) {
            alert(passwordValidationResult);
            return;
        }

        await fetch('https://backend-beryl-nu-15.vercel.app/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerForm)
>>>>>>> origin/basic
        }).then((response) => response.json()).then((data) => responseData = data);

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

<<<<<<< HEAD
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
=======
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login();
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        signup();
    };

    const validatePassword = (password) => {
        // Check password length
        if (password.length < 8 || password.length > 32) {
            return "Password must be between 8 and 32 characters.";
        }

        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase character.";
        }

        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase character.";
        }

        // Check for special character
        if (!/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
            return "Password must contain at least one special character.";
        }

        // If all conditions are met
        return true;
    };

    return (
        <div className="login-background">
            {loading && <Loader_login />}
>>>>>>> origin/basic
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
<<<<<<< HEAD
                        </div>
=======
                    </div>
>>>>>>> origin/basic
                    <Link to='/' className='home-icon'>
                        <i className="bx bx-home"></i>
                    </Link>
                    <p className="featured-words">Welcome To <span>Trendycart</span></p>
                </div>
<<<<<<< HEAD

=======
>>>>>>> origin/basic
                <div className="col col-2">
                    <div className="btn-box">
                        <button
                            className="btn btn-1"
                            onClick={handleLoginClick}
                            style={{ backgroundColor: showLogin ? '#21264D' : 'rgba(255, 255, 255, 0.2)' }}>
<<<<<<< HEAD
                            Sign In
=======
                            Log In
>>>>>>> origin/basic
                        </button>
                        <button
                            className="btn btn-2"
                            onClick={handleRegisterClick}
                            style={{ backgroundColor: showLogin ? 'rgba(255, 255, 255, 0.2)' : '#21264D' }}>
                            Sign Up
                        </button>
                    </div>
<<<<<<< HEAD

                    <form className={showLogin ? "login-form" : "register-form"} onSubmit={handleFormSubmit}>
=======
                    <form className={showLogin ? "login-form" : "register-form"} onSubmit={showLogin ? handleLoginSubmit : handleRegisterSubmit}>
>>>>>>> origin/basic
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
<<<<<<< HEAD
                                            value={formData.email}
                                            onChange={changeHandler}
=======
                                            value={loginForm.email}
                                            onChange={handleLoginInputChange}
                                            required
>>>>>>> origin/basic
                                        />
                                        <i className="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="Password"
                                            name="password"
<<<<<<< HEAD
                                            value={formData.password}
                                            onChange={changeHandler}
=======
                                            value={loginForm.password}
                                            onChange={handleLoginInputChange}
                                            required
>>>>>>> origin/basic
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
<<<<<<< HEAD
                                            value={formData.username}
                                            onChange={changeHandler}
=======
                                            value={registerForm.username}
                                            onChange={handleRegisterInputChange}
                                            required
>>>>>>> origin/basic
                                        />
                                        <i className="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Email"
                                            name="email"
<<<<<<< HEAD
                                            value={formData.email}
                                            onChange={changeHandler}
=======
                                            value={registerForm.email}
                                            onChange={handleRegisterInputChange}
                                            required
>>>>>>> origin/basic
                                        />
                                        <i className="bx bx-mobile icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="Password"
                                            name="password"
<<<<<<< HEAD
                                            value={formData.password}
                                            onChange={changeHandler}
                                            required />
=======
                                            value={registerForm.password}
                                            onChange={handleRegisterInputChange}
                                            required
                                        />
>>>>>>> origin/basic
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
<<<<<<< HEAD
=======
                                                required
>>>>>>> origin/basic
                                            />
                                            <FaRegCalendarAlt className="calendar-icon" onClick={handleCalendarIconClick} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="input-box">
<<<<<<< HEAD
                            <button className="input-submit" type="submit">
                                <span>Continue</span>
=======
                            <button className="input-submit" type="submit" disabled={loading}>
                                <span>{showLogin ? "Continue" : "Sign Up"}</span>
>>>>>>> origin/basic
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