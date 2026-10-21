import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../data/products';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'mira_wishlist';

export function WishlistProvider({ children }) {
  // Load initial wishlist array of product IDs from localStorage
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
      window.dispatchEvent(new Event('mira_wishlist_updated'));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setWishlistIds(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [productId, ...prev];
      }
    });
  }, []);

  const addToWishlist = useCallback((productId) => {
    setWishlistIds(prev => {
      if (!prev.includes(productId)) {
        return [productId, ...prev];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  // Hydrate full product objects from catalog
  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean);
  }, [wishlistIds]);

  const value = {
    wishlistIds,
    wishlistProducts,
    totalWishlistItems: wishlistIds.length,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
