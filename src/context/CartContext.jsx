import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'mira_cart';
const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING_COST = 15;

export function CartProvider({ children }) {
  // Load initial cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('mira_cart_updated'));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Add product to cart with color and size selection.
   * Prevents duplicate entries when product, size, and color match;
   * increases quantity instead.
   */
  const addToCart = useCallback((product, selectedColor, selectedSize, quantity = 1) => {
    if (!product) return;

    const colorName = typeof selectedColor === 'object' ? selectedColor?.name : (selectedColor || 'Standard');
    const colorHex = typeof selectedColor === 'object' ? selectedColor?.hex : '#1a1a1a';
    const sizeName = selectedSize || 'One Size';

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id &&
                item.selectedColor === colorName &&
                item.selectedSize === sizeName
      );

      if (existingIndex > -1) {
        // Increase quantity of existing entry
        const updated = [...prevCart];
        const newQty = Math.min(10, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      }

      // Add as new cart item
      const newItem = {
        cartItemId: `${product.id}-${colorName}-${sizeName}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        image: product.image,
        selectedColor: colorName,
        selectedColorHex: colorHex,
        selectedSize: sizeName,
        quantity: Math.min(10, Math.max(1, quantity))
      };

      return [...prevCart, newItem];
    });
  }, []);

  /**
   * Update quantity of a specific cart item
   */
  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      }
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: Math.min(10, Math.max(1, newQuantity))
          };
        }
        return item;
      });
    });
  }, []);

  /**
   * Remove item from cart completely
   */
  const removeFromCart = useCallback((cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Derived financial & count calculations
  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    return isEligibleForFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  }, [cart.length, isEligibleForFreeShipping]);

  const amountToFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const freeShippingProgress = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal]);

  const total = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotal + shippingCost;
  }, [cart.length, subtotal, shippingCost]);

  const value = {
    cart,
    totalItems,
    subtotal,
    shippingCost,
    total,
    isEligibleForFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping,
    freeShippingProgress,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
