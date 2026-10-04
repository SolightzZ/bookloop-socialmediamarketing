import React from 'react';
import { Box, Typography } from '@mui/material';
import { Truck, MapPin, Check } from 'lucide-react';

export type DeliveryMethod = 'shipping' | 'meetup' | 'both';

export interface DeliverySelectorProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

export const DeliverySelector: React.FC<DeliverySelectorProps> = ({
  value,
  onChange,
}) => {
  const options = [
    {
      id: 'shipping' as DeliveryMethod,
      title: 'จัดส่งพัสดุ',
      desc: 'จัดส่งทางพัสดุด่วน',
      icon: <Truck size={20} color="#1976D2" />,
    },
    {
      id: 'meetup' as DeliveryMethod,
      title: 'นัดรับสินค้า',
      desc: 'ส่งมอบด้วยตนเอง',
      icon: <MapPin size={20} color="#1976D2" />,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 1.75 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '1rem',
            lineHeight: 1.3,
          }}
        >
          การจัดส่ง
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
          เลือกวิธีส่งมอบหนังสือ
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1.5,
        }}
      >
        {options.map((opt) => {
          const isSelected = value === opt.id || value === 'both';

          return (
            <Box
              key={opt.id}
              role="button"
              tabIndex={0}
              onClick={() => onChange(opt.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onChange(opt.id);
                }
              }}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: isSelected ? '2px solid #1976D2' : '1px solid #E2EAF2',
                bgcolor: isSelected ? '#F0F7FF' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: isSelected ? '#1976D2' : '#CBD5E1',
                  bgcolor: isSelected ? '#F0F7FF' : '#F8FAFD',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: isSelected ? '#FFFFFF' : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: isSelected ? '#BFDBFE' : '#E2EAF2',
                  }}
                >
                  {opt.icon}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: '#0F2F52',
                      fontSize: '0.9375rem',
                    }}
                  >
                    {opt.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748B',
                      fontSize: '0.78rem',
                      display: 'block',
                    }}
                  >
                    {opt.desc}
                  </Typography>
                </Box>
              </Box>

              {/* Blue check indicator */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: isSelected ? '#1976D2' : 'transparent',
                  border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                {isSelected && <Check size={13} strokeWidth={3} />}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
