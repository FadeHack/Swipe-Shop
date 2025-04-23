import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, cartCount, updateCartItemQuantity } = useShop();

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const calculateTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.discountPercentage > 0) {
        const savings = (item.originalPrice - item.price) * (item.quantity || 1);
        return total + savings;
      }
      return total;
    }, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.12; // 12% tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              to="/"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Takes 2/3 of space on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items ({cartItems.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear Cart
                </button>
              </div>
              
              <motion.div 
                className="mb-2 space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={`cart-${item.id}-${index}`}
                      className="flex flex-wrap sm:flex-nowrap items-center bg-white rounded-lg p-4 border border-gray-100 hover:border-indigo-100 transition-colors overflow-hidden"
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                    >
                      {/* Item image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 mb-3 sm:mb-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Item details */}
                      <div className="flex-grow min-w-0 ml-0 sm:ml-4">
                        <div className="flex justify-between mb-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate max-w-[60vw] sm:max-w-xs">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3 min-w-0">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium break-all truncate max-w-[50vw] sm:max-w-[160px]">{item.brand}</span>
                          {item.discountPercentage > 0 && (
                            <span className="ml-2 bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs font-medium break-all truncate max-w-[40vw] sm:max-w-[120px]">
                              {item.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                        
                        {/* Quantity controls */}
                        <div className="flex flex-wrap items-center mt-2 mb-1">
                          <span className="text-sm text-gray-600 mr-2">Quantity:</span>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCartItemQuantity(item.id, (item.quantity || 1) - 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center font-medium text-gray-700">
                              {item.quantity || 1}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCartItemQuantity(item.id, (item.quantity || 1) + 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right min-w-0">
                          <div className="text-lg font-bold text-indigo-600 break-words">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </div>
                          {item.discountPercentage > 0 && (
                            <div className="text-xs text-gray-400 line-through break-words">
                              {formatPrice(item.originalPrice * (item.quantity || 1))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Continue shopping link */}
            <Link 
              to="/shop"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Continue Shopping
            </Link>
          </div>
          
          {/* Order Summary - Takes 1/3 of space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-800">Free</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (12%)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(calculateTax())}</span>
                </div>
                {calculateTotalSavings() > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>You Saved</span>
                    <span className="font-semibold">{formatPrice(calculateTotalSavings())}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <div className="flex justify-between text-gray-800">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
              
              {/* Promo code input */}
              <div className="mb-6">
                <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex">
                  <input
                    type="text"
                    id="promo"
                    className="flex-1 rounded-l-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter code"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-r-lg hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              
              {/* Checkout button */}
              <button className="w-full py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Proceed to Checkout
              </button>
              
              {/* Payment methods */}
              <div className="mt-6 flex items-center justify-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6" />
              </div>
              
              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center text-gray-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
