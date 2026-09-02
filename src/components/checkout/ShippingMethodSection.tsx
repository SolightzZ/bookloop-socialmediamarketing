import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  Chip,
} from '@mui/material';
import {
  LocalShippingOutlined as ShippingIcon,
  BoltOutlined as FlashIcon,
  CheckCircle as SelectedIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatCurrency';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimate: string;
  carrier: string;
  description: string;
  tag?: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Shipping (มาตรฐาน)',
    price: 0,
    estimate: '2-3 วันทำการ',
    carrier: 'Flash Express / Kerry',
    description: 'จัดส่งพัสดุแบบประหยัดพลังงาน หมุนเวียนกล่องพัสดุรักษ์โลก',
    tag: 'ฟรี (โปรโมชัน)',
  },
  {
    id: 'express',
    name: 'Express Shipping (ด่วนพิเศษ)',
    price: 40,
    estimate: '1-2 วันทำการ (ส่งด่วน)',
    carrier: 'Flash Express Priority',
    description: 'เข้ารับและนำจ่ายพัสดุในวันถัดไปทันที พร้อมประกันสินค้าชดเชยเต็มจำนวน',
    tag: 'ส่งไวทันใจ',
  },
];

interface ShippingMethodSectionProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  selectedMethod,
  onSelectMethod,
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
          <ShippingIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
            2. วิธีการจัดส่ง
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            เลือกรูปแบบความเร็วในการจัดส่งหนังสือ
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SHIPPING_OPTIONS.map((opt) => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {opt.name}
                      </Typography>
                      {opt.tag && (
                        <Chip
                          label={opt.tag}
                          size="small"
                          color={opt.price === 0 ? 'success' : 'primary'}
                          sx={{ fontSize: '0.72rem', height: 22, fontWeight: 700 }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: opt.price === 0 ? 'success.main' : 'primary.main',
                      }}
                    >
                      {opt.price === 0 ? 'ฟรี (Free)' : formatCurrency(opt.price)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.85rem' }}>
                    {opt.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FlashIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                      ระยะเวลา: {opt.estimate}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ขนส่ง: {opt.carrier}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};
