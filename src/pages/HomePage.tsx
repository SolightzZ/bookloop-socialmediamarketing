import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';

// Below-fold sections are lazy-loaded so the initial bundle stays small and
// LCP (Hero) is not blocked by three.js / motion / discovery / carousel code.
const BookRecommendationSection = React.lazy(() => import('../components/home/BookRecommendationSection').then((m) => ({ default: m.BookRecommendationSection })));
const RecommendedForYou = React.lazy(() => import('../components/home/RecommendedForYou').then((m) => ({ default: m.RecommendedForYou })));
const RecentlyViewedSection = React.lazy(() => import('../components/home/RecentlyViewedSection').then((m) => ({ default: m.RecentlyViewedSection })));
const BookDiscovery = React.lazy(() => import('../components/discovery/BookDiscovery').then((m) => ({ default: m.BookDiscovery })));
const CategoryExplorer = React.lazy(() => import('../components/home/CategoryExplorer').then((m) => ({ default: m.CategoryExplorer })));
const SocialUgcSection = React.lazy(() => import('../components/SocialUgcSection').then((m) => ({ default: m.SocialUgcSection })));
const HomeNewsletterSection = React.lazy(() => import('../components/home/HomeNewsletterSection').then((m) => ({ default: m.HomeNewsletterSection })));
const OnboardingModal = React.lazy(() => import('../components/onboarding/OnboardingModal').then((m) => ({ default: m.OnboardingModal })));

// Warm the discovery + three.js chunks while the browser is idle so the
// interactive section feels instant when scrolled into view — without
// competing with first-paint bandwidth. Skipped on data-saver / 2G links.
if (typeof window !== 'undefined') {
   const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
   };
   const conn = nav.connection;
   const slowConnection = conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
   if (!slowConnection) {
      const warm = () => {
         void import('../components/discovery/BookDiscovery');
      };
      const win = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
      if (typeof win.requestIdleCallback === 'function') {
         win.requestIdleCallback(warm, { timeout: 4000 });
      } else {
         setTimeout(warm, 3500);
      }
   }
}

/** Render children only when scrolled near the viewport — defers both
 *  network fetch (lazy chunk) and 3D/motion initialization cost. */
function LazyOnVisible({ children, minHeight = 320 }: { children: React.ReactNode; minHeight?: number }) {
   const ref = useRef<HTMLDivElement>(null);
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const el = ref.current;
      if (!el || visible) return;
      if (typeof IntersectionObserver === 'undefined') {
         setVisible(true);
         return;
      }
      const observer = new IntersectionObserver(
         (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
               setVisible(true);
               observer.disconnect();
            }
         },
         { rootMargin: '600px 0px' },
      );
      observer.observe(el);
      return () => observer.disconnect();
   }, [visible]);

   return (
      <div
         ref={ref}
         style={{
            minHeight: visible ? undefined : minHeight,
            // กัน layout ใต้โฟลด์ถ่วง initial render — บราวเซอร์ข้ามงาน layout/paint จนใกล้ viewport
            contentVisibility: visible ? undefined : ('auto' as const),
            containIntrinsicSize: visible ? undefined : `auto ${minHeight}px`,
         }}>
         {visible ? <Suspense fallback={null}>{children}</Suspense> : null}
      </div>
   );
}

export default function HomePage() {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   // โมดัล onboarding เลื่อนไปโหลดตอน browser ว่าง — ไม่แย่ง bandwidth/parse กับ Hero (LCP)
   const [showOnboarding, setShowOnboarding] = useState(false);

   useEffect(() => {
      const win = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
      if (typeof win.requestIdleCallback === 'function') {
         const id = win.requestIdleCallback(() => setShowOnboarding(true), { timeout: 5000 });
         return () => (win as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      }
      const t = setTimeout(() => setShowOnboarding(true), 2500);
      return () => clearTimeout(t);
   }, []);

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         trackEvent('search_book', { query: searchQuery.trim() });
         navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      }
   };

   return (
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
         {/* 2. Hero Section (Cute 2D Editorial Illustrated Hero) */}
         <Hero searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSearchSubmit={handleSearch} />

         {/* 3. Trust / Value Strip */}
         <TrustStrip />

         {/* 4. Featured / Curated Books (Continuously Auto-scrolling Book Carousel) */}
         <LazyOnVisible minHeight={380}>
            <BookRecommendationSection />
         </LazyOnVisible>

         <LazyOnVisible>
            {/* 4.1 Recommended For You (personalized from onboarding preferences) */}
            <RecommendedForYou />
         </LazyOnVisible>

         <LazyOnVisible minHeight={0}>
            {/* 4.2 Recently Viewed (dynamic) */}
            <RecentlyViewedSection />
         </LazyOnVisible>

         <LazyOnVisible minHeight={480}>
            {/* 4.5 Interactive 2D Discovery Playground (pulls three.js — keep off initial load) */}
            <BookDiscovery />
         </LazyOnVisible>

         <LazyOnVisible>
            {/* 5. Explore Categories */}
            <CategoryExplorer />
         </LazyOnVisible>

         <LazyOnVisible>
            {/* 9. Social Community */}
            <SocialUgcSection />
         </LazyOnVisible>

         <LazyOnVisible minHeight={200}>
            {/* 9.5 Newsletter Subscription Section (Email Only) */}
            <HomeNewsletterSection />
         </LazyOnVisible>

         {/* First-time onboarding popup (auto แสดงเฉพาะ user ที่ยังไม่เคยทำ) */}
         {showOnboarding && (
            <Suspense fallback={null}>
               <OnboardingModal />
            </Suspense>
         )}
      </Box>
   );
}
