import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { showConfirm, showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { CartEmptyState } from '../components/cart/CartEmptyState';
import { CartItemCard } from '../components/cart/CartItemCard';
import { CartOrderSummary } from '../components/cart/CartOrderSummary';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, savings, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    showConfirm('ต้องการล้างตะกร้าสินค้าทั้งหมดหรือไม่?').then((result) => {
      if (result.isConfirmed) {
        clearCart();
        showSuccess('ล้างตะกร้าเรียบร้อย');
      }
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    trackEvent('begin_checkout', { itemsCount: cartCount, subtotal, userId: user?.id || 'guest' });
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 10 }, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Swiss header — oversized title, count as index, quiet clear action */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 2,
            mb: { xs: 3, md: 5 },
          }}
        >
          <Box>
            <Typography
              sx={{ color: '#1976D2', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', mb: 1 }}
            >
              {String(cartCount).padStart(2, '0')} เล่มในตะกร้า
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: '#102A43',
                fontSize: { xs: '2rem', md: '2.75rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              ตะกร้าสินค้า
            </Typography>
          </Box>
          <Typography
            component="button"
            type="button"
            onClick={handleClearCart}
            sx={{
              bgcolor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#62748A',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              pb: 0.5,
              '&:hover': { color: '#D64545' },
              '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px', borderRadius: '6px' },
            }}
          >
            ล้างตะกร้าทั้งหมด
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* Item list — tabular column header + hairline rows */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              aria-hidden
              sx={{
                display: { xs: 'none', md: 'grid' },
                gridTemplateColumns: '72px 1fr 150px 110px 40px',
                columnGap: 3,
                pb: 1.5,
                borderBottom: '2px solid #102A43',
              }}
            >
              {['', 'สินค้า', 'จำนวน', 'รวม', ''].map((label, i) => (
                <Typography
                  key={i}
                  sx={{
                    color: '#62748A',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textAlign: i === 3 ? 'right' : 'left',
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
                px: { xs: 2, md: 3 },
                bgcolor: '#FFFFFF',
                border: '1px solid #D6E0EA',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(15, 53, 87, 0.06)',
              }}
            >
              {cart.map((item) => (
                <Box
                  key={item.id}
                  component="li"
                  sx={{
                    borderBottom: '1px solid #D6E0EA',
                    '&:last-of-type': { borderBottom: 'none' },
                  }}
                >
                  <CartItemCard
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Summary rail */}
          <Grid size={{ xs: 12, md: 4 }}>
            <CartOrderSummary
              cartCount={cartCount}
              subtotal={subtotal}
              savings={savings}
              onCheckout={handleCheckout}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
