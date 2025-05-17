import { baseApi } from './baseApi';
import { Skin } from '../types';

export const searchApi = baseApi.injectEndpoints({
  endpoints: build => ({
    search: build.query<Skin[], string>({
      query: (searchTerm) => `/skins/search?q=${encodeURIComponent(searchTerm)}`
    }),
  }),
  overrideExisting: false,
});

export const { useSearchQuery } = searchApi;
export const useLazySearchQuery = searchApi.endpoints.search.initiate;
