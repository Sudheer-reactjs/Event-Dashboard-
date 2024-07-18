import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { USERDATA } from '../pages/Helpers/url';

const DashboardHeader = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }
                
                const response = await axios.get(USERDATA, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });
    
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) { 
                    // Unauthorized access: redirect to login
                    // navigate('/login'); 
                } else {
                    // Handle other errors as needed
                    // Example: display a message to the user
                }
            }
        };
    
        fetchUserData();
    }, [navigate]);
    

    const handleLogout = () => {
        localStorage.removeItem('Token');
        // Implement your logout logic here
        navigate('/'); // Redirect to login page after logout
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="dashboard-header">
            <div className="profile-section" onClick={toggleDropdown}>
                <img
                    src={userData?.thumbnail_urls?.[0] || 'https://via.placeholder.com/50'}
                    alt="User"
                    className="profile-image"
                />
                <div className="user-name">
                    <h4>{userData?.full_name}</h4>
                    <span>{userData ? 'Admin' : ''}</span> 
                </div>
                <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
