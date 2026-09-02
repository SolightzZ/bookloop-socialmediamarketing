import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, Link, Chip } from '@mui/material';
import { AutoStories as BookIcon } from '@mui/icons-material';

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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F7F9FB',
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          maxWidth: { xs: '100%', sm: 460 },
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo Header */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            mb: 3.5,
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
              width: 40,
              height: 40,
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
                color: 'primary.main',
                lineHeight: 1.1,
              }}
            >
              BookLoop
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              แพลตฟอร์มส่งต่อหนังสือมือสอง
            </Typography>
          </Box>
        </Box>

        {/* Main Card */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            boxShadow: '0 4px 20px -2px rgba(15, 41, 66, 0.05)',
          }}
        >
          {/* Card Title & Subtitle */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                mb: 0.75,
                fontSize: { xs: '1.35rem', sm: '1.5rem' },
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Form Content */}
          {children}

          {/* Footer Text / Alternate Auth Link */}
          {footerText && (
            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: '1px solid #F1F5F9',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'text.secondary',
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
            color: 'text.secondary',
          }}
        >
          <BookIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
          <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
            หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป
          </Typography>
        </Box>

        {/* Legal links */}
        <Box sx={{ mt: 1.5, display: 'flex', gap: 2 }}>
          <Link
            component={RouterLink}
            to="/about"
            variant="caption"
            sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
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
            sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            แคมเปญ Read-Share-Repeat
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
