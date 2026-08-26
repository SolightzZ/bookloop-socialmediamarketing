import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { showConfirm, showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { CartEmptyState } from '../components/cart/CartEmptyState';
import { CartItemCard } from '../components/cart/CartItemCard';
import { CartOrderSummary } from '../components/cart/CartOrderSummary';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, savings, cartCount } = useCart();
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

    trackEvent('begin_checkout', { itemsCount: cartCount, subtotal });

    showConfirm(
      'ยืนยันการสั่งซื้อแบบ Demo หรือไม่?',
      `ยอดชำระทั้งหมด ${formatCurrency(subtotal)} (${cartCount} เล่ม)\n(นี่คือการจำลองการทำงาน ไม่มีการเรียกเก็บเงินจริง)`
    ).then((result) => {
      if (result.isConfirmed) {
        const orderId = '#DEMO-' + Math.floor(100000 + Math.random() * 900000);
        trackEvent('purchase_demo', { orderId, subtotal, itemsCount: cartCount });
        clearCart();
        showSuccess(
          'สั่งซื้อแบบ Demo สำเร็จ!',
          `หมายเลขคำสั่งซื้อของคุณคือ ${orderId} ขอบคุณที่ร่วมทดสอบและสนับสนุนการส่งต่อหนังสือกับ BookLoop`
        );
        navigate('/books');
      }
    });
  };

  if (cart.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ตะกร้าสินค้าของคุณ
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              คุณมีหนังสือ {cartCount} เล่มในตะกร้า
            </Typography>
          </Box>
          <Button
            size="small"
            color="error"
            onClick={handleClearCart}
            sx={{ fontSize: '0.85rem' }}
          >
            ล้างตะกร้าทั้งหมด
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Item List */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {cart.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </Box>
          </Grid>

          {/* Order Summary Sidebar */}
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
