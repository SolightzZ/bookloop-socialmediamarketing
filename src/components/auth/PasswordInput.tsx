import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  showStrengthMeter?: boolean;
}

export function calculatePasswordStrength(pass: string): {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
} {
  if (!pass) return { score: 0, label: '', color: 'error' };

  let score = 0;
  if (pass.length >= 6) score += 25;
  if (pass.length >= 8) score += 15;
  if (/[A-Z]/.test(pass)) score += 20;
  if (/[0-9]/.test(pass)) score += 20;
  if (/[^A-Za-z0-9]/.test(pass)) score += 20;

  if (score < 40) return { score, label: 'ง่ายเกินไป (อย่างน้อย 6 ตัวอักษร)', color: 'error' };
  if (score < 70) return { score, label: 'ปานกลาง (ควรมีตัวเลขหรือตัวพิมพ์ใหญ่)', color: 'warning' };
  if (score < 90) return { score, label: 'ปลอดภัย', color: 'info' };
  return { score: 100, label: 'ปลอดภัยมาก', color: 'success' };
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  autoComplete = 'current-password',
  showStrengthMeter = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const strength = showStrengthMeter ? calculatePasswordStrength(value) : null;

  return (
    <FormControl fullWidth variant="outlined" error={error} disabled={disabled} sx={{ mb: showStrengthMeter && value ? 1.5 : 2 }}>
      <InputLabel htmlFor={id} required={required} sx={{ fontSize: '0.9rem' }}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? `ซ่อน${label}` : `แสดง${label}`}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          'aria-label': label,
          'aria-invalid': error,
        }}
        sx={{
          borderRadius: 2,
          fontSize: '0.95rem',
        }}
      />

      {showStrengthMeter && value.length > 0 && strength && (
        <Box sx={{ mt: 1, px: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              ระดับความปลอดภัย:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color:
                  strength.color === 'error'
                    ? 'error.main'
                    : strength.color === 'warning'
                    ? 'warning.main'
                    : strength.color === 'info'
                    ? 'info.main'
                    : 'success.main',
              }}
            >
              {strength.label}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={strength.score}
            color={strength.color}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.06)',
            }}
          />
        </Box>
      )}

      {helperText && (
        <FormHelperText id={`${id}-helper-text`} sx={{ mx: 0.5, fontSize: '0.78rem' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
