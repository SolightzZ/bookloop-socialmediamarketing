import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  BusinessCenter as BusinessIcon,
  Science as KnowledgeIcon,
  Palette as ComicIcon,
  School as EducationIcon,
  ChildCare as KidsIcon,
  AutoAwesome as RareIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { CategoryItem } from '../../data/categories';

export interface CategoryCardProps {
  category: CategoryItem;
  bookCount: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  bookCount,
  onClick,
}) => {
  const getIcon = () => {
    switch (category.iconName) {
      case 'business':
        return <BusinessIcon sx={{ fontSize: 20 }} />;
      case 'knowledge':
        return <KnowledgeIcon sx={{ fontSize: 20 }} />;
      case 'comic':
        return <ComicIcon sx={{ fontSize: 20 }} />;
      case 'education':
        return <EducationIcon sx={{ fontSize: 20 }} />;
      case 'kids':
        return <KidsIcon sx={{ fontSize: 20 }} />;
      case 'rare':
        return <RareIcon sx={{ fontSize: 20 }} />;
      default:
        return <KnowledgeIcon sx={{ fontSize: 20 }} />;
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
      aria-label={`หมวดหมู่ ${category.name}, มีหนังสือ ${bookCount} เล่ม`}
      className="group"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid #D9E2EC',
        cursor: 'pointer',
        transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
        boxShadow: '0 2px 6px rgba(15, 45, 74, 0.03)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 20px rgba(15, 45, 74, 0.07)',
          borderColor: category.accentColor || '#1976D2',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
      }}
    >
      {/* Top Section: Supporting Icon + Dominant Title + Description */}
      <Box sx={{ mb: 2 }}>
        {/* Header: Icon + Title aligned cleanly */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.25 }}>
          {/* Supporting Icon (Not dominating) */}
          <Box
            aria-hidden="true"
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: category.accentBg || '#F0F4F8',
              color: category.accentColor || '#1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 200ms ease',
              '.group:hover &': {
                transform: 'scale(1.06)',
              },
            }}
          >
            {getIcon()}
          </Box>

          {/* Title Dominates */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              color: '#0F2D4A',
              fontSize: { xs: '1.05rem', sm: '1.125rem' },
              lineHeight: 1.25,
            }}
          >
            {category.name}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#627D98',
            fontSize: { xs: '0.8125rem', sm: '0.85rem' },
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
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
          pt: 1.75,
          mt: 'auto',
          borderTop: '1px solid #F0F4F8',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: '#627D98',
            fontSize: '0.8rem',
          }}
        >
          <Box component="span" sx={{ fontWeight: 700, color: '#102A43' }}>
            {bookCount}
          </Box>{' '}
          หนังสือ
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: category.accentColor || '#1976D2',
            transition: 'transform 200ms ease',
            '.group:hover &': {
              transform: 'translateX(4px)',
            },
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );
};
