import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  LocalOfferRounded,
  MonetizationOnOutlined,
  CalculateRounded,
  SavingsOutlined,
} from '@mui/icons-material';

interface PricingSectionProps {
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

  const handleApplyDiscountPreset = (percent: number) => {
    if (numOriginal > 0) {
      const calculatedPrice = Math.round(numOriginal * (1 - percent / 100));
      onChange({ target: { name: 'price', value: String(calculatedPrice) } });
      onBlur('price');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: '#EAF4FF',
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocalOfferRounded sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '1.05rem', lineHeight: 1.2 }}
          >
            ราคาและการส่งต่อ
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
            กำหนดราคาขายที่ยุติธรรมและเหมาะสมกับสภาพหนังสือ เพื่อเพิ่มโอกาสส่งต่อได้เร็ว
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Original Price */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="ราคาปกเดิมโดยประมาณ (ถ้าทราบ)"
            name="originalPrice"
            value={originalPrice}
            onChange={(e) => handleNumericInput('originalPrice', e.target.value)}
            onBlur={() => onBlur('originalPrice')}
            error={Boolean(touched.originalPrice && errors.originalPrice)}
            helperText={
              touched.originalPrice && errors.originalPrice
                ? errors.originalPrice
                : 'ระบุราคาที่พิมพ์ไว้หลังปกหนังสือ'
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#0F2D4A', fontWeight: 700 }}>
                    ฿
                  </InputAdornment>
                ),
                inputMode: 'numeric',
              },
            }}
            placeholder="395"
            size="small"
          />

          {/* Quick Discount Presets when Original Price exists */}
          {numOriginal > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                ตั้งราคาด่วน:
              </Typography>
              {[40, 50, 60, 70].map((pct) => (
                <Chip
                  key={pct}
                  label={`ลด ${pct}%`}
                  size="small"
                  onClick={() => handleApplyDiscountPreset(pct)}
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: '#EFF6FF',
                    color: '#1D4ED8',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#DBEAFE' },
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Selling Price */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="ราคาที่ต้องการขายจริง"
            name="price"
            value={price}
            onChange={(e) => handleNumericInput('price', e.target.value)}
            onBlur={() => onBlur('price')}
            error={Boolean(touched.price && errors.price)}
            helperText={touched.price && errors.price ? errors.price : 'ราคาขายที่ผู้ซื้อชำระจริง (บาท)'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#0F2D4A', fontWeight: 800 }}>
                    ฿
                  </InputAdornment>
                ),
                inputMode: 'numeric',
              },
            }}
            placeholder="200"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Smart Live Calculator Preview Card */}
      {numPrice > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.8,
            bgcolor: '#F0FDF4',
            border: '1px solid #DCFCE7',
            borderRadius: 2.5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnOutlined sx={{ fontSize: 22, color: '#16A34A' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#166534', fontSize: '0.85rem' }}>
                คุณจะได้รับเงินเต็ม: ฿{numPrice.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803D', fontSize: '0.75rem' }}>
                BookLoop ไม่หักค่าธรรมเนียมการขายสำหรับสมาชิกทั่วไป
              </Typography>
            </Box>
          </Box>

          {discountPercent > 0 && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                bgcolor: '#DCFCE7',
                color: '#15803D',
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                fontWeight: 800,
                fontSize: '0.78rem',
              }}
            >
              <SavingsOutlined sx={{ fontSize: 16 }} />
              ผู้ซื้อประหยัดได้ {discountPercent}%
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
