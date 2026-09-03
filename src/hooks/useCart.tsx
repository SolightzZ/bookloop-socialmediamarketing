import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, books } from '../data/books';
import { showSuccess, showConfirm, showWarning } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { useAuth } from './useAuth';
import { authService } from '../services/authService';

export interface CartItem extends Book {
  quantity: number;
}

interface StoredCartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  savings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const loadUserCart = useCallback((userId: string): StoredCartItem[] => {
    try {
      const key = `bookloop_cart_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item: any) => ({
              productId: item.productId || item.id,
              quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            }))
            .filter((item) => Boolean(item.productId));
        }
      }
      // Fallback to user data in authService
      const userData = authService.getUserData(userId);
      if (userData?.cart && Array.isArray(userData.cart)) {
        return userData.cart
          .map((item: any) => ({
            productId: item.productId || item.id,
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
          }))
          .filter((item: any) => Boolean(item.productId));
      }
    } catch (e) {
      console.warn('Error loading user cart from storage', e);
    }
    return [];
  }, []);

  const [storedItems, setStoredItems] = useState<StoredCartItem[]>(() => {
    if (user?.id) {
      return loadUserCart(user.id);
    }
    return [];
  });

  // Isolated Cart Data: reload cart when authenticated user changes, or clear on logout
  useEffect(() => {
    if (user?.id) {
      setStoredItems(loadUserCart(user.id));
    } else {
      setStoredItems([]);
    }
  }, [user?.id, loadUserCart]);

  // Sync back to user-specific storage
  useEffect(() => {
    if (user?.id) {
      const key = `bookloop_cart_${user.id}`;
      try {
        localStorage.setItem(key, JSON.stringify(storedItems));
        authService.saveUserData(user.id, { cart: storedItems });
      } catch (e) {
        console.warn('Could not persist isolated user cart', e);
      }
    }
  }, [storedItems, user?.id]);

  // Listen for broadcast sync events
  useEffect(() => {
    const handleCartSync = () => {
      if (user?.id) {
        setStoredItems(loadUserCart(user.id));
      } else {
        setStoredItems([]);
      }
    };

    window.addEventListener('bookloop_cart_updated', handleCartSync);
    return () => {
      window.removeEventListener('bookloop_cart_updated', handleCartSync);
    };
  }, [user?.id, loadUserCart]);

  // Lookup full book information from catalog data
  const cart = useMemo<CartItem[]>(() => {
    if (!isAuthenticated || !user) {
      return [];
    }

    return storedItems
      .map((item) => {
        const book = books.find((b) => b.id === item.productId);
        if (!book) return null;
        return {
          ...book,
          quantity: Math.min(item.quantity, Math.max(1, book.stock)),
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [storedItems, isAuthenticated, user]);

  const addToCart = useCallback(
    (book: Book, quantity = 1) => {
      // Backend / Hook-level security guard: Unauthenticated visitors cannot mutate cart
      if (!isAuthenticated || !user) {
        console.warn('Blocked unauthenticated cart mutation attempt');
        return;
      }

      if (book.stock <= 0) {
        showWarning('สินค้าหมด', 'หนังสือเล่มนี้หมดแล้วในระบบ Demo');
        return;
      }

      setStoredItems((prev) => {
        const existing = prev.find((item) => item.productId === book.id);
        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty > book.stock) {
            showWarning('จำนวนจำกัด', `มีสินค้าพร้อมส่งเพียง ${book.stock} เล่ม`);
            return prev.map((item) =>
              item.productId === book.id ? { ...item, quantity: book.stock } : item
            );
          }
          return prev.map((item) =>
            item.productId === book.id ? { ...item, quantity: newQty } : item
          );
        }
        return [...prev, { productId: book.id, quantity: Math.min(quantity, book.stock) }];
      });

      trackEvent('add_to_cart', { bookId: book.id, title: book.title, price: book.price, quantity });
      showSuccess('เพิ่มหนังสือลงตะกร้าแล้ว', `"${book.title}" ถูกเพิ่มในตะกร้าของคุณ`);
    },
    [isAuthenticated, user]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      if (!isAuthenticated || !user) return;

      const itemToRemove = cart.find((item) => item.id === id);
      const bookTitle = itemToRemove ? `"${itemToRemove.title}"` : 'หนังสือเล่มนี้';

      showConfirm('ต้องการลบหนังสือหรือไม่?', `คุณต้องการนำ ${bookTitle} ออกจากตะกร้าใช่หรือไม่?`).then(
        (result) => {
          if (result.isConfirmed) {
            setStoredItems((prev) => prev.filter((item) => item.productId !== id));
            showSuccess('ลบสินค้าแล้ว', 'นำหนังสือออกจากตะกร้าเรียบร้อย');
          }
        }
      );
    },
    [cart, isAuthenticated, user]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (!isAuthenticated || !user) return;

      const book = books.find((b) => b.id === id);
      if (!book) return;

      setStoredItems((prev) =>
        prev.map((item) => {
          if (item.productId === id) {
            const newQty = Math.max(1, Math.min(quantity, book.stock));
            return { ...item, quantity: newQty };
          }
          return item;
        })
      );
    },
    [isAuthenticated, user]
  );

  const clearCart = useCallback(() => {
    if (!isAuthenticated || !user) return;
    setStoredItems([]);
  }, [isAuthenticated, user]);

  const cartCount = useMemo(() => {
    if (!isAuthenticated || !user) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart, isAuthenticated, user]);

  const subtotal = useMemo(() => {
    if (!isAuthenticated || !user) return 0;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart, isAuthenticated, user]);

  const savings = useMemo(() => {
    if (!isAuthenticated || !user) return 0;
    return cart.reduce(
      (total, item) => total + ((item.originalPrice || item.price) - item.price) * item.quantity,
      0
    );
  }, [cart, isAuthenticated, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        savings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
