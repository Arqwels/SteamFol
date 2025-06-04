import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '../components/Loader/Loader';
import { Routes } from './routesPaths';
import { useAuthStatus } from '../hooks/useAuthStatus';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoggedIn, initialized } = useAuthStatus();

  if (!initialized) {
    return <Loader />;
  }

  return isLoggedIn ? children : <Navigate to={Routes.Public.Login} replace />;
};
