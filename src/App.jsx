import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Header />
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/shop"          element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart"          element={<Cart />} />
                <Route path="/wishlist"      element={<Wishlist />} />
                <Route path="/orders"        element={<Orders />} />
                <Route path="/checkout"      element={<Checkout />} />
                <Route path="/login"         element={<Auth initialMode="login" />} />
                <Route path="/register"      element={<Auth initialMode="register" />} />
                <Route path="/account"       element={<Account />} />
                <Route path="/about"         element={<About />} />
                <Route path="/contact"       element={<Contact />} />
                <Route path="*"              element={<NotFound />} />
              </Routes>
              <Footer />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

