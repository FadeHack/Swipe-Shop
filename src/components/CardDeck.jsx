import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import ProductCard from './ProductCard';

const CardDeck = forwardRef(({ products, onSwipe }, ref) => {
  // State to track the current stack of products
  const [stack, setStack] = useState([]);
  // Reference to the top card
  const [topCardRef, setTopCardRef] = useState(null);
  // State to track if we've shown all products
  const [showingEmptyState, setShowingEmptyState] = useState(false);
  
  // Number of cards to show in stack at once
  const VISIBLE_STACK_SIZE = 3;
  
  // Initialize stack on first render
  useEffect(() => {
    // Load initial stack of cards
    resetStack();
  }, []);

  // Stable triggerSwipe function that doesn't recreate on every render
  const triggerSwipe = useCallback((direction) => {
    if (topCardRef && topCardRef.triggerSwipe && stack.length > 0) {
      topCardRef.triggerSwipe(direction);
    }
  }, [topCardRef, stack.length]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    triggerSwipe
  }), [triggerSwipe]);
  
  // Reset the stack to show the first set of cards
  const resetStack = useCallback(() => {
    setShowingEmptyState(false);
    setStack(products.slice(0, products.length));
  }, [products]);
  
  // Handle swipe actions
  const handleSwipe = useCallback((direction, productId) => {
    // Remove the swiped card from the stack and check if it will be empty
    setStack(prevStack => {
      const newStack = prevStack.filter(product => product.id !== productId);
      
      // If stack will be empty after this swipe, set empty state
      if (newStack.length === 0) {
        setShowingEmptyState(true);
      }
      
      return newStack;
    });
    
    // Call external handler if provided
    if (onSwipe) {
      onSwipe(direction, productId);
    }
  }, [onSwipe]);

  // Update top card reference when needed
  const setTopCard = useCallback((cardRef) => {
    if (cardRef) {
      setTopCardRef(cardRef);
    }
  }, []);

  // Show message when no cards are left
  if (stack.length === 0 || showingEmptyState) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">All products viewed!</h2>
          <p className="text-gray-600 mb-6">You've seen all available products.</p>
          <button 
            onClick={resetStack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Only render the visible stack (limited number of cards for performance) */}
      {stack.slice(0, VISIBLE_STACK_SIZE).map((product, index) => (
        <ProductCard
          key={`deck-${product.id}-${index}`}
          product={product}
          index={index}
          totalCards={stack.length}
          onSwipe={handleSwipe}
          setCardRef={index === 0 ? setTopCard : null}
        />
      ))}
    </div>
  );
});

CardDeck.displayName = 'CardDeck';

export default CardDeck;
