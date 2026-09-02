import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  ArrowBack as BackIcon,
  LocalShippingOutlined as ShippingIcon,
  ContentCopy as CopyIcon,
  ShoppingBagOutlined as OrderIcon,
  LocationOnOutlined as AddressIcon,
  PaymentOutlined as PaymentIcon,
  ReceiptLongOutlined as ReceiptIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { Order, OrderStatus, PaymentStatus } from '../types/order';
import { orderService } from '../services/orderService';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { OrderTrackingModal } from '../components/orders/OrderTrackingModal';
import { formatCurrency } from '../utils/formatCurrency';
import { showSuccess, showWarning } from '../utils/alerts';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetched = orderService.getOrderById(orderId);
    setOrder(fetched);
    setIsLoading(false);
  }, [orderId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showSuccess(`คัดลอก${label}แล้ว`, text);
  };

  const handleDemoStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    const updated = orderService.updateOrderStatus(
      order.id,
      newStatus,
      newStatus === 'processing' || newStatus === 'shipped' || newStatus === 'out_for_delivery' || newStatus === 'delivered'
        ? 'paid'
        : order.paymentStatus
    );
    if (updated) {
      setOrder({ ...updated });
      showSuccess('อัปเดตสถานะจำลองแล้ว', `สถานะเปลี่ยนเป็น "${newStatus}"`);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', minHeight: '60vh' }}>
        <Typography>กำลังโหลดข้อมูลคำสั่งซื้อ...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ py: 8, bgcolor: '#F7F9FB', minHeight: '80vh' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <OrderIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              ไม่พบข้อมูลคำสั่งซื้อ
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              ไม่พบคำสั่งซื้อหมายเลข #{orderId} ในระบบ หรืออาจถูกลบไปแล้ว
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/account/orders')}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              ดูรายการคำสั่งซื้อของฉัน
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const statusMap: Record<OrderStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    pending_payment: { label: 'รอการชำระเงิน', color: 'warning' },
    paid: { label: 'ชำระเงินแล้ว', color: 'info' },
    processing: { label: 'กำลังเตรียมจัดส่ง', color: 'warning' },
    shipped: { label: 'จัดส่งแล้ว', color: 'info' },
    out_for_delivery: { label: 'กำลังนำจ่าย', color: 'primary' },
    delivered: { label: 'จัดส่งสำเร็จแล้ว', color: 'success' },
    cancelled: { label: 'ยกเลิกคำสั่งซื้อ', color: 'error' },
  };

  const paymentStatusMap: Record<PaymentStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    paid: { label: 'ชำระแล้ว', color: 'success' },
    pending: { label: 'รอชำระ / เก็บเงินปลายทาง', color: 'warning' },
    failed: { label: 'ล้มเหลว', color: 'error' },
    expired: { label: 'หมดอายุ', color: 'default' },
  };

  const paymentMethodLabel = {
    promptpay: 'PromptPay QR (พร้อมเพย์)',
    qr: 'QR Payment',
    cod: 'Cash on Delivery (ชำระเงินปลายทาง)',
  }[order.paymentMethod] || order.paymentMethod;

  return (
    <Box sx={{ py: 5, bgcolor: '#F7F9FB', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NextIcon fontSize="small" sx={{ color: '#94A3B8' }} />}
          sx={{ mb: 3 }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', fontSize: '0.85rem' }}
          >
            หน้าหลัก
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/account/orders')}
            sx={{ cursor: 'pointer', fontSize: '0.85rem' }}
          >
            คำสั่งซื้อของฉัน
          </Link>
          <Typography color="primary.main" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            {order.id}
          </Typography>
        </Breadcrumbs>

        {/* Header Bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3.5,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  คำสั่งซื้อ {order.id}
                </Typography>
                <Chip
                  label={statusMap[order.status]?.label || order.status}
                  color={statusMap[order.status]?.color || 'default'}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1.5 }}
                />
                <Chip
                  label={paymentStatusMap[order.paymentStatus]?.label || order.paymentStatus}
                  color={paymentStatusMap[order.paymentStatus]?.color || 'default'}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 1.5 }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                สั่งซื้อเมื่อ: {new Date(order.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {order.trackingNumber && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShippingIcon />}
                  onClick={() => setIsTrackingOpen(true)}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  ติดตามพัสดุ
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={() => navigate('/account/orders')}
                sx={{ borderRadius: 2, borderColor: '#CBD5E1', color: 'text.primary' }}
              >
                กลับไปหน้ารวม
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Order Timeline */}
        <OrderTimeline status={order.status} paymentStatus={order.paymentStatus} />

        {/* Main Grid: Details */}
        <Grid container spacing={3.5}>
          {/* Left Column: Products List */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                mb: 3.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2.5, fontSize: '1.1rem' }}>
                รายการหนังสือในคำสั่งซื้อ ({order.items.reduce((acc, it) => acc + it.quantity, 0)} เล่ม)
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {order.items.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: 56,
                          height: 76,
                          objectFit: 'cover',
                          borderRadius: 1.5,
                          border: '1px solid #CBD5E1',
                        }}
                      />
                      <Box>
                        <Typography
                          component={RouterLink}
                          to={`/books/${item.bookId}`}
                          sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            display: 'block',
                            '&:hover': { color: 'secondary.main', textDecoration: 'underline' },
                          }}
                        >
                          {item.title}
                        </Typography>
                        {item.author && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            ผู้เขียน: {item.author} {item.condition ? `• สภาพ: ${item.condition}` : ''}
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          จำนวน: {item.quantity} เล่ม × {formatCurrency(item.price)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', whiteSpace: 'nowrap' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Demo Status Controller for Testing */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px dashed #CBD5E1',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
                <SyncIcon sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  ⚡ DEMO Simulator: ปรับเปลี่ยนสถานะเพื่อทดสอบไทม์ไลน์
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant={order.status === 'pending_payment' ? 'contained' : 'outlined'}
                  onClick={() => handleDemoStatusChange('pending_payment')}
                  sx={{ borderRadius: 2 }}
                >
                  รอชำระเงิน
                </Button>
                <Button
                  size="small"
                  variant={order.status === 'processing' ? 'contained' : 'outlined'}
                  onClick={() => handleDemoStatusChange('processing')}
                  sx={{ borderRadius: 2 }}
                >
                  กำลังเตรียมจัดส่ง
                </Button>
                <Button
                  size="small"
                  variant={order.status === 'shipped' ? 'contained' : 'outlined'}
                  onClick={() => handleDemoStatusChange('shipped')}
                  sx={{ borderRadius: 2 }}
                >
                  จัดส่งแล้ว
                </Button>
                <Button
                  size="small"
                  variant={order.status === 'out_for_delivery' ? 'contained' : 'outlined'}
                  onClick={() => handleDemoStatusChange('out_for_delivery')}
                  sx={{ borderRadius: 2 }}
                >
                  กำลังนำจ่าย
                </Button>
                <Button
                  size="small"
                  variant={order.status === 'delivered' ? 'contained' : 'outlined'}
                  onClick={() => handleDemoStatusChange('delivered')}
                  color="success"
                  sx={{ borderRadius: 2 }}
                >
                  จัดส่งสำเร็จ
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Order & Shipping Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Shipping Address Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'primary.main' }}>
                  <AddressIcon sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ที่อยู่จัดส่งพัสดุ
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {order.shippingAddress?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                  โทร: {order.shippingAddress?.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontSize: '0.85rem' }}>
                  {order.shippingAddress?.address} จ.{order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <ShippingIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    วิธีการจัดส่ง: {order.shippingMethod}
                  </Typography>
                </Box>
                {order.trackingNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      เลขพัสดุ: <strong>{order.trackingNumber}</strong>
                    </Typography>
                    <Tooltip title="คัดลอกเลขพัสดุ">
                      <Button
                        size="small"
                        onClick={() => handleCopy(order.trackingNumber!, 'เลขพัสดุ')}
                        sx={{ fontSize: '0.72rem', minWidth: 'auto', p: '2px 6px' }}
                      >
                        คัดลอก
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Paper>

              {/* Payment & Financial Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'primary.main' }}>
                  <ReceiptIcon sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    สรุปยอดเงิน
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ยอดรวมสินค้า
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(order.subtotal)}
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
                        color: order.shippingFee === 0 ? 'success.main' : 'text.primary',
                      }}
                    >
                      {order.shippingFee === 0 ? 'ฟรี (Free)' : formatCurrency(order.shippingFee)}
                    </Typography>
                  </Box>

                  {order.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        ส่วนลด
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        - {formatCurrency(order.discount)}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ยอดรวมสุทธิ
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      ชำระผ่าน: {paymentMethodLabel}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Tracking Dialog Modal */}
        <OrderTrackingModal
          open={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          order={order}
        />
      </Container>
    </Box>
  );
}
