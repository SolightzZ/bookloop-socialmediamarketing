import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Chip, Divider } from '@mui/material';
import {
  Verified as VerifiedIcon,
  Star as StarIcon,
  ShoppingBag as BagIcon,
  Bolt as FastIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Seller } from '../data/books';

interface SellerCardProps {
  seller: Seller;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 10px rgba(15, 45, 74, 0.03)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={seller.avatar}
            alt={seller.name}
            sx={{ width: 56, height: 56, border: '2px solid #D9E2EC' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                {seller.name}
              </Typography>
              {seller.verified && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#1976D2 !important' }} />}
                  label="ผู้ขายยืนยันตัวตนแล้ว"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    color: '#1976D2',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 22,
                  }}
                />
              )}
            </Box>
            {seller.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                <LocationIcon sx={{ fontSize: 14, color: '#627D98' }} />
                <Typography variant="caption" sx={{ color: '#627D98' }}>
                  {seller.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {seller.bio && (
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', bgcolor: '#F7F9FC', p: 1.5, borderRadius: 1.5, color: '#627D98', border: '1px solid #EDF2F7' }}>
            "{seller.bio}"
          </Typography>
        )}

        <Divider sx={{ my: 2, borderColor: '#F0F4F8' }} />

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, textAlign: 'center' }}>
          <Box sx={{ p: 1.25, bgcolor: '#F7F9FC', borderRadius: 1.5, border: '1px solid #EDF2F7' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                {seller.rating}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#627D98', display: 'block', fontSize: '0.75rem' }}>
              คะแนนผู้ขาย
            </Typography>
          </Box>

          <Box sx={{ p: 1.25, bgcolor: '#F7F9FC', borderRadius: 1.5, border: '1px solid #EDF2F7' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <BagIcon sx={{ fontSize: 16, color: '#1976D2' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                {seller.itemsSold}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#627D98', display: 'block', fontSize: '0.75rem' }}>
              ส่งต่อสำเร็จ
            </Typography>
          </Box>

          <Box sx={{ p: 1.25, bgcolor: '#F7F9FC', borderRadius: 1.5, border: '1px solid #EDF2F7' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <FastIcon sx={{ fontSize: 16, color: '#2E7D5B' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                {seller.responseRate}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#627D98', display: 'block', fontSize: '0.75rem' }}>
              ตอบแชท
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, justifyContent: 'center' }}>
          <CalendarIcon sx={{ fontSize: 13, color: '#627D98' }} />
          <Typography variant="caption" sx={{ color: '#627D98' }}>
            เป็นสมาชิกตั้งแต่ {seller.joinedAt}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
