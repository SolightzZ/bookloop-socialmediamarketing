import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  ErrorOutlineOutlined as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionText?: string;
  secondaryAction?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'ไม่สามารถโหลดข้อมูลได้',
  description = 'เกิดข้อผิดพลาดในการเชื่อมต่อ หรือไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
  actionText = 'ลองใหม่อีกครั้ง',
  secondaryAction,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        borderRadius: 3.5,
        border: '1.5px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        maxWidth: 500,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: '#FEE2E2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <ErrorIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: '#0F2D4A',
          fontWeight: 800,
          mb: 1,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#64748B',
          mb: 3,
          lineHeight: 1.6,
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
        }}
      >
        {description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              bgcolor: '#1976D2',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0F2D4A' },
            }}
          >
            {actionText}
          </Button>
        )}
        {secondaryAction}
      </Box>
    </Paper>
  );
};
