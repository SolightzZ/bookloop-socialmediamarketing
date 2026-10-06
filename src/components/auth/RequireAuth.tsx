import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { tokens } from '../../theme/tokens';

interface RequireAuthProps {
   children?: React.ReactNode;
}

/**
 * Route guard component (ใช้ร่วมกันทั้ง /checkout, /orders/* และ /account/* —
 * ProtectedRoute เป็น alias ของตัวนี้โดยตั้งใจ หลังตรวจสอบแล้วว่า logic เดียวกัน).
 * - /cart และ /sell เปิด public ไม่ได้กันด้วย guard นี้
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
            }}>
            <CircularProgress size={36} sx={{ color: tokens.colors.actionBlue }} />
            <Typography variant="body2" sx={{ color: tokens.colors.mutedText, fontWeight: 500 }}>
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
