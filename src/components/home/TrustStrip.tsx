import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LocalOfferOutlined as TagIcon,
  VerifiedUserOutlined as ShieldIcon,
  AutoStoriesOutlined as BookIcon,
  SyncAltOutlined as LoopIcon,
} from '@mui/icons-material';
import { AppContainer } from '../common/Container';

interface TrustItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}

const trustItems: TrustItem[] = [
  {
    icon: <TagIcon sx={{ fontSize: 22, color: '#10B981' }} />,
    iconBg: '#E8F5E9',
    title: 'ประหยัดสูงสุด 70%',
    subtitle: 'คุ้มค่ากว่าราคาปกมือหนึ่ง',
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 22, color: '#1976D2' }} />,
    iconBg: '#EAF4FF',
    title: 'ตรวจสอบสภาพทุกเล่ม',
    subtitle: 'ระบุสภาพชัดเจน มีรูปจริง',
  },
  {
    icon: <BookIcon sx={{ fontSize: 22, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
    title: 'เรื่องราวจากเจ้าของเดิม',
    subtitle: 'สัมผัสคุณค่าและความทรงจำ',
  },
  {
    icon: <LoopIcon sx={{ fontSize: 22, color: '#1976D2' }} />,
    iconBg: '#EAF4FF',
    title: 'ส่งต่อได้ไม่รู้จบ',
    subtitle: 'อ่านจบแล้วส่งต่อให้คนถัดไป',
  },
];

/**
 * TrustStrip component.
 * Floating rounded white capsule matching the Mainimages.png reference prototype.
 * - Single unified horizontal capsule (borderRadius: 24)
 * - Subtle vertical separators
 * - Soft elevation and colorful circular icon badges
 */
export const TrustStrip: React.FC = () => {
  return (
    <Box
      component="section"
      aria-label="คุณค่าและความน่าเชื่อถือของ BookLoop"
      sx={{
        position: 'relative',
        zIndex: 20,
        py: { xs: 3, md: 4 },
        mt: { xs: -2, md: -3 },
      }}
    >
      <AppContainer>
        {/* Floating Capsule Container */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: { xs: 4, md: 6 },
            p: { xs: 2.5, sm: 3, md: '20px 36px' },
            boxShadow: '0 16px 40px -8px rgba(15, 45, 74, 0.09), 0 2px 8px rgba(15, 45, 74, 0.03)',
            border: '1px solid #EDF2F7',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: 'center',
          }}
        >
          {trustItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.75, md: 2 },
                px: { md: 1 },
                borderRight: {
                  md: index < trustItems.length - 1 ? '1px solid #EEF2F6' : 'none',
                },
              }}
            >
              {/* Circular Icon Container */}
              <Box
                sx={{
                  width: { xs: 36, sm: 42, md: 44 },
                  height: { xs: 36, sm: 42, md: 44 },
                  borderRadius: '50%',
                  bgcolor: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: 18, sm: 22 },
                  },
                }}
              >
                {item.icon}
              </Box>

              {/* Text Info */}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#0F2D4A',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#627D98',
                    fontSize: { xs: '0.7rem', sm: '0.78rem', md: '0.8rem' },
                    display: 'block',
                    lineHeight: 1.25,
                    mt: 0.25,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </AppContainer>
    </Box>
  );
};
