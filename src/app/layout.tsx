import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { ReduxProvider } from "@/lib/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Stock Scope - Real-Time Stock Analysis & Market Trends",
    template: "%s | Stock Scope"
  },
  description: "Analyze stocks with real-time data, interactive charts, market trends, and latest financial news. Your comprehensive stock market research platform.",
  keywords: [
    "stock analysis",
    "stock market",
    "financial charts",
    "market trends",
    "stock news",
    "investment research",
    "real-time quotes",
    "financial data",
    "stock screener"
  ],
  authors: [{ name: "Stock Scope Team" }],
  creator: "Stock Scope",
  publisher: "Stock Scope",
  applicationName: "Stock Scope",
  category: "Finance",
  classification: "Financial Analysis Tool",
  
  
  openGraph: {
    type: "website",
    siteName: "Stock Scope",
    title: "Stock Scope - Real-Time Stock Analysis & Market Trends",
    description: "Search stocks, analyze trends, view interactive charts, and stay updated with the latest market news.",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Stock Scope - Stock Market Analysis Platform"
      }
    ],
    locale: "en_US",
  },

  
  twitter: {
    card: "summary_large_image",
    title: "Stock Scope - Real-Time Stock Analysis & Market Trends",
    description: "Search stocks, analyze trends, view interactive charts, and stay updated with the latest market news.",
    images: ["/twitter-image.jpg"],
    creator: "@stockscope", 
  },

  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

 
  verification: {
    google: "your-google-verification-code",
   
  },

  
  manifest: "/manifest.json", 
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000", 
      },
    ],
  },
  
  // Theme and viewport
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },


  alternates: {
    canonical: "https://stockscope.com", 
    languages: {
      "en-US": "https://stockscope.com",
      // Add other languages as needed
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
       
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
       
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Stock Scope",
              "applicationCategory": "FinanceApplication",
              "description": "Real-time stock analysis platform with charts, trends, and financial news",
              "url": "", 
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Real-time stock quotes",
                "Interactive charts",
                "Market trend analysis",
                "Financial news",
                "Stock screening"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
