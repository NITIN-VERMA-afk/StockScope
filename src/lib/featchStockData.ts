import axios from "axios";

type TimeSeriesData = {
  [date: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
};

export type ChartPoint = {
  date: string;
  close: number;
};

type GlobalQuoteData = {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
};

type SearchMatch = {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
};

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
  region?: string;
  currency?: string;
}


export async function fetchStockData(symbol: string): Promise<ChartPoint[]> {
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const res = await axios.get(url);
    const timeSeries: TimeSeriesData | undefined = res.data["Time Series (Daily)"];

    if (!timeSeries) throw new Error("Invalid symbol or API limit reached");

    const chartData: ChartPoint[] = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, data]) => ({
        date,
        close: parseFloat(data["4. close"]),
      }))
      .reverse();

    return chartData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}


export async function fetchStockQuote(symbol: string): Promise<Stock> {
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const res = await axios.get(url);
    const quote: GlobalQuoteData = res.data["Global Quote"];

    if (!quote || !quote["01. symbol"]) {
      throw new Error("Invalid symbol or API limit reached");
    }

    const changePercent = parseFloat(quote["10. change percent"].replace('%', ''));
    
    return {
      symbol: quote["01. symbol"],
      name: quote["01. symbol"], 
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: changePercent,
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    throw error;
  }
}


export async function searchStocks(query: string): Promise<Stock[]> {
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`;

  try {
    const res = await axios.get(url);
    const matches: SearchMatch[] = res.data["bestMatches"] || [];

    if (!matches.length) {
      return [];
    }

   
    const stocks: Stock[] = matches.slice(0, 10).map(match => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      price: 0, 
      change: 0,
      changePercent: 0,
      region: match["4. region"],
      currency: match["8. currency"],
    }));

    return stocks;
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
}


export async function searchStocksWithQuotes(query: string): Promise<Stock[]> {
  try {
    const searchResults = await searchStocks(query);
    
   
    const stocksWithQuotes = await Promise.allSettled(
      searchResults.slice(0, 5).map(async (stock) => {
        try {
          const quote = await fetchStockQuote(stock.symbol);
          return {
            ...stock,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          };
        } catch (error) {
         
          return stock;
        }
      })
    );

    return stocksWithQuotes
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<Stock>).value);
      
  } catch (error) {
    console.error("Error searching stocks with quotes:", error);
    throw error;
  }
}


export const popularStocks = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'
];


export async function getPopularStocks(): Promise<Stock[]> {
  try {
    const stockPromises = popularStocks.map(symbol => fetchStockQuote(symbol));
    const results = await Promise.allSettled(stockPromises);
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<Stock>).value);
      
  } catch (error) {
    console.error("Error fetching popular stocks:", error);
    return [];
  }
}
