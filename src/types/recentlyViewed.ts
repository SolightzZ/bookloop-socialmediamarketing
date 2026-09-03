export interface RecentlyViewedBook {
  bookId: string;
  viewedAt: number;
}

export interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedBook[];
  trackView: (bookId: string) => void;
  getRecentIds: (count?: number) => string[];
  clearRecent: () => void;
}
