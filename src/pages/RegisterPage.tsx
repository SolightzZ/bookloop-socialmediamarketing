import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  return (
    <AuthLayout
      title="สร้างบัญชี BookLoop"
      subtitle="ร่วมเป็นส่วนหนึ่งของสังคมส่งต่อหนังสือสภาพดี"
      footerText={
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          มีบัญชี BookLoop อยู่แล้ว?{' '}
          <Link
            component={RouterLink}
            to={`/login${location.search}`}
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            เข้าสู่ระบบที่นี่
          </Link>
        </Typography>
      }
    >
      <RegisterForm onSuccessRedirect={redirectPath} />
    </AuthLayout>
  );
}
