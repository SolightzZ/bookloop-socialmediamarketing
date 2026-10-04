import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Undo2,
  Check,
} from 'lucide-react';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';
import { useAuth } from '../../hooks/useAuth';
import { PriceAlertButton } from './PriceAlertButton';

interface BookPurchaseBoxProps {
  book: Book;
  isFavorite: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
  /** Slot rendered between stock status and purchase actions (mobile condition strip). */
  conditionSlot?: React.ReactNode;
}

/**
 * BookPurchaseBox — editorial product information column (no outer card).
 * Hierarchy: chips → H1 → author → rating → price → stock → actions → trust row.
 * Only the primary CTA carries strong visual weight.
 */
export const BookPurchaseBox: React.FC<BookPurchaseBoxProps> = ({
  book,
  isFavorite,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onShare,
  conditionSlot,
}) => {
  const { isAuthenticated } = useAuth();
  const [addState, setAddState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAddClick = () => {
    if (!isAuthenticated) {
      onAddToCart();
      return;
    }
    if (addState !== 'idle') return;
    setAddState('loading');
    setTimeout(() => {
      onAddToCart();
      setAddState('success');
      setTimeout(() => setAddState('idle'), 1500);
    }, 350);
  };

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  return (
    <Box component="article" aria-labelledby="product-title">
      {/* 1. Category / condition metadata */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          label={book.category}
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#EAF2FE', color: '#1976D2', height: 24, borderRadius: '6px' }}
        />
        <ConditionBadge condition={book.condition} size="small" />
      </Box>

      {/* 2. Title */}
      <Typography
        id="product-title"
        variant="h1"
        component="h1"
        sx={{
          fontWeight: 800,
          color: '#102A43',
          fontSize: { xs: '2rem', md: '2.5rem' },
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        {book.title}
      </Typography>

      {/* 3. Author */}
      <Typography sx={{ color: '#62748A', fontSize: '1rem', mb: 1.5 }}>
        โดย <Box component="span" sx={{ color: '#102A43', fontWeight: 600 }}>{book.author}</Box>
      </Typography>

      {/* 4. Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Rating
          value={book.rating}
          precision={0.1}
          readOnly
          size="small"
          aria-label={`คะแนน ${book.rating} จาก 5`}
          sx={{ color: '#F5A623', '& .MuiRating-iconEmpty': { color: '#D9E2EC' } }}
        />
        <Typography sx={{ fontWeight: 700, color: '#102A43', fontSize: '0.9rem' }}>
          {book.rating.toFixed(1)}
        </Typography>
        <Typography
          component="a"
          href="#reviews"
          sx={{ color: '#62748A', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#1976D2', textDecoration: 'underline' } }}
        >
          ({book.reviewCount} รีวิว)
        </Typography>
      </Box>

      {/* 5. Price — typography, not a card */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography
          component="span"
          aria-label={`ราคา ${book.price} บาท`}
          sx={{ fontWeight: 800, color: '#102A43', fontSize: { xs: '2rem', md: '2.25rem' }, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          ฿{book.price.toLocaleString()}
        </Typography>
        {book.originalPrice && book.originalPrice > book.price && (
          <Typography
            component="span"
            sx={{ color: '#62748A', fontSize: '0.875rem', textDecoration: 'line-through' }}
            aria-label={`ราคาปก ${book.originalPrice} บาท`}
          >
            ฿{book.originalPrice.toLocaleString()}
          </Typography>
        )}
        {discountPercent > 0 && (
          <Chip
            label={`-${discountPercent}%`}
            size="small"
            sx={{ bgcolor: '#FDECEC', color: '#D64545', fontWeight: 800, fontSize: '0.75rem', height: 22, borderRadius: '6px' }}
          />
        )}
      </Box>
      <Box sx={{ mt: 0.5, mb: 2.5 }}>
        <PriceAlertButton bookId={book.id} currentPrice={book.price} />
      </Box>

      {/* 6. Availability */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            aria-hidden
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#18864B', flexShrink: 0 }}
          />
          <Typography sx={{ color: '#18864B', fontWeight: 700, fontSize: '0.9rem' }}>
            มีสินค้าพร้อมส่ง{book.stock > 1 ? ` (เหลือ ${book.stock} เล่ม)` : ''}
          </Typography>
        </Box>
        <Typography sx={{ color: '#62748A', fontSize: '0.85rem', mt: 0.5, pl: 2.5 }}>
          จัดส่งภายใน 1–2 วัน
        </Typography>
      </Box>

      {/* Mobile-only: condition strip sits before purchase actions */}
      {conditionSlot}

      {/* 7. Purchase actions — clear visual hierarchy */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          variant="contained"
          size="large"
          onClick={onBuyNow}
          aria-label={`ซื้อ ${book.title} ทันที`}
          startIcon={<ShoppingCart size={18} />}
          sx={{
            flex: { sm: 1.4 },
            minHeight: 48,
            py: 1.4,
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '8px',
            bgcolor: '#1976D2',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#1565C0', boxShadow: 'none' },
            '&:focus-visible': { outline: '2px solid #0F3557', outlineOffset: '2px' },
          }}
        >
          ซื้อทันที
        </Button>
        <Button
          variant="outlined"
          size="large"
          disabled={addState === 'loading'}
          onClick={handleAddClick}
          aria-label={`เพิ่ม ${book.title} ลงตะกร้า`}
          startIcon={
            addState === 'loading' ? (
              <CircularProgress size={16} color="inherit" />
            ) : addState === 'success' ? (
              <Check size={18} />
            ) : undefined
          }
          sx={{
            flex: { sm: 1 },
            minHeight: 48,
            py: 1.4,
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: '8px',
            borderColor: addState === 'success' ? '#18864B' : '#D9E2EC',
            color: addState === 'success' ? '#18864B' : '#0F3557',
            bgcolor: '#FFFFFF',
            whiteSpace: 'nowrap',
            '&:hover': { borderColor: '#1976D2', bgcolor: '#FFFFFF' },
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
          }}
        >
          {addState === 'loading' ? 'กำลังเพิ่ม...' : addState === 'success' ? 'เพิ่มแล้ว' : 'เพิ่มลงตะกร้า'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onToggleWishlist}
          aria-label={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
          aria-pressed={isFavorite}
          startIcon={<Heart size={18} fill={isFavorite ? '#D64545' : 'none'} color={isFavorite ? '#D64545' : '#62748A'} />}
          sx={{
            minHeight: 44,
            borderRadius: '8px',
            borderColor: '#D9E2EC',
            color: isFavorite ? '#D64545' : '#62748A',
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: '#FFFFFF',
            '&:hover': { borderColor: '#D64545', bgcolor: '#FFFFFF' },
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
          }}
        >
          {isFavorite ? 'ถูกใจแล้ว' : 'Wishlist'}
        </Button>
        <Tooltip title="แชร์หนังสือเล่มนี้">
          <IconButton
            onClick={onShare}
            aria-label="แชร์หนังสือเล่มนี้"
            sx={{
              minWidth: 44,
              minHeight: 44,
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #D9E2EC',
              color: '#62748A',
              bgcolor: '#FFFFFF',
              flex: 1,
              '&:hover': { borderColor: '#1976D2', color: '#1976D2', bgcolor: '#FFFFFF' },
              '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
            }}
          >
            <Share2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 8. Trust row — compact, no cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid #D9E2EC',
          pt: 2.5,
        }}
      >
        {[
          { icon: <Truck size={20} />, title: 'จัดส่งทั่วไทย', sub: '1–3 วัน' },
          { icon: <ShieldCheck size={20} />, title: 'สินค้าตรวจสอบแล้ว', sub: 'มั่นใจได้' },
          { icon: <Undo2 size={20} />, title: 'คืนสินค้าได้', sub: 'ตามเงื่อนไข' },
        ].map((t, i) => (
          <Box
            key={t.title}
            sx={{
              display: 'flex',
              gap: 1.25,
              alignItems: 'flex-start',
              pr: 1.5,
              pl: i === 0 ? 0 : 1.5,
              borderLeft: i === 0 ? 'none' : '1px solid #D9E2EC',
              color: '#1976D2',
            }}
          >
            <Box sx={{ flexShrink: 0, mt: 0.25 }}>{t.icon}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, color: '#102A43', fontSize: '0.82rem', lineHeight: 1.4 }}>
                {t.title}
              </Typography>
              <Typography sx={{ color: '#62748A', fontSize: '0.78rem' }}>{t.sub}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

    </Box>
  );
};
