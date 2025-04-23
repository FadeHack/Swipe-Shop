import { useState, useEffect, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
import { animated, useSpring, to, config } from 'react-spring';
import { useDrag } from '@use-gesture/react';

const ProductCard = forwardRef(({ product, onSwipe, index, totalCards, setCardRef }, ref) => {
  const [gone, setGone] = useState(false);
  const [direction, setDirection] = useState(null); // Track current swipe direction
  
  // Format price to currency display
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  // Calculate discount
  const hasDiscount = product.discountPercentage > 0;
  
  // Create a stable rotation value for each card based on its ID to prevent flickering
  const stackRotation = useMemo(() => {
    // Use product ID to create a consistent rotation
    if (index === 0) return 0;
    return (product.id % 2 === 0 ? -1 : 1) * (product.id % 3 + 1);
  }, [index, product.id]);

  // Generate springs for the card animation with smoother transitions and more visible movement
  const [{ x, y, rot, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    config: { friction: 25, tension: 200, mass: 1 } // Lower friction for more visible movement
  }));
  
  // Additional springs for animations
  const cardIntro = useSpring({
    from: { opacity: 0, transform: 'scale(0.9) translateY(40px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0)' },
    delay: index * 100,
    config: config.gentle
  });
  
  const contentAnim = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300 + index * 100,
    config: config.gentle
  });
  
  // Modified animation springs to make indicators more responsive
  const likeIndicator = useSpring({
    opacity: x.to(x => (x > 20 ? Math.min(1, x / 80) : 0)),
    transform: x.to(x => `scale(${(x > 20 ? 1 + Math.min(0.5, x / 200) : 0.8)})`),
    config: { tension: 300, friction: 20 }
  });
  
  const passIndicator = useSpring({
    opacity: x.to(x => (x < -20 ? Math.min(1, -x / 80) : 0)),
    transform: x.to(x => `scale(${(x < -20 ? 1 + Math.min(0.5, -x / 200) : 0.8)})`),
    config: { tension: 300, friction: 20 }
  });
  
  const cartIndicator = useSpring({
    opacity: y.to(y => (y < -20 ? Math.min(1, -y / 80) : 0)),
    transform: y.to(y => `scale(${(y < -20 ? 1 + Math.min(0.5, -y / 200) : 0.8)})`),
    config: { tension: 300, friction: 20 }
  });
  
  // Visual feedback based on swipe direction
  const cardBorderGlow = useSpring({
    boxShadow: to(
      [x, y, scale],
      (x, y, s) => {
        // Determine the color based on direction
        let color = 'rgba(0, 0, 0, 0.15)';
        if (x > 50) color = 'rgba(52, 211, 153, 0.7)'; // Green for like
        else if (x < -50) color = 'rgba(239, 68, 68, 0.7)'; // Red for pass
        else if (y < -50) color = 'rgba(59, 130, 246, 0.7)'; // Blue for cart
        
        // Base shadow + directional glow
        return `0 ${10 * s}px ${30 * s}px rgba(0, 0, 0, 0.15), 0 ${2 * s}px ${8 * s}px rgba(0, 0, 0, 0.1), 0 0 ${Math.max(0, Math.abs(x) / 5 || Math.abs(y) / 5)}px ${color}`;
      }
    )
  });

  // Handle programmatic swipe action - wrapped in useCallback to prevent infinite loops
  const handleSwipeAction = useCallback((direction) => {
    if (gone) return;
    
    setGone(true);
    setDirection(direction);
    
    if (direction === 'right') {
      api.start({ 
        x: window.innerWidth + 300, 
        rot: 45,  // Increased rotation for more dramatic effect
        config: { friction: 18, tension: 180, mass: 1.2, velocity: 2 }
      });
      onSwipe('right', product.id);
      console.log(`Liked Product ID: ${product.id}`);
    } else if (direction === 'left') {
      api.start({ 
        x: -window.innerWidth - 300, 
        rot: -45,  // Increased rotation for more dramatic effect
        config: { friction: 18, tension: 180, mass: 1.2, velocity: 2 }
      });
      onSwipe('left', product.id);
      console.log(`Passed Product ID: ${product.id}`);
    } else if (direction === 'up') {
      api.start({ 
        y: -window.innerHeight - 300,
        config: { friction: 18, tension: 180, mass: 1.2, velocity: 2 }
      });
      onSwipe('up', product.id);
      console.log(`Add to cart Product ID: ${product.id}`);
    }
  }, [api, gone, onSwipe, product.id]);

  // Create a stable ref object that doesn't change on every render
  const cardControlsRef = useMemo(() => ({
    triggerSwipe: handleSwipeAction
  }), [handleSwipeAction]);

  // Pass the ref to parent component if this is the top card
  useEffect(() => {
    if (setCardRef && index === 0) {
      setCardRef(cardControlsRef);
    }
  }, [setCardRef, index, cardControlsRef]);

  // Create drag binding with gesture handler with enhanced movement and feedback
  const bind = useDrag(({ active, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy], last }) => {
    // Log dragging state to debug
    console.log('Dragging:', { active, mx, my, vx, vy, last });
    
    // Add an amplification factor to make smaller movements more visible
    const amplify = 1.5; // Increased from 1.2 for more noticeable movement
    const amplifiedMx = mx * amplify;
    // Prevent downward drag (positive Y)
    const amplifiedMy = Math.min(my, 0) * amplify; // Clamp to 0 if dragging down
    
    // Update direction for visual feedback during drag
    if (active) {
      if (Math.abs(mx) > Math.abs(my)) {
        setDirection(mx > 0 ? 'right' : 'left');
      } else if (my < 0) {
        setDirection('up');
      } else {
        setDirection(null);
      }
    }
    
    // Determine the direction of the swipe and handle "gone" state
    const trigger = Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2 || Math.abs(mx) > 100 || Math.abs(my) > 100;
    
    if (!active && trigger) {
      setGone(true);
      
      // Determine swipe direction
      let swipeDirection;
      if (Math.abs(mx) > Math.abs(my)) {
        swipeDirection = mx > 0 ? 'right' : 'left';
      } else if (my < 0) {
        swipeDirection = 'up';
      } else {
        swipeDirection = null; // Down swipes are ignored
      }

      // Notify parent of swipe with enhanced exit animations
      if (swipeDirection === 'right') {
        api.start({ 
          x: window.innerWidth + 300,
          rot: 45, // More rotation for dramatic effect
          config: { friction: 18, tension: 180, velocity: Math.max(vx * 2, 2) } // More velocity
        });
        onSwipe('right', product.id);
        console.log(`Liked Product ID: ${product.id}`);
      } else if (swipeDirection === 'left') {
        api.start({ 
          x: -window.innerWidth - 300,
          rot: -45, // More rotation for dramatic effect
          config: { friction: 18, tension: 180, velocity: Math.max(-vx * 2, 2) } // More velocity
        });
        onSwipe('left', product.id);
        console.log(`Passed Product ID: ${product.id}`);
      } else if (swipeDirection === 'up') {
        api.start({ 
          y: -window.innerHeight - 300,
          config: { friction: 18, tension: 180, velocity: Math.max(-vy * 2, 2) } // More velocity
        });
        onSwipe('up', product.id);
        console.log(`Add to cart Product ID: ${product.id}`);
      } else {
        // Reset for down or invalid swipes
        api.start({ 
          x: 0, 
          y: 0, 
          rot: 0,
          config: { friction: 40, tension: 500 }
        });
        setDirection(null);
      }
    } else {
      // Enhanced rotation for more visible movement during dragging
      const rotationFactor = 7; // Reduced from 10 for more dramatic rotation
      
      // Apply more responsive spring changes during active dragging
      api.start({
        // Apply the amplified movement
        x: active ? amplifiedMx : 0,
        y: active ? amplifiedMy : 0,
        // More rotation during drag
        rot: active ? amplifiedMx / rotationFactor : 0,
        // More scale change for tactile feedback
        scale: active ? 1.05 + Math.abs(amplifiedMx) / 2000 : 1,
        config: { 
          friction: active ? 15 : 40, // Further reduced friction for more responsive movement
          tension: active ? 180 : 300,
          mass: active ? 0.7 : 1, // Lower mass for more responsive movement
        },
        // Critical change: do not use immediate mode for active dragging
        // This allows the Spring physics to activate during the drag
        immediate: false,
      });
      
      // Reset direction if returning to center
      if (last && !trigger) {
        setDirection(null);
      }
    }
  });

  // Render the card if it's not "gone"
  if (gone) return null;

  // Calculate stack position for cards below the top card
  const zIndex = totalCards - index;
  const stackOffset = index * 6; // Increased offset for stacked cards

  // Combined style object for the animated card
  const cardStyle = {
    ...cardIntro,
    // Pass x, y, and rotation directly to the transform style
    // This ensures they're applied correctly without overrides
    transform: to(
      [x, y, rot, scale],
      (x, y, r, s) => `translate3d(${x}px, ${y}px, 0) rotate(${r + stackRotation}deg) scale(${s})`
    ),
    zIndex,
    position: 'absolute',
    boxShadow: cardBorderGlow.boxShadow,
    transition: 'box-shadow 0.2s ease'
  };
  
  // Get border color based on direction for the active card
  const getBorderColor = () => {
    if (index !== 0) return '';
    
    if (direction === 'right') return 'border-emerald-400';
    if (direction === 'left') return 'border-red-400';
    if (direction === 'up') return 'border-blue-400';
    return '';
  };

  return (
    <animated.div
      {...bind()}
      style={cardStyle}
      className={`w-[300px] sm:w-[320px] md:w-[340px] h-[450px] sm:h-[480px] md:h-[520px] bg-white rounded-2xl overflow-hidden touch-none will-change-transform relative border-2 ${getBorderColor()}`}
    >
      <div className="relative h-full flex flex-col">
        {/* Product image with gradient overlay for better text visibility */}
        <div className="h-[65%] overflow-hidden bg-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Brand badge */}
          <animated.div 
            style={contentAnim}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase shadow-md text-indigo-800 border border-indigo-100 z-20"
          >
            {product.brand}
          </animated.div>
          
          {/* Discount badge */}
          {hasDiscount && (
            <animated.div 
              style={{
                ...contentAnim,
                transform: to([contentAnim.transform, scale], (t, s) => `${t} scale(${s * 1.1})`)
              }}
              className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md z-20 flex items-center gap-1"
            >
              <span className="text-sm">{product.discountPercentage}%</span> OFF
            </animated.div>
          )}
        </div>
        
        {/* Product details */}
        <animated.div 
          style={contentAnim}
          className="p-6 flex flex-col flex-grow h-[35%] bg-gradient-to-b from-white to-gray-50"
        >
          <h2 className="font-bold text-gray-800 capitalize text-xl mb-2 leading-tight line-clamp-2">{product.name}</h2>
          
          <div className="mt-auto">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mr-3">
                {formatPrice(product.price)}
              </span>
              
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </animated.div>
        
        {/* Swipe direction trail effect - enhanced for more visibility */}
        {index === 0 && direction && (
          <div className={`absolute inset-0 pointer-events-none z-20 ${
            direction === 'right' ? 'bg-gradient-to-l from-green-400/40 via-green-400/20 to-transparent' :
            direction === 'left' ? 'bg-gradient-to-r from-red-400/40 via-red-400/20 to-transparent' :
            direction === 'up' ? 'bg-gradient-to-b from-blue-400/40 via-blue-400/20 to-transparent' : ''
          }`} />
        )}
        
        {/* Swipe Indicators - Positioned as overlays */}
        {index === 0 && (
          <>
            {/* Like Indicator - Now positioned on LEFT side for better visibility when swiping RIGHT */}
            <animated.div 
              style={likeIndicator}
              className="absolute top-1/2 left-6 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full shadow-xl border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute -right-16 font-bold tracking-wider text-emerald-600 text-lg bg-white px-3 py-1 rounded-full shadow">LIKE</span>
            </animated.div>
            
            {/* Pass Indicator - Now positioned on RIGHT side for better visibility when swiping LEFT */}
            <animated.div 
              style={passIndicator}
              className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full shadow-xl border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute -left-16 font-bold tracking-wider text-red-600 text-lg bg-white px-3 py-1 rounded-full shadow">PASS</span>
            </animated.div>
            
            {/* Cart Indicator - Top center */}
            <animated.div 
              style={cartIndicator}
              className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-30 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-xl border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <span className="font-bold tracking-wider text-blue-600 text-lg bg-white px-3 py-1 rounded-full shadow mt-2">CART</span>
            </animated.div>
          </>
        )}
      </div>
    </animated.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
