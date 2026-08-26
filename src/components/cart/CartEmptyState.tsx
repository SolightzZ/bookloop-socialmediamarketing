import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ShoppingCart as CartIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const CartEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 12 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(16, 42, 67, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CartIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          ตะกร้าสินค้าของคุณว่างเปล่า
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', mb: 3 }}>
          หนังสือดีๆ หลากหลายหมวดหมู่กำลังรอให้คุณค้นพบและส่งต่อเรื่องราว ไปเริ่มเลือกหนังสือกันเลย!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/books')}
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2, px: 4, py: 1.4, borderRadius: 2 }}
        >
          ค้นหาและเลือกซื้อหนังสือ
        </Button>
      </Container>
    </Box>
  );
};
