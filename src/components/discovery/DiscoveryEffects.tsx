import React from 'react';
import { Box } from '@mui/material';

interface DiscoveryEffectsProps {
  isReducedMotion?: boolean;
}

export const DiscoveryEffects: React.FC<DiscoveryEffectsProps> = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Clean Subtle Dot Grid (Crisp 1px dots, ZERO blur, ZERO glow) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    </Box>
  );
};
