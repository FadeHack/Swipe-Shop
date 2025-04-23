import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import ShoppingPage from './pages/ShoppingPage';
import CartPage from './pages/CartPage';
import LikesPage from './pages/LikesPage';

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<><Header /><ShoppingPage /></>} />
            <Route path="/cart" element={<><Header /><CartPage /></>} />
            <Route path="/likes" element={<><Header /><LikesPage /></>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;
