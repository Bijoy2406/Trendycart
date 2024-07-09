import React, { useState, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CSS/login.css';
import { Link } from 'react-router-dom';

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    const [loginForm, setLoginForm] = useState({ Email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', Email: '', password: '', dob: new Date() });
    const datePickerRef = useRef(null);

    const [state,setState] = useState("login");
    const [formData,setFormData] = useState({
        username:"",
        password:"",
        email:"",
    })

    const changeHandler =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const signin = async () => {
        console.log("sign in executed",formData);
        let responseData;

        await fetch('http://localhost:4001/login',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response)=> response.json()).then((data)=>responseData=data)

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors)
        }
    };

    const signup = async () => {
        console.log("sign up executed",formData);
        let responseData;

        await fetch('http://localhost:4001/signup',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response)=> response.json()).then((data)=>responseData=data)

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors)
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

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        signin();
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        signup();
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

                    <form className={showLogin ? "login-form" : "register-form"} onSubmit={showLogin ? handleLoginSubmit : handleRegisterSubmit}>
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
                                            value={formData.Email}
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
                            <button className="input-submit" type="submit">
                                <span onClick={()=>{state==="login"?signin():signup()}}>Continue</span>
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
