import { Box, Button, Typography } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
   const { isAuthenticated } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const queryParams = new URLSearchParams(location.search);
   const redirectPath = queryParams.get('redirect') || '/';

   useEffect(() => {
      if (isAuthenticated) {
         navigate(redirectPath, { replace: true });
      }
   }, [isAuthenticated, navigate, redirectPath]);

   return (
      <AuthLayout
         title="เข้าสู่ระบบ"
         subtitle="ยินดีต้อนรับกลับสู่ BookLoop"
         hideBrandHeader
         layoutVariant="centered"
         footerText={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
               <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                  ยังไม่มีบัญชี BookLoop ใช่ไหม?
               </Typography>
               <Button
                  component={RouterLink}
                  to={`/register${location.search}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<UserPlus size={16} />}
                  sx={{
                     minHeight: 44,
                     py: 1.1,
                     borderRadius: '10px',
                     borderColor: '#E2E8F0',
                     color: '#0F2D4A',
                     fontWeight: 700,
                     fontSize: '0.875rem',
                     textTransform: 'none',
                     transition: 'all 0.18s ease',
                     '&:hover': {
                        borderColor: '#1976D2',
                        color: '#1976D2',
                        bgcolor: '#F8FBFF',
                        transform: 'translateY(-1px)',
                     },
                  }}>
                  สมัครสมาชิกใหม่ฟรี
               </Button>
            </Box>
         }>
         <LoginForm onSuccessRedirect={redirectPath} />
      </AuthLayout>
   );
}
