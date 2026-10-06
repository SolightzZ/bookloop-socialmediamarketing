import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Book, books } from '../data/books';
import { authService, scheduleUserStatePush } from '../services/authService';
import { listingService } from '../services/listingService';
import { showConfirm, showSuccess, showWarning } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { logWarn } from '../utils/logger';
import { useAuth } from './useAuth';

export interface CartItem extends Book {
   quantity: number;
}

interface StoredCartItem {
   productId: string;
   quantity: number;
   book?: Book;
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
                     book: item.book || undefined,
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
                  book: item.book || undefined,
               }))
               .filter((item: any) => Boolean(item.productId));
         }
      } catch (e) {
         logWarn('loadUserCart: corrupt cart in storage, starting empty', e);
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

   // Sync back to user-specific storage + server (debounced)
   useEffect(() => {
      if (user?.id) {
         const key = `bookloop_cart_${user.id}`;
         try {
            localStorage.setItem(key, JSON.stringify(storedItems));
            authService.saveUserData(user.id, { cart: storedItems });
            scheduleUserStatePush(user.id);
         } catch (e) {
            logWarn('CartProvider: persist isolated user cart failed', e);
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

   // Hydrate custom listings that are missing book data
   useEffect(() => {
      const missingIds = storedItems.filter((i) => !books.some((b) => b.id === i.productId) && !i.book && i.productId.startsWith('LST-')).map((i) => i.productId);

      if (missingIds.length > 0) {
         Promise.all(missingIds.map((id) => listingService.getListingById(id)))
            .then((fetched) => {
               const validFetched = fetched.filter((b): b is Book => Boolean(b));
               if (validFetched.length > 0) {
                  const map = new Map(validFetched.map((b) => [b.id, b]));
                  setStoredItems((prev) => prev.map((item) => (map.has(item.productId) ? { ...item, book: map.get(item.productId) } : item)));
               }
            })
            .catch((e) => {
               logWarn('CartProvider: hydrate custom listings failed', e);
            });
      }
   }, [storedItems]);

   // Lookup full book information from catalog data or stored book snapshot
   const cart = useMemo<CartItem[]>(() => {
      if (!isAuthenticated || !user) {
         return [];
      }

      return storedItems
         .map((item) => {
            const book = books.find((b) => b.id === item.productId) || item.book;
            if (!book) return null;
            const availableStock = Math.max(1, book.stock || 1);
            return {
               ...book,
               quantity: Math.min(item.quantity, availableStock),
            };
         })
         .filter((item): item is CartItem => item !== null);
   }, [storedItems, isAuthenticated, user]);

   const addToCart = useCallback(
      (book: Book, quantity = 1) => {
         // Backend / Hook-level security guard: Unauthenticated visitors cannot mutate cart
         if (!isAuthenticated || !user) {
            logWarn('Blocked unauthenticated cart mutation attempt');
            return;
         }

         const availableStock = Math.max(1, book.stock || 1);
         if (book.stock !== undefined && book.stock <= 0) {
            showWarning('สินค้าหมด', 'หนังสือเล่มนี้หมดแล้ว');
            return;
         }

         setStoredItems((prev) => {
            const existing = prev.find((item) => item.productId === book.id);
            if (existing) {
               const newQty = existing.quantity + quantity;
               if (newQty > availableStock) {
                  showWarning('จำนวนจำกัด', `มีสินค้าพร้อมส่งเพียง ${availableStock} เล่ม`);
                  return prev.map((item) => (item.productId === book.id ? { ...item, quantity: availableStock, book } : item));
               }
               return prev.map((item) => (item.productId === book.id ? { ...item, quantity: newQty, book } : item));
            }
            return [...prev, { productId: book.id, quantity: Math.min(quantity, availableStock), book }];
         });

         trackEvent('add_to_cart', { bookId: book.id, title: book.title, price: book.price, quantity });
         showSuccess('เพิ่มหนังสือลงตะกร้าแล้ว', `"${book.title}" ถูกเพิ่มในตะกร้าของคุณ`);
      },
      [isAuthenticated, user],
   );

   const removeFromCart = useCallback(
      (id: string) => {
         if (!isAuthenticated || !user) return;

         const itemToRemove = cart.find((item) => item.id === id);
         const bookTitle = itemToRemove ? `"${itemToRemove.title}"` : 'หนังสือเล่มนี้';

         showConfirm('ต้องการลบหนังสือหรือไม่?', `คุณต้องการนำ ${bookTitle} ออกจากตะกร้าใช่หรือไม่?`).then((result) => {
            if (result.isConfirmed) {
               setStoredItems((prev) => prev.filter((item) => item.productId !== id));
               showSuccess('ลบสินค้าแล้ว', 'นำหนังสือออกจากตะกร้าเรียบร้อย');
            }
         });
      },
      [cart, isAuthenticated, user],
   );

   const updateQuantity = useCallback(
      (id: string, quantity: number) => {
         if (!isAuthenticated || !user) return;

         // รายการ custom (LST-) ไม่อยู่ใน catalog กลาง — fallback ไป snapshot ที่เก็บตอน addToCart
         const book = books.find((b) => b.id === id) ?? storedItems.find((i) => i.productId === id)?.book;
         if (!book) return;

         setStoredItems((prev) =>
            prev.map((item) => {
               if (item.productId === id) {
                  const newQty = Math.max(1, Math.min(quantity, book.stock ?? 1));
                  return { ...item, quantity: newQty };
               }
               return item;
            }),
         );
      },
      [isAuthenticated, user, storedItems],
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
      return cart.reduce((total, item) => total + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);
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
         }}>
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
