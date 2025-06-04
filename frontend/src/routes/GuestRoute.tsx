import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '../components/Loader/Loader';
import { Routes } from './routesPaths';
import { useAuthStatus } from '../hooks/useAuthStatus';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isLoggedIn, initialized } = useAuthStatus();

  if (!initialized) {
    return <Loader />;
  }

  return isLoggedIn ? (
    <Navigate to={Routes.Auth.Portfolio} replace />
  ) : (
    children
  );
};
