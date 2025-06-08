"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  Search, 
  TrendingUp, 
  BarChart3, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." }
  ];

  const quickLinks = [
    { 
      title: "Market Overview", 
      description: "View today's market performance",
      icon: TrendingUp,
      href: "/market"
    },
    { 
      title: "Stock Screener", 
      description: "Find stocks based on criteria",
      icon: Search,
      href: "/screener"
    },
    { 
      title: "Portfolio", 
      description: "Track your investments",
      icon: BarChart3,
      href: "/portfolio"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div 
          className="text-center space-y-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Animated 404 */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block"
            >
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </div>
            </motion.div>
            
            {/* Floating icons */}
            <motion.div
              className="absolute -top-4 -left-4 text-blue-500"
              animate={{ 
                rotate: 360,
                y: [-5, 5, -5]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <TrendingUp size={32} />
            </motion.div>
            
            <motion.div
              className="absolute -top-2 -right-8 text-purple-500"
              animate={{ 
                rotate: -360,
                y: [5, -5, 5]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <BarChart3 size={28} />
            </motion.div>
          </motion.div>

          {/* Error message */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
              <AlertCircle size={20} />
              <h1 className="text-2xl md:text-3xl font-semibold">
                Page Not Found
              </h1>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              The stock data you're looking for seems to have moved to a different market. 
              Let's get you back on track!
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div variants={fadeInUp} className="max-w-md mx-auto">
            <Card className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-0">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      placeholder="Search for stocks (e.g., AAPL, GOOGL)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        window.location.href = `/stock/${searchQuery.toUpperCase()}`;
                      }
                    }}
                  >
                    <Search size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular stocks */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">
              Or try these popular stocks:
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {popularStocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  {...scaleOnHover}
                >
                  <Link href={`/stock/${stock.symbol}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                    >
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {stock.symbol}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1 hidden sm:inline">
                        {stock.name}
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">
              Quick Navigation:
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  {...scaleOnHover}
                >
                  <Link href={link.href}>
                    <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-0 text-center space-y-2">
                        <div className="flex justify-center">
                          <link.icon 
                            size={24} 
                            className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" 
                          />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                          {link.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {link.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Home button */}
          <motion.div variants={fadeInUp}>
            <Link href="/">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg"
                >
                  <Home size={20} className="mr-2" />
                  Back to Stock Scope
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}