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
      description: "View todays market performance",
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
              The stock data you&apos;re looking for seems to have moved to a different market. 
              Let's get you back on track!
            </p>
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