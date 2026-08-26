import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BookLoopJourney } from '../components/BookLoopJourney';
import { AboutValueCards } from '../components/about/AboutValueCards';
import { trackEvent } from '../utils/analytics';
import { tokens } from '../theme';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('view_home', { page: 'about' });
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box sx={{ bgcolor: tokens.colors.footerBg, color: '#FFFFFF', py: 11, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: '#38BDF8',
              fontWeight: 800,
              letterSpacing: 2.5,
              fontSize: '0.85rem',
              display: 'inline-block',
              mb: 1,
            }}
          >
            OUR PHILOSOPHY
          </Typography>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '2.1rem', md: '3.2rem' },
              letterSpacing: '-0.5px',
              mt: 1,
            }}
          >
            หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              mt: 3,
              lineHeight: 1.85,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: 760,
              mx: 'auto',
            }}
          >
            เราเชื่อว่าคุณค่าของหนังสือไม่ได้จบลงเมื่อหน้าสุดท้ายถูกปิดลง แต่สามารถเดินทางต่อไปสร้างแรงบันดาลใจ ความรู้ และความสุขให้กับเจ้าของคนใหม่ BookLoop จึงเกิดขึ้นเพื่อเป็นพื้นที่ส่งต่อหนังสือมือสองที่โปร่งใส เข้าถึงง่าย และยั่งยืน
          </Typography>
        </Container>
      </Box>

      {/* How BookLoop Works Interactive Section */}
      <BookLoopJourney />

      {/* Core Values & 3 Pillars of Impact */}
      <AboutValueCards />

      {/* Join the Movement CTA */}
      <Box sx={{ bgcolor: tokens.colors.ctaBg, color: tokens.colors.ctaHeading, py: 12, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: tokens.colors.ctaHeading, letterSpacing: '-0.5px' }}>
            พร้อมร่วมหมุนเวียนเรื่องราวดีๆ แล้วหรือยัง?
          </Typography>
          <Typography variant="h6" sx={{ color: tokens.colors.ctaSubtext, mb: 4, fontWeight: 400, lineHeight: 1.7, maxWidth: 680, mx: 'auto' }}>
            เลือกซื้อหนังสือเล่มต่อไปในราคาสบายกระเป๋า หรือนำหนังสือที่คุณรักมาส่งต่อให้เพื่อนนักอ่าน
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/books')}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              เลือกซื้อหนังสือ
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              size="large"
              onClick={() => navigate('/sell')}
            >
              ลงขายหนังสือ
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
