import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, books } from '../data/books';
import { showSuccess, showConfirm, showWarning } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

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

const CART_STORAGE_KEY = 'bookloop_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedItems, setStoredItems] = useState<StoredCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Support legacy format or proper { productId, quantity } format
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          productId: item.productId || item.id,
          quantity: typeof item.quantity === 'number' ? item.quantity : 1,
        })).filter(item => Boolean(item.productId));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [storedItems]);

  // Lookup full book information from catalog data
  const cart = useMemo<CartItem[]>(() => {
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
  }, [storedItems]);

  const addToCart = useCallback((book: Book, quantity = 1) => {
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
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const itemToRemove = cart.find(item => item.id === id);
    const bookTitle = itemToRemove ? `"${itemToRemove.title}"` : 'หนังสือเล่มนี้';

    showConfirm('ต้องการลบหนังสือหรือไม่?', `คุณต้องการนำ ${bookTitle} ออกจากตะกร้าใช่หรือไม่?`).then((result) => {
      if (result.isConfirmed) {
        setStoredItems((prev) => prev.filter((item) => item.productId !== id));
        showSuccess('ลบสินค้าแล้ว', 'นำหนังสือออกจากตะกร้าเรียบร้อย');
      }
    });
  }, [cart]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
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
  }, []);

  const clearCart = useCallback(() => {
    setStoredItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const savings = useMemo(() => {
    return cart.reduce(
      (total, item) => total + ((item.originalPrice || item.price) - item.price) * item.quantity,
      0
    );
  }, [cart]);

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
