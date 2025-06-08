"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Globe,
  Calendar,
  ExternalLink,
  RefreshCw,
  Clock,
  Building,
  Building2,
  DollarSign,
  Loader2,
  X,
} from "lucide-react";

import {
  searchStocksWithQuotes,
  getPopularStocks,
  fetchStockNews,
  formatNewsDate,
  Stock,
  NewsArticle,
} from "@/lib/featchStockData";


interface StockSearchBarProps {
  onSelectStock?: (stock: Stock) => void;
  placeholder?: string;
  className?: string;
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({
  onSelectStock,
  placeholder = "Search stocks (e.g., AAPL, Tesla, Microsoft...)",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(async (searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.length === 0) {
        setIsLoading(true);
        setError(null);
        try {
          
          const popularStocks = await getPopularStocks(true); 
          setFilteredStocks(popularStocks.slice(0, 8));
        } catch (err) {
          console.error("Failed to load popular stocks:", err);
          setError("Failed to load popular stocks");
          setFilteredStocks([]);
        } finally {
          setIsLoading(false);
        }
      } else if (searchQuery.length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          
          const results = await searchStocksWithQuotes(searchQuery, true); 
          setFilteredStocks(results.slice(0, 10));
        } catch (err) {
          console.error("Failed to search stocks:", err);
          setError("Failed to search stocks");
          setFilteredStocks([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFilteredStocks([]);
      }
      setSelectedIndex(-1);
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      debouncedSearch(query);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, isOpen, debouncedSearch]);

  useEffect(() => {
    if (isOpen && query.length === 0 && filteredStocks.length === 0) {
      debouncedSearch("");
    }
  }, [isOpen, query.length, filteredStocks.length, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredStocks.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredStocks[selectedIndex]) {
        handleSelectStock(filteredStocks[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setQuery(`${stock.symbol} - ${stock.name}`);
    setIsOpen(false);
    onSelectStock?.(stock);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return {
      isPositive,
      change:
        change === 0 ? "N/A" : `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent:
        changePercent === 0
          ? "N/A"
          : `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
    };
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-lg"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      
      <AnimatePresence>
        {isOpen && (filteredStocks.length > 0 || isLoading || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
             
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    {query ? `Results for "${query}"` : "Popular Stocks"}
                  </span>
                  {!isLoading && !error && (
                    <span>{filteredStocks.length} found</span>
                  )}
                </div>
              </div>

              
              {isLoading && (
                <div className="px-4 py-8 text-center">
                  <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
                  <p className="text-gray-600">Searching stocks...</p>
                </div>
              )}

             
              {error && (
                <div className="px-4 py-8 text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={() => debouncedSearch(query)}
                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Try again
                  </button>
                </div>
              )}

              
              {!isLoading &&
                !error &&
                filteredStocks.map((stock, index) => {
                  const changeData = formatChange(
                    stock.change,
                    stock.changePercent
                  );
                  const isSelected = index === selectedIndex;

                  return (
                    <motion.div
                      key={`${stock.symbol}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-4 cursor-pointer transition-all duration-150 border-b border-gray-50 last:border-b-0 ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectStock(stock)}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Side - Stock Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900 text-lg">
                                {stock.symbol}
                              </span>
                              {(stock.region ||
                                stock.currency ||
                                stock.sector) && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {stock.region || stock.sector}
                                  {stock.currency && ` • ${stock.currency}`}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm truncate max-w-xs">
                              {stock.name}
                            </p>
                          </div>
                        </div>

                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-gray-900 text-lg">
                              {formatPrice(stock.price)}
                            </span>
                          </div>

                          {stock.price > 0 && (
                            <div
                              className={`flex items-center space-x-1 text-sm ${
                                changeData.isPositive
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {changeData.change !== "N/A" && (
                                <>
                                  {changeData.isPositive ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                  <span className="font-medium">
                                    {changeData.change} (
                                    {changeData.changePercent})
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            
            {!isLoading && !error && filteredStocks.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Use ↑↓ arrows to navigate, Enter to select, Escape to close
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {isOpen &&
          query &&
          filteredStocks.length === 0 &&
          !isLoading &&
          !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-8 text-center"
            >
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No stocks found
              </h3>
              <p className="text-gray-600">
                Try searching for a stock symbol (e.g., AAPL) or company name
                (e.g., Apple)
              </p>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};


const StockNewsPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [activeTab, setActiveTab] = useState("general");
  const [error, setError] = useState<string>("");

  const categories = [
    { value: "general", label: "General Market", icon: Globe },
    { value: "forex", label: "Forex", icon: TrendingUp },
    { value: "crypto", label: "Crypto", icon: Building },
    { value: "merger", label: "M&A", icon: Building },
  ];

 
  const loadNews = useCallback(
    async (symbol?: string, category?: string) => {
      setLoading(true);
      setError("");
      try {
      
        const newsData = await fetchStockNews(
          symbol,
          category || selectedCategory
        );
        setNews(newsData);
      } catch (error) {
        console.error("Failed to load news:", error);
        setError("Failed to load news. Please try again later.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );


  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    loadNews(stock.symbol);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveTab(category);
    setSelectedStock(null);
    loadNews(undefined, category);
  };

  const handleRefresh = () => {
    loadNews(selectedStock?.symbol, selectedCategory);
  };

  const clearSearch = () => {
    setSelectedStock(null);
    setError("");
    loadNews(undefined, selectedCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Stock News Dashboard
          </h1>
          <p className="text-slate-600">
            Stay updated with the latest market news and company updates
          </p>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Search & Filter
              </h2>
            </div>

            <div className="space-y-6">
             
              <div className="flex gap-3">
                <div className="flex-1">
                  <StockSearchBar
                    onSelectStock={handleStockSelect}
                    placeholder="Search for stocks (e.g., AAPL, Tesla, Microsoft...)"
                    className="max-w-none"
                  />
                </div>
                <div className="flex gap-2">
                  {selectedStock && (
                    <button
                      onClick={clearSearch}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>
              </div>

             
              <div className="border-b border-gray-200">
                <div className="flex space-x-8">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeTab === category.value;
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

             
              {selectedStock && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900">
                            {selectedStock.symbol}
                          </span>
                          <span className="text-sm text-blue-700">
                            ${selectedStock.price.toFixed(2)}
                          </span>
                          <span
                            className={`text-sm flex items-center gap-1 ${
                              selectedStock.change >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedStock.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {selectedStock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {selectedStock.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      {error}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {news.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                  }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                 
                  {article.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.headline}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                         
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}

                  
                  <div className="p-6">
                   
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">
                          {article.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatNewsDate(article.datetime)}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {article.headline}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>

                    
                    <div className="flex items-center justify-between">
                      {article.related && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {article.related}
                          </span>
                        </div>
                      )}

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                      >
                        Read More
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && news.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No news available
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedStock
                  ? `No recent news found for ${selectedStock.symbol}`
                  : "No news articles found for the selected category"}
              </p>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh News
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StockNewsPage;
