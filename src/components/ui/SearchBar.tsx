"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  TrendingDown,
  X,
  Building2,
  DollarSign,
  Loader2,
} from "lucide-react";
import {
  searchStocks,
  getPopularStocks,
  Stock,
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
          const popularStocks = await getPopularStocks();
          setFilteredStocks(popularStocks.slice(0, 8));
        } catch (err) {
          setError("Failed to load popular stocks");
          setFilteredStocks([]);
        } finally {
          setIsLoading(false);
        }
      } else if (searchQuery.length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await searchStocks(searchQuery);
          setFilteredStocks(results.slice(0, 10));
        } catch (err) {
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
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
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

      {/* Dropdown Results */}
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
              {/* Header */}
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

              {/* Loading State */}
              {isLoading && (
                <div className="px-4 py-8 text-center">
                  <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
                  <p className="text-gray-600">Searching stocks...</p>
                </div>
              )}

              {/* Error State */}
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

              {/* Stock Results */}
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
                      key={stock.symbol}
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
                              {(stock.region || stock.currency) && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {stock.region}{" "}
                                  {stock.currency && `• ${stock.currency}`}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm truncate max-w-xs">
                              {stock.name}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Price Info */}
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

            {/* Footer */}
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

      {/* No Results */}
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

export default StockSearchBar;
