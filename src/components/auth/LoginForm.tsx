import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Mail as EmailIcon, Login as LoginIcon, Lock as LockIcon } from '@mui/icons-material';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { AuthDivider } from './AuthDivider';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessRedirect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Extract redirect query parameter if available
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = onSuccessRedirect || queryParams.get('redirect') || '/';

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      trackEvent('user_login', { method: 'email', userId: user.id });
      showSuccess('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับกลับคุณ ${user.name}`);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setErrors({
        general: err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrors({});
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      trackEvent('user_login', { method: 'google', userId: user.id });
      showSuccess('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับคุณ ${user.name}`);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setErrors({
        general: err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
  };

  return (
    <Box component="form" onSubmit={handleLogin} noValidate>
      {/* General error banner */}
      {errors.general && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          {errors.general}
        </Alert>
      )}

      {/* Social Google Login Button */}
      <SocialLogin
        onGoogleClick={handleGoogleLogin}
        isLoading={isGoogleLoading}
        disabled={isLoading}
        text="เข้าสู่ระบบด้วย Google"
      />

      <AuthDivider label="หรือเข้าสู่ระบบด้วยอีเมล" />

      {/* Email Input */}
      <TextField
        fullWidth
        id="login-email"
        name="email"
        label="อีเมล"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={Boolean(errors.email)}
        helperText={errors.email}
        placeholder="example@domain.com"
        autoComplete="email"
        required
        disabled={isLoading || isGoogleLoading}
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
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.95rem' },
        }}
      />

      {/* Password Input */}
      <PasswordInput
        id="login-password"
        name="password"
        label="รหัสผ่าน"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={Boolean(errors.password)}
        helperText={errors.password}
        required
        disabled={isLoading || isGoogleLoading}
        autoComplete="current-password"
      />

      {/* Forgot Password Link */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mb: 2.5 }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{
            color: 'secondary.main',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ลืมรหัสผ่าน?
        </Link>
      </Box>

      {/* Submit Button */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading || isGoogleLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
        sx={{
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
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>

      {/* Demo helper shortcuts for fast testing */}
      <Box
        sx={{
          mt: 3,
          p: 1.75,
          bgcolor: '#F8FAFC',
          borderRadius: 2,
          border: '1px dashed #CBD5E1',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'text.secondary',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
          }}
        >
          ทดลองเข้าใช้งานทันที (Demo Accounts):
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip
            size="small"
            label="ผู้อ่าน: reader@bookloop.co"
            clickable
            onClick={() => handleQuickDemo('reader@bookloop.co', 'password123')}
            sx={{ fontSize: '0.75rem', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          />
          <Chip
            size="small"
            label="ผู้ขาย: seller@bookloop.co"
            clickable
            onClick={() => handleQuickDemo('seller@bookloop.co', 'password123')}
            sx={{ fontSize: '0.75rem', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          />
        </Box>
      </Box>
    </Box>
  );
};
