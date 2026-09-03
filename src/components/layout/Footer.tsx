import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { AppContainer } from '../common/Container';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0A192F',
        color: '#E2E8F0',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 5 },
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <AppContainer>
        <Grid container spacing={{ xs: 4, md: 4, lg: 6 }} sx={{ mb: { xs: 4, md: 6 } }}>
          {/* Column 1: Brand */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mb: 2,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src="/images/logo.png"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.25,
                  borderRadius: 1.5,
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  fontSize: '1.25rem',
                }}
              >
                BookLoop
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#94A3B8',
                lineHeight: 1.65,
                fontSize: '0.875rem',
                maxWidth: 320,
                mb: 2.5,
              }}
            >
              หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป ซื้อ ขาย และส่งต่อหนังสือมือสองในราคาที่เข้าถึงง่าย พร้อมสร้างสังคมแห่งการแบ่งปันที่ยั่งยืน
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              แพลตฟอร์มตลาดหนังสือและชุมชนนักอ่านไทย
            </Typography>
          </Grid>

          {/* Column 2: เลือกซื้อหนังสือ */}
          <Grid size={{ xs: 6, sm: 6, md: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#38BDF8',
                mb: 2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8125rem',
              }}
            >
              เลือกซื้อหนังสือ
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {[
                { label: 'หนังสือทั้งหมด', path: '/books' },
                { label: 'นิยาย & วรรณกรรม', path: '/books?category=นิยาย' },
                { label: 'พัฒนาตนเอง & จิตวิทยา', path: '/books?category=พัฒนาตนเอง' },
                { label: 'ธุรกิจ & การลงทุน', path: '/books?category=ธุรกิจ' },
                { label: 'ความรู้ & สังคม', path: '/books?category=ความรู้' },
              ].map((link) => (
                <Box component="li" key={link.label}>
                  <Typography
                    variant="body2"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.path);
                    }}
                    href={link.path}
                    sx={{
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: '#38BDF8' },
                      '&:focus-visible': {
                        outline: '2px solid #38BDF8',
                        outlineOffset: '2px',
                        borderRadius: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Column 3: บริการของเรา */}
          <Grid size={{ xs: 6, sm: 6, md: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#38BDF8',
                mb: 2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8125rem',
              }}
            >
              บริการของเรา
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {[
                { label: 'ค้นหาหนังสือ', path: '/books' },
                { label: 'ส่งต่อหนังสือ (ขาย)', path: '/sell' },
                { label: 'ตรวจสอบสถานะคำสั่งซื้อ', path: '/account' },
                { label: 'มาตรฐานการระบุสภาพ', path: '/books' },
              ].map((link) => (
                <Box component="li" key={link.label}>
                  <Typography
                    variant="body2"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.path);
                    }}
                    href={link.path}
                    sx={{
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: '#38BDF8' },
                      '&:focus-visible': {
                        outline: '2px solid #38BDF8',
                        outlineOffset: '2px',
                        borderRadius: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Column 4: Community */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#38BDF8',
                mb: 2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8125rem',
              }}
            >
              Community
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {[
                { label: 'เรื่องราวของหนังสือ', path: '/#behind-the-books' },
                { label: 'วงจรการอ่าน BookLoop', path: '/#how-it-works' },
                { label: 'แชร์รีวิวบนโซเชียล #BookLoop', path: '/#social' },
                { label: 'ติดต่อทีมงาน BookLoop', path: '/books' },
              ].map((link) => (
                <Box component="li" key={link.label}>
                  <Typography
                    variant="body2"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.path.startsWith('/#')) {
                        const id = link.path.substring(2);
                        const el = document.getElementById(id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }
                      }
                      navigate(link.path);
                    }}
                    href={link.path}
                    sx={{
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease',
                      '&:hover': { color: '#38BDF8' },
                      '&:focus-visible': {
                        outline: '2px solid #38BDF8',
                        outlineOffset: '2px',
                        borderRadius: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '0.8125rem',
            color: '#94A3B8',
          }}
        >
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} BookLoop. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
            Designed for book lovers • มุ่งสร้างสังคมการอ่านที่ยั่งยืน
          </Typography>
        </Box>
      </AppContainer>
    </Box>
  );
};
