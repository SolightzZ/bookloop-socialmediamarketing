import {
   LocationOnOutlined as AddressIcon,
   ArrowBack as BackIcon,
   ContentCopy as CopyIcon,
   NavigateNext as NextIcon,
   ReceiptLongOutlined as ReceiptIcon,
   LocalShippingOutlined as ShippingIcon,
} from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Chip, Container, Divider, Grid, IconButton, Link, Paper, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { PageLoadingSkeleton } from '../components/common/LoadingSkeleton';
import { SafeImage } from '../components/common/SafeImage';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { OrderTrackingModal } from '../components/orders/OrderTrackingModal';
import { orderService } from '../services/orderService';
import { Order, OrderStatus, PaymentStatus } from '../types/order';
import { showSuccess } from '../utils/alerts';
import { formatCurrency } from '../utils/formatCurrency';

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

   if (isLoading) {
      return <PageLoadingSkeleton />;
   }

   if (!order) {
      return (
         <Box sx={{ py: 8, bgcolor: '#F7F9FB', minHeight: '80vh' }}>
            <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
               <ErrorState
                  title="ไม่พบข้อมูลคำสั่งซื้อ"
                  description={`ไม่พบคำสั่งซื้อหมายเลข #${orderId} ในระบบ หรืออาจถูกลบไปแล้ว`}
                  actionText="ดูรายการคำสั่งซื้อของฉัน"
                  onRetry={() => navigate('/account/orders')}
                  secondaryAction={
                     <Button variant="outlined" onClick={() => navigate('/')} sx={{ borderRadius: 2, px: 3, fontWeight: 700, borderColor: '#CBD5E1', color: '#0F2D4A' }}>
                        กลับสู่หน้าหลัก
                     </Button>
                  }
               />
            </Container>
         </Box>
      );
   }

   const statusMap: Record<OrderStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
      pending_payment: { label: 'รอการชำระเงิน', color: 'warning' },
      paid: { label: 'ชำระเงินแล้ว', color: 'info' },
      processing: { label: 'กำลังเตรียมจัดส่ง', color: 'warning' },
      shipped: { label: 'อยู่ระหว่างจัดส่ง', color: 'info' },
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

   const paymentMethodLabel =
      {
         promptpay: 'PromptPay QR (พร้อมเพย์)',
         qr: 'QR Payment',
         cod: 'Cash on Delivery (ชำระเงินปลายทาง)',
      }[order.paymentMethod] || order.paymentMethod;

   const hasTracking = Boolean(order.trackingNumber);

   return (
      <Box sx={{ py: { xs: 2.5, sm: 4, md: 5 }, bgcolor: '#F8FBFF', minHeight: '100vh', pb: 6 }}>
         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            {/* Navigation & Breadcrumbs Header */}
            <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <Breadcrumbs separator={<NextIcon fontSize="small" sx={{ color: '#94A3B8' }} />} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                     หน้าหลัก
                  </Link>
                  <Link underline="hover" color="inherit" onClick={() => navigate('/account/orders')} sx={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                     คำสั่งซื้อของฉัน
                  </Link>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1976D2' }}>{order.id}</Typography>
               </Breadcrumbs>

               {/* Mobile Back Button */}
               <Button
                  startIcon={<BackIcon />}
                  onClick={() => navigate('/account/orders')}
                  sx={{
                     display: { xs: 'inline-flex', sm: 'none' },
                     color: '#0F2D4A',
                     fontWeight: 700,
                     fontSize: '0.85rem',
                     p: 0.5,
                     minHeight: '44px',
                     textTransform: 'none',
                  }}>
                  ย้อนกลับไปรายการคำสั่งซื้อ
               </Button>
            </Box>

            {/* Top Header Card */}
            <Paper
               elevation={0}
               sx={{
                  p: { xs: 2, sm: 3 },
                  mb: { xs: 2, sm: 3 },
                  borderRadius: { xs: '16px', sm: '20px' },
                  border: '1px solid #E5EAF0',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(16, 42, 67, 0.03)',
               }}>
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: { xs: 'flex-start', sm: 'center' },
                     flexDirection: { xs: 'column', sm: 'row' },
                     gap: 2,
                  }}>
                  <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                     <Box
                        sx={{
                           display: 'flex',
                           alignItems: { xs: 'flex-start', sm: 'center' },
                           justifyContent: 'space-between',
                           gap: 1,
                           flexWrap: 'wrap',
                           mb: 0.75,
                        }}>
                        <Typography
                           variant="h5"
                           sx={{
                              fontWeight: 800,
                              color: '#0F2D4A',
                              fontSize: { xs: '1.15rem', sm: '1.4rem' },
                              letterSpacing: '-0.02em',
                           }}>
                           คำสั่งซื้อ {order.id}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                           <Chip
                              label={statusMap[order.status]?.label || order.status}
                              color={statusMap[order.status]?.color || 'default'}
                              size="small"
                              sx={{ fontWeight: 700, borderRadius: '8px', height: '26px' }}
                           />
                           <Chip
                              label={paymentStatusMap[order.paymentStatus]?.label || order.paymentStatus}
                              color={paymentStatusMap[order.paymentStatus]?.color || 'default'}
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 700, borderRadius: '8px', height: '26px' }}
                           />
                        </Box>
                     </Box>

                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                        สั่งซื้อเมื่อ:{' '}
                        {new Date(order.createdAt).toLocaleDateString('th-TH', {
                           day: 'numeric',
                           month: 'short',
                           year: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit',
                        })}{' '}
                        น.
                     </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box
                     sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' },
                        pt: { xs: 1.5, sm: 0 },
                        borderTop: { xs: '1px solid #F1F5F9', sm: 'none' },
                     }}>
                     {hasTracking && (
                        <>
                           <Button
                              variant="contained"
                              onClick={() => setIsTrackingOpen(true)}
                              startIcon={<ShippingIcon sx={{ fontSize: 18 }} />}
                              sx={{
                                 borderRadius: '10px',
                                 bgcolor: '#1976D2',
                                 color: '#FFFFFF',
                                 minHeight: '44px',
                                 fontWeight: 700,
                                 textTransform: 'none',
                                 whiteSpace: 'nowrap',
                                 flex: { xs: 1, sm: 'none' },
                                 boxShadow: 'none',
                                 '&:hover': { bgcolor: '#0F2D4A', boxShadow: 'none' },
                              }}>
                              เปิดดูสถานะขนส่ง
                           </Button>
                           <Tooltip title="คัดลอกเลขพัสดุ">
                              <IconButton
                                 onClick={() => handleCopy(order.trackingNumber!, 'เลขพัสดุ')}
                                 aria-label="คัดลอกเลขพัสดุ"
                                 sx={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    border: '1px solid #CBD5E1',
                                    bgcolor: '#FFFFFF',
                                    color: '#0F2D4A',
                                    flexShrink: 0,
                                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#1976D2' },
                                 }}>
                                 <CopyIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                           </Tooltip>
                        </>
                     )}
                     <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/account/orders')}
                        sx={{
                           borderRadius: '10px',
                           borderColor: '#CBD5E1',
                           color: '#0F2D4A',
                           minHeight: '44px',
                           fontWeight: 700,
                           textTransform: 'none',
                           flex: { xs: hasTracking ? 'none' : 1, sm: 'none' },
                           display: { xs: hasTracking ? 'none' : 'inline-flex', sm: 'inline-flex' },
                           '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' },
                        }}>
                        กลับไปหน้ารวม
                     </Button>
                  </Box>
               </Box>
            </Paper>

            {/* Order Timeline Component */}
            <OrderTimeline status={order.status} paymentStatus={order.paymentStatus} />

            {/* Main Grid: Details */}
            <Grid container spacing={3}>
               {/* Left Column: Products List */}
               <Grid size={{ xs: 12, md: 8 }}>
                  <Paper
                     elevation={0}
                     sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: { xs: '16px', sm: '20px' },
                        border: '1px solid #E5EAF0',
                        bgcolor: '#FFFFFF',
                        mb: 3,
                     }}>
                     <Typography
                        variant="h6"
                        sx={{
                           fontWeight: 800,
                           color: '#0F2D4A',
                           mb: 2,
                           fontSize: { xs: '1rem', sm: '1.15rem' },
                        }}>
                        รายการหนังสือในคำสั่งซื้อ ({order.items.reduce((acc, it) => acc + it.quantity, 0)} เล่ม)
                     </Typography>

                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {order.items.map((item, idx) => (
                           <Box
                              key={idx}
                              sx={{
                                 display: 'flex',
                                 alignItems: { xs: 'flex-start', sm: 'center' },
                                 justifyContent: 'space-between',
                                 gap: 1.5,
                                 p: { xs: 1.5, sm: 2 },
                                 borderRadius: '12px',
                                 bgcolor: '#F8FAFC',
                                 border: '1px solid #E5EAF0',
                              }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, minWidth: 0, flexGrow: 1 }}>
                                 <Box
                                    sx={{
                                       width: { xs: 48, sm: 56 },
                                       height: { xs: 68, sm: 76 },
                                       flexShrink: 0,
                                       borderRadius: '8px',
                                       overflow: 'hidden',
                                       boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                    }}>
                                    <SafeImage src={item.image} alt={item.title} fallbackTitle={item.title} objectFit="cover" />
                                 </Box>
                                 <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                    <Typography
                                       component={RouterLink}
                                       to={`/books/${item.bookId}`}
                                       sx={{
                                          fontWeight: 700,
                                          color: '#0F2D4A',
                                          textDecoration: 'none',
                                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                          lineHeight: 1.35,
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          '&:hover': { color: '#1976D2', textDecoration: 'underline' },
                                       }}>
                                       {item.title}
                                    </Typography>
                                    {item.author && (
                                       <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25, fontSize: '0.75rem' }} noWrap>
                                          ผู้เขียน: {item.author} {item.condition ? `• สภาพ: ${item.condition}` : ''}
                                       </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                       <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                                          จำนวน: {item.quantity} เล่ม × {formatCurrency(item.price)}
                                       </Typography>
                                       <Typography
                                          sx={{
                                             display: { xs: 'block', sm: 'none' },
                                             fontWeight: 800,
                                             color: '#0F2D4A',
                                             fontSize: '0.9rem',
                                          }}>
                                          {formatCurrency(item.price * item.quantity)}
                                       </Typography>
                                    </Box>
                                 </Box>
                              </Box>

                              <Typography
                                 sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    fontWeight: 800,
                                    color: '#0F2D4A',
                                    fontSize: { xs: '0.925rem', sm: '1.05rem' },
                                    whiteSpace: 'nowrap',
                                    pl: 1,
                                 }}>
                                 {formatCurrency(item.price * item.quantity)}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  </Paper>
               </Grid>

               {/* Right Column: Order & Shipping Summary */}
               <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                     {/* Shipping Address Card */}
                     <Paper
                        elevation={0}
                        sx={{
                           p: { xs: 2.5, sm: 3 },
                           borderRadius: { xs: '16px', sm: '20px' },
                           border: '1px solid #E5EAF0',
                           bgcolor: '#FFFFFF',
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: '#1976D2' }}>
                           <AddressIcon sx={{ fontSize: 20 }} />
                           <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                              ที่อยู่จัดส่งพัสดุ
                           </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.925rem', color: '#0F2D4A' }}>{order.shippingAddress?.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.2 }}>
                           โทร: {order.shippingAddress?.phone}
                        </Typography>
                        <Typography sx={{ color: '#64748B', mt: 0.75, fontSize: '0.85rem', lineHeight: 1.5 }}>
                           {order.shippingAddress?.address} จ.{order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0F2D4A' }}>
                           <ShippingIcon sx={{ fontSize: 18, color: '#1976D2' }} />
                           <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              วิธีการจัดส่ง: {order.shippingMethod}
                           </Typography>
                        </Box>
                     </Paper>

                     {/* Payment & Financial Summary */}
                     <Paper
                        elevation={0}
                        sx={{
                           p: { xs: 2.5, sm: 3 },
                           borderRadius: { xs: '16px', sm: '20px' },
                           border: '1px solid #E5EAF0',
                           bgcolor: '#FFFFFF',
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#1976D2' }}>
                           <ReceiptIcon sx={{ fontSize: 20 }} />
                           <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                              สรุปยอดเงิน
                           </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: '#64748B' }}>
                                 ยอดรวมสินค้า
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2D4A' }}>
                                 {formatCurrency(order.subtotal)}
                              </Typography>
                           </Box>

                           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: '#64748B' }}>
                                 ค่าจัดส่ง
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{
                                    fontWeight: 600,
                                    color: order.shippingFee === 0 ? '#16A34A' : '#0F2D4A',
                                 }}>
                                 {order.shippingFee === 0 ? 'ฟรี (Free)' : formatCurrency(order.shippingFee)}
                              </Typography>
                           </Box>

                           {order.discount > 0 && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <Typography variant="body2" sx={{ color: '#16A34A' }}>
                                    ส่วนลด
                                 </Typography>
                                 <Typography variant="body2" sx={{ fontWeight: 700, color: '#16A34A' }}>
                                    - {formatCurrency(order.discount)}
                                 </Typography>
                              </Box>
                           )}

                           <Divider sx={{ my: 1 }} />

                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                                 ยอดรวมสุทธิ
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                                 {formatCurrency(order.total)}
                              </Typography>
                           </Box>

                           <Box sx={{ pt: 1.25, borderTop: '1px solid #F1F5F9' }}>
                              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                                 ชำระผ่าน: {paymentMethodLabel}
                              </Typography>
                           </Box>
                        </Box>
                     </Paper>
                  </Box>
               </Grid>
            </Grid>

            {/* Tracking Dialog Modal */}
            <OrderTrackingModal open={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} order={order} />
         </Container>
      </Box>
   );
}
