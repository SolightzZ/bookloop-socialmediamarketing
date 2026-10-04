import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as PaidIcon,
  ErrorOutlined as FailedIcon,
  AccessTime as ExpiredIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { PaymentStatus } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { showSuccess, showError, showWarning } from '../../utils/alerts';

interface PromptPayDemoProps {
  totalAmount: number;
  paymentStatus: PaymentStatus;
  onStatusChange: (status: PaymentStatus) => void;
}

export const PromptPayDemo: React.FC<PromptPayDemoProps> = ({
  totalAmount,
  paymentStatus,
  onStatusChange,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    if (paymentStatus === 'paid' || paymentStatus === 'failed') return;

    if (timeLeft <= 0) {
      onStatusChange('expired');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onStatusChange('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, paymentStatus, onStatusChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onStatusChange('paid');
      showSuccess('ชำระเงินสำเร็จ', `ได้รับยอดชำระ ${formatCurrency(totalAmount)} เรียบร้อยแล้ว`);
    }, 1200);
  };

  const handleSimulateFailed = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onStatusChange('failed');
      showError('ชำระเงินไม่สำเร็จ (Demo)', 'จำลองสถานการณ์การชำระเงินขัดข้องหรือยกเลิก');
    }, 1000);
  };

  const handleResetQR = () => {
    setTimeLeft(300);
    onStatusChange('pending');
  };

  const copyBillerId = () => {
    navigator.clipboard?.writeText('010556608912345');
    showSuccess('คัดลอกรหัส Biller ID เรียบร้อย');
  };

  return (
    <Box
      component="section"
      aria-label="ชำระเงินด้วย Thai QR Payment"
      sx={{
        mt: 2.5,
        p: { xs: 2.5, sm: 3 },
        borderRadius: '10px',
        border: '1px solid #D6E0EA',
        bgcolor: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      {/* Panel eyebrow */}
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: '#62748A',
        }}
      >
        THAI QR PAYMENT
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: '#62748A', mt: 0.25, mb: 2 }}>
        พร้อมเพย์ / PromptPay
      </Typography>

      {/* QR Code */}
      <Box
        sx={{
          position: 'relative',
          width: 200,
          height: 200,
          mx: 'auto',
          p: 1.5,
          bgcolor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #D6E0EA',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {paymentStatus === 'paid' ? (
          <Box sx={{ animation: 'scaleIn 0.3s ease' }}>
            <PaidIcon sx={{ fontSize: 68, color: 'success.main', mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>
              ชำระเงินเรียบร้อย
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              พร้อมสร้างคำสั่งซื้อ
            </Typography>
          </Box>
        ) : paymentStatus === 'expired' ? (
          <Box>
            <ExpiredIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              QR Code หมดอายุ
            </Typography>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleResetQR}
              variant="outlined"
              sx={{ mt: 1, borderRadius: 1.5 }}
            >
              สร้าง QR ใหม่
            </Button>
          </Box>
        ) : paymentStatus === 'failed' ? (
          <Box>
            <FailedIcon sx={{ fontSize: 56, color: 'error.main', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
              การชำระเงินล้มเหลว
            </Typography>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleResetQR}
              variant="outlined"
              color="error"
              sx={{ mt: 1, borderRadius: 1.5 }}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* SVG QR Code pattern mock */}
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ maxWidth: 160, maxHeight: 160 }}>
              {/* Outer corner squares */}
              <rect x="5" y="5" width="26" height="26" fill="#003D6B" rx="2" />
              <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="13" y="13" width="10" height="10" fill="#003D6B" rx="1" />

              <rect x="69" y="5" width="26" height="26" fill="#003D6B" rx="2" />
              <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="77" y="13" width="10" height="10" fill="#003D6B" rx="1" />

              <rect x="5" y="69" width="26" height="26" fill="#003D6B" rx="2" />
              <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="13" y="77" width="10" height="10" fill="#003D6B" rx="1" />

              {/* Data pattern blocks */}
              <rect x="36" y="8" width="8" height="8" fill="#003D6B" />
              <rect x="48" y="8" width="6" height="12" fill="#003D6B" />
              <rect x="58" y="12" width="6" height="6" fill="#003D6B" />
              <rect x="36" y="22" width="12" height="6" fill="#003D6B" />
              <rect x="52" y="24" width="8" height="8" fill="#003D6B" />

              <rect x="8" y="36" width="8" height="8" fill="#003D6B" />
              <rect x="20" y="40" width="12" height="6" fill="#003D6B" />
              <rect x="36" y="36" width="28" height="28" fill="#003D6B" rx="2" />
              <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="5" fill="#003D6B" />

              <rect x="68" y="36" width="10" height="8" fill="#003D6B" />
              <rect x="82" y="40" width="10" height="6" fill="#003D6B" />
              <rect x="68" y="48" width="8" height="14" fill="#003D6B" />
              <rect x="80" y="52" width="12" height="8" fill="#003D6B" />

              <rect x="36" y="68" width="8" height="10" fill="#003D6B" />
              <rect x="48" y="72" width="14" height="6" fill="#003D6B" />
              <rect x="36" y="82" width="16" height="10" fill="#003D6B" />
              <rect x="56" y="82" width="8" height="10" fill="#003D6B" />
              <rect x="68" y="68" width="12" height="10" fill="#003D6B" />
              <rect x="84" y="68" width="8" height="12" fill="#003D6B" />
              <rect x="72" y="82" width="20" height="10" fill="#003D6B" />
            </svg>
          </Box>
        )}
      </Box>

      {/* Amount and Timer */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#62748A', fontSize: '0.8rem' }}>
          ยอดชำระ
        </Typography>
        <Typography
          sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.75rem', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
          aria-label={`ยอดชำระ ${formatCurrency(totalAmount)}`}
        >
          {formatCurrency(totalAmount)}
        </Typography>

        {paymentStatus === 'pending' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <ExpiredIcon sx={{ fontSize: 16, color: timeLeft < 60 ? '#D64545' : '#62748A' }} />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.82rem',
                fontVariantNumeric: 'tabular-nums',
                color: timeLeft < 60 ? '#D64545' : '#62748A',
              }}
              aria-live="polite"
            >
              QR Code หมดอายุใน {formatTime(timeLeft)}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Biller info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          mt: 1.5,
          color: '#62748A',
        }}
      >
        <Typography sx={{ fontSize: '0.78rem' }}>
          ชื่อบัญชี: <strong>BookLoop Thailand</strong>
        </Typography>
        <Tooltip title="คัดลอก Biller ID">
          <IconButton
            size="small"
            onClick={copyBillerId}
            aria-label="คัดลอก Biller ID"
            sx={{ width: 32, height: 32, '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' } }}
          >
            <CopyIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Payment verification actions */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #D6E0EA' }}>
        <Typography sx={{ color: '#62748A', fontSize: '0.8rem', display: 'block', mb: 1.5 }}>
          สแกนชำระผ่านแอปธนาคารแล้ว กดปุ่มด้านล่างเพื่อตรวจสอบ
        </Typography>

        {isVerifying ? (
          <Box sx={{ py: 1 }}>
            <Typography sx={{ color: '#1976D2', fontSize: '0.82rem', fontWeight: 600, display: 'block', mb: 1 }}>
              กำลังตรวจสอบยอดเงินจากธนาคาร...
            </Typography>
            <LinearProgress sx={{ borderRadius: '6px', height: 6 }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<PaidIcon />}
              onClick={handleSimulatePaid}
              disabled={paymentStatus === 'paid'}
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                px: 3,
                minHeight: 44,
                bgcolor: '#1976D2',
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
                '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
              }}
            >
              {paymentStatus === 'paid' ? 'ชำระเงินเรียบร้อยแล้ว' : 'ฉันชำระเงินเรียบร้อยแล้ว'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
