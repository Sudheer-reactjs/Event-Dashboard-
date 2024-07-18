import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginLogo from '../assets/LoginLogo.svg';
import { CHANGEPASSWORD } from './Helpers/url';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const storedPhone = localStorage.getItem('Number');
        const oldPassword = localStorage.getItem('OldPassword'); // Assuming old password is stored securely

        if (oldPassword && password === oldPassword) {
            setError('New password must be different from the old password.');
            return;
        }

        setLoading(true);

        try {
            console.log('Sending request to reset password', { phone_number: storedPhone, newPassword: confirmPassword });
            const formData = { 
                phone_number: JSON.parse(storedPhone),
                 newPassword: confirmPassword 
                }
            const response = await axios.post(CHANGEPASSWORD,formData);
            console.log(response.data);

            setSuccess('Password reset successfully!');
            setLoading(false);

            setTimeout(() => {
                navigate('/');
            }, 2000); // Redirect after 2 seconds
        } catch (erroor) {
            console.log(erroor?.response?.data?.message,"error")
            setLoading(false);
            setError(erroor?.response?.data?.message);
            if (erroor.response && erroor.response.data.status === 404) {
                setError('Endpoint not found. Please check the URL.');
            } 
            console.error('Reset password error:', erroor);
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
                            <h2>Create New Password</h2>
                            <p>Hey, Please fill in your credentials to access your account.</p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            {error && <p className='error-form'>{error}</p>}
                            {success && <p className='success-messages'>{success}</p>}
                            {loading && <p className='loading-form text-center'>Processing...</p>}
                            <div className='field-box'>
                                <input
                                    type='password' 
                                    placeholder='Enter Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    security='value'
                                
                                />
                            </div>
                            <div className='field-box'>
                                <input
                                    type='password'
                                    placeholder='Confirm Password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='button' type="submit" disabled={loading}>Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
