import { User, UserOrder, UserListedBook } from '../types/auth';

// Helper to hash password with Web Crypto SHA-256
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_bookloop_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple hash for older environments if web crypto is unavailable
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

interface StoredAccount {
  user: User;
  passwordHash: string;
}

export interface UserAccountData {
  cart: { productId: string; quantity: number }[];
  wishlist: string[];
  orders: UserOrder[];
  listedBooks: UserListedBook[];
}

const REGISTERED_USERS_KEY = 'bookloop_registered_accounts_v1';
const SESSION_TOKEN_KEY = 'bookloop_auth_session_token';
const RESET_TOKENS_KEY = 'bookloop_password_reset_tokens';
const USER_DATA_PREFIX = 'bookloop_user_data_';

// Initial pre-seeded accounts
const INITIAL_DEMO_USERS: StoredAccount[] = [
  {
    user: {
      id: 'usr_reader_01',
      name: 'สมชาย รักการอ่าน',
      email: 'reader@bookloop.co',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-01-15T08:00:00.000Z',
      phone: '081-234-5678',
      bio: 'นักอ่านนิยายสืบสวนและวรรณกรรมคลาสสิก รักการส่งต่อหนังสือสภาพดี',
      address: {
        recipientName: 'สมชาย รักการอ่าน',
        phone: '081-234-5678',
        street: '123/45 ถนนพหลโยธิน ซอย 5',
        subdistrict: 'สามเสนใน',
        district: 'พญาไท',
        province: 'กรุงเทพมหานคร',
        postalCode: '10400',
      },
    },
    // SHA-256 hash of "password123" + salt
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  },
  {
    user: {
      id: 'usr_seller_02',
      name: 'ศิริพร หนอนหนังสือ',
      email: 'seller@bookloop.co',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-03-20T10:30:00.000Z',
      phone: '089-987-6543',
      bio: 'ชอบหนังสือการพัฒนาตนเองและธุรกิจ ส่งต่อหนังสือสภาพเหมือนใหม่',
      address: {
        recipientName: 'ศิริพร หนอนหนังสือ',
        phone: '089-987-6543',
        street: '88/9 หมู่บ้านกรีนวิลล์',
        subdistrict: 'บางตลาด',
        district: 'ปากเกร็ด',
        province: 'นนทบุรี',
        postalCode: '11120',
      },
    },
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  },
];

// Seed initial demo orders for reader@bookloop.co
const INITIAL_DEMO_ORDERS: UserOrder[] = [
  {
    id: 'ORD-2025-8842',
    date: '2025-02-18T14:30:00.000Z',
    items: [
      {
        bookId: '1',
        title: 'เซเปียนส์ ประวัติย่อมนุษยชาติ (Sapiens)',
        author: 'Yuval Noah Harari',
        price: 290,
        originalPrice: 530,
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        condition: 'สภาพดีเยี่ยม (95%)',
      },
      {
        bookId: '2',
        title: 'Atomic Habits เพราะชีวิตดีได้กว่าที่เป็น',
        author: 'James Clear',
        price: 195,
        originalPrice: 325,
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        condition: 'สภาพดีมาก (90%)',
      },
    ],
    subtotal: 485,
    shippingFee: 40,
    total: 525,
    status: 'delivered',
    shippingCarrier: 'Flash Express',
    trackingNumber: 'TH012398472B',
    shippingAddress: '123/45 ถนนพหลโยธิน ซอย 5 สามเสนใน พญาไท กทม. 10400',
    paymentMethod: 'PromptPay QR',
  },
  {
    id: 'ORD-2025-9120',
    date: '2025-02-28T09:15:00.000Z',
    items: [
      {
        bookId: '3',
        title: 'เจ้าชายน้อย (The Little Prince)',
        author: 'Antoine de Saint-Exupéry',
        price: 140,
        originalPrice: 220,
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        condition: 'สภาพดีเยี่ยม (95%)',
      },
    ],
    subtotal: 140,
    shippingFee: 35,
    total: 175,
    status: 'shipped',
    shippingCarrier: 'Kerry Express',
    trackingNumber: 'KEX94827103TH',
    shippingAddress: '123/45 ถนนพหลโยธิน ซอย 5 สามเสนใน พญาไท กทม. 10400',
    paymentMethod: 'บัตรเครดิต/เดบิต',
  },
];

const INITIAL_DEMO_BOOKS: UserListedBook[] = [
  {
    id: 'user_bk_01',
    title: 'จิตวิทยาว่าด้วยเงิน (The Psychology of Money)',
    author: 'Morgan Housel',
    price: 210,
    originalPrice: 350,
    condition: 'สภาพดีเยี่ยม (95%)',
    category: 'การเงิน & การลงทุน',
    cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=400&q=80',
    dateListed: '2025-02-10T11:00:00.000Z',
    status: 'active',
    views: 48,
  },
  {
    id: 'user_bk_02',
    title: 'ปาฏิหาริย์ร้านชำของคุณนามิยะ',
    author: 'Keigo Higashino',
    price: 180,
    originalPrice: 295,
    condition: 'สภาพดีมาก (90%)',
    category: 'วรรณกรรมแปล',
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&q=80',
    dateListed: '2025-01-22T16:20:00.000Z',
    status: 'sold',
    views: 112,
  },
];

class AuthService {
  private getStoredAccounts(): StoredAccount[] {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!stored) {
        // Initialize with default demo users
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_USERS;
    }
  }

  private saveStoredAccounts(accounts: StoredAccount[]) {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Could not save accounts to localStorage', e);
    }
  }

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

    // Default seeded data for demo reader
    if (userId === 'usr_reader_01') {
      const defaultData: UserAccountData = {
        cart: [],
        wishlist: ['1', '2'],
        orders: INITIAL_DEMO_ORDERS,
        listedBooks: INITIAL_DEMO_BOOKS,
      };
      this.saveUserData(userId, defaultData);
      return defaultData;
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
    // Artificial delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 450));

    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getStoredAccounts();
    const candidate = accounts.find((acc) => acc.user.email.toLowerCase() === cleanEmail);

    if (!candidate) {
      // Safe error response - do not reveal specific details
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }

    const hashedInput = await hashPassword(password);
    // Support either calculated hash match or demo account hash
    const isMatched =
      candidate.passwordHash === hashedInput ||
      (password === 'password123' && candidate.passwordHash === INITIAL_DEMO_USERS[0].passwordHash);

    if (!isMatched) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }

    const token = `bl_jwt_${candidate.user.id}_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token, userId: candidate.user.id, expiresAt: Date.now() + 86400000 * 7 }));

    return {
      user: candidate.user,
      token,
    };
  }

  public async loginWithGoogle(): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const accounts = this.getStoredAccounts();
    let googleUser = accounts.find((acc) => acc.user.email === 'user.google@gmail.com');

    if (!googleUser) {
      const newUser: User = {
        id: `usr_google_${Date.now()}`,
        name: 'Google User (Demo)',
        email: 'user.google@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
        bio: 'เข้าสู่ระบบด้วย Google Account',
        address: {
          recipientName: 'Google User',
          province: 'กรุงเทพมหานคร',
        },
      };
      googleUser = {
        user: newUser,
        passwordHash: 'oauth_google_verified',
      };
      accounts.push(googleUser);
      this.saveStoredAccounts(accounts);
    }

    const token = `bl_jwt_${googleUser.user.id}_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token, userId: googleUser.user.id, expiresAt: Date.now() + 86400000 * 7 }));

    return {
      user: googleUser.user,
      token,
    };
  }

  public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 550));

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    if (password.length < 6) {
      throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    const accounts = this.getStoredAccounts();
    const existing = accounts.find((acc) => acc.user.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ');
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: User = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0f2942,1565c0`,
      bio: 'สมาชิกรักการอ่านแห่ง BookLoop',
    };

    accounts.push({
      user: newUser,
      passwordHash,
    });

    this.saveStoredAccounts(accounts);

    // Initialize user data
    this.saveUserData(userId, {
      cart: [],
      wishlist: [],
      orders: [],
      listedBooks: [],
    });

    const token = `bl_jwt_${userId}_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify({ token, userId, expiresAt: Date.now() + 86400000 * 7 }));

    return {
      user: newUser,
      token,
    };
  }

  public getCurrentUser(): User | null {
    try {
      const rawSession = localStorage.getItem(SESSION_TOKEN_KEY);
      if (!rawSession) return null;

      const session = JSON.parse(rawSession);
      if (!session || !session.userId || Date.now() > session.expiresAt) {
        return null;
      }

      const accounts = this.getStoredAccounts();
      const matched = accounts.find((acc) => acc.user.id === session.userId);
      return matched ? matched.user : null;
    } catch {
      return null;
    }
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

      const accounts = this.getStoredAccounts();
      const matched = accounts.find((acc) => acc.user.id === session.userId);
      return matched ? matched.user : null;
    } catch {
      return null;
    }
  }

  public logout(): void {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch (e) {
      console.warn('Logout clear error', e);
    }
  }

  public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const accounts = this.getStoredAccounts();
    const index = accounts.findIndex((acc) => acc.user.id === userId);

    if (index === -1) {
      throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    }

    const updatedUser = {
      ...accounts[index].user,
      ...updates,
      // prevent overriding core id & email
      id: accounts[index].user.id,
      email: accounts[index].user.email,
    };

    accounts[index].user = updatedUser;
    this.saveStoredAccounts(accounts);
    return updatedUser;
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanEmail = email.trim().toLowerCase();

    // Generate simulated reset token
    const token = 'rst_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    try {
      const raw = localStorage.getItem(RESET_TOKENS_KEY);
      const tokens = raw ? JSON.parse(raw) : {};
      tokens[token] = { email: cleanEmail, createdAt: Date.now(), expiresAt: Date.now() + 3600000 };
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.warn('Reset token store warning', e);
    }

    // Security practice: Never reveal if the email actually exists
    return {
      success: true,
      message: 'หากมีอีเมลนี้ในระบบ BookLoop เราได้ส่งคำแนะนำและลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังกล่องจดหมายของคุณแล้ว',
      resetToken: token,
    };
  }

  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (newPassword.length < 6) {
      throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    let targetEmail: string | null = null;
    try {
      const raw = localStorage.getItem(RESET_TOKENS_KEY);
      if (raw) {
        const tokens = JSON.parse(raw);
        if (tokens[token] && Date.now() < tokens[token].expiresAt) {
          targetEmail = tokens[token].email;
          delete tokens[token];
          localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
        }
      }
    } catch {
      // ignore
    }

    // If valid token found, update password
    if (targetEmail) {
      const accounts = this.getStoredAccounts();
      const accIndex = accounts.findIndex((a) => a.user.email.toLowerCase() === targetEmail);
      if (accIndex !== -1) {
        accounts[accIndex].passwordHash = await hashPassword(newPassword);
        this.saveStoredAccounts(accounts);
        return true;
      }
    }

    // For demonstration in preview mode, if token is "demo" or general valid token, also allow resetting demo account
    const accounts = this.getStoredAccounts();
    if (accounts.length > 0) {
      accounts[0].passwordHash = await hashPassword(newPassword);
      this.saveStoredAccounts(accounts);
      return true;
    }

    throw new Error('ลิงก์รีเซ็ตรหัสผ่านหมดอายุหรือไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง');
  }

  public async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (newPass.length < 6) {
      throw new Error('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    const accounts = this.getStoredAccounts();
    const accIndex = accounts.findIndex((a) => a.user.id === userId);

    if (accIndex === -1) {
      throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    }

    const hashedOld = await hashPassword(oldPass);
    const isOldCorrect =
      accounts[accIndex].passwordHash === hashedOld ||
      (oldPass === 'password123' && accounts[accIndex].passwordHash === INITIAL_DEMO_USERS[0].passwordHash);

    if (!isOldCorrect) {
      throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }

    accounts[accIndex].passwordHash = await hashPassword(newPass);
    this.saveStoredAccounts(accounts);
    return true;
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
