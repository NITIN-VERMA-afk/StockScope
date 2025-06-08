"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Home,
  TrendingUp,
  BarChart3,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function NotFound() {
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          className="text-center space-y-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div className="relative" variants={fadeInUp}>
            <motion.div animate={floatingAnimation} className="inline-block">
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -left-4 text-blue-500"
              animate={{
                rotate: 360,
                y: [-5, 5, -5],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <TrendingUp size={32} />
            </motion.div>

            <motion.div
              className="absolute -top-2 -right-8 text-purple-500"
              animate={{
                rotate: -360,
                y: [5, -5, 5],
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <BarChart3 size={28} />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
              <AlertCircle size={20} />
              <h1 className="text-2xl md:text-3xl font-semibold">
                Page Not Found
              </h1>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              The stock data you&apos;re looking for seems to have moved to a
              different market. Let&apos;s get you back on track!
            </p>
          </motion.div>

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
