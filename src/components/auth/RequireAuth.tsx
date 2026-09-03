import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface RequireAuthProps {
  children?: React.ReactNode;
}

/**
 * Route guard component.
 * Protects private commerce routes (/cart, /checkout, /order, /orders, /account).
 * - Displays a graceful loading state during session restoration to prevent authentication flicker.
 * - Redirects unauthenticated visitors to /login preserving the intended target URL and state.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={36} sx={{ color: '#1976D2' }} />
        <Typography variant="body2" sx={{ color: '#627D98', fontWeight: 500 }}>
          กำลังตรวจสอบสิทธิ์การใช้งาน...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    const fullPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(fullPath)}`}
        state={{
          from: fullPath,
          ...(location.state || {}),
        }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;
