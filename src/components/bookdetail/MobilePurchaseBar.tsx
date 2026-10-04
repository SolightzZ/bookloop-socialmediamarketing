import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Book } from '../../data/books';

interface MobilePurchaseBarProps {
  book: Book;
  onBuyNow: () => void;
}

/**
 * MobilePurchaseBar — sticky bottom purchase bar (mobile only).
 * Price + dominant CTA. Safe-area aware, never covers content
 * (page renders a matching spacer, see BookDetailPage).
 */
export const MobilePurchaseBar: React.FC<MobilePurchaseBarProps> = ({ book, onBuyNow }) => {
  return (
    <Box
      component="div"
      role="region"
      aria-label="แถบสั่งซื้อด่วน"
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #D9E2EC',
        px: 2,
        pt: 1.25,
        pb: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ minWidth: 0, flexShrink: 0 }}>
          <Typography
            sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.35rem', lineHeight: 1.1 }}
            aria-label={`ราคา ${book.price} บาท`}
          >
            ฿{book.price.toLocaleString()}
          </Typography>
          {book.originalPrice && book.originalPrice > book.price && (
            <Typography
              variant="caption"
              sx={{ color: '#62748A', textDecoration: 'line-through', fontSize: '0.75rem' }}
            >
              ฿{book.originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={onBuyNow}
          aria-label={`ซื้อ ${book.title} ทันที`}
          sx={{
            minHeight: 48,
            py: 1.25,
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '8px',
            bgcolor: '#1976D2',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
            '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
          }}
        >
          ซื้อทันที
        </Button>
      </Box>
    </Box>
  );
};
