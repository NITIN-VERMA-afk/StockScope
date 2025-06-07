// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   TrendingUp, 
//   BarChart3, 
//   Activity,
//   DollarSign,
//   Building2,
//   LineChart,
//   PieChart,
//   Loader2
// } from 'lucide-react';


// const StockLoadingAnimation = ({ 
//   variant = 'default', 
//   size = 'medium',
//   message = 'Loading...',
//   showMessage = true 
// }) => {
//   const [currentIcon, setCurrentIcon] = useState(0);
//   const icons = [TrendingUp, BarChart3, Activity, DollarSign, Building2, LineChart, PieChart];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIcon((prev) => (prev + 1) % icons.length);
//     }, 800);
//     return () => clearInterval(interval);
//   }, []);

//   const sizeClasses = {
//     small: 'w-8 h-8',
//     medium: 'w-12 h-12',
//     large: 'w-16 h-16',
//     xl: 'w-24 h-24'
//   };

//   const containerSizes = {
//     small: 'p-4',
//     medium: 'p-6',
//     large: 'p-8',
//     xl: 'p-12'
//   };

//   if (variant === 'pulse') {
//     return (
//       <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
//         <motion.div
//           className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center`}
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.7, 1, 0.7]
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         >
//           <TrendingUp className="w-1/2 h-1/2 text-white" />
//         </motion.div>
//         {showMessage && (
//           <motion.p
//             className="mt-4 text-gray-600 font-medium"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//           >
//             {message}
//           </motion.p>
//         )}
//       </div>
//     );
//   }

//   if (variant === 'bars') {
//     return (
//       <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
//         <div className="flex items-end space-x-2">
//           {[0, 1, 2, 3, 4].map((i) => (
//             <motion.div
//               key={i}
//               className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
//               style={{ width: '8px' }}
//               animate={{
//                 height: ['20px', '40px', '20px']
//               }}
//               transition={{
//                 duration: 1,
//                 repeat: Infinity,
//                 delay: i * 0.2,
//                 ease: "easeInOut"
//               }}
//             />
//           ))}
//         </div>
//         {showMessage && (
//           <motion.p
//             className="mt-4 text-gray-600 font-medium"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//           >
//             {message}
//           </motion.p>
//         )}
//       </div>
//     );
//   }

//   if (variant === 'chart') {
//     return (
//       <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
//         <div className="relative">
//           <svg width="80" height="50" viewBox="0 0 80 50">
//             <motion.polyline
//               points="5,45 15,35 25,40 35,20 45,25 55,10 65,15 75,5"
//               fill="none"
//               stroke="url(#gradient)"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               initial={{ pathLength: 0 }}
//               animate={{ pathLength: 1 }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
//                 <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//         {showMessage && (
//           <motion.p
//             className="mt-4 text-gray-600 font-medium"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//           >
//             {message}
//           </motion.p>
//         )}
//       </div>
//     );
//   }

//   if (variant === 'spinning-icons') {
//     const CurrentIcon = icons[currentIcon];
//     return (
//       <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
//         <motion.div
//           key={currentIcon}
//           className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center`}
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           exit={{ scale: 0, rotate: 180 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           <CurrentIcon className="w-1/2 h-1/2 text-white" />
//         </motion.div>
//         {showMessage && (
//           <motion.p
//             className="mt-4 text-gray-600 font-medium"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//           >
//             {message}
//           </motion.p>
//         )}
//       </div>
//     );
//   }

//   // Default variant - rotating circles
//   return (
//     <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
//       <div className="relative">
//         <motion.div
//           className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full`}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         />
//         <motion.div
//           className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-500 rounded-full`}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <TrendingUp className="w-1/2 h-1/2 text-blue-500" />
//         </div>
//       </div>
//       {showMessage && (
//         <motion.p
//           className="mt-4 text-gray-600 font-medium"
//           animate={{ opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//         >
//           {message}
//         </motion.p>
//       )}
//     </div>
//   );
// };

// // Full Page Loading Overlay
// const FullPageLoader = ({ isVisible = true, message = "Loading stock data..." }) => {
//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
//         >
//           <div className="text-center">
//             <StockLoadingAnimation 
//               variant="spinning-icons" 
//               size="xl" 
//               message={message}
//             />
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // Skeleton Loading for Stock Cards
// const StockCardSkeleton = () => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
//           <div>
//             <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
//             <div className="w-32 h-3 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="w-20 h-6 bg-gray-200 rounded mb-2"></div>
//           <div className="w-16 h-4 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//       <div className="h-32 bg-gray-200 rounded-lg"></div>
//     </div>
//   );
// };

// // Demo Component showing all variants
// const LoadingAnimationDemo = () => {
//   const [currentDemo, setCurrentDemo] = useState('default');
//   const [showFullPage, setShowFullPage] = useState(false);

//   const variants = [
//     { key: 'default', name: 'Default Spinner', message: 'Loading stocks...' },
//     { key: 'pulse', name: 'Pulse', message: 'Fetching data...' },
//     { key: 'bars', name: 'Chart Bars', message: 'Analyzing market...' },
//     { key: 'chart', name: 'Line Chart', message: 'Loading chart...' },
//     { key: 'spinning-icons', name: 'Spinning Icons', message: 'Processing...' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Stock App Loading Animations
//           </h1>
//           <p className="text-xl text-gray-600">
//             Beautiful loading animations for your stock trading application
//           </p>
//         </div>

//         {/* Variant Selector */}
//         <div className="flex flex-wrap justify-center gap-3 mb-12">
//           {variants.map((variant) => (
//             <button
//               key={variant.key}
//               onClick={() => setCurrentDemo(variant.key)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 currentDemo === variant.key
//                   ? 'bg-blue-500 text-white shadow-lg'
//                   : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
//               }`}
//             >
//               {variant.name}
//             </button>
//           ))}
//           <button
//             onClick={() => setShowFullPage(true)}
//             className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200"
//           >
//             Full Page Overlay
//           </button>
//         </div>

//         {/* Current Demo */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//           {['small', 'medium', 'large'].map((size) => (
//             <div key={size} className="bg-white rounded-xl shadow-lg p-8 text-center">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
//                 {size} Size
//               </h3>
//               <StockLoadingAnimation
//                 variant={currentDemo}
//                 size={size}
//                 message={variants.find(v => v.key === currentDemo)?.message}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Skeleton Loading Demo */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//             Skeleton Loading for Stock Cards
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => (
//               <StockCardSkeleton key={i} />
//             ))}
//           </div>
//         </div>

//         {/* Usage Examples */}
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
//           <div className="space-y-4 text-gray-700">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Basic Usage:</h3>
//               <code className="text-sm">
//                 {`<StockLoadingAnimation variant="default" size="medium" message="Loading..." />`}
//               </code>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Full Page Overlay:</h3>
//               <code className="text-sm">
//                 {`<FullPageLoader isVisible={loading} message="Fetching stock data..." />`}
//               </code>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Skeleton Loading:</h3>
//               <code className="text-sm">
//                 {`<StockCardSkeleton />`}
//               </code>
//             </div>
//           </div>
//         </div>

//         {/* Available Variants */}
//         <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Variants</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {variants.map((variant) => (
//               <div key={variant.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs font-bold">
//                     {variant.key.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{variant.name}</p>
//                   <p className="text-sm text-gray-600">{variant.message}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Full Page Loader */}
//       <FullPageLoader 
//         isVisible={showFullPage} 
//         message="Demonstrating full page loading..."
//       />
      
//       {showFullPage && (
//         <button
//           onClick={() => setShowFullPage(false)}
//           className="fixed top-4 right-4 z-[60] bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//         >
//           Close Overlay
//         </button>
//       )}
//     </div>
//   );
// };

// export default LoadingAnimationDemo;