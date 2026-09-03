import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  action,
  className = '',
  id,
}) => {
  const isCenter = align === 'center' && !action;

  return (
    <Box
      className={`mb-8 sm:mb-10 md:mb-12 ${className}`}
      sx={{
        display: action ? 'flex' : 'block',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        gap: { xs: 2, sm: 3 },
        textAlign: isCenter ? 'center' : 'left',
      }}
    >
      <Box sx={{ maxWidth: isCenter ? '720px' : '680px', mx: isCenter ? 'auto' : 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            component="span"
            sx={{
              display: 'inline-block',
              color: '#1976D2',
              fontWeight: 800,
              letterSpacing: '0.12em',
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              mb: 1,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </Typography>
        )}

        <Typography
          id={id}
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 800,
            color: '#0F2D4A',
            fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.5rem', lg: '2.75rem' },
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mb: subtitle ? 1.5 : 0,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: '#627D98',
              fontSize: { xs: '0.9375rem', sm: '1.0625rem' },
              lineHeight: 1.65,
              fontWeight: 400,
              mx: isCenter ? 'auto' : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Button
          variant="text"
          onClick={action.onClick}
          endIcon={action.icon || <ArrowForwardIcon sx={{ fontSize: 18 }} />}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            alignSelf: { xs: 'flex-start', sm: 'flex-end' },
            whiteSpace: 'nowrap',
            color: '#1976D2',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              transform: 'translateX(2px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};
