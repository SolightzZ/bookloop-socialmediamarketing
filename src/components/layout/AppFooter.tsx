import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Divider } from '@mui/material';
import { tokens } from '../../theme';

export const AppFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: tokens.colors.footerBg,
        color: tokens.colors.footerText,
        py: 8,
        mt: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 }}>
          {/* Brand Col */}
          <Box sx={{ maxWidth: 360 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="BookLoop Logo"
                referrerPolicy="no-referrer"
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1.25,
                  borderRadius: 1.5,
                  objectFit: 'contain',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                BookLoop
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: tokens.colors.footerText, mb: 2, lineHeight: 1.75, fontSize: '0.925rem' }}
            >
              หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป ซื้อ ขาย และส่งต่อหนังสือมือสองในราคาที่เข้าถึงง่าย
              พร้อมสร้างสังคมแห่งการแบ่งปันที่ยั่งยืน
            </Typography>
          </Box>

          {/* Links Columns */}
          <Box sx={{ display: 'flex', gap: { xs: 4, sm: 7 }, flexWrap: 'wrap' }}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: tokens.colors.footerHeading, mb: 2, letterSpacing: '0.2px' }}
              >
                เลือกซื้อหนังสือ
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/books')}
                >
                  หนังสือทั้งหมด
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/books?category=นิยาย')}
                >
                  นิยาย & วรรณกรรม
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/books?category=พัฒนาตนเอง')}
                >
                  พัฒนาตนเอง & จิตวิทยา
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/books?category=ธุรกิจ')}
                >
                  ธุรกิจ & การลงทุน
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: tokens.colors.footerHeading, mb: 2, letterSpacing: '0.2px' }}
              >
                เกี่ยวกับเรา
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/about')}
                >
                  เรื่องราวและปรัชญา
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/sell')}
                >
                  ส่งต่อหนังสือของคุณ
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/campaign/read-share-repeat')}
                >
                  แคมเปญ #อ่านจบส่งต่อวนต่อไป
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.footerText,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#38BDF8' },
                  }}
                  onClick={() => navigate('/techstack')}
                >
                  TechStack (สถาปัตยกรรมระบบ)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.footerMuted, fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} BookLoop. All rights reserved. (Demo Prototype Application)
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: tokens.colors.footerText, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            Made for book lovers everywhere.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
