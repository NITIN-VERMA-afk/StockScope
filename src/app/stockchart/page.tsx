"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import StockSearchBar from "@/components/ui/SearchBar";
import { Stock } from "@/lib/featchStockData";
import StockChart from "@/components/StockChart";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StockChartPage = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="w-full px-4 pt-20 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StockSearchBar onSelectStock={handleSelectStock} />
      </motion.div>

      <div className="mt-8">
        <Card className="bg-muted">
          <CardContent className="p-6">
            {selectedStock ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold text-primary mb-1">
                    {selectedStock.symbol} - {selectedStock.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Region: {selectedStock.region}, Currency:{" "}
                    {selectedStock.currency}
                  </p>
                </motion.div>

                <Separator className="my-4" />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StockChart symbol={selectedStock.symbol} />
                </motion.div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Select a stock to view the chart.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockChartPage;

