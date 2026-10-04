import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import {
  AutoFixHigh as AutoFillIcon,
} from '@mui/icons-material';
import { OrderShippingAddress } from '../../types/order';

interface ShippingAddressSectionProps {
  address: OrderShippingAddress;
  errors: Partial<Record<keyof OrderShippingAddress, string>>;
  onChange: (field: keyof OrderShippingAddress, value: string) => void;
  onUseDemoAddress: () => void;
}

const POPULAR_PROVINCES = [
  'กรุงเทพมหานคร',
  'นนทบุรี',
  'ปทุมธานี',
  'สมุทรปราการ',
  'เชียงใหม่',
  'ขอนแก่น',
  'นครราชสีมา',
  'ชลบุรี',
  'ภูเก็ต',
  'สงขลา',
];

export const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  address,
  errors,
  onChange,
  onUseDemoAddress,
}) => {
  return (
    <Box
      component="section"
      aria-label="ที่อยู่สำหรับจัดส่ง"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: '10px',
        border: '1px solid #D6E0EA',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(15, 53, 87, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'flex-start', sm: 'space-between' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Typography
            aria-hidden
            sx={{ fontWeight: 800, color: '#1976D2', fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}
          >
            01
          </Typography>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 700, color: '#102A43', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
              ที่อยู่สำหรับจัดส่ง
            </Typography>
            <Typography variant="caption" sx={{ color: '#62748A' }}>
              กรอกข้อมูลผู้รับและที่อยู่จัดส่งให้ถูกต้อง
            </Typography>
          </Box>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<AutoFillIcon />}
          onClick={onUseDemoAddress}
          sx={{
            borderRadius: '8px',
            fontSize: '0.78rem',
            textTransform: 'none',
            borderColor: '#D6E0EA',
            color: '#62748A',
            bgcolor: '#FFFFFF',
            whiteSpace: 'nowrap',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: 'center',
            '&:hover': {
              borderColor: '#1976D2',
              color: '#1976D2',
              bgcolor: '#FFFFFF',
            },
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
          }}
        >
          ใส่ที่อยู่ตัวอย่าง
        </Button>
      </Box>

      <Grid
        container
        spacing={{ xs: 2, sm: 2.5 }}
        sx={{
          '& .MuiOutlinedInput-root': { minHeight: 48, borderRadius: '8px', bgcolor: '#FFFFFF' },
          '& .MuiOutlinedInput-input': { fontSize: '0.92rem' },
        }}
      >
        {/* Full Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel htmlFor="co-name" required>
            ชื่อ-นามสกุล ผู้รับ
          </FieldLabel>
          <TextField
            id="co-name"
            fullWidth
            value={address.name}
            onChange={(e) => onChange('name', e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            placeholder="เช่น สมชาย ใจดี"
            size="small"
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel htmlFor="co-phone" required>
            เบอร์โทรศัพท์ติดต่อ
          </FieldLabel>
          <TextField
            id="co-phone"
            fullWidth
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            error={Boolean(errors.phone)}
            helperText={errors.phone || 'เพื่อการติดต่อของพนักงานขนส่ง'}
            placeholder="08X-XXX-XXXX"
            size="small"
            inputMode="tel"
          />
        </Grid>

        {/* Address */}
        <Grid size={12}>
          <FieldLabel htmlFor="co-address" required>
            ที่อยู่จัดส่ง
          </FieldLabel>
          <TextField
            id="co-address"
            fullWidth
            value={address.address}
            onChange={(e) => onChange('address', e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address || 'บ้านเลขที่ / ซอย / ถนน / อาคาร'}
            placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท 71 แขวงพระโขนงเหนือ"
            multiline
            rows={2}
            size="small"
          />
        </Grid>

        {/* Province */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel htmlFor="co-province" required>
            จังหวัด
          </FieldLabel>
          <TextField
            id="co-province"
            fullWidth
            value={address.province}
            onChange={(e) => onChange('province', e.target.value)}
            error={Boolean(errors.province)}
            helperText={errors.province}
            placeholder="เช่น กรุงเทพมหานคร"
            size="small"
          />
        </Grid>

        {/* Postal Code */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel htmlFor="co-postal" required>
            รหัสไปรษณีย์
          </FieldLabel>
          <TextField
            id="co-postal"
            fullWidth
            value={address.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            error={Boolean(errors.postalCode)}
            helperText={errors.postalCode || '5 หลัก เช่น 10110'}
            placeholder="เช่น 10110"
            size="small"
            inputMode="numeric"
            slotProps={{ htmlInput: { maxLength: 5 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

/** Label rendered above the input (never inside it). */
const FieldLabel: React.FC<{
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, required, children }) => (
  <Typography
    component="label"
    htmlFor={htmlFor}
    sx={{
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#102A43',
      mb: 1,
    }}
  >
    {children}
    {required && (
      <Box component="span" sx={{ color: '#D64545', ml: 0.25 }} aria-hidden>
        *
      </Box>
    )}
  </Typography>
);
