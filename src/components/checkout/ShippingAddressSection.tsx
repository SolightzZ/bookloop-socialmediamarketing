import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  FormHelperText,
} from '@mui/material';
import {
  LocationOnOutlined as AddressIcon,
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <AddressIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
              1. ที่อยู่สำหรับจัดส่งพัสดุ
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
            borderRadius: 2,
            fontSize: '0.78rem',
            textTransform: 'none',
            borderColor: '#CBD5E1',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        >
          ใส่ที่อยู่ตัวอย่าง
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        {/* Full Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="ชื่อ-นามสกุล ผู้รับ *"
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
          <TextField
            fullWidth
            label="เบอร์โทรศัพท์ติดต่อ *"
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            error={Boolean(errors.phone)}
            helperText={errors.phone || 'เพื่อการติดต่อของพนักงานขนส่ง'}
            placeholder="08X-XXX-XXXX หรือ 0XXXXXXXXX"
            size="small"
          />
        </Grid>

        {/* Address */}
        <Grid size={12}>
          <TextField
            fullWidth
            label="ที่อยู่จัดส่ง (บ้านเลขที่ / ซอย / ถนน / อาคาร) *"
            value={address.address}
            onChange={(e) => onChange('address', e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address}
            placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท 71 แขวงพระโขนงเหนือ"
            multiline
            rows={2}
            size="small"
          />
        </Grid>

        {/* Province */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="จังหวัด *"
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
          <TextField
            fullWidth
            label="รหัสไปรษณีย์ *"
            value={address.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            error={Boolean(errors.postalCode)}
            helperText={errors.postalCode}
            placeholder="เช่น 10110 (5 หลัก)"
            size="small"
            slotProps={{ htmlInput: { maxLength: 5 } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
