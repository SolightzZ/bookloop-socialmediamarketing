import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthState } from '../types/auth';
import { authService } from '../services/authService';
import { books } from '../data/books';

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  getCurrentUser: () => Promise<User | null>;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bookloop_cart';
const WISHLIST_STORAGE_KEY = 'bookloop_wishlist';

// Helper to merge guest cart and user cart safely
function mergeCartOnLogin(userId: string) {
  try {
    const rawGuestCart = localStorage.getItem(CART_STORAGE_KEY);
    const guestCart: { productId: string; quantity: number }[] = rawGuestCart ? JSON.parse(rawGuestCart) : [];

    const userData = authService.getUserData(userId);
    const userCart = userData.cart || [];

    const mergedCartMap = new Map<string, number>();

    // Add user's existing account cart items
    userCart.forEach((item) => {
      mergedCartMap.set(item.productId, (mergedCartMap.get(item.productId) || 0) + item.quantity);
    });

    // Merge guest cart items
    guestCart.forEach((item) => {
      mergedCartMap.set(item.productId, (mergedCartMap.get(item.productId) || 0) + item.quantity);
    });

    const finalCart: { productId: string; quantity: number }[] = [];
    mergedCartMap.forEach((qty, pid) => {
      const book = books.find((b) => b.id === pid);
      const stock = book ? book.stock : 10;
      finalCart.push({
        productId: pid,
        quantity: Math.min(qty, Math.max(1, stock)),
      });
    });

    // Save back to storage and user data
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(finalCart));
    authService.saveUserData(userId, { cart: finalCart });
    window.dispatchEvent(new Event('bookloop_cart_updated'));
  } catch (e) {
    console.warn('Error merging cart during login', e);
  }
}

// Helper to merge guest wishlist and user wishlist safely
function mergeWishlistOnLogin(userId: string) {
  try {
    const rawGuestWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const guestWishlist: string[] = rawGuestWishlist ? JSON.parse(rawGuestWishlist) : [];

    const userData = authService.getUserData(userId);
    const userWishlist = userData.wishlist || [];

    // Union set of IDs without duplicates
    const uniqueIds = Array.from(new Set([...userWishlist, ...guestWishlist]));

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(uniqueIds));
    authService.saveUserData(userId, { wishlist: uniqueIds });
    window.dispatchEvent(new Event('bookloop_wishlist_updated'));
  } catch (e) {
    console.warn('Error merging wishlist during login', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on application startup
  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionUser = await authService.getCurrentSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn('Session restore failed', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const handlePostAuthSync = useCallback((authenticatedUser: User) => {
    setUser(authenticatedUser);
    mergeCartOnLogin(authenticatedUser.id);
    mergeWishlistOnLogin(authenticatedUser.id);
  }, []);

  const login = useCallback(
    async (email: string, pass: string): Promise<User> => {
      setIsLoading(true);
      try {
        const { user: authUser } = await authService.login(email, pass);
        handlePostAuthSync(authUser);
        return authUser;
      } finally {
        setIsLoading(false);
      }
    },
    [handlePostAuthSync]
  );

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    setIsLoading(true);
    try {
      const { user: authUser } = await authService.loginWithGoogle();
      handlePostAuthSync(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  }, [handlePostAuthSync]);

  const register = useCallback(
    async (name: string, email: string, pass: string): Promise<User> => {
      setIsLoading(true);
      try {
        const { user: authUser } = await authService.register(name, email, pass);
        handlePostAuthSync(authUser);
        return authUser;
      } finally {
        setIsLoading(false);
      }
    },
    [handlePostAuthSync]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    window.dispatchEvent(new Event('bookloop_cart_updated'));
    window.dispatchEvent(new Event('bookloop_wishlist_updated'));
  }, []);

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    return authService.getCurrentSessionUser();
  }, []);

  const refreshSession = useCallback(async () => {
    await restoreSession();
  }, [restoreSession]);

  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<User> => {
      if (!user) throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ');
      const updated = await authService.updateProfile(user.id, updates);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    return authService.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    return authService.resetPassword(token, newPassword);
  }, []);

  const changePassword = useCallback(
    async (oldPass: string, newPass: string) => {
      if (!user) throw new Error('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ');
      return authService.changePassword(user.id, oldPass, newPass);
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    getCurrentUser,
    refreshSession,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
