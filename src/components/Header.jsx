import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { cartItems, likedItems } = useShop();
  const location = useLocation();

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Calculate if we're on a specific page for active styling
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and name */}
          <Link to="/" className="flex items-center group">
            <div className="mr-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:shadow-indigo-200 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-purple-500 transition-all">
              SwipeShop
            </h1>
          </Link>
          
          {/* Navigation links - Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/shop" isActive={isActive('/shop')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Shop
            </NavLink>
            <NavLink to="/likes" isActive={isActive('/likes')} count={likedItems.length}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Likes
            </NavLink>
            <NavLink to="/cart" isActive={isActive('/cart')} count={cartCount}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Cart
            </NavLink>
          </nav>
          
          {/* Mobile navigation icons */}
          <div className="flex md:hidden items-center space-x-1">
            <MobileNavLink 
              to="/shop" 
              isActive={isActive('/shop')}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
            />
            <MobileNavLink 
              to="/likes" 
              isActive={isActive('/likes')}
              count={likedItems.length}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              }
              activeColor="text-pink-600"
              activeFill={true}
            />
            <MobileNavLink 
              to="/cart" 
              isActive={isActive('/cart')}
              count={cartCount}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              }
              activeColor="text-blue-600"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// NavLink component for desktop navigation
const NavLink = ({ to, children, isActive, count = 0 }) => {
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center relative ${
        isActive 
          ? 'text-white shadow-md' 
          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      {isActive && (
        <motion.span 
          layoutId="navBackground"
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <div className="flex items-center">
        {children}
        {count > 0 && (
          <div className="ml-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {count > 99 ? "99+" : count}
          </div>
        )}
      </div>
    </Link>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ to, isActive, count = 0, icon, activeColor = "text-indigo-600", activeFill = false }) => {
  return (
    <Link to={to} className="relative">
      <div className={`p-2 rounded-full transition-all duration-200 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
        <div className={`${isActive ? activeColor : 'text-gray-500'}`}>
          {icon}
        </div>
      </div>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
};

export default Header;
