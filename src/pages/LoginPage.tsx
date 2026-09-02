import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
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
      title="เข้าสู่ระบบ BookLoop"
      subtitle="ยินดีต้อนรับกลับสู่อาณาจักรหนังสือและการแบ่งปัน"
      footerText={
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          ยังไม่มีบัญชี BookLoop?{' '}
          <Link
            component={RouterLink}
            to={`/register${location.search}`}
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            สมัครสมาชิกใหม่
          </Link>
        </Typography>
      }
    >
      <LoginForm onSuccessRedirect={redirectPath} />
    </AuthLayout>
  );
}
