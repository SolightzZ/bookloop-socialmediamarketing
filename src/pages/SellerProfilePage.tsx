import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Avatar, Chip, Rating, Grid, Button } from '@mui/material';
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  CalendarToday as JoinDateIcon,
  VerifiedUser as VerifiedIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { books } from '../data/books';
import { BookCard } from '../components/BookCard';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';

export default function SellerProfilePage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();

  const sellerBooks = useMemo(() => books.filter((b) => b.seller.id === sellerId), [sellerId]);
  const seller = sellerBooks.length > 0 ? sellerBooks[0].seller : null;

  if (!seller) {
    return (
      <Box sx={{ py: 10, bgcolor: '#F7FAFC', minHeight: '80vh', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <StoreIcon sx={{ fontSize: 64, color: '#E2E8F0', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 1 }}>
            ไม่พบผู้ขาย
          </Typography>
          <Typography variant="body2" sx={{ color: '#627D98', mb: 3 }}>
            ผู้ขายรายนี้อาจไม่มีอยู่แล้วหรือถูกลบออก
          </Typography>
          <Button variant="contained" onClick={() => navigate('/books')} sx={{ textTransform: 'none', fontWeight: 700 }}>
            กลับไปเลือกซื้อหนังสือ
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, bgcolor: '#F7FAFC', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <BreadcrumbsNav items={[{ label: 'ค้นหาหนังสือ', path: '/books' }, { label: seller.name }]} />

        {/* Seller Header */}
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            gap: 3,
          }}
        >
          <Avatar
            src={seller.avatar}
            sx={{
              width: { xs: 72, sm: 88 },
              height: { xs: 72, sm: 88 },
              bgcolor: '#EAF4FF',
              border: '3px solid #FFFFFF',
              boxShadow: '0 2px 12px rgba(15, 45, 74, 0.1)',
            }}
          >
            <StoreIcon sx={{ fontSize: 36, color: '#1976D2' }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F2D4A', fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                {seller.name}
              </Typography>
              {seller.verified && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 14, color: '#1976D2 !important' }} />}
                  label="ยืนยันตัวตนแล้ว"
                  size="small"
                  sx={{ bgcolor: '#EAF4FF', color: '#1976D2', fontWeight: 600, height: 24, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating value={seller.rating} precision={0.1} readOnly size="small" sx={{ color: '#F59E0B' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F2D4A' }}>
                  {seller.rating}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#627D98' }}>
                ขายแล้ว {seller.itemsSold} เล่ม
              </Typography>
              <Typography variant="body2" sx={{ color: '#627D98' }}>
                อัตราตอบกลับ {seller.responseRate}
              </Typography>
              {seller.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#627D98' }}>
                    {seller.location}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <JoinDateIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                <Typography variant="body2" sx={{ color: '#627D98' }}>
                  สมาชิกตั้งแต่ {seller.joinedAt}
                </Typography>
              </Box>
            </Box>

            {seller.bio && (
              <Typography variant="body2" sx={{ color: '#627D98', mt: 1.5, lineHeight: 1.6 }}>
                {seller.bio}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Seller's Books */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 2.5 }}>
          หนังสือของ {seller.name} ({sellerBooks.length} เล่ม)
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          {sellerBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
