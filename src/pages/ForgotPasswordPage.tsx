import React from 'react';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="ลืมรหัสผ่าน"
      subtitle="ระบบจะช่วยคุณตั้งค่ารหัสผ่านใหม่อย่างปลอดภัย"
      footerText={
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          จำรหัสผ่านได้แล้ว?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            เข้าสู่ระบบ
          </Link>
        </Typography>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
