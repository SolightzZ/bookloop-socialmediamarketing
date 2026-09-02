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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Person as PersonIcon, Mail as EmailIcon, HowToReg as RegisterIcon } from '@mui/icons-material';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { AuthDivider } from './AuthDivider';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';

interface RegisterFormProps {
  onSuccessRedirect?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccessRedirect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = onSuccessRedirect || queryParams.get('redirect') || '/';

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    } else if (name.trim().length < 2) {
      newErrors.name = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
    }

    if (!email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านยืนยันไม่ตรงกัน';
    }

    if (!agreeTerms) {
      newErrors.terms = 'กรุณายอมรับเงื่อนไขการใช้บริการและนโยบายความเป็นส่วนตัว';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await register(name, email, password);
      trackEvent('user_register', { method: 'email', userId: user.id });
      showSuccess('สมัครสมาชิกสำเร็จ', `ยินดีต้อนรับคุณ ${user.name} สู่ครอบครัว BookLoop`);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setErrors({
        general: err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrors({});
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      trackEvent('user_register', { method: 'google', userId: user.id });
      showSuccess('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับคุณ ${user.name}`);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setErrors({
        general: err.message || 'ไม่สามารถสมัครผ่าน Google ได้',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} noValidate>
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

      {/* Google Signup Button */}
      <SocialLogin
        onGoogleClick={handleGoogleSignup}
        isLoading={isGoogleLoading}
        disabled={isLoading}
        text="สมัครสมาชิกด้วย Google"
      />

      <AuthDivider label="หรือกรอกข้อมูลสมัครสมาชิก" />

      {/* Full Name */}
      <TextField
        fullWidth
        id="register-name"
        name="name"
        label="ชื่อ-นามสกุล หรือ นามแฝงนักอ่าน"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={Boolean(errors.name)}
        helperText={errors.name}
        placeholder="เช่น ชานนท์ นักอ่าน"
        autoComplete="name"
        required
        disabled={isLoading || isGoogleLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.95rem' },
        }}
      />

      {/* Email */}
      <TextField
        fullWidth
        id="register-email"
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

      {/* Password with Strength Meter */}
      <PasswordInput
        id="register-password"
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
        autoComplete="new-password"
        showStrengthMeter={true}
      />

      {/* Confirm Password */}
      <PasswordInput
        id="register-confirm-password"
        name="confirmPassword"
        label="ยืนยันรหัสผ่าน"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
        required
        disabled={isLoading || isGoogleLoading}
        autoComplete="new-password"
      />

      {/* Terms & Conditions Checkbox */}
      <Box sx={{ mb: 2.5, mt: 0.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              id="agree-terms-checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              color="primary"
              disabled={isLoading || isGoogleLoading}
              size="small"
              sx={{ pt: 0.25 }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: '0.825rem', color: 'text.primary', lineHeight: 1.4 }}>
              ฉันยอมรับ{' '}
              <Link component={RouterLink} to="/about" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                เงื่อนไขการใช้บริการ
              </Link>{' '}
              และ{' '}
              <Link component={RouterLink} to="/about" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                นโยบายความเป็นส่วนตัว
              </Link>{' '}
              ของ BookLoop
            </Typography>
          }
          sx={{ alignItems: 'flex-start', m: 0 }}
        />
        {errors.terms && (
          <FormHelperText error sx={{ mx: 1.5, mt: 0.5, fontSize: '0.78rem' }}>
            {errors.terms}
          </FormHelperText>
        )}
      </Box>

      {/* Submit Register Button */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading || isGoogleLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RegisterIcon />}
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
        {isLoading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
      </Button>
    </Box>
  );
};
