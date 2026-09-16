import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  MenuBookRounded,
  MonetizationOnOutlined,
  VolunteerActivismOutlined,
  ArrowForwardRounded,
  LockOutlined,
  AutoStoriesRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AppContainer } from '../common/Container';
import { useAuth } from '../../hooks/useAuth';
import { MagneticButton } from '../common/MagneticButton';
import { trackEvent } from '../../utils/analytics';

/**
 * HomePassOnSection
 * Dedicated community section for passing on books.
 * Copy:
 * "มีหนังสือที่อ่านจบแล้ว? ส่งต่อได้ที่นี่
 * เปลี่ยนหนังสือบนชั้นให้กลายเป็นรายได้และส่งต่อแรงบันดาลใจ สู่นักอ่านคนถัดไปในชุมชน BookLoop"
 * Rule:
 * ต้องเข้าสู่ระบบถึงจะเห็นปุ่ม "ส่งต่อหนังสือ" (ถ้ายังไม่เข้าสู่ระบบ แสดงปุ่มเข้าสู่ระบบเพื่อส่งต่อหนังสือ)
 */
export const HomePassOnSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGoToSell = () => {
    trackEvent('pass_on_book_click', { source: 'pass_on_community_section' });
    navigate('/sell');
  };

  const handleGoToLogin = () => {
    trackEvent('pass_on_book_click', { action: 'login_prompt', source: 'pass_on_community_section' });
    navigate('/login', { state: { from: { pathname: '/sell' } } });
  };

  return (
    <Box
      component="section"
      id="pass-on-books"
      aria-labelledby="pass-on-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 11 },
        bgcolor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AppContainer>
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            borderRadius: { xs: 3, sm: 4 },
            overflow: 'hidden',
            bgcolor: '#0F2D4A',
            color: '#FFFFFF',
            p: { xs: 3.5, sm: 5, md: 7 },
            boxShadow: '0 20px 40px -15px rgba(15, 45, 74, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Subtle Ambient Background Gradients */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              bgcolor: '#1976D2',
              opacity: 0.2,
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: '#38BDF8',
              opacity: 0.12,
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.75fr' },
              gap: { xs: 4, md: 5 },
              alignItems: 'center',
            }}
          >
            {/* Left Column: Heading, Copy, Key Highlights, & Auth-gated CTA */}
            <Box>
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 9999,
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                <AutoStoriesRounded sx={{ fontSize: 16 }} />
                <span>BOOK CIRCULATION COMMUNITY</span>
              </Box>

              {/* Required Exact Headline */}
              <Typography
                id="pass-on-heading"
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.65rem' },
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  mb: 2,
                }}
              >
                มีหนังสือที่อ่านจบแล้ว?{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#38BDF8',
                    display: { xs: 'inline', sm: 'inline-block' },
                  }}
                >
                  ส่งต่อได้ที่นี่
                </Box>
              </Typography>

              {/* Required Exact Subtitle Copy */}
              <Typography
                variant="body1"
                sx={{
                  color: '#CBD5E1',
                  fontSize: { xs: '0.98rem', sm: '1.08rem', md: '1.15rem' },
                  lineHeight: 1.7,
                  maxWidth: 620,
                  mb: 3.5,
                }}
              >
                เปลี่ยนหนังสือบนชั้นให้กลายเป็นรายได้และส่งต่อแรงบันดาลใจ สู่นักอ่านคนถัดไปในชุมชน BookLoop
              </Typography>

              {/* Three Value Micro-Pillars */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, sm: 2.5 },
                  mb: 4,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FBBF24',
                    }}
                  >
                    <MonetizationOnOutlined sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                    เปลี่ยนเป็นรายได้
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                    }}
                  >
                    <VolunteerActivismOutlined sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                    ส่งต่อแรงบันดาลใจ
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34D399',
                    }}
                  >
                    <MenuBookRounded sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                    หมุนเวียนเรื่องราว
                  </Typography>
                </Box>
              </Box>

              {/* Authentication-Gated CTA Area */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {isAuthenticated ? (
                  // Logged in: Render the "ส่งต่อหนังสือ" button with magnetic hover physics
                  <MagneticButton strength={0.25}>
                    <Button
                      id="pass-on-book-btn"
                      variant="contained"
                      size="large"
                      onClick={handleGoToSell}
                      endIcon={<ArrowForwardRounded />}
                      sx={{
                        bgcolor: '#38BDF8',
                        color: '#0A1E33',
                        px: { xs: 3.5, sm: 4.5 },
                        py: 1.5,
                        borderRadius: 2.5,
                        fontWeight: 800,
                        fontSize: { xs: '0.98rem', sm: '1.05rem' },
                        boxShadow: '0 8px 24px -4px rgba(56, 189, 248, 0.4)',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#7DD3FC',
                          boxShadow: '0 12px 28px -4px rgba(56, 189, 248, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      ส่งต่อหนังสือ
                    </Button>
                  </MagneticButton>
                ) : (
                  // Not logged in: Require login to see/access "ส่งต่อหนังสือ"
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                    }}
                  >
                    <Button
                      id="pass-on-login-prompt-btn"
                      variant="contained"
                      size="large"
                      onClick={handleGoToLogin}
                      startIcon={<LockOutlined sx={{ fontSize: 19 }} />}
                      endIcon={<ArrowForwardRounded />}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        px: { xs: 3, sm: 4 },
                        py: 1.4,
                        borderRadius: 2.5,
                        fontWeight: 700,
                        fontSize: { xs: '0.92rem', sm: '0.98rem' },
                        textTransform: 'none',
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.25)',
                          borderColor: '#38BDF8',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      เข้าสู่ระบบเพื่อส่งต่อหนังสือ
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94A3B8',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      * ต้องเข้าสู่ระบบเพื่อเริ่มลงขายและส่งต่อหนังสือ
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Right Column: Dynamic Circulation Visual Card */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box
                  sx={{
                    width: 320,
                    p: 3.5,
                    borderRadius: 3.5,
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.25)',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#38BDF8',
                    }}
                  >
                    <MenuBookRounded sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.8 }}>
                    ส่งต่อหนังสือใน 3 ขั้นตอน
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6, mb: 2.5 }}>
                    ถ่ายรูปหนังสือ ระบุสภาพและราคา แล้วลงขายสู่ชุมชนคนรักการอ่านได้ทันที
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(15, 45, 74, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                      สถานะระบบ
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22C55E' }} />
                      <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 700 }}>
                        พร้อมส่งต่อตลอด 24 ชม.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Paper>
      </AppContainer>
    </Box>
  );
};
