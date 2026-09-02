import React from 'react';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="ตั้งรหัสผ่านใหม่"
      subtitle="กำหนดรหัสผ่านใหม่สำหรับเข้าสู่ระบบ BookLoop"
      footerText={
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          กลับไปยังหน้า{' '}
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
      <ResetPasswordForm />
    </AuthLayout>
  );
}
