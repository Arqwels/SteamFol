import { baseApi } from './baseApi';
import { Portfolio } from '../types';

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPortfolio: builder.query<Portfolio[], void>({
      query: () => '/portfolio',
      providesTags: () => [{ type: 'Portfolio' }],
    }),

    activatePortfolio: builder.mutation<void, number|null>({
      query: (id) => ({
        url: `/portfolio/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Portfolio' }],
    }),

    createPortfolio: builder.mutation<Portfolio, { namePortfolio: string }> ({
      query: (body) => ({
        url: '/portfolio',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Portfolio' }],
    }),

    renamePortfolio: builder.mutation<Portfolio, { id: number; namePortfolio: string }>({
      query: ({ id, namePortfolio }) => ({
        url: `/portfolio/${id}`,
        method: 'PATCH',
        body: { namePortfolio },
      }),
      invalidatesTags: [{ type: 'Portfolio' }],
    }),

    // Возможно сделать получение статуса (message) и выводить его на клиенте в уведомление
    deletePortfolio: builder.mutation<void, number>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Portfolio' }],
    }),
  }),
});

export const {
  useGetAllPortfolioQuery,
  useActivatePortfolioMutation,
  useCreatePortfolioMutation,
  useRenamePortfolioMutation,
  useDeletePortfolioMutation
} = portfolioApi;
