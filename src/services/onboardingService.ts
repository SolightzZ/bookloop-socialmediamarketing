import { apiClient } from './apiClient';
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

/** base URL ของเว็บ (รองรับ dev '/', GitHub Pages basename และ /app/ same-origin) สำหรับลิงก์ในอีเมล */
export function getSiteBaseUrl(): string {
  const { origin } = window.location;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base ? `${origin}${base}` : origin;
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
  const result = await apiClient.post<{ success: boolean; user: User; welcomeEmailQueued?: boolean }>(
    'auth_onboarding.php',
    input,
  );
  if (result.success && result.user) return result.user;
  throw new Error('ไม่สามารถบันทึกความสนใจได้ กรุณาลองใหม่อีกครั้ง');
}
