import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoStories as BookIcon, Home as HomeIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppContainer } from '../components/common/Container';

const NotFoundPage: React.FC = () => {
   const navigate = useNavigate();

   return (
      <Box
         sx={{
            py: { xs: 8, md: 14 },
            textAlign: 'center',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
         }}>
         <AppContainer maxWidth="sm">
            {/* Cute Illustration / Graphic */}
            <Box
               sx={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  bgcolor: '#EAF4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: '2px dashed #1976D2',
               }}>
               <BookIcon sx={{ fontSize: 54, color: '#1976D2' }} />
            </Box>

            <Typography
               variant="overline"
               sx={{
                  color: '#1976D2',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  display: 'block',
                  mb: 1,
               }}>
               404 ไม่พบหน้าที่ต้องการ
            </Typography>

            <Typography
               variant="h4"
               component="h1"
               sx={{
                  fontWeight: 800,
                  color: '#0F2D4A',
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
               }}>
               เรื่องราวในหน้านี้อาจถูกส่งต่อแล้ว
            </Typography>

            <Typography
               variant="body1"
               sx={{
                  color: '#627D98',
                  maxWidth: 440,
                  mx: 'auto',
                  mb: 4,
                  lineHeight: 1.6,
               }}>
               หน้าที่คุณค้นหาไม่มีอยู่หรืออาจถูกย้ายไปแล้ว คุณสามารถกลับไปหน้าแรก หรือค้นหาหนังสือเล่มโปรดในตลาด BookLoop ได้เลย
            </Typography>

            <Box
               sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: 320, sm: 'none' },
                  mx: 'auto',
               }}>
               <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                     bgcolor: '#1976D2',
                     borderRadius: 50,
                     px: 3.5,
                     py: 1.2,
                     minHeight: 46,
                     fontWeight: 700,
                     textTransform: 'none',
                     boxShadow: 'none',
                     width: { xs: '100%', sm: 'auto' },
                     '&:hover': {
                        bgcolor: '#0F2D4A',
                        boxShadow: 'none',
                     },
                     '&:focus-visible': {
                        outline: '2px solid #0F2D4A',
                        outlineOffset: '2px',
                     },
                  }}>
                  กลับสู่หน้าแรก
               </Button>

               <Button
                  variant="outlined"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/books')}
                  sx={{
                     borderColor: '#CBD5E1',
                     color: '#0F2D4A',
                     borderRadius: 50,
                     px: 3.5,
                     py: 1.2,
                     minHeight: 46,
                     fontWeight: 700,
                     textTransform: 'none',
                     bgcolor: '#FFFFFF',
                     width: { xs: '100%', sm: 'auto' },
                     '&:hover': {
                        borderColor: '#1976D2',
                        color: '#1976D2',
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                     },
                     '&:focus-visible': {
                        outline: '2px solid #1976D2',
                        outlineOffset: '2px',
                     },
                  }}>
                  ค้นหาหนังสือ
               </Button>
            </Box>
         </AppContainer>
      </Box>
   );
};
export default NotFoundPage;
