import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

interface AuthButtonProps {
  fullWidth?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  fullWidth = false,
  variant = 'outlined',
  size = 'medium',
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/login');
    }
  };

  return (
    <Button
      variant={variant}
      color="primary"
      size={size}
      fullWidth={fullWidth}
      onClick={handleClick}
      startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
      aria-label="เข้าสู่ระบบ BookLoop"
      sx={{
        borderRadius: 2,
        fontWeight: 700,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 0.6, sm: 0.8 },
        fontSize: { xs: '0.85rem', sm: '0.875rem' },
        whiteSpace: 'nowrap',
        borderColor: 'primary.main',
        color: variant === 'contained' ? '#FFFFFF' : 'primary.main',
        bgcolor: variant === 'contained' ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: variant === 'contained' ? 'primary.dark' : 'rgba(15, 41, 66, 0.06)',
          borderColor: 'primary.dark',
        },
      }}
    >
      เข้าสู่ระบบ
    </Button>
  );
};
