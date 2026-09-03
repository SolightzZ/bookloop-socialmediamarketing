import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  Collapse,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShieldOutlined as ShieldIcon,
  CheckCircle as ConfirmIcon,
  Recycling as EcoIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { CartItem } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { SafeImage } from '../common/SafeImage';
import { PromoCodeInput } from './PromoCodeInput';

interface CheckoutSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  savings: number;
  isSubmitting: boolean;
  onConfirmOrder: () => void;
  appliedPromo: { code: string; label: string; discount: number } | null;
  onApplyPromo: (discount: number, label: string) => void;
  onRemovePromo: () => void;
}

export const CheckoutSummarySidebar: React.FC<CheckoutSummarySidebarProps> = ({
  items,
  subtotal,
  shippingFee,
  discount,
  total,
  savings,
  isSubmitting,
  onConfirmOrder,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [isItemsExpanded, setIsItemsExpanded] = useState<boolean>(true);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        position: { md: 'sticky' },
        top: { md: 90 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.15rem' }}>
          สรุปคำสั่งซื้อ ({totalCount} เล่ม)
        </Typography>

        <IconButton
          size="small"
          onClick={() => setIsItemsExpanded(!isItemsExpanded)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          {isItemsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsible Product List */}
      <Collapse in={isItemsExpanded}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: 280,
            overflowY: 'auto',
            pr: 0.5,
            my: 2,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#CBD5E1', borderRadius: 2 },
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ width: 44, height: 60, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden' }}>
                <SafeImage
                  src={item.cover}
                  alt={item.title}
                  fallbackTitle={item.title}
                  objectFit="cover"
                  borderRadius={6}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {item.condition || 'สภาพดี'} • จำนวน: {item.quantity}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>

      <Divider sx={{ my: 2 }} />

      {/* Promo Code Input */}
      <Box sx={{ mb: 2 }}>
        <PromoCodeInput
          appliedPromo={appliedPromo}
          onApply={onApplyPromo}
          onRemove={onRemovePromo}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Pricing Breakdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ยอดรวมสินค้า
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatCurrency(subtotal)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ค่าจัดส่ง
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: shippingFee === 0 ? 'success.main' : 'text.primary',
            }}
          >
            {shippingFee === 0 ? 'ฟรี (โปรโมชัน)' : formatCurrency(shippingFee)}
          </Typography>
        </Box>

        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              ส่วนลดพิเศษ
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
              - {formatCurrency(discount)}
            </Typography>
          </Box>
        )}

        {savings > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ประหยัดจากราคาปก
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>
              ประหยัด {formatCurrency(savings)}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Final Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
          ยอดชำระสุทธิ
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {formatCurrency(total)}
        </Typography>
      </Box>

      {/* Confirm Button */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting || items.length === 0}
        onClick={onConfirmOrder}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ConfirmIcon />}
        sx={{
          py: 1.8,
          fontSize: '1.1rem',
          fontWeight: 800,
          borderRadius: 2.5,
          mb: 1.5,
          bgcolor: '#1976D2',
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.35)',
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#1565C0',
          },
          '&:disabled': {
            bgcolor: '#CBD5E1',
            color: '#94A3B8',
          },
        }}
      >
        {isSubmitting ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
      </Button>

      <Typography
        variant="caption"
        sx={{
          textAlign: 'center',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.6,
          mb: 2,
        }}
      >
        <LockIcon sx={{ fontSize: 14, color: '#16A34A' }} />
        <span>การสั่งซื้อปลอดภัย ข้อมูลของคุณได้รับการปกป้อง 100%</span>
      </Typography>

      {/* Trust & Eco Badges */}
      <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <ShieldIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="caption">รับประกันการซื้อขายปลอดภัย 100%</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <EcoIcon sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption">ร่วมหมุนเวียนหนังสือ ช่วยลดการตัดต้นไม้</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
