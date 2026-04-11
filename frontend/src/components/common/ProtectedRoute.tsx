import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('[DEBUG] ProtectedRoute rendering:', { isAuthenticated, loading, location: location.pathname });

  // Show nothing while validating token
  if (loading) {
    console.log('[DEBUG] ProtectedRoute: loading=true, returning null');
    return null;
  }

  if (!isAuthenticated) {
    console.log('[DEBUG] ProtectedRoute: isAuthenticated=false, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('[DEBUG] ProtectedRoute: isAuthenticated=true, rendering children');
  return children;
};

export default ProtectedRoute;
