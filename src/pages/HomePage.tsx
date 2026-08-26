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
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 3.5, md: 6 } }}>
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
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }, lineHeight: 1.25 }}>
                หนังสือแนะนำประจำสัปดาห์
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/books')}
              sx={{ fontWeight: 'bold', alignSelf: { xs: 'flex-start', sm: 'auto' }, px: 0 }}
            >
              ดูหนังสือทั้งหมด ({books.length})
            </Button>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
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
      <Box sx={{ bgcolor: tokens.colors.ctaBg, color: tokens.colors.ctaHeading, py: { xs: 7, md: 12 }, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: tokens.colors.ctaHeading, letterSpacing: '-0.5px', fontSize: { xs: '1.8rem', sm: '2.25rem', md: '3rem' }, lineHeight: 1.3 }}>
            หนังสือเล่มต่อไปของคุณ อาจกำลังรออยู่
          </Typography>
          <Typography variant="h6" sx={{ color: tokens.colors.ctaSubtext, mb: { xs: 3, md: 4 }, fontWeight: 400, lineHeight: 1.7, maxWidth: 680, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
            ร่วมเป็นส่วนหนึ่งของคอมมูนิตี้คนรักการอ่าน ส่งต่อความรู้และเรื่องราวที่ไม่มีวันสิ้นสุด
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.25, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } } }}>
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
