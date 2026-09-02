import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, books } from '../data/books';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

interface WishlistContextType {
  wishlist: Book[];
  wishlistIds: string[];
  toggleWishlist: (book: Book) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'bookloop_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => (typeof item === 'string' ? item : item.id)).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Listen for external updates (such as login merge)
  useEffect(() => {
    const handleWishlistSync = () => {
      try {
        const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!saved) {
          setWishlistIds([]);
          return;
        }
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed.map((item: any) => (typeof item === 'string' ? item : item.id)).filter(Boolean));
        }
      } catch (e) {
        console.warn('Error reading synced wishlist', e);
      }
    };

    window.addEventListener('bookloop_wishlist_updated', handleWishlistSync);
    return () => {
      window.removeEventListener('bookloop_wishlist_updated', handleWishlistSync);
    };
  }, []);

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
