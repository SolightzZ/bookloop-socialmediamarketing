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

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  sx,
  fallbackTitle,
  loading = 'lazy',
  fetchPriority = 'auto',
  className,
  borderRadius,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  // If no source is provided at all, treat directly as fallback
  const isInvalidSrc = !src || src.trim() === '';

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
          bgcolor: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: borderRadius || 0,
          p: 2,
          textAlign: 'center',
          color: '#64748B',
          userSelect: 'none',
          boxSizing: 'border-box',
          ...sx,
        }}
        role="img"
        aria-label={alt || fallbackTitle || 'รูปภาพหนังสือ BookLoop'}
      >
        <BookIcon sx={{ fontSize: 36, color: '#94A3B8', mb: 1 }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: '#475569',
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {fallbackTitle || alt || 'BookLoop'}
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
      }}
    >
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
          transition: 'opacity 0.25s ease',
          opacity: isLoading ? 0 : 1,
        }}
      />
    </Box>
  );
};
