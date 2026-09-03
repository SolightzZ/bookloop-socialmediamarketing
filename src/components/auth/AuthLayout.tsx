import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, Link } from '@mui/material';
import { AutoStories as BookIcon } from '@mui/icons-material';
import { LoginBackground } from './LoginBackground';

const logoImg = '/images/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#F7F9FC',
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        overflow: 'hidden',
      }}
    >
      {/* 1. Background Layer (z-index: 0, pointer-events: none) */}
      <LoginBackground />

      {/* 2. Content Container (z-index: 10) */}
      <Container
        maxWidth="xs"
        sx={{
          position: 'relative',
          zIndex: 10,
          maxWidth: { xs: '100%', sm: 460 },
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo Header (z-index: 10) */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            mb: 3,
            gap: 1.25,
            transition: 'transform 0.15s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          role="button"
          aria-label="กลับสู่หน้าหลัก BookLoop"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/');
            }
          }}
        >
          <Box
            component="img"
            src={logoImg}
            alt="BookLoop Logo"
            referrerPolicy="no-referrer"
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              objectFit: 'contain',
            }}
          />
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#0F2D4A',
                lineHeight: 1.1,
              }}
            >
              BookLoop
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#627D98',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              แพลตฟอร์มส่งต่อหนังสือมือสอง
            </Typography>
          </Box>
        </Box>

        {/* Main Login Card (z-index: 20, stable, no animation) */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            zIndex: 20,
            width: '100%',
            p: { xs: 3, sm: 4 },
            borderRadius: { xs: 3, sm: '24px' },
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(15, 45, 74, 0.05)',
          }}
        >
          {/* Card Title & Subtitle */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#0F2D4A',
                mb: 0.75,
                fontSize: { xs: '1.35rem', sm: '1.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#627D98',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Form Content (Interactive controls: z-index: 30) */}
          <Box sx={{ position: 'relative', zIndex: 30 }}>
            {children}
          </Box>

          {/* Footer Text / Alternate Auth Link */}
          {footerText && (
            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: '1px solid #F1F5F9',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#627D98',
              }}
            >
              {footerText}
            </Box>
          )}
        </Paper>

        {/* Community Trust Badge */}
        <Box
          sx={{
            mt: 3.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#627D98',
          }}
        >
          <BookIcon sx={{ fontSize: 16, color: '#1976D2' }} />
          <Typography variant="caption" sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
            หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป
          </Typography>
        </Box>

        {/* Legal links */}
        <Box sx={{ mt: 1.5, display: 'flex', gap: 2 }}>
          <Link
            component={RouterLink}
            to="/about"
            variant="caption"
            sx={{
              color: '#94A3B8',
              textDecoration: 'none',
              '&:hover': { color: '#1976D2', textDecoration: 'underline' },
            }}
          >
            เกี่ยวกับเรา
          </Link>
          <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
            •
          </Typography>
          <Link
            component={RouterLink}
            to="/campaign/read-share-repeat"
            variant="caption"
            sx={{
              color: '#94A3B8',
              textDecoration: 'none',
              '&:hover': { color: '#1976D2', textDecoration: 'underline' },
            }}
          >
            แคมเปญ Read-Share-Repeat
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
