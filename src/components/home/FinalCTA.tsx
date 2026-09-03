import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '../common/Container';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      aria-label="ร่วมเป็นส่วนหนึ่งของ BookLoop"
      sx={{
        bgcolor: '#0B2545',
        color: '#FFFFFF',
        py: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Subtle Visual Loop Motif (SVG Background) */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 360, sm: 600, md: 800 },
          height: { xs: 360, sm: 600, md: 800 },
          pointerEvents: 'none',
          opacity: 0.06,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <path
            d="M 50 100 C 50 70, 80 50, 100 70 C 120 90, 150 130, 150 100 C 150 70, 120 50, 100 70 C 80 90, 50 130, 50 100 Z"
            stroke="#38BDF8"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />
        </svg>
      </Box>

      <AppContainer sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          {/* Eyebrow */}
          <Typography
            variant="overline"
            sx={{
              color: '#38BDF8',
              fontWeight: 800,
              letterSpacing: '0.14em',
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              mb: 1.5,
              display: 'block',
            }}
          >
            START YOUR READING LOOP
          </Typography>

          {/* Headline */}
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 2.5,
              color: '#FFFFFF',
            }}
          >
            หนังสือเล่มต่อไปของคุณ
            <br />
            อาจกำลังรออยู่
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: '#CBD5E1',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              lineHeight: 1.7,
              maxWidth: 580,
              mx: 'auto',
              mb: { xs: 4, sm: 5 },
            }}
          >
            ร่วมเป็นส่วนหนึ่งของคอมมูนิตี้คนรักการอ่าน ส่งต่อความรู้ ความคิด และเรื่องราวที่ไม่มีวันสิ้นสุดในราคาที่เข้าถึงได้ทุกคน
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/books')}
              sx={{
                bgcolor: '#FFFFFF',
                color: '#0F2D4A',
                px: { xs: 4, sm: 4.5 },
                py: 1.4,
                borderRadius: 2,
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              ค้นหาหนังสือ
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/sell')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                px: { xs: 4, sm: 4.5 },
                py: 1.4,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              ส่งต่อหนังสือ
            </Button>
          </Box>
        </Box>
      </AppContainer>
    </Box>
  );
};
