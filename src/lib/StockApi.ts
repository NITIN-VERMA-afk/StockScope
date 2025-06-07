import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChartPoint } from '@/lib/featchStockData';

const API_KEY = process.env.API_KEY;

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.alphavantage.co/query' }),
  endpoints: (builder) => ({
    getStockChart: builder.query<ChartPoint[], string>({
      query: (symbol) =>
        `?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`,
      transformResponse: (response: any): ChartPoint[] => {
        const timeSeries = response['Time Series (Daily)'];
        if (!timeSeries) throw new Error('Invalid symbol');

        return Object.entries(timeSeries)
          .slice(0, 30)
          .map(([date, data]) => {
            const point = data as {
              '1. open': string;
              '2. high': string;
              '3. low': string;
              '4. close': string;
              '5. volume': string;
            };

            return {
              date,
              close: parseFloat(point['4. close']),
            };
          })
          .reverse();
      },
      keepUnusedDataFor: 60 * 60 * 12, 
    }),
  }),
});

export const { useGetStockChartQuery } = stockApi;

