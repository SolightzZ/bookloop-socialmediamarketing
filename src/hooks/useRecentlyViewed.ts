import { useContext } from 'react';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
