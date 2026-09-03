import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  CloudUploadOutlined as UploadIcon,
  DeleteOutlineRounded as DeleteIcon,
  CachedRounded as ReplaceIcon,
  CheckCircleRounded as SuccessIcon,
  WbSunnyOutlined,
  ImportContactsRounded,
  SearchRounded,
  AddPhotoAlternateRounded,
} from '@mui/icons-material';

export interface BookImageUploadProps {
  imagePreview: string | null;
  onImageSelected: (dataUrl: string) => void;
  onImageRemoved: () => void;
  error?: string | null;
  touched?: boolean;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const BookImageUpload: React.FC<BookImageUploadProps> = ({
  imagePreview,
  onImageSelected,
  onImageRemoved,
  error,
  touched,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [clientError, setClientError] = useState<string | null>(null);

  const validateAndProcessFile = (file: File) => {
    setClientError(null);

    const fileType = file.type.toLowerCase();
    const isAllowedType =
      ALLOWED_MIME_TYPES.includes(fileType) ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.png') ||
      file.name.toLowerCase().endsWith('.webp');

    if (!isAllowedType) {
      setClientError('รูปแบบไฟล์ไม่ถูกต้อง รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setClientError(`ขนาดไฟล์ใหญ่เกินกำหนด (ขนาดไฟล์สูงสุดไม่เกิน ${MAX_FILE_SIZE_MB} MB)`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadProgress(80);
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          const result = e.target?.result as string;
          onImageSelected(result);
        }, 120);
      }, 150);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setClientError('เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ กรุณาลองใหม่อีกครั้ง');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 3 Modern Photography Tips */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
          gap: 1.2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.2,
            bgcolor: '#F0FDF4',
            borderRadius: 2,
            border: '1px solid #DCFCE7',
          }}
        >
          <WbSunnyOutlined sx={{ fontSize: 18, color: '#16A34A' }} />
          <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 600, fontSize: '0.75rem' }}>
            ถ่ายในที่แสงธรรมชาติชัดเจน
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.2,
            bgcolor: '#EFF6FF',
            borderRadius: 2,
            border: '1px solid #DBEAFE',
          }}
        >
          <ImportContactsRounded sx={{ fontSize: 18, color: '#2563EB' }} />
          <Typography variant="caption" sx={{ color: '#1D4ED8', fontWeight: 600, fontSize: '0.75rem' }}>
            ถ่ายทั้งหน้าปกและสันหนังสือ
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.2,
            bgcolor: '#FEF3C7',
            borderRadius: 2,
            border: '1px solid #FDE68A',
          }}
        >
          <SearchRounded sx={{ fontSize: 18, color: '#D97706' }} />
          <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 600, fontSize: '0.75rem' }}>
            ซูมจุดตำหนิเพื่อความโปร่งใส
          </Typography>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="book-image-file-input"
      />

      {/* Image Preview or Upload Zone */}
      {imagePreview ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            p: 2,
            borderRadius: 3,
            border: '1.5px solid #CBD5E1',
            bgcolor: '#F8FAFC',
          }}
        >
          <Box
            component="img"
            src={imagePreview}
            alt="ภาพตัวอย่างหนังสือ"
            sx={{
              width: 100,
              height: 130,
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: '0 4px 10px rgba(15, 45, 74, 0.12)',
              border: '1px solid #E2E8F0',
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#16A34A', mb: 0.5 }}>
              <SuccessIcon sx={{ fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                อัปโหลดรูปภาพหนังสือเรียบร้อย
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2, fontSize: '0.78rem' }}>
              รูปภาพนี้จะแสดงเป็นหน้าปกหลักในหน้ารายการหนังสือและผลการค้นหา
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReplaceIcon sx={{ fontSize: 16 }} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderColor: '#CBD5E1',
                  color: '#0F2D4A',
                }}
              >
                เปลี่ยนรูปภาพ
              </Button>
              <Tooltip title="ลบรูปภาพนี้">
                <IconButton
                  size="small"
                  onClick={onImageRemoved}
                  sx={{ color: '#EF4444', bgcolor: '#FEE2E2', borderRadius: 2 }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: isDragging ? '2px dashed #1976D2' : '2px dashed #CBD5E1',
            bgcolor: isDragging ? '#EFF6FF' : '#F8FAFC',
            borderRadius: 3.5,
            p: { xs: 3, sm: 4 },
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
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: isDragging ? '#DBEAFE' : '#EAF4FF',
              color: '#1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            {isDragging ? <AddPhotoAlternateRounded sx={{ fontSize: 28 }} /> : <UploadIcon sx={{ fontSize: 28 }} />}
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 0.5, fontSize: '0.95rem' }}>
            คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่
          </Typography>

          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5, fontSize: '0.78rem' }}>
            รองรับไฟล์ JPG, PNG หรือ WEBP (ขนาดไม่เกิน 5 MB)
          </Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<UploadIcon />}
            sx={{
              bgcolor: '#1976D2',
              borderRadius: 9999,
              px: 3,
              py: 0.8,
              fontWeight: 700,
              fontSize: '0.82rem',
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            เลือกรูปภาพจากเครื่อง
          </Button>
        </Box>
      )}

      {/* Uploading progress bar */}
      {isUploading && (
        <Box sx={{ mt: 1.5 }}>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 2, height: 6 }} />
        </Box>
      )}

      {/* Errors */}
      {(clientError || (touched && error)) && (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2, fontSize: '0.8rem' }}>
          {clientError || error}
        </Alert>
      )}
    </Box>
  );
};
