import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import useAuthStore from '@/store/auth';
import { AuthState } from '@/types';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const isAdmin = useAuthStore((state: AuthState) => state.user?.role === 'ADMIN');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AdminRoute; 