import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Book, books } from '../data/books';
import { authService, scheduleUserStatePush } from '../services/authService';
import { listingService } from '../services/listingService';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { logWarn } from '../utils/logger';
import { useAuth } from './useAuth';

interface WishlistContextType {
   wishlist: Book[];
   wishlistIds: string[];
   toggleWishlist: (book: Book) => void;
   isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'bookloop_wishlist';

const GUEST_WISHLIST_KEY = 'bookloop_wishlist';

// แยก key ตาม user แบบเดียวกับ cart (bookloop_cart_<userId>) กันเห็นของกันข้าม account
const wishlistKey = (userId?: string | null) => (userId ? `bookloop_wishlist_${userId}` : GUEST_WISHLIST_KEY);

function parseWishlistIds(raw: string | null): string[] {
   if (!raw) return [];
   try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
         return parsed.map((item: any) => (typeof item === 'string' ? item : item?.id)).filter(Boolean);
      }
   } catch (e) {
      // storage เสีย — เริ่มจากว่าง แต่ต้องเห็นใน console
      logWarn('parseWishlistIds: malformed storage, returning []', e);
   }
   return [];
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { user } = useAuth();
   const userId = user?.id ?? null;

   const loadWishlist = useCallback((uid: string | null): string[] => {
      const saved = parseWishlistIds(localStorage.getItem(wishlistKey(uid)));
      if (uid) {
         // Fallback ไป user data เผื่อ key หลักหาย
         try {
            const userData = authService.getUserData(uid);
            if (saved.length === 0 && Array.isArray(userData?.wishlist) && userData.wishlist.length > 0) {
               return userData.wishlist.filter(Boolean);
            }
         } catch (e) {
            // fallback ล้ม — ใช้ค่าจาก key หลักต่อ แต่ต้องเห็นใน console
            logWarn('loadWishlist: userData fallback failed', e);
         }
      }
      return saved;
   }, []);

   const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlist(userId));

   // Isolated wishlist: โหลดใหม่เมื่อ user เปลี่ยน, ล้างเมื่อ logout
   useEffect(() => {
      setWishlistIds(loadWishlist(userId));
   }, [userId, loadWishlist]);

   // Sync กลับ storage ของ user คนนั้น + user data + server (debounced)
   useEffect(() => {
      try {
         localStorage.setItem(wishlistKey(userId), JSON.stringify(wishlistIds));
         if (userId) {
            authService.saveUserData(userId, { wishlist: wishlistIds });
            scheduleUserStatePush(userId);
         }
      } catch (e) {
         logWarn('WishlistProvider: save wishlist to localStorage failed', e);
      }
   }, [wishlistIds, userId]);

   // Listen for external updates (such as login merge)
   useEffect(() => {
      const handleWishlistSync = () => {
         setWishlistIds(loadWishlist(userId));
      };

      window.addEventListener('bookloop_wishlist_updated', handleWishlistSync);
      return () => {
         window.removeEventListener('bookloop_wishlist_updated', handleWishlistSync);
      };
   }, [userId, loadWishlist]);

   const [customBooks, setCustomBooks] = useState<Map<string, Book>>(new Map());

   useEffect(() => {
      const missingIds = wishlistIds.filter((id) => !books.some((b) => b.id === id) && !customBooks.has(id) && id.startsWith('LST-'));
      if (missingIds.length > 0) {
         Promise.all(missingIds.map((id) => listingService.getListingById(id)))
            .then((fetched) => {
               const valid = fetched.filter((b): b is Book => Boolean(b));
               if (valid.length > 0) {
                  setCustomBooks((prev) => {
                     const next = new Map(prev);
                     valid.forEach((b) => next.set(b.id, b));
                     return next;
                  });
               }
            })
            .catch((e) => {
               logWarn('WishlistProvider: hydrate custom listings failed', e);
            });
      }
   }, [wishlistIds, customBooks]);

   const wishlist = useMemo<Book[]>(() => {
      return wishlistIds.map((id) => books.find((b) => b.id === id) || customBooks.get(id)).filter((b): b is Book => Boolean(b));
   }, [wishlistIds, customBooks]);

   const toggleWishlist = useCallback((book: Book) => {
      setWishlistIds((prev) => {
         const exists = prev.includes(book.id);
         if (exists) {
            trackEvent('favorite_book', { bookId: book.id, title: book.title, action: 'remove' });
            return prev.filter((id) => id !== book.id);
         }
         trackEvent('favorite_book', { bookId: book.id, title: book.title, action: 'add' });
         showSuccess('เพิ่มลงในรายการโปรดแล้ว', `"${book.title}" อยู่ในรายการที่ชอบของคุณ`);
         return [...prev, book.id];
      });
   }, []);

   const isInWishlist = useCallback((id: string) => wishlistIds.includes(id), [wishlistIds]);

   return <WishlistContext.Provider value={{ wishlist, wishlistIds, toggleWishlist, isInWishlist }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
   const context = useContext(WishlistContext);
   if (context === undefined) {
      throw new Error('useWishlist must be used within a WishlistProvider');
   }
   return context;
};
