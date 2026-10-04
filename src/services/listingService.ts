import { apiClient, getApiBaseUrl } from './apiClient';
import { Book } from '../data/books';
import { authService, getStoredSession } from './authService';

export interface ListingItem {
  id: string;
  userId?: string;
  title: string;
  author?: string;
  isbn?: string;
  category: string;
  condition: string;
  price: number;
  originalPrice?: number;
  defects?: string;
  story?: string;
  image?: string;
  status: 'pending' | 'active' | 'rejected' | 'sold' | 'paused';
  createdAt?: string;
  updatedAt?: string;
}

export function resolveImageUrl(url?: string): string {
  if (!url || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // แปลง relative path (เช่น 'images/listings/...') ให้ชี้ไปยัง host ของ backend ถูกต้อง
  const apiBase = getApiBaseUrl();
  const hostBase = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = url.replace(/^\/+/, '');
  return `${hostBase}/${cleanPath}`;
}

export function listingToBook(item: ListingItem): Book {
  const conditionMap: Record<string, Book['condition']> = {
    'ใหม่': 'Excellent',
    'เหมือนใหม่': 'Excellent',
    'ดีมาก': 'Very Good',
    'ดี': 'Good',
    'พอใช้': 'Acceptable',
    'มีตำหนิ': 'Acceptable',
    'Excellent': 'Excellent',
    'Very Good': 'Very Good',
    'Good': 'Good',
    'Acceptable': 'Acceptable',
  };

  const cond = conditionMap[item.condition] || 'Good';
  const coverUrl = resolveImageUrl(item.image);

  return {
    id: item.id,
    title: item.title,
    author: item.author || 'ไม่ระบุผู้แต่ง',
    category: item.category || 'ทั่วไป',
    cover: coverUrl,
    images: [coverUrl],
    price: Number(item.price),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    condition: cond,
    conditionDescription: item.defects || item.story || '',
    defects: item.defects ? [item.defects] : undefined,
    story: item.story || undefined,
    sellerNote: item.story || item.defects || undefined,
    rating: 5,
    reviewCount: 0,
    stock: item.status === 'sold' ? 0 : 1,
    seller: {
      id: item.userId || 'seller',
      name: 'ผู้ขายชุมชน BookLoop',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      itemsSold: 1,
      responseRate: 100,
      joinedAt: item.createdAt ? item.createdAt.split('T')[0] : '2026-10',
      verified: true,
    },
    isbn: item.isbn,
  };
}

export const listingService = {
  /**
   * ดึงรายการลงขายที่ผ่านการอนุมัติแล้ว (status = active) เพื่อนำไปแสดงในหน้าร้าน / ค้นหา
   */
  async getActiveListings(): Promise<Book[]> {
    try {
      const res = await apiClient.get<{ success: boolean; items: ListingItem[] }>('listings_list.php?limit=50');
      if (res && res.success && Array.isArray(res.items)) {
        return res.items.map(listingToBook);
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * ดึงรายการลงขายของตัวเอง (ทุกสถานะ pending, active, rejected)
   */
  async getMyListings(): Promise<ListingItem[]> {
    try {
      const res = await apiClient.get<{ success: boolean; items: ListingItem[] }>('listings_list.php?mine=1&limit=50');
      if (res && res.success && Array.isArray(res.items)) {
        return res.items;
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * ค้นหารายการลงขายตาม ID
   */
  async getListingById(id: string): Promise<Book | null> {
    try {
      const res = await apiClient.get<{ success: boolean; items: ListingItem[] }>(`listings_list.php?id=${encodeURIComponent(id)}`);
      if (res && res.success && Array.isArray(res.items) && res.items.length > 0) {
        return listingToBook(res.items[0]);
      }
    } catch {
      // fallback local
    }

    try {
      const session = getStoredSession();
      if (session?.userId) {
        const userData = authService.getUserData(session.userId);
        const match = userData.listedBooks?.find((b) => b.id === id);
        if (match) {
          const coverUrl = resolveImageUrl(match.cover);
          const conditionMap: Record<string, Book['condition']> = {
            'ใหม่': 'Excellent',
            'เหมือนใหม่': 'Excellent',
            'ดีมาก': 'Very Good',
            'ดี': 'Good',
            'พอใช้': 'Acceptable',
            'มีตำหนิ': 'Acceptable',
            'Excellent': 'Excellent',
            'Very Good': 'Very Good',
            'Good': 'Good',
            'Acceptable': 'Acceptable',
          };
          const cond = conditionMap[match.condition] || 'Good';
          return {
            id: match.id,
            title: match.title,
            author: match.author || 'ไม่ระบุผู้แต่ง',
            category: match.category || 'ทั่วไป',
            cover: coverUrl,
            images: [coverUrl],
            price: Number(match.price),
            originalPrice: match.originalPrice ? Number(match.originalPrice) : undefined,
            condition: cond,
            conditionDescription: match.defects || match.story || '',
            defects: match.defects ? [match.defects] : undefined,
            story: match.story,
            sellerNote: match.story || match.defects,
            rating: 5,
            reviewCount: 0,
            stock: match.status === 'sold' ? 0 : 1,
            seller: {
              id: session.userId,
              name: 'ผู้ขาย (คุณ)',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              rating: 5,
              itemsSold: 1,
              responseRate: 100,
              joinedAt: match.dateListed || new Date().toISOString().split('T')[0],
              verified: true,
            },
            isbn: match.isbn,
          };
        }
      }
    } catch {
      // ignore
    }

    return null;
  },

  /**
   * แก้ไขข้อมูลและรูปภาพของรายการลงขาย
   */
  async updateListing(
    id: string,
    data: {
      title?: string;
      author?: string;
      isbn?: string;
      category?: string;
      condition?: string;
      price?: number;
      originalPrice?: number;
      defects?: string;
      story?: string;
      image?: string;
    }
  ): Promise<{ success: boolean; message?: string; listing?: ListingItem }> {
    return apiClient.post<{ success: boolean; message?: string; listing?: ListingItem }>(
      'listings_update.php',
      { id, ...data }
    );
  },
};
