import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ShopContext = createContext();

// Custom hook to use the context
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  // State for cart items - now with quantity tracking
  const [cartItems, setCartItems] = useState([]);
  
  // State for liked items
  const [likedItems, setLikedItems] = useState([]);
  
  // Load items from localStorage on initial render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('swipeshop-cart') || '[]');
    const savedLikes = JSON.parse(localStorage.getItem('swipeshop-likes') || '[]');
    
    setCartItems(savedCart);
    setLikedItems(savedLikes);
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('swipeshop-cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    localStorage.setItem('swipeshop-likes', JSON.stringify(likedItems));
  }, [likedItems]);
  
  // Add item to cart with quantity tracking
  const addToCart = (product) => {
    // Check if already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      const updatedItems = [...cartItems];
      if (!updatedItems[existingItemIndex].quantity) {
        // Add quantity property if it doesn't exist
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: 1
        };
      }
      updatedItems[existingItemIndex].quantity = (updatedItems[existingItemIndex].quantity || 1) + 1;
      setCartItems(updatedItems);
    } else {
      // Item doesn't exist, add to cart with quantity 1
      setCartItems(prev => [...prev, {...product, quantity: 1}]);
      
      // Remove from likes if it exists there
      const isLiked = likedItems.some(item => item.id === product.id);
      if (isLiked) {
        removeFromLikes(product.id);
      }
    }
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  
  // Add item to likes
  const addToLikes = (product) => {
    // Don't add to likes if already in cart
    const inCart = cartItems.some(item => item.id === product.id);
    if (inCart) {
      return;
    }
    
    // Check if already liked
    const exists = likedItems.some(item => item.id === product.id);
    if (!exists) {
      setLikedItems(prev => [...prev, product]);
    }
  };
  
  // Remove item from likes
  const removeFromLikes = (productId) => {
    setLikedItems(prev => prev.filter(item => item.id !== productId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Update item quantity
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or negative
      removeFromCart(productId);
      return;
    }
    
    // Update quantity
    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
  };
  
  // Handle swipe actions
  const handleSwipe = (direction, product) => {
    if (direction === 'right') {
      addToLikes(product);
    } else if (direction === 'up') {
      addToCart(product);
    }
  };
  
  // Calculate total items in cart (accounting for quantities)
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  return (
    <ShopContext.Provider value={{
      cartItems,
      likedItems,
      addToCart,
      removeFromCart,
      addToLikes, 
      removeFromLikes,
      clearCart,
      handleSwipe,
      updateCartItemQuantity,
      cartCount,
      likesCount: likedItems.length
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
