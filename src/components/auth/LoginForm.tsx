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
import { Mail as EmailIcon, Login as LoginIcon } from '@mui/icons-material';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { AuthDivider } from './AuthDivider';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';

import { useCart } from '../../hooks/useCart';
import { books } from '../../data/books';
import { getPendingAction, clearPendingAction, PendingAction } from '../../types/authGate';

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessRedirect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const { addToCart } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Extract redirect query parameter if available
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = onSuccessRedirect || queryParams.get('redirect') || '/';

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Resume pending action or navigate to return path
  const resumePendingActionOrNavigate = (authenticatedUser: any) => {
    const pendingAction =
      (location.state?.pendingAction as PendingAction | undefined) ||
      getPendingAction();

    clearPendingAction();

    if (pendingAction && pendingAction.bookId) {
      const targetBook = books.find((b) => b.id === pendingAction.bookId);
      if (targetBook) {
        addToCart(targetBook);
      }

      if (pendingAction.type === 'buy-now') {
        navigate('/checkout', { replace: true });
        return;
      }

      if (pendingAction.type === 'add-to-cart') {
        const returnUrl =
          location.state?.from ||
          queryParams.get('redirect') ||
          `/books/${pendingAction.bookId}`;
        navigate(returnUrl, { replace: true });
        return;
      }
    }

    const finalPath = location.state?.from || redirectPath;
    navigate(finalPath, { replace: true });
  };

  // Validation
  const emailTrimmed = email.trim();
  const isEmailEmpty = !emailTrimmed;
  const isEmailInvalid = !isEmailEmpty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
  const emailError = isEmailEmpty
    ? 'กรุณากรอกอีเมล'
    : isEmailInvalid
    ? 'รูปแบบอีเมลไม่ถูกต้อง'
    : undefined;

  const isPasswordEmpty = !password;
  const passwordError = isPasswordEmpty ? 'กรุณากรอกรหัสผ่าน' : undefined;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Mark all fields touched on submit
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      return;
    }

    // Prevent duplicate submission
    if (isLoading || isGoogleLoading) return;

    setIsLoading(true);
    try {
      const user = await login(emailTrimmed, password);
      trackEvent('user_login', { method: 'email', userId: user.id });
      showSuccess('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับกลับคุณ ${user.name}`);
      resumePendingActionOrNavigate(user);
    } catch (err: any) {
      setGeneralError(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGeneralError(null);
    if (isLoading || isGoogleLoading) return;

    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      trackEvent('user_login', { method: 'google', userId: user.id });
      showSuccess('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับคุณ ${user.name}`);
      resumePendingActionOrNavigate(user);
    } catch (err: any) {
      setGeneralError(err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTouched({ email: true, password: true });
    setGeneralError(null);
  };

  return (
    <Box component="form" onSubmit={handleLogin} noValidate>
      {/* General Error Banner */}
      {generalError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: '0.875rem',
            '& .MuiAlert-message': { width: '100%' },
          }}
          onClose={() => setGeneralError(null)}
        >
          {generalError}
        </Alert>
      )}

      {/* Social Google Login Button (spacing: 16px) */}
      <SocialLogin
        onGoogleClick={handleGoogleLogin}
        isLoading={isGoogleLoading}
        disabled={isLoading}
        text="เข้าสู่ระบบด้วย Google"
      />

      {/* Divider (spacing: 24px) */}
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
          if (generalError) setGeneralError(null);
        }}
        onBlur={() => markTouched('email')}
        error={Boolean(touched.email && emailError)}
        helperText={touched.email ? emailError : undefined}
        placeholder="example@domain.com"
        autoComplete="email"
        required
        disabled={isLoading || isGoogleLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ fontSize: 20, color: '#627D98' }} />
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
          if (generalError) setGeneralError(null);
        }}
        onBlur={() => markTouched('password')}
        error={Boolean(touched.password && passwordError)}
        helperText={touched.password ? passwordError : undefined}
        required
        disabled={isLoading || isGoogleLoading}
        autoComplete="current-password"
      />

      {/* Forgot Password Link (spacing: 8px to 16px) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mb: 3 }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{
            color: '#1976D2',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.85rem',
            '&:hover': { textDecoration: 'underline' },
            '&:focus-visible': {
              outline: '2px solid #1976D2',
              outlineOffset: '2px',
            },
          }}
        >
          ลืมรหัสผ่าน?
        </Link>
      </Box>

      {/* Submit Button (spacing: 16px) */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading || isGoogleLoading}
        startIcon={
          isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <LoginIcon sx={{ fontSize: 20 }} />
          )
        }
        sx={{
          py: 1.35,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '0.975rem',
          bgcolor: '#0F2D4A',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(15, 45, 74, 0.2)',
          '&:hover': {
            bgcolor: '#1976D2',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: '2px solid #1976D2',
            outlineOffset: '2px',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>

      {/* Demo Accounts (Visually Secondary, spacing: 24px) */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: '#F8FAFC',
          borderRadius: 2.5,
          border: '1px solid #E2E8F0',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#627D98',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
            fontSize: '0.78rem',
          }}
        >
          ทดลองเข้าใช้งานทันที (Demo Accounts)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip
            size="small"
            label="ผู้อ่าน: reader@bookloop.co"
            clickable
            onClick={() => handleQuickDemo('reader@bookloop.co', 'password123')}
            sx={{
              fontSize: '0.75rem',
              bgcolor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#0F2D4A',
              fontWeight: 500,
              '&:hover': { bgcolor: '#F1F5F9', borderColor: '#1976D2' },
            }}
          />
          <Chip
            size="small"
            label="ผู้ขาย: seller@bookloop.co"
            clickable
            onClick={() => handleQuickDemo('seller@bookloop.co', 'password123')}
            sx={{
              fontSize: '0.75rem',
              bgcolor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#0F2D4A',
              fontWeight: 500,
              '&:hover': { bgcolor: '#F1F5F9', borderColor: '#1976D2' },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
