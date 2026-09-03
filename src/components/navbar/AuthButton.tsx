import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';

interface AuthButtonProps {
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  fullWidth = false,
  size = 'small',
  onClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const label = isLoginPage ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
  const loadingLabel = 'กำลังเข้าสู่ระบบ...';
  const ariaLabel = isLoginPage ? 'สมัครสมาชิก BookLoop' : 'เข้าสู่ระบบ BookLoop';
  const Icon = isLoginPage ? RegisterIcon : LoginIcon;

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    if (onClick) {
      onClick();
    } else {
      navigate(isLoginPage ? '/register' : '/login');
    }
  };

  return (
    <Button
      component="button"
      type="button"
      variant="contained"
      fullWidth={fullWidth}
      size={size}
      disableElevation
      disabled={loading}
      onClick={handleClick}
      aria-label={loading ? loadingLabel : ariaLabel}
      aria-busy={loading || undefined}
      tabIndex={0}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.625,
        height: 36,
        px: 1.75,
        py: 0,
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '0.8125rem',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        minWidth: 0,
        flexShrink: 0,
        textTransform: 'none',
        letterSpacing: 0,
        color: '#FFFFFF',
        bgcolor: '#1976D2',
        border: '1px solid #1565C0',
        boxShadow: 'none',
        cursor: loading ? 'default' : 'pointer',
        '&:hover': {
          bgcolor: loading ? '#1976D2' : '#1565C0',
          border: '1px solid #0D47A1',
          boxShadow: loading ? 'none' : '0 2px 8px rgba(25, 118, 210, 0.3)',
          transform: loading ? 'none' : 'translateY(-1px)',
        },
        '&:active': {
          bgcolor: '#0D47A1',
          border: '1px solid #0D47A1',
          boxShadow: 'none',
          transform: 'translateY(0)',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
        '&.Mui-disabled': {
          bgcolor: '#1976D2',
          color: '#FFFFFF',
          border: '1px solid #1565C0',
          opacity: 0.8,
        },
        '& .MuiButton-startIcon': {
          m: 0,
          p: 0,
          display: 'inline-flex',
          alignItems: 'center',
          '& > *': { fontSize: '17px !important' },
        },
        transition: 'all 0.18s ease',
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={17} sx={{ color: '#FFFFFF', flexShrink: 0 }} />
          {loadingLabel}
        </>
      ) : (
        <>
          <Icon sx={{ fontSize: '17px !important' }} />
          {label}
        </>
      )}
    </Button>
  );
};
