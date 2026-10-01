import { User, UserOrder, UserListedBook } from '../types/auth';
import { apiClient, ApiError, NGROK_BYPASS_HEADERS } from './apiClient';
import { logWarn } from '../utils/logger';

export interface UserAccountData {
   cart: { productId: string; quantity: number }[];
   wishlist: string[];
   orders: UserOrder[];
   listedBooks: UserListedBook[];
}

const SESSION_TOKEN_KEY = 'bookloop_auth_session_token';
const USER_DATA_PREFIX = 'bookloop_user_data_';

// debounce push ข้ามเครื่อง — รวม mutation รัวๆ (กด + หลายครั้ง) ให้เหลือ 1 request
const userStatePushTimers = new Map<string, ReturnType<typeof setTimeout>>();
export function scheduleUserStatePush(userId: string): void {
   if (!userId) return;
   const prev = userStatePushTimers.get(userId);
   if (prev) clearTimeout(prev);
   userStatePushTimers.set(
      userId,
       setTimeout(() => {
          userStatePushTimers.delete(userId);
          authService.pushUserState(userId).catch((e) => {
             logWarn('pushUserState (debounced background sync) failed', e);
          });
      }, 2500),
   );
}

/** session ที่เก็บใน localStorage (ใช้หา userId ปัจจุบันโดยไม่ต้องพึ่ง backend) */
export function getStoredSession(): { token: string; userId: string; expiresAt: number } | null {
   try {
      const raw = localStorage.getItem(SESSION_TOKEN_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session?.userId || !session?.token) return null;
      return session;
   } catch (e) {
      logWarn('getStoredSession: corrupt session in localStorage', e);
      return null;
   }
}

class AuthService {
   // Get user specific saved data (cart, wishlist, orders, listed books)
   public getUserData(userId: string): UserAccountData {
      try {
         const data = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
         if (data) {
            return JSON.parse(data);
         }
      } catch (e) {
         console.warn('Error reading user data', e);
      }

      return {
         cart: [],
         wishlist: [],
         orders: [],
         listedBooks: [],
      };
   }

   public saveUserData(userId: string, data: Partial<UserAccountData>) {
      try {
         const current = this.getUserData(userId);
         const updated = { ...current, ...data };
         localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(updated));
      } catch (e) {
         console.warn('Could not save user data', e);
      }
   }

   public async login(email: string, password: string): Promise<{ user: User; token: string }> {
      const result = await apiClient.post<{ success: boolean; user: User; token: string }>('auth_login.php', { email, password });

      localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token: result.token, userId: result.user.id, expiresAt: Date.now() + 86400000 * 7 }));

      return { user: result.user, token: result.token };
   }

   public async register(name: string, email: string, password: string, subscribeNewsletter: boolean = false): Promise<{ user: User; token: string }> {
      const result = await apiClient.post<{ success: boolean; user: User; token: string }>('auth_register.php', { name, email, password, subscribeNewsletter });

      localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token: result.token, userId: result.user.id, expiresAt: Date.now() + 86400000 * 7 }));

      return { user: result.user, token: result.token };
   }

   public getCurrentUser(): User | null {
      try {
         const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
         if (!rawSession) return null;

         const session = JSON.parse(rawSession);
         if (!session || !session.userId || Date.now() > session.expiresAt) {
            return null;
         }

           const xhr = new XMLHttpRequest();
           // ส่ง token ใน query แทน Authorization header เพื่อเลี่ยง preflight (InfinityFree free ดัก OPTIONS)
            xhr.open('GET', `${import.meta.env.VITE_API_BASE_URL || 'https://panitijahem.xo.je/api'}/auth_me.php?token=${encodeURIComponent(session.token)}`, false);
           xhr.setRequestHeader('ngrok-skip-browser-warning', NGROK_BYPASS_HEADERS['ngrok-skip-browser-warning']);
           xhr.send();

          if (xhr.status === 200) {
             const result = JSON.parse(xhr.responseText);
             if (result.success && result.user) {
                return result.user;
             }
          }
       } catch (e) {
          // ต่อ backend ไม่ได้ — คืน null ให้ caller จัดการต่อ (ไม่มีโหมดออฟไลน์)
          logWarn('getCurrentUser: backend unreachable, returning null', e);
       }

       return null;
    }

   private sessionRestorePromise: Promise<User | null> | null = null;

   // กันยิง auth_me.php ซ้อนกันเมื่อมี caller พร้อมกันหลายตัว
   // (เช่น React StrictMode รัน mount effect ซ้ำใน dev) — ขอเดียวพอ ใครมาทีหลังรอผลเดียวกัน
   public getCurrentSessionUser(): Promise<User | null> {
      if (!this.sessionRestorePromise) {
         this.sessionRestorePromise = this.restoreSessionInternal().finally(() => {
            this.sessionRestorePromise = null;
         });
      }
      return this.sessionRestorePromise;
   }

   private async restoreSessionInternal(): Promise<User | null> {
      try {
         const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
         if (!rawSession) return null;

         const session = JSON.parse(rawSession);
         if (!session || !session.userId || Date.now() > session.expiresAt) {
            this.logout();
            return null;
         }

         const result = await apiClient.get<{ success: boolean; user: User }>('auth_me.php');

         if (result.success && result.user) {
            return result.user;
         }
       } catch (e) {
          // 401/403 = token ฝั่ง server ใช้ไม่ได้แล้ว → ลบทิ้ง จะได้ไม่ยิง auth_me.php ซ้ำทุกครั้งที่ mount
          // (5xx/เครือข่ายล่ม = backend มีปัญหาชั่วคราว เก็บ token ไว้ก่อน รอบหน้าอาจได้ข้อมูล)
          if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
             this.clearStoredSession();
          } else {
             logWarn('restoreSessionInternal failed (keeping stored session)', e);
          }
       }

       return null;
    }

   // ล้าง session ใน localStorage เท่านั้น (ไม่เรียก auth_logout.php เพราะ token ใช้ไม่ได้แล้ว)
   private clearStoredSession(): void {
      try {
         localStorage.removeItem(SESSION_TOKEN_KEY);
      } catch (e) {
         console.warn('Could not clear stored session', e);
      }
   }

   public logout(): void {
      // เพิกถอน token ฝั่ง server แบบ best-effort — client logout ต้องสำเร็จเสมอแม้ backend ไม่พร้อม
      try {
         apiClient.post<{ success: boolean }>('auth_logout.php').catch((e) => {
            // backend อาจไม่พร้อมใช้งาน ไม่ต้องทำอะไร — แต่ต้องเห็นใน console
            logWarn('auth_logout.php best-effort call failed', e);
         });
      } catch (e) {
         // ignore — ล้าง local ต่อตามปกติ
         logWarn('logout: unexpected error while revoking token', e);
      }
      this.clearStoredSession();
   }

   public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
      const result = await apiClient.post<{ success: boolean; user: User }>('auth_update_profile.php', updates);

      if (result.success && result.user) {
         return result.user;
      }

      throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
   }

   public async deleteAccount(password: string): Promise<void> {
      try {
         await apiClient.delete<{ success: boolean; message: string }>('auth_delete_account.php', { password });
      } finally {
         this.logout();
      }
   }

   public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
      const result = await apiClient.post<{ success: boolean; message: string; resetToken?: string }>('auth_forgot_password.php', { email });
      return { success: true, message: result.message, resetToken: result.resetToken };
   }

   public async resetPassword(token: string, newPassword: string): Promise<boolean> {
      const result = await apiClient.post<{ success: boolean; message: string }>('auth_reset_password.php', { token, newPassword });
      return result.success;
   }

   public async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
      const result = await apiClient.post<{ success: boolean; message: string }>('auth_change_password.php', { oldPassword: oldPass, newPassword: newPass });
      return result.success;
   }

   // ─── user_state sync (ตะกร้า + รายการโปรดข้ามเครื่อง) ───
   public async pullUserState(): Promise<{ cart: { productId: string; quantity: number }[]; wishlist: string[] } | null> {
      try {
         const result = await apiClient.get<{ success: boolean; cart: { productId: string; quantity: number }[]; wishlist: string[] }>('user_state.php');
         if (result.success) return { cart: result.cart ?? [], wishlist: result.wishlist ?? [] };
      } catch (e) {
         // backend ไม่พร้อม — ใช้ข้อมูลบนเครื่องต่อ
         logWarn('pullUserState failed, using local data', e);
      }
      return null;
   }

   public async pushUserState(userId: string): Promise<void> {
      try {
         const data = this.getUserData(userId);
         let cart = data.cart ?? [];
         let wishlist = data.wishlist ?? [];
         try {
            const cartRaw = localStorage.getItem(`bookloop_cart_${userId}`);
            if (cartRaw) {
               const parsed = JSON.parse(cartRaw);
               if (Array.isArray(parsed)) cart = parsed;
            }
            const wishRaw = localStorage.getItem(`bookloop_wishlist_${userId}`);
            if (wishRaw) {
               const parsed = JSON.parse(wishRaw);
               if (Array.isArray(parsed)) wishlist = parsed;
            }
         } catch (e) {
            // ใช้ค่าจาก userData ต่อ
            logWarn('pushUserState: per-key storage parse failed, using userData', e);
         }
         await apiClient.post<{ success: boolean }>('user_state.php', { cart, wishlist });
      } catch (e) {
         // best-effort — sync รอบหน้าจะลองใหม่
         logWarn('pushUserState failed, will retry on next sync', e);
      }
   }

   public addOrder(userId: string, order: UserOrder): void {
      const current = this.getUserData(userId);
      const updatedOrders = [order, ...(current.orders || [])];
      this.saveUserData(userId, { orders: updatedOrders });
   }

   public addListedBook(userId: string, book: UserListedBook): void {
      const current = this.getUserData(userId);
      const updatedBooks = [book, ...(current.listedBooks || [])];
      this.saveUserData(userId, { listedBooks: updatedBooks });
   }
}

export const authService = new AuthService();
