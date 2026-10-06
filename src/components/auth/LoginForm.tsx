import { Alert, Box, Checkbox, FormControlLabel, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Mail as EmailIcon, LogIn as LoginIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';
import { logWarn } from '../../utils/logger';
import { getEmailError, getLoginPasswordError } from '../../utils/validation';
import { SubmitButton } from '../common/SubmitButton';
import { PasswordInput } from './PasswordInput';

import { books } from '../../data/books';
import { useCart } from '../../hooks/useCart';
import { clearPendingAction, getPendingAction, PendingAction } from '../../types/authGate';
import { getSafeRedirectPath } from '../../utils/redirect';

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
   const [rememberMe, setRememberMe] = useState(true);
   const [touched, setTouched] = useState<Record<string, boolean>>({});
   const [generalError, setGeneralError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   // Extract redirect query parameter if available (sanitized: in-app path only)
   const queryParams = new URLSearchParams(location.search);
   const redirectPath = getSafeRedirectPath(onSuccessRedirect || queryParams.get('redirect'), '/');

   const markTouched = (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
   };

   // Resume pending action or navigate to return path
   const resumePendingActionOrNavigate = (authenticatedUser: any) => {
      const pendingAction = (location.state?.pendingAction as PendingAction | undefined) || getPendingAction();

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
            const returnUrl = getSafeRedirectPath(location.state?.from || queryParams.get('redirect') || `/books/${pendingAction.bookId}`);
            navigate(returnUrl, { replace: true });
            return;
         }
      }

      const finalPath = getSafeRedirectPath(location.state?.from || redirectPath);
      navigate(finalPath, { replace: true });
   };

   // Validation
   const emailTrimmed = email.trim();
   const emailError = getEmailError(emailTrimmed);
   const passwordError = getLoginPasswordError(password);

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
         logWarn('LoginForm: login failed', err);
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
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  bgcolor: '#FEE2E2',
                  color: '#991B1B',
                  border: '1px solid #FECACA',
                  '& .MuiAlert-message': { width: '100%', fontWeight: 500 },
               }}
               onClose={() => setGeneralError(null)}>
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
                        <EmailIcon size={18} color="#64748B" />
                     </InputAdornment>
                  ),
               },
            }}
            sx={{
               mb: 2.25,
               '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  bgcolor: '#FFFFFF',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                  '& fieldset': {
                     borderColor: '#E2E8F0',
                  },
                  '&:hover fieldset': {
                     borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                     borderColor: '#1976D2',
                     borderWidth: '1.5px',
                  },
                  '&.Mui-focused': {
                     boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
                  },
               },
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

         {/* Controls Row: Remember Me & Forgot Password */}
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               mt: 0.5,
               mb: 3,
            }}>
            <FormControlLabel
               control={
                  <Checkbox
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                     size="small"
                     sx={{
                        color: '#CBD5E1',
                        '&.Mui-checked': { color: '#1976D2' },
                        p: 0.5,
                        mr: 0.5,
                     }}
                  />
               }
               label={<Typography sx={{ fontSize: '0.84rem', color: '#64748B', userSelect: 'none' }}>จดจำฉันไว้ในระบบ</Typography>}
            />

            <Link
               component={RouterLink}
               to="/forgot-password"
               sx={{
                  color: '#1976D2',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  '&:hover': { textDecoration: 'underline' },
                  '&:focus-visible': {
                     outline: '2px solid rgba(25, 118, 210, 0.4)',
                     outlineOffset: '2px',
                     borderRadius: '4px',
                  },
               }}>
               ลืมรหัสผ่าน?
            </Link>
         </Box>

         {/* Submit Button */}
         <SubmitButton
            isLoading={isLoading}
            loadingLabel="กำลังเข้าสู่ระบบ..."
            startIcon={<LoginIcon size={18} />}
            sx={{
               py: 1.4,
               fontSize: '0.975rem',
               fontWeight: 700,
               borderRadius: '10px',
               bgcolor: '#1976D2',
               color: '#FFFFFF',
               boxShadow: 'none',
               transition: 'all 0.18s ease',
               '&:hover': {
                  bgcolor: '#0F2D4A',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
               },
               '&:active': {
                  transform: 'translateY(0)',
               },
            }}>
            เข้าสู่ระบบ
         </SubmitButton>
      </Box>
   );
};
