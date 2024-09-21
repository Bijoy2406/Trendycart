import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backend-beryl-nu-15.vercel.app/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Password reset link sent! Please check your email.');
        setTimeout(() => {
          navigate('/login'); // Redirect to another page after payment, e.g., home
      }, 3500); // 2 m delay
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Error sending password reset request:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <div className="form__group field">
          <input
            type="email"
            className="form_field"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email" className="form__label">Email</label>
        </div>
        <button type="submit" className='forgot-button'>Send Reset Link</button>
      </form>
      <ToastContainer className="toast-container" />
    </div>
  );
}

export default ForgotPassword;
