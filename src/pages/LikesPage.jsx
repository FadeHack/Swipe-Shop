import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const LikesPage = () => {
  const { likedItems, removeFromLikes, addToCart, cartItems } = useShop();
  const [addedToCartIds, setAddedToCartIds] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showToast, setShowToast] = useState(false);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  // Check if an item is already in the cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Handle adding to cart with feedback
  const handleAddToCart = (product) => {
    // Add to cart and remove from likes
    addToCart(product);
    removeFromLikes(product.id);
    
    // Show item-specific indicator
    setAddedToCartIds(prev => ({
      ...prev,
      [product.id]: true
    }));
    
    // Show global toast
    setShowToast(true);
    
    // Hide indicators after delay
    setTimeout(() => {
      setAddedToCartIds(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filteredItems = [...likedItems];
    
    // Apply filters
    if (activeFilter === 'discounted') {
      filteredItems = filteredItems.filter(item => item.discountPercentage > 0);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filteredItems.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filteredItems.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        // Default sorting (by recently added)
        break;
    }
    
    return filteredItems;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 }
  };

  // Filtered and sorted items
  const filteredAndSortedItems = getFilteredAndSortedItems();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Your Wishlist</h1>
        <p className="text-gray-600 text-center max-w-2xl">
          Here are all the products you've liked. Add them to your cart or browse through your personalized collection.
        </p>
      </div>
      
      {likedItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-pink-100 rounded-full blur-lg opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Swipe right on products you like to add them to your wishlist!</p>
            <Link 
              to="/shop"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors inline-block"
            >
              Discover Products
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls - Filter and Sort */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Filter:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeFilter === 'all' 
                        ? 'bg-white shadow-sm text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    All Items
                  </button>
                  <button 
                    onClick={() => setActiveFilter('discounted')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeFilter === 'discounted' 
                        ? 'bg-white shadow-sm text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Discounted
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 border-0 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="default">Recently Added</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>
          </div>
        
          {/* Item count and continue shopping link */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 font-medium">
              <span className="text-indigo-600 font-semibold">{filteredAndSortedItems.length}</span> items in your wishlist
            </p>
            <Link to="/shop" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        
          {/* Product Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredAndSortedItems.map(item => (
                <motion.div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden relative group"
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Discount badge */}
                    {item.discountPercentage > 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        {item.discountPercentage}% OFF
                      </div>
                    )}
                    
                    {/* Remove button - increased z-index and improved positioning */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        removeFromLikes(item.id);
                      }}
                      className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors z-30"
                      aria-label="Remove from likes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <button 
                        onClick={() => handleAddToCart(item)}
                        disabled={isInCart(item.id)}
                        className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          isInCart(item.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        {isInCart(item.id) ? 'Added to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-1">
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-800 rounded-full">{item.brand}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">{item.name}</h3>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">{formatPrice(item.price)}</span>
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative
                          ${isInCart(item.id) 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                        disabled={isInCart(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        
                        {/* Show a checkmark if already in cart */}
                        {isInCart(item.id) && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Added to cart notification */}
                  <AnimatePresence>
                    {addedToCartIds[item.id] && (
                      <motion.div
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={notificationVariants}
                      >
                        Added to cart!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        
          {/* Toast notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-5 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 border border-gray-100"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={notificationVariants}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Added to cart</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default LikesPage;
