import { Box, Container, Paper, Typography } from '@mui/material';
import { Lock } from 'lucide-react';
import React from 'react';
import { LoginBackground } from './LoginBackground';

export interface AuthLayoutProps {
   children: React.ReactNode;
   title: string;
   subtitle?: string;
   footerText?: React.ReactNode;
   hideBrandHeader?: boolean;
   editorialContent?: React.ReactNode;
   layoutVariant?: 'split' | 'centered';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, footerText, hideBrandHeader = true, editorialContent, layoutVariant = 'centered' }) => {
   const isSplit = layoutVariant === 'split' && Boolean(editorialContent);

   return (
      <Box
         sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#F8FBFF',
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3 },
            overflow: 'hidden',
         }}>
         {/* 1. Atmospheric Ambient Layer (z-index: 0, non-blocking) */}
         <LoginBackground />

         {/* 2. Responsive Content Container */}
         <Container
            maxWidth={isSplit ? 'lg' : 'xs'}
            sx={{
               position: 'relative',
               zIndex: 10,
               maxWidth: isSplit ? { xs: '100%', sm: 520, md: 1000 } : { xs: '100%', sm: 440, md: 460 },
               mx: 'auto',
               width: '100%',
            }}>
            <Box
               sx={{
                  display: isSplit ? 'grid' : 'flex',
                  gridTemplateColumns: isSplit ? { xs: '1fr', md: '1.1fr 0.9fr' } : undefined,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: 3, md: 5 },
                  width: '100%',
               }}>
               {/* Editorial Column (Only if explicitly passed in split mode) */}
               {isSplit && editorialContent && <Box sx={{ display: { xs: 'none', md: 'block' } }}>{editorialContent}</Box>}

               {/* Clean Focused Auth Card */}
               <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 440, md: 460 }, mx: 'auto' }}>
                  <Paper
                     elevation={0}
                     sx={{
                        position: 'relative',
                        zIndex: 20,
                        width: '100%',
                        p: { xs: 3, sm: 4, md: 4.5 },
                        borderRadius: { xs: '16px', sm: '20px' },
                        border: '1px solid #E5EAF0',
                        bgcolor: '#FFFFFF',
                        boxShadow: '0 8px 30px rgba(15, 47, 82, 0.06)',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                     }}>
                     {/* Card Title & Subtitle */}
                     <Box sx={{ mb: 3 }}>
                        <Typography
                           variant="h2"
                           component="h1"
                           sx={{
                              fontWeight: 800,
                              color: '#0F2D4A',
                              mb: 0.75,
                              fontSize: { xs: '1.4rem', sm: '1.6rem' },
                              letterSpacing: '-0.02em',
                           }}>
                           {title}
                        </Typography>
                        {subtitle && (
                           <Typography
                              variant="body2"
                              sx={{
                                 color: '#64748B',
                                 fontSize: '0.875rem',
                                 lineHeight: 1.5,
                              }}>
                              {subtitle}
                           </Typography>
                        )}
                     </Box>

                     {/* Form Content */}
                     <Box sx={{ position: 'relative', zIndex: 30 }}>{children}</Box>

                     {/* Footer Text / Alternate Action */}
                     {footerText && (
                        <Box
                           sx={{
                              mt: 3,
                              pt: 2.5,
                              borderTop: '1px solid #F1F5F9',
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              color: '#64748B',
                           }}>
                           {footerText}
                        </Box>
                     )}
                  </Paper>

                  {/* Subtle Security Guarantee */}
                  <Box
                     sx={{
                        mt: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        color: '#94A3B8',
                        fontSize: '0.78rem',
                     }}>
                     <Lock size={13} strokeWidth={2.2} />
                     <span>ข้อมูลส่วนบุคคลของคุณได้รับการปกป้องอย่างปลอดภัย</span>
                  </Box>
               </Box>
            </Box>
         </Container>
      </Box>
   );
};
