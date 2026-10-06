import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

export const Footer: React.FC = () => {
   const navigate = useNavigate();

   const links = [
      { label: 'เกี่ยวกับเรา', path: '/#about' },
      { label: 'ช่วยเหลือ', path: '/#faq' },
      { label: 'นโยบายความเป็นส่วนตัว', path: '/#privacy' },
      { label: 'ติดต่อเรา', path: '/#contact' },
   ];

   const handleLink = (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      if (path.startsWith('/#')) {
         const id = path.substring(2);
         const el = document.getElementById(id);
         if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
         }
      }
      navigate(path);
   };

   return (
      <Box
         component="footer"
         sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#F8FBFF',
            backgroundImage: 'radial-gradient(720px 220px at 10% 0%, rgba(15,108,240,0.08), transparent 70%), radial-gradient(rgba(16,42,67,0.08) 1px, transparent 1.2px)',
            backgroundSize: 'auto, 22px 22px',
            color: '#0A1628',
            borderTop: '1px solid #E2E8F0',
            mt: 'auto',
            '::selection': {
               backgroundColor: '#0F6CF0',
               color: '#FFFFFF',
            },
         }}>
         <Container maxWidth="lg" sx={{ maxWidth: '1240px !important', px: { xs: 2, sm: 3 }, position: 'relative' }}>
            {/* Main row */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: { xs: 3, md: 4 },
                  pt: { xs: 4, sm: 5 },
                  pb: { xs: 1.5, sm: 2 },
               }}>
               {/* Brand */}
               <Box sx={{ maxWidth: 360 }}>
                  <Box
                     role="button"
                     tabIndex={0}
                     aria-label="BookLoop - กลับไปหน้าแรก"
                     onClick={() => navigate('/')}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                           e.preventDefault();
                           navigate('/');
                        }
                     }}
                     sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1.25,
                        cursor: 'pointer',
                        borderRadius: 2,
                        p: 0.5,
                        ml: -0.5,
                        '&:focus-visible': {
                           outline: '2px solid #0F6CF0',
                           outlineOffset: '3px',
                        },
                     }}>
                     <Box
                        component="img"
                        src={`${import.meta.env.BASE_URL}images/logo.webp`}
                        alt=""
                        aria-hidden="true"
                        sx={{
                           width: 36,
                           height: 36,
                           borderRadius: '10px',
                           objectFit: 'contain',
                           boxShadow: '0 8px 20px -8px rgba(10,22,40,0.35)',
                        }}
                     />
                     <Typography variant="h6" component="span" sx={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
                        <Box component="span" sx={{ color: '#0A1628' }}>
                           Book
                        </Box>
                        <Box component="span" sx={{ color: '#0F6CF0' }}>
                           Loop
                        </Box>
                     </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, mt: 1.25 }}>
                     หนังสือทุกเล่ม มีเรื่องราวให้
                     <Box component="span" sx={{ color: '#0F6CF0', fontWeight: 700 }}>
                        คนถัดไป
                     </Box>
                  </Typography>

                  <Button
                     variant="contained"
                     size="medium"
                     disableElevation
                     endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                     onClick={() => navigate('/sell')}
                     sx={{
                        mt: 2.5,
                        borderRadius: '999px',
                        backgroundColor: '#0A1628',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        px: 3,
                        py: 1.15,
                        textTransform: 'none',
                        transition: 'transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease',
                        '&:hover': {
                           backgroundColor: '#16283F',
                           boxShadow: '0 12px 26px -10px rgba(10,22,40,0.5)',
                           transform: 'translateY(-1px)',
                        },
                        '&:focus-visible': {
                           outline: '2px solid #0F6CF0',
                           outlineOffset: '3px',
                        },
                     }}>
                     ส่งต่อหนังสือของคุณ
                  </Button>
               </Box>

               {/* Links */}
               <Box
                  component="nav"
                  aria-label="ลิงก์ท้ายหน้า"
                  sx={{
                     display: 'flex',
                     flexWrap: 'wrap',
                     columnGap: { xs: 2.5, sm: 3 },
                     rowGap: 1.25,
                     alignItems: 'center',
                  }}>
                  {links.map((link) => (
                     <Typography
                        key={link.label}
                        variant="body2"
                        component="a"
                        href={link.path}
                        onClick={(e) => handleLink(e, link.path)}
                        sx={{
                           color: '#334155',
                           textDecoration: 'none',
                           fontSize: '0.9rem',
                           fontWeight: 500,
                           cursor: 'pointer',
                           textUnderlineOffset: '4px',
                           textDecorationThickness: '1.5px',
                           transition: 'color 0.15s ease',
                           '&:hover': {
                              color: '#0F6CF0',
                              textDecoration: 'underline',
                           },
                           '&:focus-visible': {
                              outline: '2px solid #0F6CF0',
                              outlineOffset: '3px',
                              borderRadius: '4px',
                           },
                        }}>
                        {link.label}
                     </Typography>
                  ))}
               </Box>
            </Box>

            {/* Giant editorial wordmark, decorative crop */}
            <Typography
               aria-hidden="true"
               sx={{
                  fontWeight: 800,
                  fontSize: 'clamp(3.5rem, 12vw, 7rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.85,
                  color: 'rgba(10,22,40,0.055)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  userSelect: 'none',
                  mt: 1,
                  mb: '-0.12em',
               }}>
               BookLoop
            </Typography>

            {/* Bottom line */}
            <Box
               sx={{
                  py: 2.25,
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: 'center',
               }}>
               <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
                  © 2026 BookLoop. สงวนลิขสิทธิ์ทั้งหมด
               </Typography>
            </Box>
         </Container>
      </Box>
   );
};
