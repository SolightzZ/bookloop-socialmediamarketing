import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import {
  ErrorOutlineOutlined as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            py: { xs: 6, sm: 8, md: 10 },
            px: 2,
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F7F9FC',
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4.5 },
                borderRadius: 3.5,
                border: '1.5px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(15, 45, 74, 0.06)',
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
                <ErrorIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#0F2D4A',
                  mb: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                ขออภัย เกิดข้อผิดพลาดขึ้นชั่วคราว
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#627D98',
                  mb: 3,
                  maxWidth: 420,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                ระบบไม่สามารถแสดงผลส่วนนี้ได้ตามปกติ คุณสามารถลองโหลดใหม่อีกครั้ง หรือกลับไปยังหน้าหลัก
              </Typography>

              {this.state.error && (
                <Box
                  sx={{
                    mb: 3,
                    p: 1.5,
                    bgcolor: '#F1F5F9',
                    borderRadius: 2,
                    border: '1px solid #E2E8F0',
                    textAlign: 'left',
                    maxHeight: 120,
                    overflow: 'auto',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: '#475569',
                      m: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.message || String(this.state.error)}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    fontWeight: 700,
                    bgcolor: '#1976D2',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0F2D4A' },
                  }}
                >
                  ลองใหม่อีกครั้ง
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    fontWeight: 700,
                    borderColor: '#CBD5E1',
                    color: '#0F2D4A',
                    '&:hover': {
                      borderColor: '#1976D2',
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  กลับสู่หน้าหลัก
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
