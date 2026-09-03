import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { FeaturedBooksSection } from '../components/home/FeaturedBooksSection';
import { BookDiscovery } from '../components/discovery/BookDiscovery';
import { CategoryExplorer } from '../components/home/CategoryExplorer';
import { HomeValueProps } from '../components/home/HomeValueProps';
import { BookLoopJourney } from '../components/BookLoopJourney';
import { BookStoriesSection } from '../components/BookStoriesSection';
import { SocialUgcSection } from '../components/SocialUgcSection';
import { FinalCTA } from '../components/home/FinalCTA';
import { RecentlyViewedSection } from '../components/home/RecentlyViewedSection';

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

      {/* 4. Featured / Curated Books */}
      <FeaturedBooksSection />

      {/* 4.2 Recently Viewed (dynamic) */}
      <RecentlyViewedSection />

      {/* 4.5 Interactive 2D Discovery Playground */}
      <BookDiscovery />

      {/* 5. Explore Categories */}
      <CategoryExplorer />

      {/* 6. Why BookLoop */}
      <HomeValueProps />

      {/* 7. How BookLoop Works */}
      <BookLoopJourney />

      {/* 8. Behind The Books */}
      <BookStoriesSection />

      {/* 9. Social Community */}
      <SocialUgcSection />

      {/* 10. Final CTA */}
      <FinalCTA />
    </Box>
  );
}
