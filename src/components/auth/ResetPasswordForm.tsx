import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircleOutlined as SuccessIcon, LockReset as ResetIcon } from '@mui/icons-material';
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || 'demo';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่านใหม่';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านยืนยันไม่ตรงกัน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setIsDone(true);
      showSuccess('ตั้งรหัสผ่านใหม่สำเร็จ', 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที');
    } catch (err: any) {
      setErrors({
        general: err.message || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(46, 125, 91, 0.1)',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <SuccessIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          รหัสผ่านของคุณได้รับการอัปเดตอย่างปลอดภัยแล้ว สามารถเข้าสู่ระบบเพื่อใช้งานต่อได้ทันที
        </Typography>

        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: 2, py: 1.25, fontWeight: 700 }}
        >
          เข้าสู่ระบบทันที
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleReset} noValidate>
      {/* Hidden username input for password manager accessibility compliance */}
      <input
        type="text"
        name="username"
        autoComplete="username"
        value="user"
        readOnly
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      />
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.875rem' }}>
          {errors.general}
        </Alert>
      )}

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.5 }}>
        กรุณากรอกรหัสผ่านใหม่ที่ปลอดภัย (อย่างน้อย 6 ตัวอักษร)
      </Typography>

      <PasswordInput
        id="reset-new-password"
        name="password"
        label="รหัสผ่านใหม่"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={Boolean(errors.password)}
        helperText={errors.password}
        required
        disabled={isLoading}
        showStrengthMeter={true}
        autoComplete="new-password"
      />

      <PasswordInput
        id="reset-confirm-password"
        name="confirmPassword"
        label="ยืนยันรหัสผ่านใหม่"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ResetIcon />}
        sx={{
          mt: 1,
          py: 1.25,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '0.95rem',
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
      </Button>
    </Box>
  );
};
