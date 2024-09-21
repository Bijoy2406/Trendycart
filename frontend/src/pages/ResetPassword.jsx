import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordChecklist from "react-password-checklist";
import './CSS/ResetPassword.css'; // Assuming you have a separate CSS file for the styles

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Separate state for confirm password visibility
    const [isValid, setIsValid] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);

    const checkTokenValidity = async () => {
        try {
            const response = await fetch(`https://backend-beryl-nu-15.vercel.app/verify-reset-token/${token}`);
            const data = await response.json();
            setTokenValid(data.valid);
        } catch (error) {
            console.error('Error checking token validity:', error);
            setTokenValid(false);
        }
    };

    useEffect(() => {
        checkTokenValidity();
    }, [token]);

    const handlePasswordChange = (newPassword, isValid) => {
        setPassword(newPassword);
    };

    // Validate password match and display the toast if necessary
    useEffect(() => {
        if (password !== confirmPassword && confirmPassword !== '') {
            toast.error('Passwords do not match!');
        }
    }, [password, confirmPassword]);

    // Toggle visibility for password field
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle visibility for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
    
        if (!isValid) {
            console.log('Password invalid');
            toast.error('Password does not meet the requirements.');
            return;
        }
    
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            toast.error('Passwords do not match!');
            return;
        }
    
        try {
            const response = await fetch(`https://backend-beryl-nu-15.vercel.app/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
    
            if (response.ok) {
                toast.success('Password reset successfully!');
                setTimeout(() => {
                    navigate('/login'); // Redirect to another page after reset
                }, 3500); // 3.5 seconds delay
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };
    

    if (tokenValid === false) {
        return (
            <div className="reset-password-container">
                <h2>Invalid or Expired Token</h2>
                <p>Your password reset link is invalid or has expired. 
                Please request a new password reset link.</p>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit} className="reset-password-form">
                {/* New Password Field */}
                <div className="form__group field">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form__field"
                        placeholder="New Password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="form__label">New Password</label>
                    {/* Eye Icon for toggling visibility */}
                    <span className="eye-icon-new" onClick={togglePasswordVisibility}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                {/* Confirm Password Field */}
                <div className="form__group field">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form__field"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword" className="form__label">Confirm Password</label>
                    {/* Eye Icon for toggling visibility */}
                    <span className="eye-icon-confirm" onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? '👁️' : '🙈'}
                    </span>
                    <PasswordChecklist
                        rules={["minLength", "specialChar", "number", "capital", "lowercase"]}
                        minLength={8}
                        value={password}
                        onChange={(isValid) => setIsValid(isValid)}
                    />
                </div>

                <button
                    type="submit"
                    className="reset-password-button"
                    disabled={!isValid || password !== confirmPassword}
                >
                    Reset Password
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ResetPassword;
