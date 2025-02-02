import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import useAuthStore from '@/store/auth';
import { AuthState } from '@/types';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 