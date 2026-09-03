import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { CasinoRounded, RefreshRounded } from '@mui/icons-material';
import { BookDiscoveryButtonProps } from './bookDiscovery.types';

export const BookDiscoveryButton: React.FC<BookDiscoveryButtonProps> = ({
  state,
  onClick,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  const isRunning =
    state === 'starting' ||
    state === 'shuffling' ||
    state === 'slowing' ||
    state === 'fake-stop' ||
    state === 'revealing';

  const isDisabled = disabled || isRunning;

  let label = 'สุ่มหนังสือให้ฉัน';
  let icon = <CasinoRounded sx={{ fontSize: 20 }} />;

  if (isRunning) {
    label = 'กำลังสุ่ม...';
    icon = <CircularProgress size={16} color="inherit" thickness={4} />;
  } else if (state === 'result') {
    label = 'สุ่มอีกครั้ง';
    icon = <RefreshRounded sx={{ fontSize: 20 }} />;
  }

  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={isRunning ? 'กำลังค้นหาและสุ่มหนังสือ' : label}
      aria-busy={isRunning}
      aria-disabled={isDisabled}
      startIcon={icon}
      sx={{
        width: { xs: '100%', sm: '210px' }, // Target 180–220px width
        height: 46,
        fontSize: '0.95rem',
        fontWeight: 700,
        borderRadius: '9999px',
        textTransform: 'none',
        bgcolor: state === 'result' ? '#0F2D4A' : '#1976D2',
        color: '#FFFFFF',
        boxShadow: '0 2px 6px rgba(15, 45, 74, 0.12)', // Clean subtle shadow, NO GLOW
        transition: 'all 0.2s ease-out',
        '&:hover': {
          bgcolor: state === 'result' ? '#1E3A5F' : '#1565C0',
          boxShadow: '0 4px 10px rgba(15, 45, 74, 0.18)',
        },
        '&.Mui-disabled': {
          bgcolor: '#94A3B8',
          color: '#F8FAFC',
          opacity: 0.85,
        },
      }}
      className={`select-none ${className}`}
    >
      {label}
    </Button>
  );
};
