import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { formatCurrency } from '../../utils/formatCurrency';

interface MobileCheckoutBarProps {
  total: number;
  isSubmitting: boolean;
  disabled: boolean;
  onConfirm: () => void;
}

/**
 * MobileCheckoutBar — sticky bottom purchase bar (mobile only).
 * Total + dominant confirm CTA. Safe-area aware; the page renders
 * a matching spacer so it never covers form content.
 */
export const MobileCheckoutBar: React.FC<MobileCheckoutBarProps> = ({
  total,
  isSubmitting,
  disabled,
  onConfirm,
}) => {
  return (
    <Box
      component="div"
      role="region"
      aria-label="แถบยืนยันคำสั่งซื้อ"
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #D6E0EA',
        px: 2,
        pt: 1.25,
        pb: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ minWidth: 0, flexShrink: 0 }}>
          <Typography sx={{ color: '#62748A', fontSize: '0.72rem', fontWeight: 600 }}>
            ยอดชำระสุทธิ
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              color: '#102A43',
              fontSize: '1.3rem',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
            aria-label={`ยอดชำระสุทธิ ${formatCurrency(total)}`}
          >
            {formatCurrency(total)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          disabled={disabled || isSubmitting}
          onClick={onConfirm}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          aria-label="ยืนยันการสั่งซื้อ"
          sx={{
            minHeight: 48,
            py: 1.25,
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '8px',
            bgcolor: '#1976D2',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
            '&:disabled': { bgcolor: '#CBD5E1', color: '#FFFFFF' },
            '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
          }}
        >
          {isSubmitting ? 'กำลังสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
        </Button>
      </Box>
    </Box>
  );
};
