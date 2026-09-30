import { apiClient } from './apiClient';
import {
   getStoredSession,
   isBackendUnreachable,
   loadLocalAccounts,
   notifyOfflineMode,
   saveLocalAccounts,
   toPublicUser,
} from './authService';
import { books, type Book } from '../data/books';
import { getCategoryThaiName, PREVIEW_BOOK_COUNT } from '../data/onboarding';
import type { User } from '../types/auth';

export interface RecommendedBookPayload {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  cover: string;
  url: string;
}

export interface SaveOnboardingInput {
  categories: string[];
  favoriteBooks: string[];
  recommendedBooks: RecommendedBookPayload[];
  skipped: boolean;
}

/**
 * เลือกหนังสือแนะนำจากหมวดที่ผู้ใช้เลือก (เรียงตาม rating)
 * แล้วเติมด้วยหนังสือยอดนิยม (rating สูง) ให้ครบจำนวน — ผสม personalized + general
 */
export function getRecommendedBooks(categoryIds: string[], count: number = PREVIEW_BOOK_COUNT): Book[] {
  const thaiNames = new Set(categoryIds.map(getCategoryThaiName));
  const byRatingDesc = (a: Book, b: Book) => b.rating - a.rating || b.reviewCount - a.reviewCount;

  const matched = books.filter((b) => thaiNames.has(b.category)).sort(byRatingDesc);
  if (matched.length >= count) return matched.slice(0, count);

  const matchedIds = new Set(matched.map((b) => b.id));
  const filler = books.filter((b) => !matchedIds.has(b.id)).sort(byRatingDesc);
  return [...matched, ...filler].slice(0, count);
}

/** base URL ของเว็บ (รองรับ GitHub Pages basename) สำหรับลิงก์ในอีเมล */
export function getSiteBaseUrl(): string {
  const { origin, pathname } = window.location;
  const base = '/bookloop-socialmediamarketing';
  return pathname === base || pathname.startsWith(`${base}/`) ? `${origin}${base}` : origin;
}

export function toBookPayload(book: Book, baseUrl: string): RecommendedBookPayload {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price,
    category: book.category,
    cover: book.cover,
    url: `${baseUrl}/books/${book.id}`,
  };
}

export async function saveOnboardingPreferences(input: SaveOnboardingInput): Promise<User> {
  try {
    const result = await apiClient.post<{ success: boolean; user: User; welcomeEmailQueued?: boolean }>(
      'auth_onboarding.php',
      input,
    );
    if (result.success && result.user) return result.user;
    throw new Error('ไม่สามารถบันทึกความสนใจได้ กรุณาลองใหม่อีกครั้ง');
  } catch (e) {
    if (!isBackendUnreachable(e)) throw e;
    return saveOnboardingLocal(input, e);
  }
}

// whitelist เดียวกับ backend (auth_onboarding.php) — หมวดหลัก 8 + เสริม 8
const ONBOARDING_CATEGORY_IDS = new Set([
  'novel', 'growth', 'business', 'knowledge', 'comic', 'education', 'kids', 'rare',
  'science', 'history', 'technology', 'psychology', 'finance', 'health', 'art', 'language',
]);

/** ต่อ backend ไม่ได้ → บันทึก preferences ลงบัญชีบนเครื่อง (โหมดออฟไลน์) */
function saveOnboardingLocal(input: SaveOnboardingInput, originalError: unknown): User {
  const session = getStoredSession();
  const accounts = loadLocalAccounts();
  const account = accounts.find((a) => a.id === session?.userId);
  // ไม่มีบัญชีบนเครื่อง (เช่น session ของ server) — คง error เดิมไว้ (พฤติกรรมก่อนมี fallback)
  if (!account) throw originalError;

  const skipped = input.skipped === true;
  const categories: string[] = [];
  if (!skipped) {
    for (const raw of input.categories ?? []) {
      const id = String(raw).toLowerCase().trim();
      if (id && ONBOARDING_CATEGORY_IDS.has(id) && !categories.includes(id)) categories.push(id);
      if (categories.length >= 8) break;
    }
  }
  const favoriteBooks: string[] = [];
  if (!skipped) {
    for (const raw of input.favoriteBooks ?? []) {
      const id = String(raw).trim().slice(0, 64);
      if (id && !favoriteBooks.includes(id)) favoriteBooks.push(id);
      if (favoriteBooks.length >= 20) break;
    }
  }
  account.preferences = {
    ...account.preferences,
    categories,
    favoriteBooks,
    onboardingCompleted: true,
    skipped,
    preferencesUpdatedAt: new Date().toISOString(),
    welcomeEmailSentAt: account.preferences?.welcomeEmailSentAt ?? null,
  };
  saveLocalAccounts(accounts);
  notifyOfflineMode();
  return toPublicUser(account);
}
