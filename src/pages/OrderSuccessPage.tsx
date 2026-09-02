import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  ShoppingBagOutlined as OrderIcon,
  AutoStories as BooksIcon,
  LocalShippingOutlined as ShippingIcon,
  ReceiptLongOutlined as ReceiptIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { showSuccess } from '../utils/alerts';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Try to get order from state or query params or most recent order
  const stateOrder = location.state?.order as Order | undefined;
  const orderIdFromQuery = searchParams.get('orderId') || location.state?.orderId;

  const order = stateOrder || (orderIdFromQuery ? orderService.getOrderById(orderIdFromQuery) : null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard?.writeText(order.id);
      showSuccess('คัดลอกหมายเลขคำสั่งซื้อแล้ว', order.id);
    }
  };

  const paymentStatusMap = {
    paid: { label: 'ชำระเงินสำเร็จแล้ว', color: 'success' as const },
    pending: { label: 'รอชำระเงิน / COD', color: 'warning' as const },
    failed: { label: 'การชำระเงินขัดข้อง', color: 'error' as const },
    expired: { label: 'หมดอายุ', color: 'default' as const },
  };

  const paymentMethodLabel = {
    promptpay: 'PromptPay QR',
    qr: 'QR Payment',
    cod: 'ชำระเงินปลายทาง (COD)',
  }[order?.paymentMethod || 'promptpay'] || 'PromptPay QR';

  return (
    <Box sx={{ py: 8, bgcolor: '#F7F9FB', minHeight: '90vh' }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 6 },
            borderRadius: 3.5,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(16, 42, 67, 0.06)',
          }}
        >
          {/* Success Check Animation/Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(46, 125, 50, 0.1)',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <SuccessIcon sx={{ fontSize: 48 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            สั่งซื้อสำเร็จ!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto' }}>
            ขอบคุณที่ร่วมเป็นส่วนหนึ่งของการส่งต่อความรู้และหมุนเวียนหนังสือกับ BookLoop เรากำลังเตรียมแพ็คหนังสืออย่างดีที่สุด
          </Typography>

          {/* Order Details Card */}
          {order && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2.5,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                textAlign: 'left',
              }}
            >
              <Grid container spacing={2.5} sx={{ alignItems: 'center' }}>
                {/* Order ID */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    หมายเลขคำสั่งซื้อ (Order ID)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {order.id}
                    </Typography>
                    <Button
                      size="small"
                      onClick={copyOrderId}
                      startIcon={<CopyIcon sx={{ fontSize: 14 }} />}
                      sx={{ fontSize: '0.75rem', p: '2px 8px' }}
                    >
                      คัดลอก
                    </Button>
                  </Box>
                </Grid>

                {/* Total */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    ยอดชำระสุทธิ
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {formatCurrency(order.total)}
                  </Typography>
                </Grid>

                {/* Payment Method */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    วิธีการชำระเงิน
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {paymentMethodLabel}
                  </Typography>
                </Grid>

                {/* Payment Status */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    สถานะการชำระเงิน
                  </Typography>
                  <Chip
                    label={paymentStatusMap[order.paymentStatus]?.label || order.paymentStatus}
                    color={paymentStatusMap[order.paymentStatus]?.color || 'default'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Grid>

                {/* Delivery Recipient */}
                <Grid size={12}>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                    <ShippingIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        จัดส่งถึง: {order.shippingAddress?.name} ({order.shippingAddress?.phone})
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {order.shippingAddress?.address} จ.{order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate(order ? `/orders/${order.id}` : '/account/orders')}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                px: 3.5,
                py: 1.4,
                boxShadow: '0 4px 14px rgba(16, 42, 67, 0.25)',
              }}
            >
              ดูคำสั่งซื้อ
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<BooksIcon />}
              onClick={() => navigate('/books')}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                px: 3.5,
                py: 1.4,
                borderColor: '#CBD5E1',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: '#F8FAFC',
                },
              }}
            >
              กลับไปเลือกซื้อหนังสือ
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
