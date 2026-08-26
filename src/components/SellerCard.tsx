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
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={seller.avatar}
            alt={seller.name}
            sx={{ width: 56, height: 56, border: '2px solid #D9E2EC' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {seller.name}
              </Typography>
              {seller.verified && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#1769AA !important' }} />}
                  label="ผู้ขายยืนยันตัวตนแล้ว"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(23, 105, 170, 0.08)',
                    color: 'secondary.main',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 22,
                  }}
                />
              )}
            </Box>
            {seller.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {seller.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {seller.bio && (
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', bgcolor: 'background.default', p: 1.5, borderRadius: 1.5, color: 'text.secondary' }}>
            "{seller.bio}"
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, textAlign: 'center' }}>
          <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {seller.rating}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              คะแนนผู้ขาย
            </Typography>
          </Box>

          <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <BagIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {seller.itemsSold}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              ส่งต่อสำเร็จ
            </Typography>
          </Box>

          <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <FastIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {seller.responseRate}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              ตอบแชท
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, justifyContent: 'center' }}>
          <CalendarIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            เป็นสมาชิกตั้งแต่ {seller.joinedAt}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
