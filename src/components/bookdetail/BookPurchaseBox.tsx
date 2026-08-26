import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShipping as ShippingIcon,
  Share as ShareIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';
import { PriceComparison } from '../PriceComparison';

interface BookPurchaseBoxProps {
  book: Book;
  isFavorite: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}

export const BookPurchaseBox: React.FC<BookPurchaseBoxProps> = ({
  book,
  isFavorite,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onShare,
}) => {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid #D9E2EC' }}>
      {/* Category & Condition Tags */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={book.category}
          size="small"
          color="primary"
          sx={{ fontWeight: 700 }}
        />
        <ConditionBadge condition={book.condition} size="small" />
        {book.featured && (
          <Chip label="หนังสือแนะนำ" size="small" color="secondary" sx={{ fontWeight: 600 }} />
        )}
      </Box>

      {/* Title & Author */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: { xs: '1.75rem', md: '2.25rem' },
        }}
      >
        {book.title}
      </Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
        ผู้เขียน: <strong style={{ color: '#102A43' }}>{book.author}</strong>
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Price & Savings */}
      <Box sx={{ mb: 3, p: 2.5, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
          ราคาพิเศษสำหรับหนังสือส่งต่อ
        </Typography>
        <PriceComparison price={book.price} originalPrice={book.originalPrice} size="large" />
        <Typography variant="body2" sx={{ color: 'success.main', mt: 1, fontWeight: 500 }}>
          ✓ ประหยัดเงินเพื่อนำไปซื้อหนังสือเล่มโปรดเล่มต่อไป
        </Typography>
      </Box>

      {/* Condition Note Callout */}
      {book.conditionDescription && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>คำอธิบายสภาพ:</strong> {book.conditionDescription}
          </Typography>
          {book.defects && book.defects.length > 0 && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
              ตำหนิที่พบ: {book.defects.join(', ')}
            </Typography>
          )}
        </Alert>
      )}

      {/* Delivery and Stock note */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
          <CheckIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            มีสินค้าพร้อมส่ง ({book.stock} เล่ม)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <ShippingIcon fontSize="small" />
          <Typography variant="body2">
            จัดส่งด่วนโดยผู้ขาย
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onBuyNow}
            sx={{
              py: 1.5,
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            ซื้อเลย (Demo)
          </Button>
        </Grid>
        <Grid size={{ xs: 8, sm: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<CartIcon />}
            onClick={onAddToCart}
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            เพิ่มลงตะกร้า
          </Button>
        </Grid>
        <Grid size={{ xs: 2, sm: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={onToggleWishlist}
            sx={{
              py: 1.5,
              minWidth: 'auto',
              px: 0,
              borderRadius: 2,
            }}
            title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกในรายการโปรด'}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </Button>
        </Grid>
        <Grid size={{ xs: 2, sm: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={onShare}
            sx={{
              py: 1.5,
              minWidth: 'auto',
              px: 0,
              borderRadius: 2,
            }}
            title="แชร์หน้านี้"
          >
            <ShareIcon />
          </Button>
        </Grid>
      </Grid>

      {/* Seller note if any */}
      {book.sellerNote && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, borderLeft: '4px solid #1769AA' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'secondary.main', display: 'block' }}>
            ข้อความจากผู้ขาย
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            "{book.sellerNote}"
          </Typography>
        </Box>
      )}
    </Box>
  );
};
