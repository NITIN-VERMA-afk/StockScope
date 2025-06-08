import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();



type TimeSeriesData = {
  [date: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
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


export type FinnhubCandle = {
  c: number[]; 
  h: number[]; 
  l: number[];
  o: number[]; 
  t: number[]; 
  v: number[]; 
  s: string;   
};

export type FinnhubQuote = {
  c: number; 
  d: number; 
  dp: number; 
  h: number;  
  l: number; 
  o: number;  
  pc: number; 
  t: number;  
};

export type FinnhubSymbolSearch = {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
};

export type NewsArticle = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

export type CompanyProfile = {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
};

// Common types
export type ChartPoint = {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
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
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}


const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FIN_HUB;





export async function fetchStockData(symbol: string): Promise<ChartPoint[]> {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    const res = await axios.get(url);
    const timeSeries: TimeSeriesData | undefined = res.data["Time Series (Daily)"];

    if (!timeSeries) throw new Error("Invalid symbol or API limit reached");

    const chartData: ChartPoint[] = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, data]) => ({
        date,
        close: parseFloat(data["4. close"]),
        open: parseFloat(data["1. open"]),
        high: parseFloat(data["2. high"]),
        low: parseFloat(data["3. low"]),
        volume: parseFloat(data["5. volume"]),
      }))
      .reverse();

    return chartData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}

export async function fetchStockQuote(symbol: string): Promise<Stock> {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

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
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`;

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



export async function fetchFinnhubStockData(symbol: string, days: number = 30): Promise<ChartPoint[]> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (days * 24 * 60 * 60);
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;

  try {
    const res = await axios.get(url);
    const data: FinnhubCandle = res.data;

    if (data.s !== 'ok' || !data.c || data.c.length === 0) {
      throw new Error("Invalid symbol or no data available");
    }

    const chartData: ChartPoint[] = data.t.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      close: data.c[index],
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      volume: data.v[index],
    }));

    return chartData;
  } catch (error) {
    console.error("Error fetching Finnhub stock data:", error);
    throw error;
  }
}

export async function fetchFinnhubStockQuote(symbol: string): Promise<Stock> {
  const [quoteRes, profileRes] = await Promise.allSettled([
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
    axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
  ]);

  try {
    if (quoteRes.status !== 'fulfilled') {
      throw new Error("Failed to fetch quote data");
    }

    const quote: FinnhubQuote = quoteRes.value.data;
    
    if (!quote.c) {
      throw new Error("Invalid symbol or no data available");
    }

    let companyName = symbol;
    let sector = undefined;
    
    if (profileRes.status === 'fulfilled') {
      const profile: CompanyProfile = profileRes.value.data;
      if (profile.name) {
        companyName = profile.name;
        sector = profile.finnhubIndustry;
      }
    }

    return {
      symbol: symbol,
      name: companyName,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      previousClose: quote.pc,
      sector: sector,
    };
  } catch (error) {
    console.error("Error fetching Finnhub stock quote:", error);
    throw error;
  }
}

export async function searchFinnhubStocks(query: string): Promise<Stock[]> {
  const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`;

  try {
    const res = await axios.get(url);
    const searchData: FinnhubSymbolSearch = res.data;

    if (!searchData.result || searchData.result.length === 0) {
      return [];
    }

    const stocks: Stock[] = searchData.result.slice(0, 10).map(result => ({
      symbol: result.symbol,
      name: result.description,
      price: 0,
      change: 0,
      changePercent: 0,
    }));

    return stocks;
  } catch (error) {
    console.error("Error searching Finnhub stocks:", error);
    throw error;
  }
}

export async function fetchStockNews(symbol?: string, category?: string): Promise<NewsArticle[]> {
  let url: string;
  
  if (symbol) {
    // Company news
    const to = Math.floor(Date.now() / 1000);
    const from = to - (7 * 24 * 60 * 60); // Last 7 days
    url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${new Date(from * 1000).toISOString().split('T')[0]}&to=${new Date(to * 1000).toISOString().split('T')[0]}&token=${FINNHUB_API_KEY}`;
  } else {
    // General market news
    url = `https://finnhub.io/api/v1/news?category=${category || 'general'}&token=${FINNHUB_API_KEY}`;
  }

  try {
    const res = await axios.get(url);
    const news: NewsArticle[] = res.data;

    return news.slice(0, 20); 
  } catch (error) {
    console.error("Error fetching stock news:", error);
    throw error;
  }
}

export async function fetchCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;

  try {
    const res = await axios.get(url);
    const profile: CompanyProfile = res.data;

    if (!profile.name) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
}



export async function searchStocksWithQuotes(query: string, useFinnhub: boolean = false): Promise<Stock[]> {
  try {
    const searchResults = useFinnhub ? 
      await searchFinnhubStocks(query) : 
      await searchStocks(query);
    
    const stocksWithQuotes = await Promise.allSettled(
      searchResults.slice(0, 5).map(async (stock) => {
        try {
          const quote = useFinnhub ? 
            await fetchFinnhubStockQuote(stock.symbol) :
            await fetchStockQuote(stock.symbol);
          return {
            ...stock,
            ...quote,
          };
        } catch {
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

export async function getPopularStocks(useFinnhub: boolean = false): Promise<Stock[]> {
  try {
    const stockPromises = popularStocks.map(symbol => 
      useFinnhub ? fetchFinnhubStockQuote(symbol) : fetchStockQuote(symbol)
    );
    const results = await Promise.allSettled(stockPromises);
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<Stock>).value);
      
  } catch (error) {
    console.error("Error fetching popular stocks:", error);
    return [];
  }
}



export function formatNewsDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}
