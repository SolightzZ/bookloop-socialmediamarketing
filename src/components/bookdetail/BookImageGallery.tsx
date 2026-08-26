import React from 'react';
import { Box, Paper } from '@mui/material';

interface BookImageGalleryProps {
  title: string;
  images: string[];
  selectedImg: string;
  onSelectImage: (img: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

export const BookImageGallery: React.FC<BookImageGalleryProps> = ({
  title,
  images,
  selectedImg,
  onSelectImage,
}) => {
  return (
    <Box sx={{ position: { md: 'sticky' }, top: 90 }}>
      {/* Main Image Preview */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #D9E2EC',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 2,
          bgcolor: '#FFFFFF',
        }}
      >
        <Box
          component="img"
          src={selectedImg || FALLBACK_IMAGE}
          alt={title}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          sx={{
            width: '100%',
            aspectRatio: '3/4',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Paper>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1.5, overflow: 'auto', pb: 1 }}>
          {images.map((img, i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                border: '2px solid',
                borderColor: selectedImg === img ? 'primary.main' : '#D9E2EC',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                width: 72,
                height: 96,
                flexShrink: 0,
                transition: 'all 0.2s',
                '&:hover': { opacity: 0.9 },
              }}
              onClick={() => onSelectImage(img)}
            >
              <Box
                component="img"
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
