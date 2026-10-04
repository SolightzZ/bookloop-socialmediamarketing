import React from 'react';
import {
  Box,
  Typography,
  Radio,
  Chip,
  Alert,
} from '@mui/material';
import {
  QrCodeScanner as QrIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  LocalAtmOutlined as CodIcon,
  InfoOutlined as InfoIcon,
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
    <Box
      component="section"
      aria-label="วิธีการชำระเงิน"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: '10px',
        border: '1px solid #D6E0EA',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(15, 53, 87, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
        <Typography
          aria-hidden
          sx={{ fontWeight: 800, color: '#1976D2', fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}
        >
          03
        </Typography>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#102A43', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
            วิธีการชำระเงิน
          </Typography>
          <Typography variant="caption" sx={{ color: '#62748A' }}>
            เลือกช่องทางชำระเงินที่ต้องการ
          </Typography>
        </Box>
      </Box>

      {/* Payment Options List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {PAYMENT_OPTIONS.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <Box
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectMethod(opt.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMethod(opt.id);
                }
              }}
              sx={{
                p: 2.5,
                borderRadius: '8px',
                border: isSelected ? '2px solid #1976D2' : '1px solid #D6E0EA',
                bgcolor: isSelected ? 'rgba(25, 118, 210, 0.04)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'border-color 180ms ease',
                '&:hover': {
                  borderColor: isSelected ? '#1976D2' : '#94A3B8',
                },
                '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
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
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#D97706',
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 14 }} />
                      <span>{opt.note}</span>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
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
        <Alert severity="info" sx={{ mt: 2.5, borderRadius: '8px' }}>
          คุณเลือกชำระเงินปลายทาง (Cash on Delivery) เจ้าหน้าที่ขนส่งจะโทรนัดหมายล่วงหน้าก่อนนำจ่ายพัสดุ
        </Alert>
      )}
    </Box>
  );
};
