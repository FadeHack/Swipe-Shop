import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Shopping background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-purple-800/70 to-black/70"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={loaded ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <div className="flex justify-center mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-300 text-6xl font-extrabold mb-2">
                SwipeShop
              </span>
            </div>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full mb-6"></div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover. Swipe. Shop.
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            A new way to discover products you'll love. Swipe right to like, left to pass, 
            and up to add directly to your cart.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/shop">
              <motion.button 
                className="px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Shopping
              </motion.button>
            </Link>
            <Link to="/likes">
              <motion.button 
                className="px-8 py-4 text-lg font-medium rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 transform transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                View Wishlist
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: Math.random() * 40 + 5,
                height: Math.random() * 40 + 5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -150 - 50],
                opacity: [0.1, 0.3, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Footer */}
        <motion.div 
          className="absolute bottom-8 left-0 w-full text-center text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p>© {new Date().getFullYear()} SwipeShop. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
