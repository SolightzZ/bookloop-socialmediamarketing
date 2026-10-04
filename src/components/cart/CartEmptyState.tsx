import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * CartEmptyState — minimal Swiss empty state.
 * Oversized index numeral, quiet type, single CTA.
 */
export const CartEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '80vh', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          aria-hidden
          sx={{
            fontWeight: 800,
            color: '#D9E2EC',
            fontSize: { xs: '5rem', md: '7rem' },
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          00
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            color: '#102A43',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            mt: 1,
          }}
        >
          ตะกร้าของคุณยังว่างอยู่
        </Typography>
        <Typography sx={{ color: '#62748A', fontSize: '1rem', mt: 1.5, maxWidth: 480, lineHeight: 1.7 }}>
          หนังสือทุกหมวดในคลังของชุมชน BookLoop พร้อมให้เลือกอยู่แล้ว
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/books')}
          endIcon={<ArrowRight size={18} />}
          sx={{
            mt: 4,
            px: 4,
            minHeight: 52,
            borderRadius: '8px',
            fontWeight: 800,
            bgcolor: '#1976D2',
            boxShadow: 'none',
            width: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
            '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
          }}
        >
          ค้นหาและเลือกซื้อหนังสือ
        </Button>
      </Container>
    </Box>
  );
};
