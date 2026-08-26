import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import { BookCard } from '../components/BookCard';
import { BookLoopJourney } from '../components/BookLoopJourney';
import { BookStoriesSection } from '../components/BookStoriesSection';
import { SocialUgcSection } from '../components/SocialUgcSection';
import { MarketingFunnel } from '../components/MarketingFunnel';
import { tokens } from '../theme';
import { trackEvent } from '../utils/analytics';
import { HomeHeroBanner } from '../components/home/HomeHeroBanner';
import { HomeCampaignBanner } from '../components/home/HomeCampaignBanner';
import { HomeCategoryGrid } from '../components/home/HomeCategoryGrid';
import { HomeValueProps } from '../components/home/HomeValueProps';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('search_book', { query: searchQuery });
      navigate(`/books?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  return (
    <Box>
      {/* 1. Hero Section */}
      <HomeHeroBanner
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {/* 2. Campaign Banner */}
      <HomeCampaignBanner />

      {/* 3. Categories Discovery */}
      <HomeCategoryGrid />

      {/* 4. Featured Books */}
      <Box sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 'bold',
                  letterSpacing: 1.5,
                  display: 'block',
                }}
              >
                CURATED SELECTION
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                หนังสือแนะนำประจำสัปดาห์
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/books')}
              sx={{ fontWeight: 'bold' }}
            >
              ดูหนังสือทั้งหมด ({books.length})
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredBooks.map((book) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={book.id}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Value Proposition (4 key pillars) */}
      <HomeValueProps />

      {/* 6. How BookLoop Works */}
      <BookLoopJourney />

      {/* 7. Book Stories (Behind the books) */}
      <BookStoriesSection />

      {/* 8. Social UGC Feed */}
      <SocialUgcSection />

      {/* 9. Marketing Funnel Strategy Component */}
      <MarketingFunnel />

      {/* 10. Final CTA */}
      <Box sx={{ bgcolor: tokens.colors.ctaBg, color: tokens.colors.ctaHeading, py: 12, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: tokens.colors.ctaHeading, letterSpacing: '-0.5px' }}>
            หนังสือเล่มต่อไปของคุณ อาจกำลังรออยู่
          </Typography>
          <Typography variant="h6" sx={{ color: tokens.colors.ctaSubtext, mb: 4, fontWeight: 400, lineHeight: 1.7, maxWidth: 680, mx: 'auto' }}>
            ร่วมเป็นส่วนหนึ่งของคอมมูนิตี้คนรักการอ่าน ส่งต่อความรู้และเรื่องราวที่ไม่มีวันสิ้นสุด
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/books')}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              ค้นหาหนังสือ
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              size="large"
              onClick={() => navigate('/sell')}
            >
              ขายหนังสือของคุณ
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
