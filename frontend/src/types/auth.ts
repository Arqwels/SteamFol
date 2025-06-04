// Ответ от сервера при авторизации/регистрации/рефреше
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    id: number;
    isActivated: boolean;
  };
}

// Параметры для логина
export interface Credentials {
  email: string;
  password: string;
}

// Параметры для регистрации
export interface RegisterData extends Credentials {}
