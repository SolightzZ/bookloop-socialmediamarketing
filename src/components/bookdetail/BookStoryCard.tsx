import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { AutoStories as StoryIcon } from '@mui/icons-material';

interface BookStoryCardProps {
  story: string;
  sellerName: string;
}

export const BookStoryCard: React.FC<BookStoryCardProps> = ({ story, sellerName }) => {
  if (!story) return null;

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        mb: 6,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <StoryIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          เรื่องราวของหนังสือเล่มนี้ (Book Story)
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontStyle: 'italic',
          lineHeight: 1.8,
          color: 'text.primary',
          pl: 2,
          borderLeft: '3px solid #1769AA',
        }}
      >
        "{story}"
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2, pl: 2 }}>
        — บันทึกความทรงจำและเหตุผลในการส่งต่อโดย <strong>{sellerName}</strong>
      </Typography>
    </Paper>
  );
};
