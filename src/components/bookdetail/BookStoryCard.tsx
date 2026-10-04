import React from 'react';
import { Box, Typography } from '@mui/material';

interface BookStoryCardProps {
  story: string;
  sellerName: string;
}

/**
 * BookStoryCard — editorial pull-quote for the book's story.
 * Left accent border + italic type, no card chrome.
 */
export const BookStoryCard: React.FC<BookStoryCardProps> = ({ story, sellerName }) => {
  if (!story) return null;

  return (
    <Box
      component="section"
      aria-label="เรื่องราวของหนังสือเล่มนี้"
      sx={{ maxWidth: 720 }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: '#102A43',
          fontSize: { xs: '1.375rem', md: '1.5rem' },
          letterSpacing: '-0.01em',
          mb: 2,
        }}
      >
        เรื่องราวของหนังสือเล่มนี้
      </Typography>
      <Box
        component="blockquote"
        sx={{
          m: 0,
          pl: 2.5,
          borderLeft: '3px solid #1976D2',
        }}
      >
        <Typography
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.8,
            color: '#102A43',
            fontSize: { xs: '1rem', md: '1.05rem' },
          }}
        >
          “{story}”
        </Typography>
        <Typography sx={{ color: '#62748A', fontSize: '0.85rem', mt: 1.25, fontWeight: 600 }}>
          ส่งต่อโดย {sellerName}
        </Typography>
      </Box>
    </Box>
  );
};
