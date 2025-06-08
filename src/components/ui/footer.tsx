'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  TrendingUp, 
  Github, 
  ExternalLink, 

  Twitter, 
  Linkedin,
  ArrowUp,
  BarChart3,
  Database,
  Shield
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "API Docs", href: "https://www.alphavantage.co/documentation/", external: true },
  { name: "GitHub", href: "https://github.com/yourusername/stock-scope", external: true },
  { name: "About", href: "#about" },
];

const footerSections: FooterSection[] = [
  {
    title: "Navigation",
    links: navItems
  },
  {
    title: "Features",
    links: [
      { name: "Stock Search", href: "#stock-search" },
      { name: "Price Charts", href: "#charts" },
      { name: "Market News", href: "#news" },
      { name: "Technical Analysis", href: "#analysis" },
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Market Data", href: "#market-data" },
      { name: "Trading Guide", href: "#guide" },
      { name: "FAQ", href: "#faq" },
      { name: "Support", href: "#support" },
    ]
  }
];

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/yourusername/stock-scope", icon: Github },
];

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400 mr-2" />
              <h3 className="text-2xl font-bold">StockScope</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Professional stock research dashboard providing real-time market data, 
              charts, and insights. No login required - start analyzing stocks instantly.
            </p>
            
            {/* Key Features */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                Real-time Stock Data
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Database className="h-4 w-4 mr-2 text-blue-400" />
                Alpha Vantage API
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                No Registration Required
              </div>
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section,) => (
            <motion.div 
              key={section.title} 
              variants={itemVariants}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm block"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest market insights and feature updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2024 StockScope. All rights reserved. Market data provided by Alpha Vantage.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                );
              })}
              
              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all duration-200"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-950 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 text-center">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute financial advice. 
            Always do your own research and consult with financial professionals before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;