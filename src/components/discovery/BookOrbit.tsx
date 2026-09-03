import React from 'react';
import { Box, Typography } from '@mui/material';
import { SyncAltRounded, AutoAwesomeRounded } from '@mui/icons-material';
import { DiscoveryState } from './bookDiscovery.types';

interface BookOrbitProps {
  state: DiscoveryState;
  isReducedMotion?: boolean;
  className?: string;
}

export const BookOrbit: React.FC<BookOrbitProps> = ({
  state,
  isReducedMotion = false,
  className = '',
}) => {
  const isRunning =
    state === 'starting' ||
    state === 'shuffling' ||
    state === 'slowing' ||
    state === 'fake-stop' ||
    state === 'revealing';

  return (
    <Box
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Floating Orbit Identity (Compact, clean solid style, NO GLOW) */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 4, sm: 8 },
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          bgcolor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          py: 0.4,
          px: 1.5,
          borderRadius: 9999,
          boxShadow: '0 1px 3px rgba(15, 45, 74, 0.06)',
        }}
      >
        <SyncAltRounded
          sx={{
            fontSize: 14,
            color: '#1976D2',
            animation: !isReducedMotion && isRunning ? 'spinSlow 2s linear infinite' : 'none',
            '@keyframes spinSlow': {
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: '#0F2D4A',
            letterSpacing: '0.02em',
          }}
        >
          Book • Read • Share • Repeat
        </Typography>
      </Box>

      {/* Suspense status hint (Compact, clean solid amber, NO GLOW, NO BLUR) */}
      {isRunning && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 10, sm: 16 },
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            bgcolor: '#FEF3C7',
            border: '1px solid #FCD34D',
            py: 0.35,
            px: 1.4,
            borderRadius: 9999,
            color: '#B45309',
          }}
        >
          <AutoAwesomeRounded sx={{ fontSize: 13 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>
            {state === 'fake-stop' ? 'เล่มนี้ใช่ไหมนะ...' : 'กำลังลุ้นผลในวงโคจร...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
