import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { BookRecommendationSection } from '../components/home/BookRecommendationSection';
import { RecommendedForYou } from '../components/home/RecommendedForYou';
import { BookDiscovery } from '../components/discovery/BookDiscovery';
import { CategoryExplorer } from '../components/home/CategoryExplorer';
import { SocialUgcSection } from '../components/SocialUgcSection';
import { HomeNewsletterSection } from '../components/home/HomeNewsletterSection';
import { FinalCTA } from '../components/home/FinalCTA';
import { RecentlyViewedSection } from '../components/home/RecentlyViewedSection';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
      <Hero
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {/* 3. Trust / Value Strip */}
      <TrustStrip />

      {/* 4. Featured / Curated Books (Continuously Auto-scrolling Book Carousel) */}
      <BookRecommendationSection />

      {/* 4.1 Recommended For You (personalized from onboarding preferences) */}
      <RecommendedForYou />

      {/* 4.2 Recently Viewed (dynamic) */}
      <RecentlyViewedSection />

      {/* 4.5 Interactive 2D Discovery Playground */}
      <BookDiscovery />

      {/* 5. Explore Categories */}
      <CategoryExplorer />

      {/* 9. Social Community */}
      <SocialUgcSection />

      {/* 9.5 Newsletter Subscription Section (Email Only) */}
      <HomeNewsletterSection />

      {/* 10. Final CTA */}
      <FinalCTA />

      {/* First-time onboarding popup (auto แสดงเฉพาะ user ที่ยังไม่เคยทำ) */}
      <OnboardingModal />
    </Box>
  );
}
