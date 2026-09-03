import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  AutoStories as NovelIcon,
  SelfImprovement as GrowthIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { CategoryItem } from '../../data/categories';

export interface FeaturedCategoryCardProps {
  category: CategoryItem;
  bookCount: number;
  onClick: () => void;
}

export const FeaturedCategoryCard: React.FC<FeaturedCategoryCardProps> = ({
  category,
  bookCount,
  onClick,
}) => {
  const getIcon = () => {
    switch (category.iconName) {
      case 'novel':
        return <NovelIcon sx={{ fontSize: 24 }} />;
      case 'growth':
        return <GrowthIcon sx={{ fontSize: 24 }} />;
      default:
        return <NovelIcon sx={{ fontSize: 24 }} />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Box
      component="article"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`หมวดแนะนำ ${category.name}, มีหนังสือ ${bookCount} เล่ม`}
      className="group"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 3, sm: 3.5, md: 4 },
        minHeight: { xs: 200, sm: 220 },
        borderRadius: 4,
        bgcolor: '#FFFFFF',
        border: '1px solid #D9E2EC',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
        boxShadow: '0 2px 8px rgba(15, 45, 74, 0.04)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 28px rgba(15, 45, 74, 0.09)',
          borderColor: category.accentColor || '#1976D2',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
      }}
    >
      {/* Subtle decorative background watermark motif */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -15,
          right: -15,
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: category.accentBg || '#EBF3FA',
          opacity: 0.4,
          pointerEvents: 'none',
          transition: 'transform 300ms ease, opacity 300ms ease',
          '.group:hover &': {
            transform: 'scale(1.1)',
            opacity: 0.6,
          },
        }}
      />

      {/* Top Header: Title, Badge, Supporting Icon */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 1.5,
          }}
        >
          {/* Title & Badge */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0F2D4A',
                  fontSize: { xs: '1.35rem', sm: '1.55rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {category.name}
              </Typography>
              <Chip
                label="หมวดแนะนำ"
                size="small"
                sx={{
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  color: '#1976D2',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  height: 22,
                  borderRadius: 1.5,
                  border: '1px solid rgba(25, 118, 210, 0.15)',
                }}
              />
            </Box>
          </Box>

          {/* Supporting Icon Tile */}
          <Box
            aria-hidden="true"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: category.accentBg || '#EBF3FA',
              color: category.accentColor || '#1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 250ms ease',
              '.group:hover &': {
                transform: 'scale(1.08)',
              },
            }}
          >
            {getIcon()}
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: '#627D98',
            fontSize: { xs: '0.925rem', sm: '1rem' },
            lineHeight: 1.6,
            maxWidth: '92%',
          }}
        >
          {category.desc}
        </Typography>
      </Box>

      {/* Bottom Metadata: Book count & Arrow */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2.5,
          mt: 3,
          borderTop: '1px solid #F0F4F8',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: '#102A43',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box component="span" sx={{ color: '#1976D2' }}>
            {bookCount}
          </Box>{' '}
          หนังสือ
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#1976D2',
            transition: 'transform 200ms ease',
            '.group:hover &': {
              transform: 'translateX(4px)',
            },
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>
    </Box>
  );
};
