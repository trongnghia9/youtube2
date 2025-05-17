import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SubscriptionPage from '../pages/Subscription';
import SubscriptionManagement from '../pages/UserPages/SubscriptionManagement';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Protected routes */}
      <Route
        path="/subscription"
        element={
          <PrivateRoute>
            <SubscriptionPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/subscription/manage"
        element={
          <PrivateRoute>
            <SubscriptionManagement />
          </PrivateRoute>
        }
      />
      
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes; 