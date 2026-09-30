import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, books } from '../data/books';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { useAuth } from './useAuth';
import { authService } from '../services/authService';

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
const wishlistKey = (userId?: string | null) =>
  userId ? `bookloop_wishlist_${userId}` : GUEST_WISHLIST_KEY;

function parseWishlistIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => (typeof item === 'string' ? item : item?.id)).filter(Boolean);
    }
  } catch {
    // ignore malformed storage
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
      } catch {
        // ignore storage errors
      }
    }
    return saved;
  }, []);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlist(userId));

  // Isolated wishlist: โหลดใหม่เมื่อ user เปลี่ยน, ล้างเมื่อ logout
  useEffect(() => {
    setWishlistIds(loadWishlist(userId));
  }, [userId, loadWishlist]);

  // Sync กลับ storage ของ user คนนั้น + user data
  useEffect(() => {
    try {
      localStorage.setItem(wishlistKey(userId), JSON.stringify(wishlistIds));
      if (userId) {
        authService.saveUserData(userId, { wishlist: wishlistIds });
      }
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
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

  const wishlist = useMemo<Book[]>(() => {
    return wishlistIds
      .map((id) => books.find((b) => b.id === id))
      .filter((b): b is Book => Boolean(b));
  }, [wishlistIds]);

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

  const isInWishlist = useCallback(
    (id: string) => wishlistIds.includes(id),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
