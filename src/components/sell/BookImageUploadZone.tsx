import React from 'react';
import { Box, Typography } from '@mui/material';
import { PhotoCamera as PhotoIcon } from '@mui/icons-material';

interface BookImageUploadZoneProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookImageUploadZone: React.FC<BookImageUploadZoneProps> = ({
  imagePreview,
  onImageChange,
}) => {
  return (
    <Box
      component="label"
      sx={{
        border: '2px dashed #CBD5E1',
        borderRadius: 2.5,
        p: 4,
        textAlign: 'center',
        bgcolor: 'background.default',
        cursor: 'pointer',
        display: 'block',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(16, 42, 67, 0.02)',
        },
      }}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={onImageChange}
      />
      {imagePreview ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={imagePreview}
            alt="Preview"
            sx={{ maxHeight: 180, borderRadius: 1.5, objectFit: 'contain' }}
          />
          <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
            คลิกเพื่อเปลี่ยนรูปภาพ
          </Typography>
        </Box>
      ) : (
        <Box>
          <PhotoIcon sx={{ fontSize: 44, color: 'secondary.main', mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            อัปโหลดรูปถ่ายหนังสือจริง
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            แนะนำให้ถ่ายปกหน้า ปกหลัง และมุมที่มีตำหนิ (รองรับ JPG, PNG)
          </Typography>
        </Box>
      )}
    </Box>
  );
};
