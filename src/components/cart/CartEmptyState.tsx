import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ShoppingCart as CartIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const CartEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 6, sm: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            borderRadius: '50%',
            bgcolor: 'rgba(16, 42, 67, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CartIcon sx={{ fontSize: { xs: 40, sm: 50 }, color: 'text.secondary' }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: 'primary.main',
            fontSize: { xs: '1.45rem', sm: '1.85rem', md: '2.15rem' },
          }}
        >
          ตะกร้าสินค้าของคุณว่างเปล่า
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', mb: 3, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          หนังสือดีๆ หลากหลายหมวดหมู่กำลังรอให้คุณค้นพบและส่งต่อเรื่องราว ไปเริ่มเลือกหนังสือกันเลย!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/books')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 2,
            px: 4,
            py: 1.4,
            borderRadius: 2,
            fontWeight: 700,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          ค้นหาและเลือกซื้อหนังสือ
        </Button>
      </Container>
    </Box>
  );
};
