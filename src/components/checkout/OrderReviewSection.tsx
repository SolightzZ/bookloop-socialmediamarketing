import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  AssignmentTurnedInOutlined as ReviewIcon,
  LocalShippingOutlined as ShippingIcon,
  LocationOnOutlined as AddressIcon,
  PaymentOutlined as PaymentIcon,
  CheckCircle as ConfirmCheckIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { OrderShippingAddress, PaymentMethod, PaymentStatus } from '../../types/order';
import { CartItem } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { SHIPPING_OPTIONS } from './ShippingMethodSection';
import { SafeImage } from '../common/SafeImage';

interface OrderReviewSectionProps {
  customerName: string;
  customerEmail: string;
  address: OrderShippingAddress;
  shippingMethodId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  isSubmitting: boolean;
  onConfirmOrder: () => void;
}

export const OrderReviewSection: React.FC<OrderReviewSectionProps> = ({
  customerName,
  customerEmail,
  address,
  shippingMethodId,
  paymentMethod,
  paymentStatus,
  items,
  subtotal,
  shippingFee,
  discount,
  total,
  isSubmitting,
  onConfirmOrder,
}) => {
  const shippingInfo = SHIPPING_OPTIONS.find((s) => s.id === shippingMethodId) || SHIPPING_OPTIONS[0];

  const paymentMethodLabel = {
    promptpay: 'PromptPay QR (พร้อมเพย์)',
    qr: 'QR Payment (สแกนจ่าย)',
    cod: 'Cash on Delivery (ชำระเงินปลายทาง)',
  }[paymentMethod];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'rgba(16, 42, 67, 0.08)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReviewIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
            4. ตรวจสอบและยืนยันคำสั่งซื้อ
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            โปรดตรวจสอบความถูกต้องของข้อมูลก่อนยืนยัน
          </Typography>
        </Box>
      </Box>

      {/* Review Details Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Recipient & Address */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
              <AddressIcon sx={{ fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ข้อมูลผู้รับและที่อยู่จัดส่ง
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {address.name || customerName || 'ยังไม่ได้ระบุชื่อ'} ({address.phone || 'ยังไม่ได้ระบุเบอร์โทร'})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              {address.address ? `${address.address} จ.${address.province} ${address.postalCode}` : 'ยังไม่ได้ระบุที่อยู่'}
            </Typography>
            {customerEmail && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                อีเมลแจ้งเตือน: {customerEmail}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Shipping & Payment Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
              <ShippingIcon sx={{ fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                การจัดส่งและการชำระเงิน
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>การจัดส่ง:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {shippingInfo.name} ({shippingFee === 0 ? 'ฟรี' : formatCurrency(shippingFee)})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>การชำระเงิน:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {paymentMethodLabel}
                </Typography>
                {paymentMethod !== 'cod' && (
                  <Chip
                    label={paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                    size="small"
                    color={paymentStatus === 'paid' ? 'success' : 'default'}
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Item summary in review */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
        รายการหนังสือ ({items.reduce((acc, it) => acc + it.quantity, 0)} เล่ม)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#F8FAFC',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 42, height: 56, flexShrink: 0, borderRadius: 1, overflow: 'hidden' }}>
                <SafeImage
                  src={item.cover}
                  alt={item.title}
                  fallbackTitle={item.title}
                  objectFit="cover"
                  borderRadius={4}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.875rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  จำนวน: {item.quantity} เล่ม • {formatCurrency(item.price)} / เล่ม
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatCurrency(item.price * item.quantity)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Confirmation Readiness Notice */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: '#0284C7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ReviewIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0369A1' }}>
            พร้อมสำหรับการยืนยันคำสั่งซื้อ
          </Typography>
          <Typography variant="caption" sx={{ color: '#0284C7', display: 'block' }}>
            โปรดตรวจสอบข้อมูลผู้รับและรายการหนังสือข้างต้นให้เรียบร้อย จากนั้นกดปุ่ม <strong>"ยืนยันการสั่งซื้อ"</strong> ที่แถบสรุปคำสั่งซื้อ
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.6,
          mt: 1.5,
        }}
      >
        <LockIcon sx={{ fontSize: 14, color: '#16A34A' }} />
        <span>การสั่งซื้อปลอดภัย ข้อมูลของคุณได้รับการปกป้องด้วยมาตรฐานความปลอดภัย</span>
      </Typography>
    </Paper>
  );
};
