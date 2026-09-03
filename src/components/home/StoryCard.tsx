import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { FormatQuote as QuoteIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { SafeImage } from '../common/SafeImage';
import { Book } from '../../data/books';

export interface StoryCardProps {
  book: Book;
  isFeatured?: boolean;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  book,
  isFeatured = false,
  onClick,
}) => {
  if (isFeatured) {
    return (
      <Box
        component="article"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`เรื่องราวของหนังสือ ${book.title} โดย ${book.seller.name}`}
        sx={{
          height: '100%',
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 3.5,
          bgcolor: '#FFFFFF',
          border: '1px solid #D9E2EC',
          boxShadow: '0 4px 20px rgba(15, 45, 74, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 32px rgba(15, 45, 74, 0.08)',
            borderColor: '#CBD5E1',
            '& .story-read-more': {
              color: '#1976D2',
              transform: 'translateX(4px)',
            },
          },
          '&:focus-visible': {
            outline: '2px solid #1976D2',
            outlineOffset: '2px',
          },
        }}
      >
        {/* Large Decorative Quote Watermark */}
        <QuoteIcon
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: { xs: 64, md: 88 },
            color: 'rgba(25, 118, 210, 0.08)',
            pointerEvents: 'none',
          }}
        />

        {/* Editorial Eyebrow */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#1976D2',
              fontWeight: 800,
              letterSpacing: '0.1em',
              fontSize: '0.75rem',
            }}
          >
            เรื่องราวคัดสรรประจำสัปดาห์
          </Typography>
        </Box>

        {/* Large Editorial Quotation Typography */}
        <Typography
          variant="h5"
          component="blockquote"
          sx={{
            fontStyle: 'italic',
            color: '#0F2D4A',
            fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.65rem' },
            lineHeight: 1.5,
            fontWeight: 500,
            mb: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          "{book.story}"
        </Typography>

        {/* Small Book + Seller Information Strip */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {/* Book Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                width: 48,
                height: 64,
                borderRadius: 1.5,
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <SafeImage
                src={book.cover}
                alt=""
                aria-hidden="true"
                fallbackTitle={book.title}
                objectFit="cover"
                loading="lazy"
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: '#0F2D4A',
                  fontSize: '0.95rem',
                }}
              >
                {book.title}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ color: '#627D98', display: 'block', mb: 0.5 }}
              >
                {book.author}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Avatar
                  src={book.seller.avatar}
                  alt={book.seller.name}
                  sx={{ width: 18, height: 18 }}
                />
                <Typography variant="caption" noWrap sx={{ color: '#627D98', fontWeight: 600 }}>
                  ส่งต่อโดย {book.seller.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Read Book Details Action */}
          <Box
            className="story-read-more"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#627D98',
              fontWeight: 700,
              fontSize: '0.85rem',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
          >
            ดูหนังสือเล่มนี้
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  // Secondary Story Card (Refined, compact)
  return (
    <Box
      component="article"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`เรื่องราวของหนังสือ ${book.title} โดย ${book.seller.name}`}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid #D9E2EC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(15, 45, 74, 0.06)',
          borderColor: '#CBD5E1',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
      }}
    >
      <Typography
        variant="body1"
        component="blockquote"
        sx={{
          fontStyle: 'italic',
          color: '#0F2D4A',
          fontSize: { xs: '0.95rem', sm: '1.025rem' },
          lineHeight: 1.6,
          mb: 2.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        "{book.story}"
      </Typography>

      <Box
        sx={{
          pt: 2,
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 54,
            borderRadius: 1,
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <SafeImage
            src={book.cover}
            alt=""
            aria-hidden="true"
            fallbackTitle={book.title}
            objectFit="cover"
            loading="lazy"
          />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.875rem' }}
          >
            {book.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
            <Avatar
              src={book.seller.avatar}
              alt={book.seller.name}
              sx={{ width: 16, height: 16 }}
            />
            <Typography variant="caption" noWrap sx={{ color: '#627D98', fontSize: '0.75rem' }}>
              ส่งต่อโดย {book.seller.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
