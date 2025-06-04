import { AuthResponse, Credentials, RegisterData } from '../types';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Auth' }],
    }),

    login: builder.mutation<AuthResponse, Credentials>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Auth' }],
    }),

    refresh: builder.query<AuthResponse, void>({
      query: () => '/auth/refresh',
      providesTags: () => [{ type: 'Auth' }],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Auth' }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshQuery,
  useLogoutMutation,
} = authApi;
