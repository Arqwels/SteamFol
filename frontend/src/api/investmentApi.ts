import { baseApi } from './baseApi';
import { CreateInvestmentRequest, Investment, UpdateInvestmentRequest } from '../types/investment';

export const investmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvestments: builder.query<Investment[], void>({
      query: () => '/investment',
      providesTags: () => [
        {
          type: 'Investments',
        },
      ],
    }),

    createInvestment: builder.mutation<Investment, CreateInvestmentRequest>({
      query: (newInvestment) => ({
        url: '/investment',
        method: 'POST',
        body: newInvestment,
      }),
      invalidatesTags: [{ type: 'Investments' }],
    }),

    updateInvestment: builder.mutation<Investment, UpdateInvestmentRequest>({
      query: ({ id, ...rest }) => ({
        url: `/investment/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: [{ type: 'Investments' }],
    }),

    deleteInvestment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/investment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Investments' }],
    })
  }),
  overrideExisting: false,
});

export const {
  useGetInvestmentsQuery,
  useCreateInvestmentMutation,
  useUpdateInvestmentMutation,
  useDeleteInvestmentMutation,
} = investmentApi;
