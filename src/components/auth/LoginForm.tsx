import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Link,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Mail as EmailIcon, Login as LoginIcon } from '@mui/icons-material';
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';
import { getEmailError, getPasswordError } from '../../utils/validation';
import { SubmitButton } from '../common/SubmitButton';

import { useCart } from '../../hooks/useCart';
import { books } from '../../data/books';
import { getPendingAction, clearPendingAction, PendingAction } from '../../types/authGate';

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessRedirect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToCart } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const emailError = getEmailError(emailTrimmed);
  const passwordError = getPasswordError(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Mark all fields touched on submit
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      return;
    }

    // Prevent duplicate submission
    if (isLoading) return;

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
        disabled={isLoading}
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
        disabled={isLoading}
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
      <SubmitButton
        isLoading={isLoading}
        loadingLabel="กำลังเข้าสู่ระบบ..."
        startIcon={<LoginIcon sx={{ fontSize: 20 }} />}
        sx={{
          py: 1.35,
          fontSize: '0.975rem',
          bgcolor: '#0F2D4A',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(15, 45, 74, 0.2)',
          '&:hover': {
            bgcolor: '#1976D2',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.25)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        เข้าสู่ระบบ
      </SubmitButton>
    </Box>
  );
};
