import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import CardDeck from '../components/CardDeck';
import { products } from '../data/products';

const ShoppingPage = () => {
  const deckRef = useRef(null);
  const { handleSwipe: contextHandleSwipe } = useShop();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Function to handle swipe actions - now using the context
  const handleSwipe = (direction, productId) => {
    // Find the product and pass it to context
    const product = products.find(p => p.id === productId);
    if (product) {
      contextHandleSwipe(direction, product);
      
      // Show toast notification based on direction
      showToastNotification(direction);
    }
  };

  // Show toast notification
  const showToastNotification = (action) => {
    let message = '';
    let type = '';
    
    switch(action) {
      case 'left':
        message = 'Product passed';
        type = 'pass';
        break;
      case 'right':
        message = 'Added to wishlist';
        type = 'like';
        break;
      case 'up':
        message = 'Added to cart';
        type = 'cart';
        break;
      default:
        return;
    }
    
    setToast({ show: true, message, type });
    
    // Hide toast after 2 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 2000);
  };

  // Button handlers to trigger programmatic swipes
  const handleSwipeLeft = () => {
    if (deckRef.current) {
      deckRef.current.triggerSwipe('left');
      showToastNotification('left');
    }
  };

  const handleSwipeUp = () => {
    if (deckRef.current) {
      deckRef.current.triggerSwipe('up');
      showToastNotification('up');
    }
  };

  const handleSwipeRight = () => {
    if (deckRef.current) {
      deckRef.current.triggerSwipe('right');
      showToastNotification('right');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Premium background with subtle patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full border border-indigo-200/20 opacity-60"></div>
        <div className="absolute bottom-60 right-10 w-60 h-60 rounded-full border border-purple-200/20 opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full border border-indigo-200/30 opacity-40"></div>
      </div>

      {/* Main content wrapper with increased size for cards */}
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Title at the top */}
        <motion.h1 
          className="text-2xl sm:text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Products
        </motion.h1>
        
        {/* Card deck area with responsive sizing */}
        <div className="w-full max-w-md md:max-w-lg h-[60vh] md:h-[550px] flex items-center justify-center relative">
          <motion.div 
            className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
          
          {/* Card deck - Enhanced size and prominence */}
          <div className="w-full h-full relative overflow-hidden rounded-2xl">
            <CardDeck ref={deckRef} products={products} onSwipe={handleSwipe} />
          </div>
        </div>
        
        {/* Control buttons - Premium design with labels */}
        <motion.div 
          className="mt-8 mb-4 flex justify-center items-center gap-6 sm:gap-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Pass Button */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.button 
              onClick={handleSwipeLeft}
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white text-red-500 shadow-lg border border-gray-100 hover:bg-red-50 active:scale-95 transition-all duration-200 relative group"
              aria-label="Pass"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            <span className="mt-2 text-xs font-medium text-gray-600">Skip</span>
          </motion.div>
          
          {/* Add to Cart Button - Larger size */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.button 
              onClick={handleSwipeUp}
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl border border-indigo-200 hover:shadow-indigo-200/50 active:scale-95 transition-all duration-200 relative"
              aria-label="Add to cart"
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
              <div className="absolute -inset-1 rounded-full bg-blue-400/20 animate-pulse"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.button>
            <span className="mt-2 text-xs font-medium text-gray-600">Add to Cart</span>
          </motion.div>
          
          {/* Like Button */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.button 
              onClick={handleSwipeRight}
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white text-green-500 shadow-lg border border-gray-100 hover:bg-green-50 active:scale-95 transition-all duration-200 relative group"
              aria-label="Like"
            >
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            <span className="mt-2 text-xs font-medium text-gray-600">Like</span>
          </motion.div>
        </motion.div>
        
        {/* Simple swipe instructions */}
        <motion.p 
          className="text-center text-xs text-gray-500 mb-2 opacity-70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
        >
          Swipe cards or use buttons to browse products
        </motion.p>
      </div>
      
      {/* Toast notification - Enhanced */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-base
              ${toast.type === 'like' ? 'bg-emerald-500 text-white' : toast.type === 'pass' ? 'bg-red-500 text-white' : toast.type === 'cart' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}
              border border-white/20
              max-w-[90vw] sm:max-w-xs
              animate-toast-pop
            `}
            initial={{ opacity: 0, y: -30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
          >
            {toast.type === 'pass' && (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            {toast.type === 'like' && (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            )}
            {toast.type === 'cart' && (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
            )}
            <span className="font-medium text-xs">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast pop animation (Tailwind custom) */}
      <style>{`
        @keyframes toast-pop {
          0% { transform: translateY(-20px) scale(0.97); opacity: 0; }
          60% { transform: translateY(0) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-toast-pop {
          animation: toast-pop 0.5s cubic-bezier(.4,2,.3,1) both;
        }
      `}</style>
    </div>
  );
};

export default ShoppingPage;
