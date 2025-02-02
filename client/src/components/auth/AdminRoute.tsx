import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const AdminRoute: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute; 