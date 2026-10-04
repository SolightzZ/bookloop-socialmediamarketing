import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface CartOrderSummaryProps {
  cartCount: number;
  subtotal: number;
  savings: number;
  onCheckout: () => void;
}

/**
 * CartOrderSummary — tonal summary surface (#E8EEF5) on the
 * #F5F7FA page. Distinct functional area, subtle border, no shadow.
 */
export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  cartCount,
  subtotal,
  savings,
  onCheckout,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      component="aside"
      aria-label="สรุปรายการคำสั่งซื้อ"
      sx={{ position: { md: 'sticky' }, top: 88 }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: 700, color: '#102A43', fontSize: '1.125rem', letterSpacing: '-0.01em', mb: 0 }}
      >
        สรุปคำสั่งซื้อ
      </Typography>

      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #D6E0EA',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(15, 53, 87, 0.06)',
          mt: 2,
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
          <Typography sx={{ color: '#62748A', fontSize: '0.9rem' }}>
            สินค้า ({cartCount} เล่ม)
          </Typography>
          <Typography sx={{ fontWeight: 600, color: '#102A43', fontSize: '0.95rem', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(subtotal)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
          <Typography sx={{ color: '#62748A', fontSize: '0.9rem' }}>ค่าจัดส่ง</Typography>
          <Typography sx={{ fontWeight: 700, color: '#18864B', fontSize: '0.9rem' }}>
            ฟรี
          </Typography>
        </Box>

        {savings > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
            <Typography sx={{ color: '#18864B', fontSize: '0.9rem' }}>ประหยัดได้ทั้งหมด</Typography>
            <Typography sx={{ color: '#18864B', fontWeight: 700, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
              − {formatCurrency(savings)}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mt: 2.5,
            pt: 2,
            borderTop: '1px solid #D6E0EA',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#102A43', fontSize: '0.95rem' }}>
            ยอดชำระสุทธิ
          </Typography>
          <Typography
            sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.75rem', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
            aria-label={`ยอดชำระสุทธิ ${formatCurrency(subtotal)}`}
          >
            <AnimatedCounter value={subtotal} />
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onCheckout}
          sx={{
            mt: 2.5,
            minHeight: 52,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '8px',
            bgcolor: '#1976D2',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
            '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
          }}
        >
          ดำเนินการชำระเงิน
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/books')}
          sx={{
            mt: 1.5,
            minHeight: 48,
            borderRadius: '8px',
            borderColor: '#D6E0EA',
            color: '#0F3557',
            fontWeight: 700,
            bgcolor: '#FFFFFF',
            '&:hover': { borderColor: '#1976D2', color: '#1976D2', bgcolor: '#FFFFFF' },
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
          }}
        >
          เลือกซื้อหนังสือต่อ
        </Button>
      </Box>
    </Box>
  );
};
