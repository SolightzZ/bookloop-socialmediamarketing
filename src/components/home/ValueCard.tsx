import React from 'react';
import { Box, Typography } from '@mui/material';

export interface ValueCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  accentBg: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({
  number,
  icon,
  title,
  desc,
  color,
  accentBg,
}) => {
  return (
    <Box
      component="article"
      sx={{
        p: { xs: 3, sm: 3.5 },
        height: '100%',
        borderRadius: 3,
        bgcolor: '#F7F9FC',
        border: '1px solid #EDF2F7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        transition: 'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          bgcolor: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(15, 45, 74, 0.06)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Top Row: Icon + Step Number */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            bgcolor: accentBg,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            color: '#94A3B8',
            fontFamily: 'monospace',
          }}
        >
          {number}
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 700,
          color: '#0F2D4A',
          fontSize: { xs: '1.05rem', sm: '1.15rem' },
          lineHeight: 1.3,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {/* Short Description */}
      <Typography
        variant="body2"
        sx={{
          color: '#627D98',
          fontSize: { xs: '0.875rem', sm: '0.9rem' },
          lineHeight: 1.6,
        }}
      >
        {desc}
      </Typography>
    </Box>
  );
};
