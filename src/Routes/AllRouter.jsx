import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import OTPInput from '../pages/OTPInput';
import Dashboard from '../pages/Dashboard';
import Event from '../pages/Event';
import Type from '../pages/Type';
import User from '../pages/Users';
import EventView from '../pages/EventView';
import UserView from '../pages/UserView';
import Modal from 'react-modal';
Modal.setAppElement('#root');
const AllRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp" element={<OTPInput />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event" element={<Event />} />
          <Route path="/type" element={<Type />} />
          <Route path="/user" element={<User />} /> 
          <Route path="/event/:id" element={< EventView/>} /> 
          <Route path='/user/:id' element={<UserView />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AllRouter;
