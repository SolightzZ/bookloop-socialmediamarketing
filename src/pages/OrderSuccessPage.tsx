import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  ContentCopy as CopyIcon,
  ArrowForward as ArrowIcon,
  HomeOutlined as HomeIcon,
  AutoStories as BooksIcon,
  MailOutlined as EmailIcon,
} from '@mui/icons-material';
import { Order, OrderItem } from '../types/order';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { formatCurrency } from '../utils/formatCurrency';
import { logWarn } from '../utils/logger';
import { showSuccess } from '../utils/alerts';
import { useNotification } from '../hooks/useNotification';
import { tokens } from '../theme/tokens';

const INK = tokens.colors.inkNavy;
const MUTED = tokens.colors.mutedText;
const BORDER = tokens.colors.border;
const BLUE = tokens.colors.actionBlue;
const SUCCESS = tokens.colors.success;
const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* ── Small building blocks ─────────────────────────────────── */

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    component="p"
    sx={{
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: MUTED,
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    component="h2"
    sx={{
      fontSize: '1rem',
      fontWeight: 800,
      letterSpacing: '-0.01em',
      color: INK,
      mb: 2,
    }}
  >
    {children}
  </Typography>
);

const StatusDot: React.FC<{ color: string }> = ({ color }) => (
  <Box
    aria-hidden="true"
    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
  />
);

const ItemImage: React.FC<{ item: OrderItem }> = ({ item }) => {
  const [broken, setBroken] = useState(false);
  if (broken || !item.image) {
    return (
      <Box
        role="img"
        aria-label={item.title}
        sx={{
          width: 56,
          height: 70,
          borderRadius: 1,
          bgcolor: tokens.colors.surfaceMuted,
          border: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MUTED,
          flexShrink: 0,
        }}
      >
        <BooksIcon sx={{ fontSize: 24 }} />
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={item.image}
      alt={item.title}
      loading="lazy"
      onError={() => setBroken(true)}
      sx={{
        width: 56,
        height: 70,
        objectFit: 'cover',
        borderRadius: 1,
        border: `1px solid ${BORDER}`,
        display: 'block',
        flexShrink: 0,
        bgcolor: tokens.colors.surfaceMuted,
      }}
    />
  );
};

/* ── Page ──────────────────────────────────────────────────── */

/** Fallback กรณี refresh หน้าแล้ว state หาย: ดึงคำสั่งซื้อล่าสุดของ user ปัจจุบัน */
function getMostRecentOrder(): Order | null {
  try {
    const userId = authService.getCurrentUserId();
    if (!userId) return null;
    const orders = orderService.getUserOrders(userId);
    if (!orders.length) return null;
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  } catch (e) {
    logWarn('getMostRecentOrder failed', e);
    return null;
  }
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotification();

  // Try to get order from state or query params or most recent order
  const stateOrder = location.state?.order as Order | undefined;
  const orderIdFromQuery = searchParams.get('orderId') || location.state?.orderId;

  const order =
    stateOrder ||
    (orderIdFromQuery ? orderService.getOrderById(orderIdFromQuery) : null) ||
    getMostRecentOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add in-app notification when order is loaded (guard ซ้ำจาก React StrictMode ใน dev)
  const notifiedOrderId = useRef<string | null>(null);
  useEffect(() => {
    if (order && notifiedOrderId.current !== order.id) {
      notifiedOrderId.current = order.id;
      addNotification({
        type: 'order_update',
        title: 'สั่งซื้อสำเร็จ!',
        message: `คำสั่งซื้อ ${order.id} ได้รับการยืนยันแล้ว อีเมลยืนยันถูกส่งไปที่กล่องจดหมายของคุณ`,
        actionUrl: `/orders/${order.id}`,
      });
    }
  }, [order?.id]);

  const copyOrderId = async () => {
    if (!order?.id) return;
    try {
      await navigator.clipboard.writeText(order.id);
    } catch (e) {
      // Fallback for non-secure contexts (http) — แต่ต้องเห็นใน console
      logWarn('copyOrderId: clipboard API failed, using textarea fallback', e);
      const ta = document.createElement('textarea');
      ta.value = order.id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showSuccess('คัดลอกหมายเลขคำสั่งซื้อแล้ว', order.id);
  };

  const paymentStatusMap: Record<string, { label: string; color: string }> = {
    paid: { label: 'ชำระเงินสำเร็จ', color: SUCCESS },
    pending: { label: 'รอชำระเงิน / COD', color: tokens.colors.warning },
    failed: { label: 'การชำระเงินขัดข้อง', color: tokens.colors.danger },
    expired: { label: 'หมดอายุ', color: MUTED },
  };

  const paymentMethodLabel =
    {
      promptpay: 'PromptPay QR',
      qr: 'QR Payment',
      cod: 'ชำระเงินปลายทาง (COD)',
    }[order?.paymentMethod || 'promptpay'] || 'PromptPay QR';

  const createdAtLabel = (() => {
    if (!order?.createdAt) return '—';
    const d = new Date(order.createdAt);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  /* Empty state — no order resolved */
  if (!order) {
    return (
      <Box sx={{ bgcolor: '#F7F8FA', py: { xs: 6, md: 10 }, minHeight: '80vh' }}>
        <Container maxWidth={false} sx={{ maxWidth: 1120, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              bgcolor: tokens.colors.paper,
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              p: { xs: 4, md: 6 },
              maxWidth: 640,
            }}
          >
            <Eyebrow>BookLoop — Transaction</Eyebrow>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: INK, mb: 1 }}
            >
              ไม่พบข้อมูลคำสั่งซื้อ
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: '0.95rem', mb: 3 }}>
              เราไม่พบคำสั่งซื้อที่ระบุ อาจหมดอายุหรือลิงก์ไม่ถูกต้อง
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ bgcolor: INK, '&:hover': { bgcolor: BLUE } }}
            >
              กลับหน้าหลัก
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const paymentStatus = paymentStatusMap[order.paymentStatus] || {
    label: order.paymentStatus,
    color: MUTED,
  };

  return (
    <Box sx={{ bgcolor: '#F7F8FA', py: { xs: 4, sm: 6, md: 8 }, minHeight: '90vh' }}>
      <Container maxWidth={false} sx={{ maxWidth: 1120, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* ── 01 · Transaction eyebrow ── */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            BookLoop — Transaction
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: MUTED }}>
            วันที่ทำรายการ {createdAtLabel}
          </Typography>
        </Box>

        {/* ── 02 · Success hero ── */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
          <SuccessIcon
            aria-hidden="true"
            sx={{ fontSize: 40, color: SUCCESS, mt: 0.5, flexShrink: 0 }}
          />
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: INK,
              }}
            >
              คำสั่งซื้อสำเร็จ!
            </Typography>
            <Typography
              sx={{
                color: MUTED,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                mt: 0.75,
              }}
            >
              ขอบคุณที่สั่งซื้อสินค้ากับ BookLoop
            </Typography>
          </Box>
        </Box>

        {/* Email notice — single quiet line */}
        <Box
          role="status"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4, color: MUTED }}
        >
          <EmailIcon aria-hidden="true" sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.85rem' }}>
            อีเมลยืนยันคำสั่งซื้อถูกส่งแล้ว กรุณาตรวจสอบกล่องจดหมาย (รวมถึง Junk/Spam)
          </Typography>
        </Box>

        {/* ── 03 · Order meta ── */}
        <Box
          component="section"
          aria-label="ข้อมูลคำสั่งซื้อ"
          sx={{
            bgcolor: tokens.colors.paper,
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            p: { xs: 2.5, sm: 3.5, md: 4 },
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.2fr 1fr 1fr' },
              columnGap: 4,
              rowGap: 2.5,
            }}
          >
            <Box>
              <Eyebrow>หมายเลขคำสั่งซื้อ</Eyebrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography
                  component="span"
                  sx={{ fontFamily: MONO, fontSize: '1.15rem', fontWeight: 700, color: INK }}
                >
                  {order.id}
                </Typography>
                <Button
                  size="small"
                  onClick={copyOrderId}
                  startIcon={<CopyIcon sx={{ fontSize: 14 }} />}
                  aria-label={`คัดลอกหมายเลขคำสั่งซื้อ ${order.id}`}
                  sx={{
                    fontSize: '0.75rem',
                    color: BLUE,
                    minWidth: 0,
                    px: 1,
                    '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                  }}
                >
                  คัดลอก
                </Button>
              </Box>
            </Box>

            <Box>
              <Eyebrow>วิธีการชำระเงิน</Eyebrow>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: INK, mb: 0.5 }}>
                {paymentMethodLabel}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatusDot color={paymentStatus.color} />
                <Typography sx={{ fontSize: '0.85rem', color: MUTED }}>
                  {paymentStatus.label}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Eyebrow>ยอดชำระสุทธิ</Eyebrow>
              <Typography
                sx={{ fontSize: '1.6rem', fontWeight: 800, color: BLUE, letterSpacing: '-0.01em' }}
              >
                {formatCurrency(order.total)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── 04 · Product summary ── */}
        <Box
          component="section"
          aria-label="รายการสินค้า"
          sx={{
            bgcolor: tokens.colors.paper,
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            p: { xs: 2.5, sm: 3.5, md: 4 },
            mb: 3,
          }}
        >
          <SectionTitle>
            รายการสินค้า ({order.items.reduce((n, i) => n + (i.quantity || 0), 0)} เล่ม)
          </SectionTitle>

          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box
              component="thead"
              sx={{ display: { xs: 'none', sm: 'table-header-group' } }}
            >
              <Box component="tr">
                {['สินค้า', 'จำนวน', 'ราคา/เล่ม', 'รวม'].map((h, i) => (
                  <Box
                    key={h}
                    component="th"
                    scope="col"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: MUTED,
                      textAlign: i === 0 ? 'left' : 'right',
                      pb: 1.5,
                      borderBottom: `1px solid ${BORDER}`,
                      fontFamily: 'inherit',
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {order.items.map((item) => (
                <Box
                  key={`${item.bookId}-${item.title}`}
                  component="tr"
                  sx={{
                    display: { xs: 'block', sm: 'table-row' },
                    py: { xs: 2, sm: 0 },
                    borderBottom: `1px solid ${BORDER}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      display: { xs: 'flex', sm: 'table-cell' },
                      gap: 2,
                      py: { xs: 1.5, sm: 2 },
                      pr: { sm: 2 },
                      verticalAlign: 'top',
                    }}
                  >
                    <ItemImage item={item} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: INK,
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.title}
                      </Typography>
                      {item.author && (
                        <Typography sx={{ fontSize: '0.8rem', color: MUTED, mt: 0.25 }}>
                          {item.author}
                        </Typography>
                      )}
                      {/* Mobile-only qty × price line */}
                      <Typography
                        sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '0.8rem', color: MUTED, mt: 0.5 }}
                      >
                        ×{item.quantity} · {formatCurrency(item.price)} · รวม{' '}
                        <Typography component="span" sx={{ fontWeight: 700, color: INK }}>
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      display: { xs: 'none', sm: 'table-cell' },
                      textAlign: 'right',
                      py: 2,
                      px: 1,
                      verticalAlign: 'top',
                      fontSize: '0.9rem',
                      color: INK,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ×{item.quantity}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      display: { xs: 'none', sm: 'table-cell' },
                      textAlign: 'right',
                      py: 2,
                      px: 1,
                      verticalAlign: 'top',
                      fontSize: '0.9rem',
                      color: MUTED,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCurrency(item.price)}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      display: { xs: 'none', sm: 'table-cell' },
                      textAlign: 'right',
                      py: 2,
                      pl: 1,
                      verticalAlign: 'top',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: INK,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCurrency(item.price * item.quantity)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Totals */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${BORDER}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              maxWidth: { sm: 320 },
              ml: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: MUTED }}>
              <span>ยอดรวมย่อย</span>
              <span style={{ color: INK }}>{formatCurrency(order.subtotal)}</span>
            </Box>
            {order.shippingFee > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: MUTED }}>
                <span>ค่าจัดส่ง</span>
                <span style={{ color: INK }}>{formatCurrency(order.shippingFee)}</span>
              </Box>
            )}
            {order.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: MUTED }}>
                <span>ส่วนลด</span>
                <span style={{ color: SUCCESS }}>−{formatCurrency(order.discount)}</span>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                pt: 1.25,
                mt: 0.5,
                borderTop: `2px solid ${INK}`,
              }}
            >
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: INK }}>
                ยอดชำระสุทธิ
              </Typography>
              <Typography
                sx={{ fontSize: '1.5rem', fontWeight: 800, color: BLUE, letterSpacing: '-0.01em' }}
              >
                {formatCurrency(order.total)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── 05 · Shipping ── */}
        <Box
          component="section"
          aria-label="ที่อยู่จัดส่ง"
          sx={{
            bgcolor: tokens.colors.paper,
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            p: { xs: 2.5, sm: 3.5, md: 4 },
            mb: 4,
          }}
        >
          <SectionTitle>ที่อยู่จัดส่ง</SectionTitle>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: INK }}>
            {order.shippingAddress?.name}
            <Typography component="span" sx={{ fontWeight: 400, color: MUTED }}>
              {'  ·  '}{order.shippingAddress?.phone}
            </Typography>
          </Typography>
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: MUTED,
              lineHeight: 1.7,
              mt: 0.5,
              overflowWrap: 'anywhere',
            }}
          >
            {order.shippingAddress?.address} จ.{order.shippingAddress?.province}{' '}
            {order.shippingAddress?.postalCode}
          </Typography>
        </Box>

        {/* ── 06 · Actions ── */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            onClick={() => navigate(`/orders/${order.id}`)}
            sx={{
              bgcolor: INK,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              '&:hover': { bgcolor: BLUE },
              '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            ติดตามคำสั่งซื้อ
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderColor: tokens.colors.borderStrong,
              color: INK,
              '&:hover': { borderColor: INK, bgcolor: '#FFFFFF' },
              '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
