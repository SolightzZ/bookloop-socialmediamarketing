import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  Box,
  Button,
} from '@mui/material';
import {
  ShieldOutlined as ShieldIcon,
  LocalShippingOutlined as ShippingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartOrderSummaryProps {
  cartCount: number;
  subtotal: number;
  savings: number;
  onCheckout: () => void;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  cartCount,
  subtotal,
  savings,
  onCheckout,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        position: { xs: 'static', md: 'sticky' },
        top: 90,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
        สรุปรายการคำสั่งซื้อ
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ color: 'text.secondary' }}>ยอดรวมสินค้า ({cartCount} เล่ม)</Typography>
        <Typography sx={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ color: 'text.secondary' }}>ค่าจัดส่ง (Demo)</Typography>
        <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
          ฟรี (ส่งเสริมการอ่าน)
        </Typography>
      </Box>

      {savings > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ color: 'success.main' }}>ประหยัดได้ทั้งหมด</Typography>
          <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
            - {formatCurrency(savings)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ยอดชำระสุทธิ
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {formatCurrency(subtotal)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onCheckout}
        sx={{
          py: 1.6,
          fontSize: '1.05rem',
          fontWeight: 700,
          borderRadius: 2,
          mb: 1.5,
        }}
      >
        ดำเนินการชำระเงิน
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate('/books')}
        sx={{ borderRadius: 2 }}
      >
        เลือกซื้อหนังสือต่อ
      </Button>

      {/* Trust Badges */}
      <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #F0F4F8' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
          <ShieldIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
          <Typography variant="caption">การจำลองคำสั่งซื้อปลอดภัย ไม่มีการตัดเงินจริง</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <ShippingIcon sx={{ fontSize: 18, color: 'success.main' }} />
          <Typography variant="caption">ส่งเสริมวงจรหมุนเวียนหนังสือและลดทรัพยากร</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
