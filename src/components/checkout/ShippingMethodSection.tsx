import React from 'react';
import {
  Box,
  Typography,
  Radio,
  Chip,
} from '@mui/material';
import {
  BoltOutlined as FlashIcon,
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
    <Box
      component="section"
      aria-label="วิธีการจัดส่ง"
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
          02
        </Typography>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#102A43', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
            วิธีการจัดส่ง
          </Typography>
          <Typography variant="caption" sx={{ color: '#62748A' }}>
            เลือกรูปแบบความเร็วในการจัดส่งหนังสือ
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {SHIPPING_OPTIONS.map((opt) => {
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
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
