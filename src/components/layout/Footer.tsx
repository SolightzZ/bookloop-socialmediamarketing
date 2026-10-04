import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, IconButton } from '@mui/material';
import { ApiStatusBadge } from '../common/ApiStatusBadge';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'เกี่ยวกับเรา', path: '/#about' },
    { label: 'ช่วยเหลือ', path: '/#faq' },
    { label: 'นโยบายความเป็นส่วนตัว', path: '/#privacy' },
    { label: 'ติดต่อเรา', path: '/#contact' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0B192C',
        color: '#E2E8F0',
        pt: { xs: 4, sm: 5 },
        pb: { xs: 4, sm: 4 },
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: '1240px !important', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2.5,
            mb: 3,
          }}
        >
          {/* Brand & Slogan */}
          <Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                mb: 0.5,
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt=""
                aria-hidden="true"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                }}
              >
                <Box component="span" sx={{ color: '#FFFFFF' }}>Book</Box>
                <Box component="span" sx={{ color: '#38BDF8' }}>Loop</Box>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: '#94A3B8',
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}
            >
              หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป
            </Typography>
          </Box>

          {/* Links */}
          <Box
            component="nav"
            aria-label="ลิงก์ท้ายหน้า"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
            }}
          >
            {links.map((link) => (
              <Typography
                key={link.label}
                variant="body2"
                component="a"
                href={link.path}
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
                sx={{
                  color: '#CBD5E1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: '#38BDF8',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Bottom Line */}
        <Box
          sx={{
            pt: 2.5,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#64748B',
              fontSize: '0.78rem',
            }}
          >
            © 2026 BookLoop. สงวนลิขสิทธิ์ทั้งหมด
          </Typography>

          <ApiStatusBadge />
        </Box>
      </Container>
    </Box>
  );
};
