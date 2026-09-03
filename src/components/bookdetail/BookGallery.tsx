import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { SafeImage } from '../common/SafeImage';

export interface BookGalleryProps {
  title: string;
  images: string[];
  selectedImg: string;
  onSelectImage: (img: string) => void;
}

/**
 * Reusable BookGallery component.
 * - Enforces stable 4/5 aspect ratio to prevent layout shift.
 * - Uses object-fit: contain centered on a soft neutral background to prevent aggressive cropping.
 * - Supports keyboard navigation (Tab, Enter, Space) and all visual states (default, selected, hover, focus, loading, error).
 */
export const BookGallery: React.FC<BookGalleryProps> = ({
  title,
  images = [],
  selectedImg,
  onSelectImage,
}) => {
  // Ensure images list contains at least the selected image
  const galleryImages = images && images.length > 0 ? images : [selectedImg].filter(Boolean);
  const currentImage = selectedImg || galleryImages[0] || '';

  return (
    <Box
      component="section"
      aria-label={`แกลเลอรีรูปภาพของ ${title}`}
      sx={{
        position: { md: 'sticky' },
        top: 96,
        width: '100%',
      }}
    >
      {/* Main Image Container: 4/5 Aspect Ratio, object-fit contain, soft neutral background */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          aspectRatio: '4 / 5',
          borderRadius: 3,
          border: '1px solid #D9E2EC',
          bgcolor: '#F7F9FC',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 2,
          position: 'relative',
          boxShadow: '0 2px 12px rgba(15, 45, 74, 0.04)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <SafeImage
            src={currentImage}
            alt={`ภาพหน้าปกหนังสือ ${title}`}
            fallbackTitle={title}
            objectFit="contain"
            loading="eager"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 10px 20px rgba(15, 45, 74, 0.12))',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          />
        </Box>
      </Paper>

      {/* Thumbnail List */}
      {galleryImages.length > 1 && (
        <Box
          role="region"
          aria-label="รูปภาพย่อย"
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
            pt: 0.5,
            px: 0.5,
            // Custom scrollbar
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#CBD5E1', borderRadius: 3 },
          }}
        >
          {galleryImages.map((img, index) => {
            const isSelected = currentImage === img;
            return (
              <Box
                key={`${img}-${index}`}
                role="button"
                tabIndex={0}
                aria-label={`ดูรูปภาพที่ ${index + 1} จากทั้งหมด ${galleryImages.length} รูป`}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => onSelectImage(img)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectImage(img);
                  }
                }}
                sx={{
                  width: { xs: 60, sm: 68 },
                  height: { xs: 75, sm: 85 },
                  aspectRatio: '4 / 5',
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: '#F7F9FC',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  p: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: isSelected ? '2px solid #1976D2' : '1px solid #D9E2EC',
                  boxShadow: isSelected ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : 'none',
                  transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: isSelected ? '#1976D2' : '#94A3B8',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #1976D2',
                    outlineOffset: '2px',
                  },
                }}
              >
                <SafeImage
                  src={img}
                  alt={`รูปย่อยที่ ${index + 1}`}
                  fallbackTitle={`${index + 1}`}
                  objectFit="contain"
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
