import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { AppContainer } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { LandingBookCard } from './LandingBookCard';

export const FeaturedBooksSection: React.FC = () => {
  const navigate = useNavigate();
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  return (
    <Box
      component="section"
      id="featured-books"
      aria-labelledby="featured-books-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #D9E2EC',
      }}
    >
      <AppContainer>
        <SectionHeader
          id="featured-books-heading"
          eyebrow="CURATED SELECTION"
          title="หนังสือแนะนำประจำสัปดาห์"
          subtitle="คัดสรรหนังสือมือสองสภาพเยี่ยม คุ้มค่า และส่งต่อเรื่องราวดีๆ จากเพื่อนนักอ่าน"
          align="left"
          action={{
            label: `ดูหนังสือทั้งหมด (${books.length})`,
            onClick: () => navigate('/books'),
          }}
        />

        {/* 4 Curated Books: 4 Desktop, 2 Tablet, 2 Mobile */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 3.5 }}>
          {featuredBooks.map((book) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={book.id}>
              <LandingBookCard book={book} />
            </Grid>
          ))}
        </Grid>
      </AppContainer>
    </Box>
  );
};
