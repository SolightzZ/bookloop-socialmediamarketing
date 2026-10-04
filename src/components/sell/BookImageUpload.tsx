import React, { useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, FormHelperText } from '@mui/material';
import { UploadCloud, X, Plus } from 'lucide-react';
import { compressImageToDataUrl } from '../../utils/imageCompressor';

export interface BookImageUploadProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  // Legacy / fallback props
  imagePreview?: string | null;
  onImageSelected?: (dataUrl: string) => void;
  onImageRemoved?: () => void;
  error?: string | null;
  touched?: boolean;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const BookImageUpload: React.FC<BookImageUploadProps> = ({
  images,
  onImagesChange,
  imagePreview,
  onImageSelected,
  onImageRemoved,
  error,
  touched,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Normalize image list: support either images array or single imagePreview
  const currentImages: string[] = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (imagePreview) return [imagePreview];
    return [];
  }, [images, imagePreview]);

  const updateImages = (newImages: string[]) => {
    if (onImagesChange) {
      onImagesChange(newImages);
    }
    if (onImageSelected && newImages.length > 0) {
      onImageSelected(newImages[0]);
    } else if (onImageRemoved && newImages.length === 0) {
      onImageRemoved();
    }
  };

  const processFiles = (fileList: FileList | File[]) => {
    setClientError(null);
    const files = Array.from(fileList);
    const remainingSlots = MAX_IMAGES - currentImages.length;

    if (remainingSlots <= 0) {
      setClientError(`สามารถเพิ่มรูปได้สูงสุด ${MAX_IMAGES} รูป`);
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    Promise.all(
      filesToProcess.map(async (file) => {
        const fileType = file.type.toLowerCase();
        const isAllowed =
          ALLOWED_MIME_TYPES.includes(fileType) ||
          file.name.toLowerCase().endsWith('.jpg') ||
          file.name.toLowerCase().endsWith('.jpeg') ||
          file.name.toLowerCase().endsWith('.png') ||
          file.name.toLowerCase().endsWith('.webp');

        if (!isAllowed) {
          throw new Error('รูปแบบไฟล์ไม่ถูกต้อง รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP');
        }

        // ย่อและบีบอัดรูปภาพให้อยู่ในขนาด < 480KB เสมอ ป้องกัน Payload ใหญ่เกินกำหนด
        return compressImageToDataUrl(file, {
          maxDimension: 1280,
          maxSizeBytes: 480 * 1024,
          initialQuality: 0.82,
        });
      })
    )
      .then((compressedImages) => {
        updateImages([...currentImages, ...compressedImages]);
      })
      .catch((err) => {
        setClientError(err?.message || 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so same file can be re-uploaded if needed
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
    updateImages(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const displayError = (touched && error) || clientError;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="book-image-upload-input"
      />

      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '1.05rem',
            lineHeight: 1.3,
          }}
        >
          รูปหนังสือ <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#64748B',
            fontSize: '0.825rem',
            display: 'block',
            mt: 0.25,
          }}
        >
          เพิ่มรูปเพื่อให้ผู้ซื้อเห็นสภาพจริง
        </Typography>
      </Box>

      {/* Uploader / Thumbnails */}
      {currentImages.length === 0 ? (
        /* Empty State: Compact Upload Area */
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: isDragging ? '2px dashed #1976D2' : '2px dashed #CBD5E1',
            borderRadius: '14px',
            bgcolor: isDragging ? '#F0F7FF' : '#F8FAFD',
            py: { xs: 3.5, sm: 4 },
            px: 2,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#1976D2',
              bgcolor: '#F0F7FF',
            },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#EAF4FF',
              color: '#1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.25,
            }}
          >
            <UploadCloud size={24} strokeWidth={2} />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#0F2F52',
              fontSize: '0.9375rem',
              mb: 0.5,
            }}
          >
            เพิ่มรูปหนังสือ
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: '#64748B',
              fontSize: '0.78rem',
              display: 'block',
              mb: 1.75,
            }}
          >
            JPG, PNG · สูงสุด 5 MB (สูงสุด {MAX_IMAGES} รูป)
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            sx={{
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.8125rem',
              px: 2.25,
              py: 0.7,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1259A8',
                boxShadow: 'none',
              },
            }}
          >
            อัปโหลดรูป
          </Button>
        </Box>
      ) : (
        /* Populated State: Horizontal Thumbnails [ Thumbnail ] [ Thumbnail ] [ + เพิ่มรูป ] */
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            {currentImages.map((imgUrl, idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  width: { xs: 96, sm: 108 },
                  height: { xs: 114, sm: 128 },
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: idx === 0 ? '2px solid #1976D2' : '1px solid #E2EAF2',
                  bgcolor: '#F1F5F9',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(15, 47, 82, 0.06)',
                }}
              >
                <Box
                  component="img"
                  src={imgUrl}
                  alt={`รูปหนังสือที่ ${idx + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Cover badge for first image */}
                {idx === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      right: 4,
                      bgcolor: 'rgba(25, 118, 210, 0.92)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      py: 0.25,
                      textAlign: 'center',
                      borderRadius: '4px',
                      letterSpacing: '0.01em',
                    }}
                  >
                    รูปหลัก
                  </Box>
                )}

                {/* Remove button */}
                <IconButton
                  size="small"
                  aria-label="ลบรูป"
                  onClick={() => handleRemoveImage(idx)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(15, 23, 42, 0.72)',
                    color: '#FFFFFF',
                    width: 22,
                    height: 22,
                    p: 0,
                    '&:hover': {
                      bgcolor: '#EF4444',
                    },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <X size={13} strokeWidth={2.5} />
                </IconButton>
              </Box>
            ))}

            {/* Add More Slot if < MAX_IMAGES */}
            {currentImages.length < MAX_IMAGES && (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: { xs: 96, sm: 108 },
                  height: { xs: 114, sm: 128 },
                  borderRadius: '12px',
                  border: '2px dashed #93C5FD',
                  bgcolor: '#F8FAFD',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#1976D2',
                    bgcolor: '#EFF6FF',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#EAF4FF',
                    color: '#1976D2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: '#1976D2',
                    fontSize: '0.75rem',
                  }}
                >
                  เพิ่มรูป
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    fontSize: '0.68rem',
                  }}
                >
                  ({currentImages.length}/{MAX_IMAGES})
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1.25,
              color: '#64748B',
              fontSize: '0.78rem',
            }}
          >
            JPG, PNG · สูงสุด 5 MB (รูปแรกจะเป็นรูปหน้าปกหลัก)
          </Typography>
        </Box>
      )}

      {/* Validation Error Feedback */}
      {displayError && (
        <FormHelperText
          error
          sx={{
            mt: 1,
            fontSize: '0.8rem',
            fontWeight: 500,
          }}
        >
          {displayError}
        </FormHelperText>
      )}
    </Box>
  );
};
