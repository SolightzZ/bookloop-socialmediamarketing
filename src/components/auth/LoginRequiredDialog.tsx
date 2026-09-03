import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Close as CloseIcon,
  ShoppingCartOutlined as CartIcon,
  ShoppingBagOutlined as BuyIcon,
} from '@mui/icons-material';

export interface LoginRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  mode?: 'add-to-cart' | 'buy-now' | 'generic';
  customMessage?: string;
}

/**
 * Accessible, editorial LoginRequiredDialog.
 * Contextual prompt shown whenever an unauthenticated visitor attempts
 * a commerce mutation (Add to Cart or Buy Now).
 */
export const LoginRequiredDialog: React.FC<LoginRequiredDialogProps> = ({
  open,
  onClose,
  onLogin,
  mode = 'add-to-cart',
  customMessage,
}) => {
  const isBuyNow = mode === 'buy-now';

  const heading = customMessage || (
    isBuyNow
      ? 'กรุณาเข้าสู่ระบบเพื่อดำเนินการซื้อหนังสือ'
      : 'กรุณาเข้าสู่ระบบเพื่อเพิ่มหนังสือลงตะกร้า'
  );

  const subtext = isBuyNow
    ? 'เข้าสู่ระบบ BookLoop เพื่อเลือกที่อยู่จัดส่ง ชำระเงิน และรับการคุ้มครองคำสั่งซื้ออย่างปลอดภัย'
    : 'เข้าสู่ระบบ BookLoop เพื่อเก็บหนังสือเล่มนี้ไว้ในตะกร้าส่วนตัวของคุณและดำเนินการสั่งซื้อ';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onLogin();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="login-required-title"
      aria-describedby="login-required-desc"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(15, 45, 74, 0.55)',
          },
        },
        paper: {
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: 420,
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 20px 40px -15px rgba(15, 45, 74, 0.25)',
            border: '1px solid #E2E8F0',
          },
        },
      }}
    >
      {/* Close button */}
      <IconButton
        aria-label="ปิดหน้าต่าง"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: '#627D98',
          '&:hover': { color: '#0F2D4A', bgcolor: '#F1F5F9' },
          '&:focus-visible': { outline: '2px solid #1976D2' },
        }}
        size="small"
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Header Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1, px: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: isBuyNow ? '#EAF4FF' : '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1976D2',
            flexShrink: 0,
          }}
        >
          {isBuyNow ? <BuyIcon sx={{ fontSize: 24 }} /> : <CartIcon sx={{ fontSize: 24 }} />}
        </Box>
        <Box>
          <Typography
            id="login-required-title"
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 800,
              color: '#0F2D4A',
              fontSize: { xs: '1.05rem', sm: '1.15rem' },
              lineHeight: 1.3,
            }}
          >
            {heading}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: 1, py: 2 }}>
        <Typography
          id="login-required-desc"
          variant="body2"
          sx={{
            color: '#627D98',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          {subtext}
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: '#F8FAFC',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          <LockIcon sx={{ fontSize: 18, color: '#1976D2' }} />
          <Typography variant="caption" sx={{ color: '#486581', fontWeight: 500, fontSize: '0.78rem' }}>
            ข้อมูลตะกร้าและการสั่งซื้อจะเชื่อมต่อกับบัญชีของคุณโดยอัตโนมัติ
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 1, pb: 1, gap: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            color: '#627D98',
            borderColor: '#CBD5E1',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            px: 2.25,
            py: 1,
            '&:hover': {
              borderColor: '#94A3B8',
              bgcolor: '#F8FAFC',
            },
            '&:focus-visible': {
              outline: '2px solid #1976D2',
            },
          }}
        >
          ยกเลิก
        </Button>

        <Button
          variant="contained"
          autoFocus
          onClick={onLogin}
          sx={{
            borderRadius: 2,
            bgcolor: '#1976D2',
            color: '#FFFFFF',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.9rem',
            px: 2.75,
            py: 1,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
            '&:hover': {
              bgcolor: '#0F2D4A',
              boxShadow: '0 6px 16px rgba(15, 45, 74, 0.3)',
            },
            '&:focus-visible': {
              outline: '2px solid #1976D2',
              outlineOffset: '2px',
            },
          }}
        >
          เข้าสู่ระบบ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
