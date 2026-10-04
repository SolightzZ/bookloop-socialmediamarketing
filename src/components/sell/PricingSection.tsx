import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';

export interface PricingSectionProps {
  price: string;
  originalPrice: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onBlur: (field: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  price,
  originalPrice,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  const handleNumericInput = (name: 'price' | 'originalPrice', rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9]/g, '');
    onChange({ target: { name, value: sanitized } });
  };

  const numPrice = Number(price) || 0;
  const numOriginal = Number(originalPrice) || 0;

  const discountPercent =
    numPrice > 0 && numOriginal > numPrice
      ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
      : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Title */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '1.05rem',
            lineHeight: 1.3,
          }}
        >
          ราคาหนังสือ
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#64748B',
            fontSize: '0.825rem',
            display: 'block',
            mt: 0.25,
          }}
        >
          กำหนดราคาขายที่คุณต้องการ
        </Typography>
      </Box>

      {/* 2 Column Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2.5, sm: 2.5 },
        }}
      >
        {/* ราคาที่ต้องการ (ราคาขายจริง) */}
        <Box>
          <Typography
            component="label"
            htmlFor="sell-field-price"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            ราคาที่ต้องการ (บาท) <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
          </Typography>
          <TextField
            id="sell-field-price"
            name="price"
            fullWidth
            size="small"
            value={price}
            placeholder="200"
            onChange={(e) => handleNumericInput('price', e.target.value)}
            onBlur={() => onBlur('price')}
            error={Boolean(touched.price && errors.price)}
            helperText={touched.price && errors.price ? errors.price : ''}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#64748B', fontWeight: 600 }}>
                    ฿
                  </InputAdornment>
                ),
                inputMode: 'numeric',
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: '#E2EAF2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
              },
            }}
          />
        </Box>

        {/* ราคาหนังสือเดิม (ราคาปกเดิม) */}
        <Box>
          <Typography
            component="label"
            htmlFor="sell-field-original-price"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            ราคาปกเดิม (ถ้าทราบ)
          </Typography>
          <TextField
            id="sell-field-original-price"
            name="originalPrice"
            fullWidth
            size="small"
            value={originalPrice}
            placeholder="395"
            onChange={(e) => handleNumericInput('originalPrice', e.target.value)}
            onBlur={() => onBlur('originalPrice')}
            error={Boolean(touched.originalPrice && errors.originalPrice)}
            helperText={touched.originalPrice && errors.originalPrice ? errors.originalPrice : ''}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#64748B', fontWeight: 600 }}>
                    ฿
                  </InputAdornment>
                ),
                inputMode: 'numeric',
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: '#E2EAF2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Subtle Live Summary Hint */}
      {numPrice > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: '#F0FDF4',
            borderRadius: '10px',
            border: '1px solid #DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>
            คุณจะได้รับเงิน: ฿{numPrice.toLocaleString()} · ไม่มีค่าธรรมเนียม
          </Typography>

          {discountPercent > 0 && (
            <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 700, fontSize: '0.78rem' }}>
              ประหยัดจากราคาปก {discountPercent}%
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
