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
      {/* Top Floating Orbit Identity */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 6, sm: 10 },
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          bgcolor: '#FFFFFF',
          border: isRunning ? '1.5px solid #60A5FA' : '1px solid #CBD5E1',
          py: 0.45,
          px: 1.6,
          borderRadius: 9999,
          boxShadow: isRunning ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 1px 4px rgba(15, 45, 74, 0.06)',
          transition: 'all 0.3s ease',
        }}
      >
        <SyncAltRounded
          sx={{
            fontSize: 15,
            color: '#1976D2',
            animation: !isReducedMotion && isRunning ? 'spinFast 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
            '@keyframes spinFast': {
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '0.72rem', sm: '0.76rem' },
            color: isRunning ? '#1976D2' : '#0F2D4A',
            letterSpacing: '0.02em',
          }}
        >
          Book • Read • Share • Repeat
        </Typography>
      </Box>

      {/* Suspense status hint (Spectacular badge with animation) */}
      {isRunning && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 8, sm: 12 },
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            bgcolor: state === 'fake-stop' ? '#FEE2E2' : '#FEF3C7',
            border: state === 'fake-stop' ? '1.5px solid #FCA5A5' : '1.5px solid #FCD34D',
            py: 0.4,
            px: 1.6,
            borderRadius: 9999,
            color: state === 'fake-stop' ? '#B91C1C' : '#B45309',
            boxShadow: '0 4px 12px rgba(180, 83, 9, 0.15)',
            animation: 'bounceIn 0.3s ease-out, shimmerBadge 1.5s infinite alternate',
            '@keyframes bounceIn': {
              '0%': { transform: 'scale(0.85)', opacity: 0 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          <AutoAwesomeRounded
            sx={{
              fontSize: 14,
              animation: 'spin 2s linear infinite',
              '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } },
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
            {state === 'fake-stop' ? '✨ เล่มนี้ใช่ไหมนะ...' : '🚀 กำลังลุ้นผลในวงโคจร...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
