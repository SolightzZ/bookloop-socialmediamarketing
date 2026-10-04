import React, { useState } from 'react';
import {
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
  CheckCircle as ConfirmIcon,
} from '@mui/icons-material';
import { CartItem } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <Box
      component="aside"
      aria-label="สรุปคำสั่งซื้อ"
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '10px',
        border: '1px solid #D6E0EA',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(15, 53, 87, 0.04)',
        position: { md: 'sticky' },
        top: { md: 88 },
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
        <Typography variant="h2" sx={{ fontWeight: 700, color: '#102A43', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
          สรุปคำสั่งซื้อ ({totalCount} เล่ม)
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            component="button"
            type="button"
            onClick={() => navigate('/cart')}
            sx={{
              bgcolor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#1976D2',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              p: 0.5,
              '&:hover': { textDecoration: 'underline' },
              '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px', borderRadius: '6px' },
            }}
          >
            แก้ไขสินค้า →
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            aria-label={isItemsExpanded ? 'ย่อรายการสินค้า' : 'ขยายรายการสินค้า'}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            {isItemsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
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
              <Box sx={{ width: 44, height: 60, flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid #D6E0EA' }}>
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

      <Divider sx={{ my: 2, borderColor: '#D6E0EA' }} />

      {/* Promo Code Input */}
      <Box sx={{ mb: 2 }}>
        <PromoCodeInput
          appliedPromo={appliedPromo}
          onApply={onApplyPromo}
          onRemove={onRemovePromo}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: '#D6E0EA' }} />

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

      <Divider sx={{ my: 2, borderColor: '#D6E0EA' }} />

      {/* Final Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#102A43' }}>
          ยอดชำระสุทธิ
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: '#102A43', fontSize: '2rem', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
          aria-label={`ยอดชำระสุทธิ ${formatCurrency(total)}`}
        >
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
          minHeight: 52,
          py: 1.5,
          fontSize: '1.05rem',
          fontWeight: 800,
          borderRadius: '8px',
          bgcolor: '#1976D2',
          boxShadow: 'none',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            bgcolor: '#1565C0',
            boxShadow: 'none',
          },
          '&:disabled': {
            bgcolor: '#CBD5E1',
            color: '#94A3B8',
          },
          '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
        }}
      >
        {isSubmitting ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
      </Button>
    </Box>
  );
};
