import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../assets/LoginLogo.svg';
import { SIGNUPCODEMATCH } from './Helpers/url'; 

const OTPInput = () => {
    const [otp, setOtp] = useState(new Array(4).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length < 4) {
            setError('Please enter a valid 4-digit OTP.'); 
            return;
        }

        const storedPhone = localStorage.getItem('phone_number');
        if (storedPhone) {
            let phone = JSON.parse(storedPhone);
            setLoading(true);

            try {
                const response = await axios.post(SIGNUPCODEMATCH, { phone_number: phone, otp: otpCode })

                localStorage.setItem('authToken', response.data.token);

                setLoading(false);
                navigate('/reset-password');
            } catch (error) {
                setLoading(false);
                setError('Invalid OTP. Please try again.');
                console.error('OTP verification error:', error);
            }
        } else {
            setError('Phone number not found in local storage.');
        }
    };

    return (
        <div className='logo-outer'>
            <div className='container'>
                <div className='logo-inner'>
                    <div className='login-logo'>
                        <img src={LoginLogo} alt="Login Logo" />
                    </div>
                    <div className='login-form'>
                        <div className='login-heading'>
                            <h2>Enter OTP</h2>
                            <p>Enter the 4-digit pin sent to your phone</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {error && <p className='error-form'>{error}</p>} 
                            {loading && <p className='loading-form text-center'>Verifying...</p>}
                            <div className='otp-input'>
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type='text'
                                        maxLength='1'
                                        value={data}
                                        onChange={e => handleChange(e.target, index)}
                                        onFocus={e => e.target.select()}
                                        required
                                    />
                                ))}
                            </div>
                            <button className='button' type='submit' disabled={loading}>Verify</button>
                            <p className='back-to-login'>
                                Remember Password? <Link to="/">Sign In</Link> page.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPInput;
