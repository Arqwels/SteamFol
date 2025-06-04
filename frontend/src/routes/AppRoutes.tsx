import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, publicRoutes } from './routesConfig';
import { PrivateRoute } from './PrivateRoute';
import { GuestRoute } from './GuestRoute';
import { Routes as RoutesPaths } from './routesPaths';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Приватные */}
      {authRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}

      {/* Публичные и гостевые */}
      {publicRoutes.map(({ path, Component, guestOnly }) => {
        const Wrapper = guestOnly ? GuestRoute : React.Fragment;
        return (
          <Route
            key={path}
            path={path}
            element={
              <Wrapper>
                <Component />
              </Wrapper>
            }
          />
        );
      })}

      <Route
        path="/*"
        element={<Navigate to={RoutesPaths.Public.Main} replace />}
      />
    </Routes>
  );
};
