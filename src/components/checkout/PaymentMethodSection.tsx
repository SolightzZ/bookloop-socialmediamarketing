import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  Chip,
  Alert,
} from '@mui/material';
import {
  PaymentOutlined as PaymentIcon,
  QrCodeScanner as QrIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  LocalAtmOutlined as CodIcon,
  CheckCircle as ActiveCheckIcon,
} from '@mui/icons-material';
import { PaymentMethod, PaymentStatus } from '../../types/order';
import { PromptPayDemo } from './PromptPayDemo';

interface PaymentMethodSectionProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  onPaymentStatusChange: (status: PaymentStatus) => void;
}

interface PaymentOptionDef {
  id: PaymentMethod;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  note?: string;
}

const PAYMENT_OPTIONS: PaymentOptionDef[] = [
  {
    id: 'promptpay',
    name: 'PromptPay QR (พร้อมเพย์)',
    subtitle: 'สแกน QR Code ผ่าน Mobile Banking ทุกธนาคาร ไม่มีค่าธรรมเนียม',
    icon: <QrIcon sx={{ fontSize: 24, color: '#003D6B' }} />,
    badge: 'แนะนำ / สะดวกที่สุด',
  },
  {
    id: 'qr',
    name: 'QR Payment (สแกนจ่ายทันที)',
    subtitle: 'รองรับ Thai QR Standard, TrueMoney และ Mobile Banking',
    icon: <WalletIcon sx={{ fontSize: 24, color: '#1769AA' }} />,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (ชำระเงินปลายทาง)',
    subtitle: 'ชำระเงินสดหรือโอนกับพนักงานขนส่งเมื่อได้รับพัสดุ',
    icon: <CodIcon sx={{ fontSize: 24, color: '#2E7D32' }} />,
    note: 'เตรียมเงินสดพอดีกับยอดชำระในวันนำจ่าย',
  },
];

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedMethod,
  onSelectMethod,
  totalAmount,
  paymentStatus,
  onPaymentStatusChange,
}) => {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
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
          <PaymentIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
            3. วิธีการชำระเงิน
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            เลือกช่องทางชำระเงินที่ต้องการ (ระบบจำลอง Demo)
          </Typography>
        </Box>
      </Box>

      {/* Payment Options List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PAYMENT_OPTIONS.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <Paper
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: isSelected ? '2px solid #102A43' : '1px solid #E2E8F0',
                bgcolor: isSelected ? 'rgba(16, 42, 67, 0.02)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  borderColor: isSelected ? '#102A43' : '#94A3B8',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Radio
                  checked={isSelected}
                  onChange={() => onSelectMethod(opt.id)}
                  value={opt.id}
                  sx={{
                    p: 0,
                    mt: 0.3,
                    color: '#94A3B8',
                    '&.Mui-checked': { color: 'primary.main' },
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {opt.icon}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {opt.name}
                      </Typography>
                    </Box>

                    {opt.badge && (
                      <Chip
                        label={opt.badge}
                        size="small"
                        color="secondary"
                        sx={{ fontSize: '0.72rem', height: 22, fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.85rem' }}>
                    {opt.subtitle}
                  </Typography>

                  {opt.note && (
                    <Typography variant="caption" sx={{ color: '#D97706', mt: 0.5, display: 'block' }}>
                      ℹ️ {opt.note}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* PromptPay / QR Code Display */}
      {(selectedMethod === 'promptpay' || selectedMethod === 'qr') && (
        <PromptPayDemo
          totalAmount={totalAmount}
          paymentStatus={paymentStatus}
          onStatusChange={onPaymentStatusChange}
        />
      )}

      {selectedMethod === 'cod' && (
        <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
          คุณเลือกชำระเงินปลายทาง (Cash on Delivery) เจ้าหน้าที่ขนส่งจะโทรนัดหมายล่วงหน้าก่อนนำจ่ายพัสดุ
        </Alert>
      )}
    </Paper>
  );
};
