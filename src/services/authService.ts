import { User, UserOrder, UserListedBook } from '../types/auth';
import { showToast } from '../utils/alerts';
import { apiClient, ApiError } from './apiClient';

export interface UserAccountData {
   cart: { productId: string; quantity: number }[];
   wishlist: string[];
   orders: UserOrder[];
   listedBooks: UserListedBook[];
}

const SESSION_TOKEN_KEY = 'bookloop_auth_session_token';
const USER_DATA_PREFIX = 'bookloop_user_data_';

// ─── Local demo fallback ─────────────────────────────────────────────
// InfinityFree free ดัก request ข้าม origin ที่ edge (หน้า challenge ?i=1 +
// third-party cookie ถูก browser บล็อก) ทำให้ fetch ล้มระดับเครือข่าย
// (ApiError status 0 — browser ไม่อนุญาตให้อ่าน response เลย) ก่อนถึง PHP เสมอ
// fallback นี้ให้สมัคร/ล็อกอิน/ใช้งานต่อได้โดยเก็บบัญชีบนเครื่อง (localStorage)
// โหมดนี้ชัดเจนว่าเป็น "บัญชีบนเครื่อง" ไม่ใช่บัญชีบน server — เมื่อ backend
// ต่อถึง (same-origin /app หรือย้ายโฮสต์) ระบบจะกลับไปใช้ server เป็นหลักเอง
const LOCAL_USERS_KEY = 'bookloop_local_users';
const OFFLINE_NOTICE_KEY = 'bookloop_offline_notice_shown';

interface LocalAccount extends User {
   passHash: string;
}

function isBackendUnreachable(e: unknown): boolean {
   return (
      e instanceof ApiError &&
      (e.status === 0 || e.message.includes('HTML แทน JSON'))
   );
}

function notifyOfflineMode(): void {
   try {
      if (sessionStorage.getItem(OFFLINE_NOTICE_KEY)) return;
      sessionStorage.setItem(OFFLINE_NOTICE_KEY, '1');
   } catch {
      // private browsing — ข้ามการกัน toast ซ้ำ
   }
   try {
      showToast('โหมดออฟไลน์', 'ต่อ backend ไม่ได้ ใช้บัญชีบนเครื่องนี้ชั่วคราว', 'warning');
   } catch {
      // toast ล้มต้องไม่พัง auth flow
   }
}

function loadLocalAccounts(): LocalAccount[] {
   try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
   } catch {
      return [];
   }
}

function saveLocalAccounts(accounts: LocalAccount[]): void {
   try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(accounts));
   } catch {
      // storage เต็ม — ปล่อยให้ caller ล้มตามธรรมชาติ
   }
}

function toPublicUser(account: LocalAccount): User {
   const { passHash: _passHash, ...publicUser } = account;
   return publicUser as User;
}

async function sha256Hex(text: string): Promise<string> {
   const data = new TextEncoder().encode(text);
   if (typeof crypto !== 'undefined' && crypto.subtle) {
      const digest = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest))
         .map((b) => b.toString(16).padStart(2, '0'))
         .join('');
   }
   // fallback เผื่อ non-secure context รุ่นเก่า — ดีกว่าเก็บ plaintext
   let h1 = 0xdeadbeef;
   let h2 = 0x41c6ce57;
   for (let i = 0; i < text.length; i++) {
      const ch = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
   }
   h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
   h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
   return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function randomLocalId(prefix: string): string {
   try {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      return `${prefix}${Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
   } catch {
      return `${prefix}${Date.now().toString(16)}${Math.floor(Math.random() * 0xffff).toString(16)}`;
   }
}

function writeLocalSession(token: string, userId: string): void {
   localStorage.setItem(
      SESSION_TOKEN_KEY,
      JSON.stringify({ token, userId, expiresAt: Date.now() + 86400000 * 7 }),
   );
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
      try {
         const result = await apiClient.post<{ success: boolean; user: User; token: string }>('auth_login.php', { email, password });

         localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token: result.token, userId: result.user.id, expiresAt: Date.now() + 86400000 * 7 }));

         return { user: result.user, token: result.token };
      } catch (e) {
         if (!isBackendUnreachable(e)) throw e;
         return this.loginLocal(email, password);
      }
   }

   private async loginLocal(email: string, password: string): Promise<{ user: User; token: string }> {
      const clean = email.toLowerCase().trim();
      const account = loadLocalAccounts().find((a) => a.email.toLowerCase() === clean);
      if (!account) {
         throw new Error('ไม่พบบัญชีนี้บนเครื่อง (โหมดออฟไลน์) กรุณาสมัครสมาชิกใหม่');
      }
      if ((await sha256Hex(password)) !== account.passHash) {
         throw new Error('รหัสผ่านไม่ถูกต้อง');
      }
      const token = randomLocalId('bl_local_');
      writeLocalSession(token, account.id);
      notifyOfflineMode();
      return { user: toPublicUser(account), token };
   }

   public async register(name: string, email: string, password: string, subscribeNewsletter: boolean = false): Promise<{ user: User; token: string }> {
      try {
         const result = await apiClient.post<{ success: boolean; user: User; token: string }>('auth_register.php', { name, email, password, subscribeNewsletter });

         localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token: result.token, userId: result.user.id, expiresAt: Date.now() + 86400000 * 7 }));

         return { user: result.user, token: result.token };
      } catch (e) {
         if (!isBackendUnreachable(e)) throw e;
         return this.registerLocal(name, email, password);
      }
   }

   private async registerLocal(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
      const cleanName = name.trim();
      const cleanEmail = email.toLowerCase().trim();
      if (!cleanName || !cleanEmail || !password) {
         throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
         throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
      }
      if (password.length < 6) {
         throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      }
      const accounts = loadLocalAccounts();
      if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
         throw new Error('อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ');
      }
      const now = new Date().toISOString();
      const account: LocalAccount = {
         id: randomLocalId('usr_local_'),
         name: cleanName,
         email: cleanEmail,
         passHash: await sha256Hex(password),
         avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(cleanName) + '&backgroundColor=0f2942,1565c0',
         phone: '',
         bio: 'สมาชิกรักการอ่านแห่ง BookLoop',
         address: {},
         createdAt: now,
      } as LocalAccount;
      accounts.push(account);
      saveLocalAccounts(accounts);
      const token = randomLocalId('bl_local_');
      writeLocalSession(token, account.id);
      notifyOfflineMode();
      return { user: toPublicUser(account), token };
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
          xhr.open('GET', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth_me.php?token=${encodeURIComponent(session.token)}`, false);
          xhr.send();

          if (xhr.status === 200) {
             const result = JSON.parse(xhr.responseText);
             if (result.success && result.user) {
                return result.user;
             }
          }
       } catch {
          // Backend unavailable — fallback บัญชีบนเครื่อง (โหมดออฟไลน์)
          try {
             const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
             const session = rawSession ? JSON.parse(rawSession) : null;
             if (session?.userId) {
                const account = loadLocalAccounts().find((a) => a.id === session.userId);
                if (account) return toPublicUser(account);
             }
          } catch {
             // ignore
          }
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
          }
          // ต่อ backend ไม่ได้ (CORS/edge block) → ใช้บัญชีบนเครื่องต่อ session เดิม
          if (isBackendUnreachable(e)) {
             try {
                const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
                const session = rawSession ? JSON.parse(rawSession) : null;
                if (session?.userId && Date.now() <= session.expiresAt) {
                   const account = loadLocalAccounts().find((a) => a.id === session.userId);
                   if (account) return toPublicUser(account);
                }
             } catch {
                // ignore
             }
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
         apiClient.post<{ success: boolean }>('auth_logout.php').catch(() => {
            // backend อาจไม่พร้อมใช้งาน ไม่ต้องทำอะไร
         });
      } catch {
         // ignore — ล้าง local ต่อตามปกติ
      }
      this.clearStoredSession();
   }

   public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
      try {
         const result = await apiClient.post<{ success: boolean; user: User }>('auth_update_profile.php', updates);

         if (result.success && result.user) {
            return result.user;
         }

         throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
      } catch (e) {
         if (!isBackendUnreachable(e)) throw e;
         const accounts = loadLocalAccounts();
         const account = accounts.find((a) => a.id === userId);
         if (!account) throw new Error('ไม่พบบัญชีบนเครื่อง');
         const allowed: (keyof User)[] = ['name', 'phone', 'bio', 'address', 'avatar'];
         for (const field of allowed) {
            if (updates[field] !== undefined) {
               (account as unknown as Record<string, unknown>)[field] = updates[field];
            }
         }
         saveLocalAccounts(accounts);
         notifyOfflineMode();
         return toPublicUser(account);
      }
   }

   public async deleteAccount(password: string): Promise<void> {
      try {
         await apiClient.delete<{ success: boolean; message: string }>('auth_delete_account.php', { password });
      } catch (e) {
         // โหมดออฟไลน์: ตรวจรหัสผ่านกับบัญชีบนเครื่องก่อนลบ
         if (!isBackendUnreachable(e)) throw e;
         try {
            const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
            const session = rawSession ? JSON.parse(rawSession) : null;
            const accounts = loadLocalAccounts();
            const account = accounts.find((a) => a.id === session?.userId);
            if (!account) throw new Error('ไม่พบบัญชีบนเครื่อง');
            if ((await sha256Hex(password)) !== account.passHash) {
               throw new Error('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
            }
            saveLocalAccounts(accounts.filter((a) => a.id !== account.id));
         } catch (err) {
            // ล้าง session ต่อตามปกติ ( semantics เดียวกับ path server)
            this.logout();
            if (err instanceof Error && err.message === 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง') throw err;
            return;
         }
      } finally {
         this.logout();
      }
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
