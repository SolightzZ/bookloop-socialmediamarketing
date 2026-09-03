import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid, Container } from '@mui/material';

/**
 * Skeleton for individual BookCard
 */
export const BookCardSkeleton: React.FC = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* Cover image placeholder (aspect ratio ~ 3/4) */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '100%',
          pt: '133%', // 3:4 aspect ratio
          bgcolor: '#F1F5F9',
        }}
      />

      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Condition + Rating Line */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 1.5, bgcolor: '#F1F5F9' }} />
          <Skeleton variant="rounded" width={40} height={18} sx={{ borderRadius: 1, bgcolor: '#F1F5F9' }} />
        </Box>

        {/* Title Lines */}
        <Skeleton variant="text" width="90%" height={22} sx={{ bgcolor: '#F1F5F9', mb: 0.5 }} />
        <Skeleton variant="text" width="65%" height={22} sx={{ bgcolor: '#F1F5F9', mb: 1.5 }} />

        {/* Author */}
        <Skeleton variant="text" width="50%" height={16} sx={{ bgcolor: '#F1F5F9', mb: 2 }} />

        {/* Price + Button (Bottom-aligned) */}
        <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
          <Skeleton variant="text" width="40%" height={28} sx={{ bgcolor: '#F1F5F9', mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={38} sx={{ borderRadius: 2, bgcolor: '#F1F5F9' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Grid of BookCardSkeletons
 */
export const BookGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(145px, 1fr))',
          sm: 'repeat(auto-fill, minmax(175px, 1fr))',
          md: 'repeat(auto-fill, minmax(195px, 1fr))',
          lg: 'repeat(auto-fill, minmax(215px, 1fr))',
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </Box>
  );
};

/**
 * Full page loading fallback for Suspense & route transitions
 */
export const PageLoadingSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
      {/* Header / Banner Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={180} height={28} sx={{ bgcolor: '#F1F5F9', mb: 1 }} />
        <Skeleton variant="text" width={320} height={40} sx={{ bgcolor: '#F1F5F9', mb: 1.5 }} />
        <Skeleton variant="text" width={240} height={20} sx={{ bgcolor: '#F1F5F9' }} />
      </Box>

      {/* Grid of Book Cards */}
      <BookGridSkeleton count={8} />
    </Container>
  );
};
