export const Routes = {
  Public: {
    Main: '/',
    Login: '/login',
    Register: '/register',
    ForgotPassword: '/forgot-password', // Ещё реализовать нужно(
  },
  Auth: {
    Portfolio: '/portfolio',
  },
} as const;

export type PublicRoutes = (typeof Routes.Public)[keyof typeof Routes.Public];
export type AuthRoutes = (typeof Routes.Auth)[keyof typeof Routes.Auth];
