import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import DashboardHeader from '../components/DashboardHeader';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { HOMEDATA } from '../pages/Helpers/url';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('Token');
    setUserToken(token);

    const checkTokenExpiration = async () => {
      if (token) {
        try {
          const response = await axios.get(HOMEDATA, { 
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          });
          // If API call is successful, do nothing
          console.log(response.data);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            // If the token is expired, redirect to login
            navigate('/');
          }
        }
      } else {
        // If no token is found, redirect to login
        navigate('/');
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  return (
    <>
      {userToken ? (
        <div className="dashboard">
          <MainSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`dashboard-content ${isSidebarOpen ? 'shifted' : ''}`}>
            <DashboardHeader />
            <div className="content-wrapper">
              <Outlet /> {/* This renders the content of nested routes */}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Layout;
