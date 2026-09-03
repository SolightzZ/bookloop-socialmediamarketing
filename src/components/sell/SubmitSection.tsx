import React from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import {
  CheckCircleRounded as SuccessIcon,
  ErrorOutlineRounded as ErrorIcon,
  RocketLaunchRounded,
  ShieldOutlined,
  TaskAltRounded,
} from '@mui/icons-material';

interface SubmitSectionProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string | null;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isSubmitting,
  submitStatus,
  errorMessage,
}) => {
  const isBusy = isSubmitting || submitStatus === 'loading';
  const isDisabled = !isFormValid || isBusy;

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      {/* Error Alert if submission failed */}
      {submitStatus === 'error' && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: '#FEF3F2',
            color: '#B42318',
            border: '1px solid #FECDCA',
          }}
        >
          {errorMessage || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง'}
        </Alert>
      )}

      {/* Pre-submit Checklist (Compact, Modern) */}
      <Box
        sx={{
          mb: 2.5,
          p: 1.8,
          bgcolor: '#F8FAFC',
          borderRadius: 2.5,
          border: '1px solid #E2E8F0',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 1, fontSize: '0.78rem' }}>
          ความพร้อมก่อนส่งต่อหนังสือ:
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <TaskAltRounded sx={{ fontSize: 16, color: '#16A34A' }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem' }}>
              รูปถ่ายหนังสือคมชัด
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <TaskAltRounded sx={{ fontSize: 16, color: '#16A34A' }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem' }}>
              ระบุสภาพตรงความเป็นจริง
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <TaskAltRounded sx={{ fontSize: 16, color: '#16A34A' }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem' }}>
              ราคาโปร่งใส ไม่มีค่าแอบแฝง
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isDisabled}
        startIcon={
          isBusy ? (
            <CircularProgress size={20} color="inherit" />
          ) : submitStatus === 'success' ? (
            <SuccessIcon sx={{ color: '#2E7D5B' }} />
          ) : (
            <RocketLaunchRounded sx={{ fontSize: 20 }} />
          )
        }
        sx={{
          py: 1.6,
          fontSize: '1.05rem',
          fontWeight: 800,
          borderRadius: 3,
          bgcolor: submitStatus === 'success' ? '#16A34A' : isFormValid ? '#1976D2' : '#94A3B8',
          color: '#FFFFFF',
          textTransform: 'none',
          boxShadow: isFormValid && !isDisabled ? '0 4px 16px rgba(25, 118, 210, 0.3)' : 'none',
          '&:hover': {
            bgcolor: submitStatus === 'success' ? '#16A34A' : '#1565C0',
            transform: isFormValid && !isBusy ? 'translateY(-1px)' : 'none',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {isBusy
          ? 'กำลังบันทึกข้อมูล...'
          : submitStatus === 'success'
          ? 'ส่งหนังสือสำเร็จ'
          : 'ส่งต่อหนังสือขึ้นระบบ BookLoop'}
      </Button>

      {/* Helper text or Security reassurance */}
      {!isFormValid ? (
        <Typography
          variant="caption"
          sx={{
            color: '#D97706',
            display: 'block',
            textAlign: 'center',
            mt: 1.5,
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วนเพื่อส่งต่อหนังสือ
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, mt: 1.5, color: '#64748B' }}>
          <ShieldOutlined sx={{ fontSize: 16, color: '#16A34A' }} />
          <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
            ข้อมูลหนังสือจะได้รับการตรวจสอบและนำขึ้นระบบทันที ปลอดภัย 100%
          </Typography>
        </Box>
      )}
    </Box>
  );
};
