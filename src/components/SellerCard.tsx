import React from 'react';
import { Box, Typography, Avatar, Button, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, MapPin } from 'lucide-react';
import { Seller } from '../data/books';

interface SellerCardProps {
  seller: Seller;
}

/**
 * SellerCard — compact trustworthy marketplace seller profile.
 * No outer card: avatar + identity, trust stats with separators,
 * single focused "ดูร้านค้า" action.
 */
export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  const navigate = useNavigate();

  return (
    <Box component="section" aria-label={`ผู้ขาย ${seller.name}`}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: '#102A43',
          fontSize: { xs: '1.375rem', md: '1.5rem' },
          letterSpacing: '-0.01em',
          mb: 2.5,
        }}
      >
        ผู้ขาย
      </Typography>

      {/* Identity */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          src={seller.avatar}
          alt={`รูปโปรไฟล์ของ ${seller.name}`}
          sx={{ width: 52, height: 52 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.05rem' }}>
              {seller.name}
            </Typography>
            {seller.verified && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#1976D2',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <BadgeCheck size={15} aria-hidden />
                ยืนยันตัวตนแล้ว
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25, flexWrap: 'wrap' }}>
            <Typography sx={{ color: '#62748A', fontSize: '0.82rem' }}>
              ขายแล้ว {seller.itemsSold} เล่ม · สมาชิกตั้งแต่ {seller.joinedAt}
            </Typography>
            {seller.location && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: '#62748A', fontSize: '0.82rem' }}>
                <MapPin size={13} aria-hidden />
                {seller.location}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Trust signals */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          py: 1.75,
          borderTop: '1px solid #D9E2EC',
          borderBottom: '1px solid #D9E2EC',
          mb: 2.5,
        }}
      >
        {seller.rating > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Rating
              value={seller.rating}
              precision={0.1}
              readOnly
              size="small"
              aria-label={`คะแนนผู้ขาย ${seller.rating} จาก 5`}
              sx={{ color: '#F5A623', '& .MuiRating-iconEmpty': { color: '#D9E2EC' } }}
            />
            <Typography sx={{ fontWeight: 800, color: '#102A43', fontSize: '0.9rem' }}>
              {seller.rating.toFixed(1)}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontWeight: 700, color: '#102A43', fontSize: '0.85rem' }}>
            ผู้ขายใหม่ · ยังไม่มีคะแนน
          </Typography>
        )}
        <Box aria-hidden sx={{ width: 1, height: 18, bgcolor: '#D9E2EC' }} />
        <Typography sx={{ color: '#62748A', fontSize: '0.85rem' }}>
          ตอบแชท <Box component="span" sx={{ color: '#102A43', fontWeight: 700 }}>{seller.responseRate}%</Box>
        </Typography>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate(`/seller/${seller.id}`)}
        aria-label={`ดูร้านค้าของ ${seller.name}`}
        sx={{
          minHeight: 44,
          borderRadius: '8px',
          borderColor: '#D9E2EC',
          color: '#0F3557',
          fontWeight: 700,
          fontSize: '0.9rem',
          bgcolor: '#FFFFFF',
          '&:hover': { borderColor: '#1976D2', color: '#1976D2', bgcolor: '#FFFFFF' },
          '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
        }}
      >
        ดูร้านค้า
      </Button>
    </Box>
  );
};
