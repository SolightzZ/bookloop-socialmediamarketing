import React from 'react';
import { Box, Typography, Chip, Container } from '@mui/material';
import {
  BoltRounded,
  MonetizationOnOutlined,
  RecyclingRounded,
  AutoStoriesRounded,
} from '@mui/icons-material';

export const SellHero: React.FC = () => {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#0F2D4A',
        color: '#FFFFFF',
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 4, sm: 5, md: 5.5 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Modern subtle geometric accents */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          bgcolor: '#1976D2',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          bgcolor: '#38BDF8',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
          {/* Badge */}
          <Chip
            icon={<AutoStoriesRounded sx={{ fontSize: 16, color: '#38BDF8 !important' }} />}
            label="SELL & SHARE • ส่งต่อง่าย ได้คุณค่า"
            size="small"
            sx={{
              bgcolor: 'rgba(25, 118, 210, 0.25)',
              color: '#38BDF8',
              fontWeight: 800,
              letterSpacing: '0.04em',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              mb: 1.5,
              py: 0.5,
              px: 1,
              height: 28,
              fontSize: '0.78rem',
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: '#FFFFFF',
              fontSize: { xs: '1.65rem', sm: '2.1rem', md: '2.5rem' },
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              mb: 1.2,
            }}
          >
            มีหนังสือที่อ่านจบแล้ว? <span className="text-[#38BDF8]">ส่งต่อได้ที่นี่</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#CBD5E1',
              fontSize: { xs: '0.9rem', sm: '1.02rem' },
              lineHeight: 1.6,
              maxWidth: 580,
              mx: 'auto',
              mb: 3,
            }}
          >
            เปลี่ยนหนังสือบนชั้นให้กลายเป็นรายได้และส่งต่อแรงบันดาลใจ สู่นักอ่านคนถัดไปในชุมชน BookLoop
          </Typography>

          {/* 3 Modern Trust Pillars with Icons */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1.2, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 9999,
                py: 0.6,
                px: 1.8,
              }}
            >
              <BoltRounded sx={{ fontSize: 18, color: '#FBBF24' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.8rem' }}>
                ลงขายง่ายใน 3 นาที
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 9999,
                py: 0.6,
                px: 1.8,
              }}
            >
              <MonetizationOnOutlined sx={{ fontSize: 18, color: '#34D399' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.8rem' }}>
                รับเงินเต็มจำนวน ไม่มีค่าแอบแฝง
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 9999,
                py: 0.6,
                px: 1.8,
              }}
            >
              <RecyclingRounded sx={{ fontSize: 18, color: '#60A5FA' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.8rem' }}>
                หมุนเวียนและลดขยะกระดาษ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
