import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Chip } from '@mui/material';
import {
  LocalOffer as PromoIcon,
  CheckCircle as AppliedIcon,
  Close as RemoveIcon,
} from '@mui/icons-material';
import { showSuccess, showWarning } from '../../utils/alerts';

const VALID_PROMOS: Record<string, { discount: number; type: 'percent' | 'fixed'; label: string }> = {
  BOOKLOOP10: { discount: 10, type: 'percent', label: 'ลด 10%' },
  READER2024: { discount: 50, type: 'fixed', label: 'ลด 50 บาท' },
  FIRSTBUY: { discount: 15, type: 'percent', label: 'ลด 15% (ลูกค้าใหม่)' },
};

interface PromoCodeInputProps {
  onApply: (discount: number, label: string) => void;
  onRemove: () => void;
  appliedPromo: { code: string; label: string; discount: number } | null;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply, onRemove, appliedPromo }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      showWarning('กรุณาใส่รหัสส่วนลด');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const promo = VALID_PROMOS[trimmed];
      if (promo) {
        onApply(promo.discount, promo.label);
        showSuccess(`ใช้รหัส ${trimmed} สำเร็จ! ${promo.label}`);
        setCode('');
      } else {
        showWarning('รหัสส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว');
      }
      setLoading(false);
    }, 600);
  };

  if (appliedPromo) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          borderRadius: 2,
          bgcolor: '#F0FDF4',
          border: '1px solid #BBF7D0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AppliedIcon sx={{ fontSize: 18, color: '#16A34A' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#16A34A', fontSize: '0.85rem' }}>
            {appliedPromo.code}
          </Typography>
          <Chip label={appliedPromo.label} size="small" sx={{ bgcolor: '#DCFCE7', color: '#16A34A', fontWeight: 600, height: 22, fontSize: '0.7rem' }} />
        </Box>
        <Button
          size="small"
          onClick={onRemove}
          startIcon={<RemoveIcon sx={{ fontSize: 14 }} />}
          sx={{ textTransform: 'none', color: '#94A3B8', fontSize: '0.75rem', minWidth: 0 }}
        >
          ลบ
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        size="small"
        placeholder="รหัสส่วนลด"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        slotProps={{
          input: {
            startAdornment: <PromoIcon sx={{ fontSize: 18, color: '#94A3B8', mr: 0.5 }} />,
          },
        }}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: '0.85rem',
            bgcolor: '#FFFFFF',
          },
        }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={handleApply}
        disabled={loading || !code.trim()}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          px: 2.5,
          borderColor: '#CBD5E1',
          color: '#1976D2',
          '&:hover': { borderColor: '#1976D2', bgcolor: 'rgba(25, 118, 210, 0.04)' },
        }}
      >
        {loading ? 'ตรวจสอบ...' : 'ใช้โค้ด'}
      </Button>
    </Box>
  );
};
