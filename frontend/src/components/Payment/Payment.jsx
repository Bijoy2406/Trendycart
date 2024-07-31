import React, { useState } from 'react';
import './Payment.css';

const Payment = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handlePaymentMethodChange = (method) => {
        setSelectedMethod(method);
    };

    const handlePayment = () => {
        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }
        // Simulate payment processing
        alert(`Payment complete with ${selectedMethod}`);
    };

    return (
        <div className="payment-container">
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
                <div
                    className={`payment-method ${selectedMethod === 'BKASH' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('BKASH')}
                >
                    <h3>BKASH</h3>
                    <p>Pay using BKASH</p>
                </div>
                <div
                    className={`payment-method ${selectedMethod === 'NAGAD' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('NAGAD')}
                >
                    <h3>NAGAD</h3>
                    <p>Pay using NAGAD</p>
                </div>
                <div
                    className={`payment-method ${selectedMethod === 'CARD' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('CARD')}
                >
                    <h3>CARD</h3>
                    <p>Pay using Card</p>
                </div>
            </div>
            <button className="payment-button" onClick={handlePayment}>
                Proceed to Pay
            </button>
        </div>
    );
};

export default Payment;
