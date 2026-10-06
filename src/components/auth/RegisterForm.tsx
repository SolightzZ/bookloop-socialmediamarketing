import { Mail as EmailIcon, Person as PersonIcon, HowToReg as RegisterIcon } from '@mui/icons-material';
import { Alert, Box, Checkbox, FormControlLabel, FormHelperText, InputAdornment, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';
import { logWarn } from '../../utils/logger';
import { getEmailError, getPasswordError, getPasswordMatchError } from '../../utils/validation';
import { SubmitButton } from '../common/SubmitButton';
import { PasswordInput } from './PasswordInput';

interface RegisterFormProps {
   onSuccessRedirect?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = () => {
   const navigate = useNavigate();
   const { register } = useAuth();

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

   const validate = () => {
      const newErrors: typeof errors = {};

      if (!name.trim()) {
         newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
      } else if (name.trim().length < 2) {
         newErrors.name = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
      }

      const emailErr = getEmailError(email);
      if (emailErr) newErrors.email = emailErr;

      const passwordErr = getPasswordError(password);
      if (passwordErr) newErrors.password = passwordErr;

      const confirmErr = getPasswordMatchError(password, confirmPassword);
      if (confirmErr) newErrors.confirmPassword = confirmErr;

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
         // ผู้สมัครใหม่ → หน้าแรก แล้ว onboarding modal จะเด้งซ้อนให้เลือกความสนใจทันที
         navigate('/', { replace: true });
      } catch (err: any) {
         logWarn('RegisterForm: register failed', err);
         setErrors({
            general: err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง',
         });
      } finally {
         setIsLoading(false);
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
               }}>
               {errors.general}
            </Alert>
         )}

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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
                     disabled={isLoading}
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
         <SubmitButton isLoading={isLoading} loadingLabel="กำลังสร้างบัญชี..." color="primary" startIcon={<RegisterIcon />}>
            สมัครสมาชิก
         </SubmitButton>
      </Box>
   );
};
