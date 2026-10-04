import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { BookOpen, Sparkles } from 'lucide-react';

export const SellHero: React.FC = () => {
  return (
    <Box
      component="header"
      sx={{
        background: 'linear-gradient(180deg, #EDF5FD 0%, #F7FAFD 100%)',
        borderBottom: '1px solid #E2EAF2',
        py: { xs: 3.5, sm: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1040px',
            mx: 'auto',
          }}
        >
          {/* Left Text Block */}
          <Box sx={{ maxWidth: { xs: '100%', md: '640px' } }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: '#0F2F52',
                fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.35rem' },
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                mb: 1,
              }}
            >
              หนังสือที่อ่านจบแล้ว
              <Box
                component="span"
                sx={{
                  display: 'block',
                  color: '#1976D2',
                }}
              >
                ส่งต่อได้ที่นี่
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#64748B',
                fontSize: { xs: '0.95rem', md: '1.025rem' },
                lineHeight: 1.5,
              }}
            >
              ให้หนังสือของคุณได้เดินทางต่อ
            </Typography>
          </Box>

          {/* Right Compact Visual Accent (Desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              pr: 2,
            }}
          >
            <Box
              sx={{
                width: 104,
                height: 104,
                borderRadius: '50%',
                bgcolor: '#EAF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #D0E4FB',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.08)',
                position: 'relative',
              }}
            >
              <BookOpen size={44} color="#1976D2" strokeWidth={1.75} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: '#FFFFFF',
                  borderRadius: '50%',
                  p: 0.5,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="#1976D2" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
