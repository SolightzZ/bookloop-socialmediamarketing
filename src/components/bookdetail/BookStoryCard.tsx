import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { AutoStoriesOutlined as StoryIcon } from '@mui/icons-material';

interface BookStoryCardProps {
  story: string;
  sellerName: string;
}

/**
 * Subtle editorial quote component for Book Story.
 * Emphasizes the emotional memory and reason for passing the book forward.
 */
export const BookStoryCard: React.FC<BookStoryCardProps> = ({ story, sellerName }) => {
  if (!story) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4, md: 4.5 },
        borderRadius: 3,
        mb: 6,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 10px rgba(15, 45, 74, 0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
        <StoryIcon sx={{ color: '#1976D2', fontSize: 24 }} />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 800,
            color: '#0F2D4A',
            fontSize: { xs: '1.15rem', md: '1.25rem' },
          }}
        >
          เรื่องราวของหนังสือเล่มนี้
        </Typography>
      </Box>

      <Typography
        variant="body1"
        component="blockquote"
        sx={{
          fontStyle: 'italic',
          lineHeight: 1.8,
          color: '#102A43',
          fontSize: { xs: '1rem', md: '1.075rem' },
          pl: 2.5,
          borderLeft: '3px solid #1976D2',
          my: 2,
        }}
      >
        "{story}"
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: '#627D98',
          display: 'block',
          mt: 2,
          pl: 2.5,
          fontWeight: 600,
          fontSize: '0.825rem',
        }}
      >
        — บันทึกความทรงจำและความตั้งใจในการส่งต่อโดย{' '}
        <Box component="strong" sx={{ color: '#0F2D4A' }}>
          {sellerName}
        </Box>
      </Typography>
    </Paper>
  );
};
