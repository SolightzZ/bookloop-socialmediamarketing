import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

export interface CategoryTileProps {
  name: string;
  desc: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  sizeVariant?: 'large' | 'medium' | 'compact';
  onClick: () => void;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  name,
  desc,
  count,
  icon,
  color,
  bgColor,
  sizeVariant = 'medium',
  onClick,
  className = '',
}) => {
  const isLarge = sizeVariant === 'large';

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
      aria-label={`หมวดหมู่ ${name}, มีหนังสือ ${count} เล่ม`}
      className={className}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: isLarge ? '#FFFFFF' : '#FFFFFF',
        p: isLarge ? { xs: 2.5, sm: 3.5 } : { xs: 2, sm: 2.5 },
        display: 'flex',
        flexDirection: isLarge ? { xs: 'column', sm: 'row' } : 'column',
        alignItems: isLarge ? { xs: 'flex-start', sm: 'center' } : 'flex-start',
        justifyContent: 'space-between',
        gap: isLarge ? { xs: 2, sm: 3 } : 1.5,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: isLarge
          ? '0 4px 14px rgba(15, 41, 66, 0.05)'
          : '0 2px 8px rgba(15, 41, 66, 0.03)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 24px rgba(15, 41, 66, 0.08)',
          borderColor: color,
          '& .cat-arrow-icon': {
            transform: 'translateX(4px)',
            opacity: 1,
          },
          '& .cat-icon-wrapper': {
            transform: 'scale(1.06)',
          },
        },
        '&:focus-visible': {
          outline: '2px solid #1565C0',
          outlineOffset: '2px',
        },
      }}
    >
      {/* Decorative subtle background tint for large tiles */}
      {isLarge && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 140,
            height: 140,
            borderRadius: '0 0 0 100%',
            bgcolor: bgColor,
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Icon + Information Group */}
      <Box
        sx={{
          display: 'flex',
          alignItems: isLarge ? { xs: 'flex-start', sm: 'center' } : 'flex-start',
          gap: { xs: 1.5, sm: 2 },
          flexDirection: isLarge ? { xs: 'column', sm: 'row' } : 'column',
          width: '100%',
        }}
      >
        {/* Category Icon */}
        <Box
          className="cat-icon-wrapper"
          sx={{
            width: isLarge ? { xs: 52, sm: 64 } : 48,
            height: isLarge ? { xs: 52, sm: 64 } : 48,
            borderRadius: 2.5,
            bgcolor: bgColor,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                color: '#0F2942',
                fontSize: isLarge ? { xs: '1.1rem', sm: '1.25rem' } : '1rem',
                lineHeight: 1.25,
              }}
            >
              {name}
            </Typography>
            {isLarge && (
              <Chip
                label="หมวดแนะนำ"
                size="small"
                sx={{
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                  color: '#1565C0',
                  fontWeight: 700,
                  fontSize: '0.685rem',
                  height: 22,
                }}
              />
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: isLarge ? 2 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: isLarge ? 0 : 1.5,
            }}
          >
            {desc}
          </Typography>
        </Box>
      </Box>

      {/* Footer / Count & Arrow */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: isLarge ? { xs: '100%', sm: 'auto' } : '100%',
          mt: isLarge ? { xs: 1, sm: 0 } : 'auto',
          pt: isLarge ? 0 : 1,
          borderTop: isLarge ? 'none' : '1px solid #F1F5F9',
          flexShrink: 0,
          gap: 1.5,
        }}
      >
        <Chip
          label={`${count} เล่ม`}
          size="small"
          sx={{
            bgcolor: '#F8FAFC',
            color: '#486581',
            fontWeight: 700,
            fontSize: '0.75rem',
            border: '1px solid #E2E8F0',
          }}
        />

        <Box
          className="cat-arrow-icon"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: color,
            opacity: 0.7,
            transition: 'transform 0.2s ease, opacity 0.2s ease',
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );
};
