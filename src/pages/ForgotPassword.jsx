import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../assets/LoginLogo.svg';
import { COUNTRIES, SIGNUPCODESEND } from './Helpers/url';

const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false); // State to show OTP input
    const [countryCodes, setCountryCodes] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]); // State for filtered countries
    const [countryCode, setCountryCode] = useState('');
    const [showCountryList, setShowCountryList] = useState(false); // State to show/hide country list
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(COUNTRIES);
                setCountryCodes(response.data.data);
                setFilteredCountries(response.data.data); // Initialize filtered countries with all countries
                // Set default country code if needed
                if (response.data.data.length > 0) {
                    setCountryCode(response.data.data[0].phone_code);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const phoneRegex = /^[0-9]{10,15}$/; // Adjusted for international numbers
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number.');
            return;
        }

        try {
            const response = await axios.post(SIGNUPCODESEND, {
                phoneNumber: phone,
                countryCode: countryCode, // Send the selected country code
            });
            setSuccess('OTP sent to your phone. Please enter it below.');
            localStorage.setItem('phone_number',JSON.stringify(phone));
            navigate('/otp',{phoneNumber:phone});
        } catch (error) {
            setError('Error sending OTP. Please try again.');
            console.error('Forgot password error:', error);
        }
    };

    const toggleCountryList = () => {
        setShowCountryList(prev => !prev); // Toggle show/hide country list
    };

    const handleSelectCountry = (code) => {
        setCountryCode(code);
        setShowCountryList(false); // Close country list after selection
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = countryCodes.filter(country =>
            country.name.toLowerCase().includes(searchTerm) ||
            country.phone_code.includes(searchTerm)
        );
        setFilteredCountries(filtered);
    };

    return (
        <>
            <div className='logo-outer'>
                <div className='container'>
                    <div className='logo-inner'>
                        <div className='login-logo'>
                            <img src={LoginLogo} alt="Login Logo" />
                        </div>
                        <div className='login-form'>
                            <div className='login-heading'>
                                <h2>Forgot Password</h2>
                                <p>Please confirm your phone number.</p>
                            </div>

                            {!showOtpInput ? (
                                <form onSubmit={handleForgotPassword}>
                                    {error && <p className='error-form'>{error}</p>}
                                    {success && <div className='success-message'>{success}</div>}
                                    <div className='field-box field-box-select'>
                                        <div className="custom-dropdown">
                                            <div className="selected-country" onClick={toggleCountryList}>
                                                <img src={countryCodes.find(c => c.phone_code === countryCode)?.flag} alt="Selected Country Flag" />
                                                {countryCode}
                                                <svg width="6" height="3" viewBox="0 0 6 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 0L3 3L6 0L0 0Z" fill="white" />
                                                </svg>
                                            </div>
                                            {showCountryList && (
                                                <ul className="country-list scroll-bar">
                                                        <div className='search-sticky'>
                                                        <input
                                                            type="text"
                                                            placeholder="Search country..."
                                                            onChange={handleSearchChange}
                                                        />
                                                        </div>
                                                    {filteredCountries.map((country) => (
                                                        <li key={country._id} onClick={() => handleSelectCountry(country.phone_code)}>
                                                            <img src={country.flag} alt={country.name} />
                                                            {country.phone_code} - {country.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <input
                                            type='text'
                                            placeholder='Enter Phone Number'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button className='button' type="submit">Send OTP</button>
                                    <p className='back-to-login'>
                                        Remember Password? <Link to="/">Sign In</Link> Here
                                    </p>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP}>
                                    <div className='field-box'>
                                        <input
                                            type='text'
                                            placeholder='Enter OTP'
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button className='button' type="submit">Verify</button>
                                    <p className='back-to-login'>
                                        Go back to <Link to="/">Sign In</Link> page.
                                    </p>
                                </form>
                            )}  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
