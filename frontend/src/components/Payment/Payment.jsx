import React, { useState, useEffect } from 'react';
import './Payment.css';
import countries from './countries';

const Payment = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [country, setCountry] = useState('');
    const [pinNumber, setPinNumber] = useState('');
    const [billingZip, setBillingZip] = useState(''); // Added state for Billing ZIP
    const [isFormValid, setIsFormValid] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [cardError, setCardError] = useState('');

    useEffect(() => {
        validateForm();
    }, [selectedMethod, phoneNumber, cardNumber, expiryDate, cvc, country, pinNumber, billingZip]);

    const handlePaymentMethodChange = (method) => {
        setSelectedMethod(method);
        setPhoneNumber('');
        setCardNumber('');
        setExpiryDate('');
        setCvc('');
        setCountry('');
        setPinNumber('');
        setBillingZip(''); // Reset Billing ZIP
        setIsPopupOpen(true);
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        validateForm();
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value;
        setCardNumber(value);
        validateForm();
    };

    const handleExpiryDateChange = (e) => {
        let value = e.target.value;

        // Automatically add a slash after the first two digits (MM)
        if (value.length === 2 && !value.includes('/')) {
            value = value + '/';
        }

        setExpiryDate(value);
        validateForm();
    };

    const handleCvcChange = (e) => {
        const value = e.target.value;
        setCvc(value);
        validateForm();
    };

    const handleCountryChange = (e) => {
        const value = e.target.value;
        setCountry(value);
        validateForm();
    };

    const handlePinNumberChange = (e) => {
        const value = e.target.value;
        setPinNumber(value);
        validateForm();
    };

    const handleBillingZipChange = (e) => {
        const value = e.target.value;
        setBillingZip(value);
        validateForm();
    };

    const validateCardDetails = (cardNumber, expiryDate, cvc, country) => {
        const cardValid = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/.test(cardNumber);
        const expiryParts = expiryDate.split('/');
        const month = parseInt(expiryParts[0], 10);
        const year = parseInt(expiryParts[1], 10);

        let expiryValid = true;
        let errorMessage = '';

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            expiryValid = false;
            errorMessage = 'Input a valid date (MM/YY)';
        } else if (month < 1 || month > 12) {
            expiryValid = false;
            errorMessage = 'Month must be between 01 and 12';
        } else if (year < 24 || year > 50) {
            expiryValid = false;
            errorMessage = 'Year must be between 24 and 50';
        }

        const cvcValid = /^\d{3}$/.test(cvc);
        const countryValid = country !== '';

        if (!cardValid) {
            setCardError('Card number is not valid');
        } else if (!expiryValid) {
            setCardError(errorMessage);
        } else {
            setCardError('');
        }

        if (cardValid && expiryValid && cvcValid && countryValid) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (selectedMethod === 'BKASH' || selectedMethod === 'NAGAD') {
            if (!phoneNumber || !pinNumber) {
                isValid = false;
            } else if (selectedMethod === 'BKASH' && pinNumber.length !== 5) {
                isValid = false;
            } else if (selectedMethod === 'NAGAD' && pinNumber.length !== 4) {
                isValid = false;
            }
        } else if (selectedMethod === 'CARD') {
            if (!cardNumber || !expiryDate || !cvc || !country || !billingZip) {
                isValid = false;
            }
        }

        validateCardDetails(cardNumber, expiryDate, cvc, country);

        setIsFormValid(isValid);
    };

    const handlePayment = () => {
        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }
        if (!isFormValid) {
            alert('Please fill out the form correctly.');
            return;
        }
        alert(`Payment complete with ${selectedMethod}`);
        setIsPopupOpen(false);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
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

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        {selectedMethod === 'BKASH' || selectedMethod === 'NAGAD' ? (
                            <div className="phone-number-input">
                                <label>Enter your 11-digit phone number:</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    placeholder="e.g., 017XXXXXXXX"
                                />
                                <label>Enter PIN:</label>
                                <input
                                    type="password"
                                    value={pinNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only allow digits
                                        if (/^\d*$/.test(value)) {
                                            handlePinNumberChange(e);
                                        }
                                    }}
                                    placeholder={selectedMethod === 'BKASH' ? "5-digit PIN" : "4-digit PIN"}
                                    maxLength={selectedMethod === 'BKASH' ? 5 : 4}
                                    pattern="\d*"
                                />

                            </div>
                        ) : null}

                        {selectedMethod === 'CARD' ? (
                            <div className="card-inputs">
                                <label>Card Number:</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="16-digit card number"
                                    maxLength="16"
                                    minLength="16"
                                />
                                {cardError && <p className="error">{cardError}</p>}
                                <label>Expiry Date (MM/YY):</label>
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={handleExpiryDateChange}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                />
                                <label>CVC:</label>
                                <input
                                    type="text"
                                    value={cvc}
                                    onChange={handleCvcChange}
                                    placeholder="3-digit CVC"
                                    maxLength="3"
                                />
                                <label>Country:</label>
                                <select value={country} onChange={handleCountryChange}>
                                    <option value="">Select Country</option>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                <label>Billing ZIP:</label>
                                <input
                                    type="text"
                                    value={billingZip}
                                    onChange={handleBillingZipChange}
                                    placeholder="Billing ZIP"
                                />
                            </div>
                        ) : null}

                        <button className="payment-button" onClick={handlePayment} disabled={!isFormValid}>
                            Proceed to Pay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
