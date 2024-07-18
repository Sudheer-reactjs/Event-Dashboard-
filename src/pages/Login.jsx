// src/components/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../assets/LoginLogo.svg';
import { LOGIN } from './Helpers/url'; 

const Login = () => {
    const [setData] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }

        try {
            const response = await axios.post(LOGIN, {
                identifier: phoneNumber,
                password: password,
            });
        
            // Assuming response.data contains an object with user information
            const { role, token } = response.data;
        
            // Check if the role is 'Admin'
            if (role === 'Admin') {
                // Set data or store token as needed
                // setData({ token });
                console.log(token)
                localStorage.setItem('Token', JSON.stringify(token));
                console.log(response.data);
                navigate('/dashboard'); // Redirect to dashboard for admins
            } else {
                setError('Unauthorized access.'); 
            }
        
        } catch (error) {
            setError('Please check your credentials and try again.');
            console.error('Login error:', error);
        }
        
    };

    useEffect(() => { 
        axios.post("http://13.49.70.247:3002/admin/loginuser")
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
                                <h2>Login</h2>
                                <p>Please enter your login details to continue!</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                {error && <p className='error-form'>{error}</p>}
                                <div className='feild-box'>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder='Phone Number'
                                        required
                                    />
                                </div>
                                <div className='feild-box'>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Password'
                                        required
                                    />
                                </div>
                                <p className='forgot-password'>
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </p>
                                <button className='button' type="submit">Log In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
