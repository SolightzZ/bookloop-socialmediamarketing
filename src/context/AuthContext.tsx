import React, { createContext, useCallback, useEffect, useState } from 'react';
import { books } from '../data/books';
import { authService } from '../services/authService';
import { AuthState, User } from '../types/auth';
import { logWarn } from '../utils/logger';

export interface AuthContextType extends AuthState {
   login: (email: string, password: string) => Promise<User>;
   register: (name: string, email: string, password: string, subscribeNewsletter?: boolean) => Promise<User>;
   logout: () => void;
   deleteAccount: (password: string) => Promise<void>;
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
      logWarn('mergeCartOnLogin failed', e);
   }
}

// ดึงตะกร้า/รายการโปรดจาก server มารวมกับของบนเครื่อง (ข้ามเครื่องได้)
// เรียกก่อน merge guest ทุกครั้ง — server เป็นอีกหนึ่งแหล่งของ user คนนี้
async function pullServerStateOnLogin(userId: string) {
   try {
      const remote = await authService.pullUserState();
      if (!remote) return;

      const userData = authService.getUserData(userId);

      // cart: union ของบนเครื่อง + server (cap ตาม stock)
      if (remote.cart.length > 0) {
         const mergedCartMap = new Map<string, number>();
         (userData.cart || []).forEach((item) => {
            mergedCartMap.set(item.productId, (mergedCartMap.get(item.productId) || 0) + item.quantity);
         });
         remote.cart.forEach((item) => {
            mergedCartMap.set(item.productId, (mergedCartMap.get(item.productId) || 0) + item.quantity);
         });
         const finalCart: { productId: string; quantity: number }[] = [];
         mergedCartMap.forEach((qty, pid) => {
            const book = books.find((b) => b.id === pid);
            if (!book) return;
            const stock = book ? book.stock : 10;
            finalCart.push({ productId: pid, quantity: Math.min(qty, Math.max(1, stock)) });
         });
         authService.saveUserData(userId, { cart: finalCart });
         try {
            localStorage.setItem(`bookloop_cart_${userId}`, JSON.stringify(finalCart));
         } catch (e) {
            // storage เต็ม/ถูกปิด — ใช้ค่าบน userData ต่อ แต่ต้องเห็นใน console
            logWarn('pullServerStateOnLogin: cart storage write failed', e);
         }
      }

      // wishlist: union set
      if (remote.wishlist.length > 0) {
         const uniqueIds = Array.from(new Set([...(userData.wishlist || []), ...remote.wishlist]));
         authService.saveUserData(userId, { wishlist: uniqueIds });
         try {
            localStorage.setItem(`bookloop_wishlist_${userId}`, JSON.stringify(uniqueIds));
         } catch (e) {
            // storage เต็ม/ถูกปิด — ใช้ค่าบน userData ต่อ แต่ต้องเห็นใน console
            logWarn('pullServerStateOnLogin: wishlist storage write failed', e);
         }
      }
   } catch (e) {
      logWarn('pullServerStateOnLogin failed', e);
   }
}

function mergeWishlistOnLogin(userId: string) {
   try {
      const rawGuestWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const guestWishlist: string[] = rawGuestWishlist ? JSON.parse(rawGuestWishlist) : [];

      const userData = authService.getUserData(userId);
      const userWishlist = userData.wishlist || [];

      // Union set of IDs without duplicates
      const uniqueIds = Array.from(new Set([...userWishlist, ...guestWishlist]));

      // เก็บเข้า key ของ user คนนี้ แล้วลบ key กลางของ guest ทิ้ง
      // (กัน account ถัดไปบน browser เดียวกันสืบทอดรายการโปรดต่อ)
      localStorage.setItem(`bookloop_wishlist_${userId}`, JSON.stringify(uniqueIds));
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      authService.saveUserData(userId, { wishlist: uniqueIds });
      window.dispatchEvent(new Event('bookloop_wishlist_updated'));
   } catch (e) {
      logWarn('mergeWishlistOnLogin failed', e);
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
            // ดึงตะกร้า/โปรดจาก server มารวม (เช่น เพิ่มไว้อีกเครื่อง)
            await pullServerStateOnLogin(sessionUser.id);
            window.dispatchEvent(new Event('bookloop_cart_updated'));
            window.dispatchEvent(new Event('bookloop_wishlist_updated'));
         } else {
            setUser(null);
         }
      } catch (e) {
         logWarn('restoreSession failed', e);
         setUser(null);
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      restoreSession();
   }, [restoreSession]);

   const handlePostAuthSync = useCallback(async (authenticatedUser: User) => {
      setUser(authenticatedUser);
      await pullServerStateOnLogin(authenticatedUser.id);
      mergeCartOnLogin(authenticatedUser.id);
      mergeWishlistOnLogin(authenticatedUser.id);
      // ดันผลรวมกลับขึ้น server (converge — เครื่องอื่นได้ค่าล่าสุดด้วย)
      await authService.pushUserState(authenticatedUser.id);
   }, []);

   const login = useCallback(
      async (email: string, pass: string): Promise<User> => {
         setIsLoading(true);
         try {
            const { user: authUser } = await authService.login(email, pass);
            await handlePostAuthSync(authUser);
            return authUser;
         } finally {
            setIsLoading(false);
         }
      },
      [handlePostAuthSync],
   );

   const register = useCallback(
      async (name: string, email: string, pass: string, subscribeNewsletter: boolean = false): Promise<User> => {
         setIsLoading(true);
         try {
            const { user: authUser } = await authService.register(name, email, pass, subscribeNewsletter);
            await handlePostAuthSync(authUser);
            return authUser;
         } finally {
            setIsLoading(false);
         }
      },
      [handlePostAuthSync],
   );

   const logout = useCallback(() => {
      authService.logout();
      setUser(null);
      window.dispatchEvent(new Event('bookloop_cart_updated'));
      window.dispatchEvent(new Event('bookloop_wishlist_updated'));
   }, []);

   const deleteAccount = useCallback(
      async (password: string) => {
         await authService.deleteAccount(password);
         const userId = user?.id;
         setUser(null);
         if (userId) {
            try {
               localStorage.removeItem(`bookloop_user_data_${userId}`);
               localStorage.removeItem(`bookloop_wishlist_${userId}`);
            } catch (e) {
               // ล้างไม่หมดไม่กระทบ logout — แต่ต้องเห็นใน console
               logWarn('deleteAccount: local cleanup failed', e);
            }
         }
         window.dispatchEvent(new Event('bookloop_cart_updated'));
         window.dispatchEvent(new Event('bookloop_wishlist_updated'));
      },
      [user],
   );

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
      [user],
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
      [user],
   );

   const value: AuthContextType = {
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      deleteAccount,
      getCurrentUser,
      refreshSession,
      updateProfile,
      requestPasswordReset,
      resetPassword,
      changePassword,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
