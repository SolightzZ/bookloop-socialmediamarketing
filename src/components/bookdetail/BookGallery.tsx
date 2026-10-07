import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

export interface BookGalleryProps {
  title: string;
  images: string[];
  selectedImg: string;
  onSelectImage: (img: string) => void;
}

/**
 * BookGallery — clean editorial image stage.
 * 3:4 aspect, object-fit contain, generous whitespace,
 * minimal border + very subtle shadow. Thumbnails with
 * clear blue selected outline. Keyboard accessible.
 */
export const BookGallery: React.FC<BookGalleryProps> = ({
  title,
  images = [],
  selectedImg,
  onSelectImage,
}) => {
  const galleryImages = images && images.length > 0 ? images : [selectedImg].filter(Boolean);
  const currentImage = selectedImg || galleryImages[0] || '';
  const currentIndex = Math.max(0, galleryImages.indexOf(currentImage));
  const hasMultiple = galleryImages.length > 1;

  const goTo = (dir: 1 | -1) => {
    const next = (currentIndex + dir + galleryImages.length) % galleryImages.length;
    onSelectImage(galleryImages[next]);
  };

  return (
    <Box
      component="section"
      aria-label={`แกลเลอรีรูปภาพของ ${title}`}
      sx={{
        position: { md: 'sticky' },
        top: 88,
        width: '100%',
      }}
    >
      {/* Main stage */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '10px',
          border: '1px solid #D9E2EC',
          bgcolor: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(15,53,87,0.06)',
          overflow: 'hidden',
          p: { xs: 3, sm: 4, md: 4.5 },
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SafeImage
            src={currentImage}
            alt={`ภาพหน้าปกหนังสือ ${title}`}
            fallbackTitle={title}
            objectFit="contain"
            loading="eager"
            fetchPriority="high"
            sx={{ width: '100%', height: '100%' }}
          />
        </Box>

        {hasMultiple && (
          <>
            <IconButton
              onClick={() => goTo(-1)}
              aria-label="ดูรูปก่อนหน้า"
              title="รูปก่อนหน้า"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                minWidth: 44,
                minHeight: 44,
                bgcolor: '#FFFFFF',
                border: '1px solid #D9E2EC',
                color: '#102A43',
                '&:hover': { bgcolor: '#F5F7FA', borderColor: '#1976D2', color: '#1976D2' },
                '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <IconButton
              onClick={() => goTo(1)}
              aria-label="ดูรูปถัดไป"
              title="รูปถัดไป"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                minWidth: 44,
                minHeight: 44,
                bgcolor: '#FFFFFF',
                border: '1px solid #D9E2EC',
                color: '#102A43',
                '&:hover': { bgcolor: '#F5F7FA', borderColor: '#1976D2', color: '#1976D2' },
                '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails — capped at 4 with an honest overflow counter */}
      {hasMultiple && (
        <Box
          role="list"
          aria-label="รูปภาพย่อย"
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}
        >
          {galleryImages.slice(0, 4).map((img, index) => {
            const isSelected = currentImage === img;
            const isOverflowThumb = index === 3 && galleryImages.length > 4;
            const overflowCount = galleryImages.length - 4;
            return (
              <Box
                key={`${img}-${index}`}
                role="listitem"
              >
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isOverflowThumb
                      ? `ดูรูปภาพที่ 4 และอีก ${overflowCount} รูป จากทั้งหมด ${galleryImages.length} รูป`
                      : `ดูรูปภาพที่ ${index + 1} จากทั้งหมด ${galleryImages.length} รูป`
                  }
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => onSelectImage(isOverflowThumb ? galleryImages[4] : img)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectImage(isOverflowThumb ? galleryImages[4] : img);
                    }
                  }}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3 / 4',
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    p: 1,
                    border: isSelected ? '2px solid #1976D2' : '1px solid #D9E2EC',
                    transition: 'border-color 180ms ease',
                    '&:hover': { borderColor: '#1976D2' },
                    '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
                  }}
                >
                  <SafeImage
                    src={img}
                    alt={`รูปย่อยที่ ${index + 1} ของ ${title}`}
                    fallbackTitle={`${index + 1}`}
                    objectFit="contain"
                    loading="lazy"
                    sx={{ width: '100%', height: '100%' }}
                  />
                  {isOverflowThumb && (
                    <Box
                      aria-hidden="true"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(15, 45, 74, 0.62)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                      +{overflowCount}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Proof caption — every photo is of the actual copy for sale */}
      <Typography sx={{ color: '#62748A', fontSize: '0.78rem', lineHeight: 1.6, mt: 1.25 }}>
        ภาพถ่ายจริงจากหนังสือเล่มที่ขาย — ดูรูปตำหนิก่อนตัดสินใจ
      </Typography>
    </Box>
  );
};
