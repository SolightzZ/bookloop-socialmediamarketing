import React, { useState, useEffect } from 'react';
import { Box, Skeleton, Typography, SxProps, Theme } from '@mui/material';
import { MenuBook as BookIcon } from '@mui/icons-material';

interface SafeImageProps {
   src?: string | null;
   alt: string;
   aspectRatio?: string | number;
   objectFit?: 'cover' | 'contain';
   sx?: SxProps<Theme>;
   fallbackTitle?: string;
   loading?: 'lazy' | 'eager';
   fetchPriority?: 'high' | 'low' | 'auto';
   className?: string;
   borderRadius?: number | string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, aspectRatio, objectFit = 'cover', sx, fallbackTitle, loading = 'lazy', fetchPriority = 'auto', className, borderRadius }) => {
   const [hasError, setHasError] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      setHasError(false);
      setIsLoading(true);
   }, [src]);

   // Block javascript:/vbscript:/data:text/html ก่อนส่งให้ <img> กัน XSS ผ่าน scheme แปลกๆ
   // (data:image bitmap ยังใช้ได้ — SVG ถูกกันออกเพราะอาจฝังสคริปต์)
   const normalizedSrc = (src ?? '').trim();
   const isBlockedScheme = /^\s*(javascript|vbscript|file|blob|data:text\/html)/i.test(normalizedSrc);
   const isSvgDataUrl = normalizedSrc.toLowerCase().startsWith('data:image/svg');
   // If no source is provided at all, treat directly as fallback
   const isInvalidSrc = !src || src.trim() === '' || isBlockedScheme || isSvgDataUrl;

   if (hasError || isInvalidSrc) {
      return (
         <Box
            className={className}
            sx={{
               width: '100%',
               height: '100%',
               aspectRatio: aspectRatio || undefined,
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               bgcolor: '#F8FAFC',
               border: '1.5px solid #E2E8F0',
               borderRadius: borderRadius || 0,
               p: 1.5,
               textAlign: 'center',
               color: '#64748B',
               userSelect: 'none',
               boxSizing: 'border-box',
               ...sx,
            }}
            role="img"
            aria-label={alt || fallbackTitle || 'BookLoop ไม่มีภาพปก'}>
            <BookIcon sx={{ fontSize: 32, color: '#94A3B8', mb: 0.5 }} />
            <Typography
               variant="caption"
               sx={{
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  color: '#1E293B',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
               }}>
               BookLoop
            </Typography>
            <Typography
               variant="caption"
               sx={{
                  fontWeight: 500,
                  fontSize: '0.68rem',
                  color: '#64748B',
                  mt: 0.25,
               }}>
               ไม่มีภาพปก
            </Typography>
         </Box>
      );
   }

   return (
      <Box
         className={className}
         sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            aspectRatio: aspectRatio || undefined,
            overflow: 'hidden',
            borderRadius: borderRadius || 0,
            bgcolor: '#F8FAFC',
            ...sx,
         }}>
         {isLoading && (
            <Skeleton
               variant="rectangular"
               animation="wave"
               sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  bgcolor: '#E2E8F0',
               }}
            />
         )}
         <img
            src={src}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            onLoad={() => setIsLoading(false)}
            onError={() => {
               setIsLoading(false);
               setHasError(true);
            }}
            style={{
               width: '100%',
               height: '100%',
               objectFit: objectFit,
               display: 'block',
               opacity: isLoading ? 0 : 1,
               transform: isLoading ? 'scale(1.03)' : 'scale(1)',
               transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
            }}
         />
      </Box>
   );
};
