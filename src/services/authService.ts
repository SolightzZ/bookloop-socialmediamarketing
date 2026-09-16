import { User, UserOrder, UserListedBook } from '../types/auth';
import { apiClient } from './apiClient';

export interface UserAccountData {
   cart: { productId: string; quantity: number }[];
   wishlist: string[];
   orders: UserOrder[];
   listedBooks: UserListedBook[];
}

const SESSION_TOKEN_KEY = 'bookloop_auth_session_token';
const USER_DATA_PREFIX = 'bookloop_user_data_';

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

   public async loginWithGoogle(): Promise<{ user: User; token: string }> {
      throw new Error('ยังไม่รองรับการเข้าสู่ระบบด้วย Google ในขณะนี้');
   }

   public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
      const result = await apiClient.post<{ success: boolean; user: User; token: string }>('auth_register.php', { name, email, password });

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
         xhr.open('GET', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/src_backend/api'}/auth_me.php`, false);
         xhr.setRequestHeader('Authorization', `Bearer ${session.token}`);
         xhr.send();

         if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            if (result.success && result.user) {
               return result.user;
            }
         }
      } catch {
         // Backend unavailable
      }

      return null;
   }

   public async getCurrentSessionUser(): Promise<User | null> {
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
      } catch {
         // Backend unavailable
      }

      return null;
   }

   public logout(): void {
      try {
         localStorage.removeItem(SESSION_TOKEN_KEY);
      } catch (e) {
         console.warn('Logout clear error', e);
      }
   }

   public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
      const result = await apiClient.post<{ success: boolean; user: User }>('auth_update_profile.php', updates);

      if (result.success && result.user) {
         return result.user;
      }

      throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
   }

   public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
      throw new Error('ยังไม่รองรับการรีเซ็ตรหัสผ่านในขณะนี้');
   }

   public async resetPassword(token: string, newPassword: string): Promise<boolean> {
      throw new Error('ยังไม่รองรับการรีเซ็ตรหัสผ่านในขณะนี้');
   }

   public async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
      throw new Error('ยังไม่รองรับการเปลี่ยนรหัสผ่านในขณะนี้');
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
