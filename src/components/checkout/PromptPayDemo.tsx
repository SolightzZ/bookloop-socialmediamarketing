import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
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
      showSuccess('ชำระเงินสำเร็จ (Demo)', `ได้รับยอดชำระ ${formatCurrency(totalAmount)} เรียบร้อยแล้ว`);
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
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 2,
        borderRadius: 2.5,
        border: '1.5px dashed #003D6B',
        bgcolor: '#F8FAFC',
        textAlign: 'center',
      }}
    >
      {/* Thai QR Header */}
      <Box
        sx={{
          bgcolor: '#003D6B',
          color: '#FFFFFF',
          py: 1,
          px: 2,
          borderRadius: 1.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
          THAI QR PAYMENT
        </Typography>
        <Chip
          label="พร้อมเพย์ / PromptPay"
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 20,
          }}
        />
      </Box>

      {/* QR Code Container */}
      <Box
        sx={{
          position: 'relative',
          width: 200,
          height: 200,
          mx: 'auto',
          p: 1.5,
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          border: '1px solid #CBD5E1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          ยอดชำระเงิน
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#003D6B' }}>
          {formatCurrency(totalAmount)}
        </Typography>

        {paymentStatus === 'pending' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <ExpiredIcon sx={{ fontSize: 16, color: timeLeft < 60 ? 'error.main' : 'text.secondary' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: timeLeft < 60 ? 'error.main' : 'text.secondary',
              }}
            >
              QR Code จะหมดอายุใน: {formatTime(timeLeft)}
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
          gap: 1,
          mt: 1.5,
          color: 'text.secondary',
        }}
      >
        <Typography variant="caption">
          ชื่อบัญชี: <strong>BookLoop Social Platform (Demo)</strong>
        </Typography>
        <Tooltip title="คัดลอก Biller ID">
          <IconButton size="small" onClick={copyBillerId}>
            <CopyIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Payment verification actions (Simulation) */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #E2E8F0' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          ⚡ ทดสอบระบบ Demo (คลิกเพื่อจำลองสถานะการชำระเงิน):
        </Typography>

        {isVerifying ? (
          <Box sx={{ py: 1 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 1 }}>
              กำลังตรวจสอบยอดเงินจากธนาคาร...
            </Typography>
            <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<PaidIcon />}
              onClick={handleSimulatePaid}
              disabled={paymentStatus === 'paid'}
              sx={{ borderRadius: 2, fontWeight: 700, px: 2 }}
            >
              {paymentStatus === 'paid' ? 'ชำระเงินเรียบร้อยแล้ว' : 'ฉันชำระเงินแล้ว'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleSimulateFailed}
              disabled={paymentStatus === 'paid'}
              sx={{ borderRadius: 2, fontSize: '0.75rem' }}
            >
              จำลองชำระเงินไม่สำเร็จ
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
