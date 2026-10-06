import { LockReset as ResetIcon } from '@mui/icons-material';
import { Alert, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess } from '../../utils/alerts';
import { logWarn } from '../../utils/logger';
import { getPasswordError, getPasswordMatchError } from '../../utils/validation';
import { SubmitButton } from '../common/SubmitButton';
import { SuccessPanel } from '../common/SuccessPanel';
import { PasswordInput } from './PasswordInput';

export const ResetPasswordForm: React.FC = () => {
   const location = useLocation();
   const { resetPassword } = useAuth();

   const queryParams = new URLSearchParams(location.search);
   const token = queryParams.get('token') ?? '';
   const hasToken = token.trim() !== '';

   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
   const [isLoading, setIsLoading] = useState(false);
   const [isDone, setIsDone] = useState(false);

   const validate = () => {
      const newErrors: typeof errors = {};

      const passwordErr = getPasswordError(password);
      if (passwordErr) newErrors.password = passwordErr;

      const confirmErr = getPasswordMatchError(password, confirmPassword);
      if (confirmErr) newErrors.confirmPassword = confirmErr;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!hasToken) {
         setErrors({ general: 'ลิงก์ตั้งรหัสผ่านใหม่ไม่ถูกต้อง กรุณาขอรีเซ็ตรหัสผ่านใหม่อีกครั้ง' });
         return;
      }
      setErrors({});

      if (!validate()) return;

      setIsLoading(true);
      try {
         await resetPassword(token, password);
         setIsDone(true);
         showSuccess('ตั้งรหัสผ่านใหม่สำเร็จ', 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที');
      } catch (err: any) {
         logWarn('ResetPasswordForm: resetPassword failed', err);
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
            <SuccessPanel
               title="ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว"
               message="รหัสผ่านของคุณได้รับการอัปเดตอย่างปลอดภัยแล้ว สามารถเข้าสู่ระบบเพื่อใช้งานต่อได้ทันที"
               primaryAction={{
                  label: 'เข้าสู่ระบบทันที',
                  to: '/login',
                  variant: 'contained',
               }}
            />
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
         {!hasToken && !errors.general && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.875rem' }}>
               ลิงก์ตั้งรหัสผ่านใหม่ไม่ถูกต้อง กรุณาขอรีเซ็ตรหัสผ่านใหม่อีกครั้ง
            </Alert>
         )}

         <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.5 }}>
            กรุณากรอกรหัสผ่านใหม่ที่ปลอดภัย (อย่างน้อย 8 ตัวอักษร)
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

         <SubmitButton isLoading={isLoading} loadingLabel="กำลังบันทึก..." color="primary" sx={{ mt: 1 }} startIcon={<ResetIcon />}>
            บันทึกรหัสผ่านใหม่
         </SubmitButton>
      </Box>
   );
};
