import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Mail as EmailIcon,
  ArrowBack as BackIcon,
  Send as SendIcon,
  BoltRounded as BoltIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getEmailError } from '../../utils/validation';
import { SubmitButton } from '../common/SubmitButton';
import { SuccessPanel } from '../common/SuccessPanel';

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = getEmailError(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setSuccessInfo(res);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งคำขอรีเซ็ตรหัสผ่าน');
    } finally {
      setIsLoading(false);
    }
  };

  if (successInfo) {
    return (
      <SuccessPanel
        title="ส่งคำขอเรียบร้อยแล้ว"
        message={successInfo.message}
        primaryAction={{
          label: 'กลับไปหน้าเข้าสู่ระบบ',
          to: '/login',
          variant: 'outlined',
        }}
      >
        {/* Demo shortcut helper for testing within browser */}
        {successInfo.resetToken && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              textAlign: 'left',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <BoltIcon sx={{ fontSize: 16 }} />
              <span>ทางลัดสำหรับการทดสอบระบบ (Demo Simulation):</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#15803D', display: 'block', mb: 1.5 }}>
              เนื่องจากเป็นโหมดตัวอย่าง คุณสามารถกดปุ่มด้านล่างเพื่อไปยังหน้าตั้งรหัสผ่านใหม่ได้ทันที
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="success"
              fullWidth
              onClick={() => navigate(`/reset-password?token=${successInfo.resetToken}`)}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            >
              ไปยังหน้าตั้งรหัสผ่านใหม่
            </Button>
          </Paper>
        )}
      </SuccessPanel>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.875rem' }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.6 }}>
        กรุณากรอกอีเมลที่ลงทะเบียนไว้กับ BookLoop เราจะส่งคำแนะนำในการตั้งรหัสผ่านใหม่ให้คุณ
      </Typography>

      <TextField
        fullWidth
        id="forgot-email"
        name="email"
        label="อีเมลของคุณ"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        error={Boolean(error)}
        placeholder="example@domain.com"
        autoComplete="email"
        required
        disabled={isLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.95rem' },
        }}
      />

      <SubmitButton
        isLoading={isLoading}
        loadingLabel="กำลังส่งข้อมูล..."
        color="primary"
        startIcon={<SendIcon />}
      >
        ส่งคำขอรีเซ็ตรหัสผ่าน
      </SubmitButton>

      <Box sx={{ mt: 2.5, textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            textDecoration: 'none',
            fontSize: '0.875rem',
            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
          }}
        >
          <BackIcon sx={{ fontSize: 16 }} /> กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </Box>
    </Box>
  );
};
