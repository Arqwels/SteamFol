import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage/MainPage';
import { PortfolioPage } from '../pages/PortfolioPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Routes } from './routesPaths';

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
  guestOnly?: boolean;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: Routes.Public.Main,
    Component: MainPage,
    guestOnly: true, //! Когда норм страница будет сделать общей
  },
  {
    path: Routes.Public.Login,
    Component: LoginPage,
    guestOnly: true,
  },
  {
    path: Routes.Public.Register,
    Component: RegisterPage,
    guestOnly: true,
  },
  // Добавить потом страницу по восстановлению пароля
];

export const authRoutes: RouteConfig[] = [
  {
    path: Routes.Auth.Portfolio,
    Component: PortfolioPage,
  },
];
