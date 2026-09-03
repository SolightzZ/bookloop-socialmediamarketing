import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { books } from '../../data/books';
import { BookCard } from '../BookCard';
import { SectionHeader } from './SectionHeader';

export const RecentlyViewedSection: React.FC = () => {
  const navigate = useNavigate();
  const { recentlyViewed, clearRecent } = useRecentlyViewed();

  const recentBooks = useMemo(() => {
    const bookMap = new Map(books.map((b) => [b.id, b]));
    return recentlyViewed
      .slice(0, 6)
      .map((r) => bookMap.get(r.bookId))
      .filter(Boolean) as typeof books;
  }, [recentlyViewed]);

  if (recentBooks.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 5, md: 7 } }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <SectionHeader
          eyebrow="ประวัติการเข้าชม"
          title="หนังสือที่คุณเพิ่งเปิดดู"
          subtitle="กลับไปดูหนังสือที่คุณสนใจอีกครั้ง"
          action={
            <Button
              size="small"
              startIcon={<HistoryIcon sx={{ fontSize: 16 }} />}
              onClick={clearRecent}
              sx={{ textTransform: 'none', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}
            >
              ล้างประวัติ
            </Button>
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: { xs: 2, sm: 2.5 },
            mt: 3,
          }}
        >
          {recentBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
