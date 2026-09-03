import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { OrderShippingAddress, PaymentMethod, PaymentStatus, Order } from '../types/order';
import { CheckoutStepper } from '../components/checkout/CheckoutStepper';
import { ShippingAddressSection } from '../components/checkout/ShippingAddressSection';
import { ShippingMethodSection, SHIPPING_OPTIONS } from '../components/checkout/ShippingMethodSection';
import { PaymentMethodSection } from '../components/checkout/PaymentMethodSection';
import { OrderReviewSection } from '../components/checkout/OrderReviewSection';
import { CheckoutSummarySidebar } from '../components/checkout/CheckoutSummarySidebar';
import { showSuccess, showError, showWarning } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

const DEMO_ADDRESS: OrderShippingAddress = {
  name: 'สมชาย รักการอ่าน',
  phone: '0812345678',
  address: '123/45 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา',
  province: 'กรุงเทพมหานคร',
  postalCode: '10110',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, savings, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // State
  const [address, setAddress] = useState<OrderShippingAddress>({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    province: user?.address?.province || 'กรุงเทพมหานคร',
    postalCode: user?.address?.postalCode || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderShippingAddress, string>>>({});
  const [shippingMethodId, setShippingMethodId] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; label: string; discount: number } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update address if user profile loads
  useEffect(() => {
    if (user && !address.name) {
      setAddress({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address?.street
          ? `${user.address.street} ${user.address.subdistrict || ''} ${user.address.district || ''}`.trim()
          : '',
        province: user.address?.province || 'กรุงเทพมหานคร',
        postalCode: user.address?.postalCode || '',
      });
    }
  }, [user]);

  // If cart is empty, redirect or prompt
  useEffect(() => {
    if (cart.length === 0) {
      // Allow slight delay or let user see empty message
    }
  }, [cart]);

  // Selected Shipping fee calculation
  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingMethodId) || SHIPPING_OPTIONS[0];
  const shippingFee = selectedShipping.price;
  const promoDiscount = appliedPromo
    ? appliedPromo.discount >= 1 && appliedPromo.discount <= 100
      ? Math.round(subtotal * (appliedPromo.discount / 100))
      : appliedPromo.discount
    : 0;
  const discount = promoDiscount;
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleAddressChange = (field: keyof OrderShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUseDemoAddress = () => {
    setAddress(DEMO_ADDRESS);
    setErrors({});
    showSuccess('นำเข้าที่อยู่ตัวอย่างแล้ว');
  };

  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof OrderShippingAddress, string>> = {};

    if (!address.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล ผู้รับ';
    }

    const cleanPhone = address.phone.replace(/\D/g, '');
    if (!address.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (cleanPhone.length < 9 || cleanPhone.length > 10) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง';
    }

    if (!address.address.trim()) {
      newErrors.address = 'กรุณากรอกที่อยู่จัดส่ง';
    }

    if (!address.province.trim()) {
      newErrors.province = 'กรุณาระบุจังหวัด';
    }

    const cleanZip = address.postalCode.replace(/\D/g, '');
    if (!address.postalCode.trim()) {
      newErrors.postalCode = 'กรุณากรอกรหัสไปรษณีย์';
    } else if (cleanZip.length !== 5) {
      newErrors.postalCode = 'รหัสไปรษณีย์ต้องมี 5 หลัก';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    if (!isAuthenticated || !user) {
      showError('กรุณาเข้าสู่ระบบ', 'เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการ');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      showError('ไม่มีสินค้าในตะกร้า', 'กรุณาเลือกหนังสือลงตะกร้าก่อนดำเนินการชำระเงิน');
      navigate('/books');
      return;
    }

    if (!validateAddress()) {
      showWarning('ข้อมูลไม่ครบถ้วน', 'กรุณาตรวจสอบและกรอกข้อมูลที่อยู่จัดส่งให้ถูกต้อง');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate realistic API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        items: cart.map((item) => ({
          bookId: item.id,
          title: item.title,
          image: item.cover,
          quantity: item.quantity,
          price: item.price,
          author: item.author,
          condition: item.condition,
          originalPrice: item.originalPrice,
        })),
        subtotal,
        shippingFee,
        discount,
        total: finalTotal,
        shippingAddress: address,
        shippingMethod: selectedShipping.name,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : (paymentStatus === 'paid' ? 'paid' : 'pending'),
        status: paymentStatus === 'paid' ? 'processing' : 'pending_payment',
        shippingCarrier: selectedShipping.carrier,
      };

      const createdOrder = orderService.createOrder(orderData);

      // Track analytics
      trackEvent('purchase', {
        orderId: createdOrder.id,
        total: finalTotal,
        itemsCount: cart.length,
        paymentMethod,
      });

      // Clear cart only after success
      clearCart();

      // Navigate to success screen
      navigate('/order/success', {
        state: {
          order: createdOrder,
          orderId: createdOrder.id,
        },
      });
    } catch (err) {
      console.error('Order creation failed', err);
      showError('สร้างคำสั่งซื้อไม่สำเร็จ', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default', minHeight: '80vh' }}>
        <Container maxWidth="md">
          <Alert
            severity="warning"
            action={
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/books')}
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                ไปเลือกซื้อหนังสือ
              </Link>
            }
            sx={{ borderRadius: 2 }}
          >
            ตะกร้าสินค้าว่างเปล่า ไม่สามารถดำเนินการชำระเงินได้
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2.5, sm: 4, md: 5 }, bgcolor: '#F7F9FB', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NextIcon fontSize="small" sx={{ color: '#94A3B8' }} />}
          sx={{ mb: { xs: 2, sm: 3 } }}
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
            onClick={() => navigate('/cart')}
            sx={{ cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ตะกร้าสินค้า
          </Link>
          <Typography color="primary.main" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            ชำระเงิน
          </Typography>
        </Breadcrumbs>

        {/* Stepper Header */}
        <CheckoutStepper activeStep={4} />

        {/* 2-Column Responsive Layout */}
        <Grid container spacing={{ xs: 2.5, md: 4 }}>
          {/* Left Column: Form Steps */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3.5 } }}>
              {/* Step 1: Shipping Address */}
              <ShippingAddressSection
                address={address}
                errors={errors}
                onChange={handleAddressChange}
                onUseDemoAddress={handleUseDemoAddress}
              />

              {/* Step 2: Shipping Method */}
              <ShippingMethodSection
                selectedMethod={shippingMethodId}
                onSelectMethod={setShippingMethodId}
              />

              {/* Step 3: Payment Method */}
              <PaymentMethodSection
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                totalAmount={finalTotal}
                paymentStatus={paymentStatus}
                onPaymentStatusChange={setPaymentStatus}
              />

              {/* Step 4: Review and Confirm */}
              <OrderReviewSection
                customerName={address.name}
                customerEmail={user?.email || ''}
                address={address}
                shippingMethodId={shippingMethodId}
                paymentMethod={paymentMethod}
                paymentStatus={paymentStatus}
                items={cart}
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                total={finalTotal}
                isSubmitting={isSubmitting}
                onConfirmOrder={handleConfirmOrder}
              />
            </Box>
          </Grid>

          {/* Right Column: Order Summary Sidebar */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <CheckoutSummarySidebar
              items={cart}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              total={finalTotal}
              savings={savings}
              isSubmitting={isSubmitting}
              onConfirmOrder={handleConfirmOrder}
              appliedPromo={appliedPromo}
              onApplyPromo={(d, label) => setAppliedPromo({ code: label.split(' ')[0] || 'PROMO', label, discount: d })}
              onRemovePromo={() => setAppliedPromo(null)}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
