import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ISkin {
  id: number;
  market_name: string;
  market_hash_name: string;
  price_skin: number;
  image_url: string;
  date_update: string;
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: build => ({
    search: build.query<ISkin[], string>({
      query: (searchTerm) => `skins/search?q=${encodeURIComponent(searchTerm)}`,
      keepUnusedDataFor: 0.0001,
    })
  })
})

export const { useSearchQuery } = searchApi;
export const useLazySearchQuery = searchApi.endpoints.search.initiate;
