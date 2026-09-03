import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  ShoppingCartOutlined as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShippingOutlined as ShippingIcon,
  ShareOutlined as ShareIcon,
  CheckCircleOutlineRounded as CheckIcon,
  AutoStoriesOutlined as StoryIcon,
} from '@mui/icons-material';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';
import { useAuth } from '../../hooks/useAuth';

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
      setTimeout(() => {
        setAddState('idle');
      }, 1500);
    }, 350);
  };

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  return (
    <Box
      component="article"
      sx={{
        bgcolor: '#FFFFFF',
        p: { xs: 3, sm: 3.5, md: 4 },
        borderRadius: 3,
        border: '1px solid #D9E2EC',
        boxShadow: '0 2px 10px rgba(15, 45, 74, 0.04)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Category, Condition & Optional Featured Badges (Restrained density) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75, flexWrap: 'wrap' }}>
        <Chip
          label={book.category}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: '#EBF3FA',
            color: '#1976D2',
            border: '1px solid rgba(25, 118, 210, 0.2)',
            height: 24,
          }}
        />

        <ConditionBadge condition={book.condition} size="small" />

        {book.featured && (
          <Chip
            label="หมวดแนะนำ"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              color: '#1976D2',
              height: 24,
            }}
          />
        )}
      </Box>

      {/* 2. Visually Dominant Title */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontWeight: 800,
          color: '#0F2D4A',
          fontSize: { xs: '1.65rem', sm: '2rem', md: '2.35rem' },
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        {book.title}
      </Typography>

      {/* 3. Author */}
      <Typography
        variant="subtitle1"
        sx={{
          color: '#627D98',
          fontSize: { xs: '0.95rem', sm: '1.05rem' },
          mb: 2.5,
        }}
      >
        ผู้เขียน:{' '}
        <Box component="strong" sx={{ color: '#102A43', fontWeight: 700 }}>
          {book.author}
        </Box>
      </Typography>

      <Divider sx={{ borderColor: '#F0F4F8', mb: 3 }} />

      {/* 4. Price Block (Current price is visually strongest) */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          bgcolor: '#F7F9FC',
          borderRadius: 2.5,
          border: '1px solid #D9E2EC',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
          {/* Primary Current Price */}
          <Typography
            variant="h3"
            component="span"
            sx={{
              fontWeight: 800,
              color: '#0F2D4A',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            ฿{book.price.toLocaleString()}
          </Typography>

          {/* Secondary: Original Price */}
          {book.originalPrice && book.originalPrice > book.price && (
            <Typography
              variant="body1"
              component="span"
              sx={{
                textDecoration: 'line-through',
                color: '#627D98',
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
              }}
            >
              ฿{book.originalPrice.toLocaleString()}
            </Typography>
          )}

          {/* Secondary: Discount Chip */}
          {discountPercent > 0 && (
            <Chip
              label={`ประหยัด ${discountPercent}%`}
              size="small"
              sx={{
                bgcolor: '#E8F5E9',
                color: '#2E7D5B',
                fontWeight: 800,
                fontSize: '0.75rem',
                height: 24,
                border: '1px solid rgba(46, 125, 91, 0.25)',
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#2E7D5B',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            mt: 0.75,
            fontSize: '0.8125rem',
          }}
        >
          <CheckIcon sx={{ fontSize: 16 }} />
          <span>ราคาพิเศษสำหรับหนังสือส่งต่อ ช่วยประหยัดเงินเพื่ออ่านเล่มถัดไป</span>
        </Typography>
      </Box>

      {/* Condition Description Alert if specified */}
      {book.conditionDescription && (
        <Alert
          severity="info"
          icon={false}
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: '#EBF3FA',
            border: '1px solid rgba(25, 118, 210, 0.15)',
            color: '#0F2D4A',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            <Box component="strong" sx={{ color: '#0F2D4A' }}>
              คำอธิบายสภาพ:
            </Box>{' '}
            {book.conditionDescription}
          </Typography>
          {book.defects && book.defects.length > 0 && (
            <Typography
              variant="caption"
              sx={{ display: 'block', color: '#627D98', mt: 0.5, fontSize: '0.8rem' }}
            >
              ตำหนิที่พบ: {book.defects.join(', ')}
            </Typography>
          )}
        </Alert>
      )}

      {/* Shipping and Stock status */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 3 },
          alignItems: 'center',
          mb: 3.5,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#2E7D5B' }}>
          <CheckIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
            มีสินค้าพร้อมส่ง ({book.stock} เล่ม)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#627D98' }}>
          <ShippingIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            จัดส่งด่วนโดยผู้ขาย
          </Typography>
        </Box>
      </Box>

      {/* 5. Purchase Actions: Desktop vs Mobile */}
      {/* DESKTOP ACTIONS: [ซื้อทันที] [เพิ่มลงตะกร้า] [♡] [Share] */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1.5,
          mb: 3.5,
        }}
      >
        {/* Primary CTA: ซื้อทันที */}
        <Button
          variant="contained"
          size="large"
          onClick={onBuyNow}
          aria-label={`ซื้อ ${book.title} ทันที`}
          sx={{
            flex: 1.2,
            py: 1.4,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: '#0F2D4A',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(15, 45, 74, 0.2)',
            '&:hover': {
              bgcolor: '#1976D2',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:focus-visible': {
              outline: '2px solid #1976D2',
              outlineOffset: '2px',
            },
            transition: 'all 0.2s ease',
          }}
        >
          ซื้อทันที
        </Button>

        {/* Secondary CTA: เพิ่มลงตะกร้า */}
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
              <CheckIcon sx={{ fontSize: 18, color: '#2E7D5B' }} />
            ) : (
              <CartIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            flex: 1,
            py: 1.4,
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 2,
            borderColor: addState === 'success' ? '#2E7D5B' : '#D9E2EC',
            color: addState === 'success' ? '#2E7D5B' : '#0F2D4A',
            bgcolor: addState === 'success' ? '#E8F5E9' : '#FFFFFF',
            '&:hover': {
              borderColor: '#1976D2',
              bgcolor: 'rgba(25, 118, 210, 0.04)',
              transform: 'translateY(-1px)',
            },
            '&:focus-visible': {
              outline: '2px solid #1976D2',
              outlineOffset: '2px',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {addState === 'loading'
            ? 'กำลังเพิ่ม...'
            : addState === 'success'
            ? 'เพิ่มแล้ว'
            : 'เพิ่มลงตะกร้า'}
        </Button>

        {/* Tertiary: Wishlist */}
        <Tooltip title={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}>
          <IconButton
            onClick={onToggleWishlist}
            aria-label={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              border: '1px solid #D9E2EC',
              color: isFavorite ? '#E1306C' : '#627D98',
              bgcolor: isFavorite ? 'rgba(225, 48, 108, 0.06)' : '#FFFFFF',
              borderColor: isFavorite ? 'rgba(225, 48, 108, 0.3)' : '#D9E2EC',
              '&:hover': {
                borderColor: '#E1306C',
                bgcolor: 'rgba(225, 48, 108, 0.08)',
                transform: 'scale(1.05)',
              },
              '&:focus-visible': {
                outline: '2px solid #1976D2',
                outlineOffset: '2px',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isFavorite ? <FavoriteIcon sx={{ fontSize: 22 }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
          </IconButton>
        </Tooltip>

        {/* Tertiary: Share */}
        <Tooltip title="แชร์หนังสือเล่มนี้">
          <IconButton
            onClick={onShare}
            aria-label="แชร์หนังสือ"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              border: '1px solid #D9E2EC',
              color: '#627D98',
              bgcolor: '#FFFFFF',
              '&:hover': {
                borderColor: '#1976D2',
                color: '#1976D2',
                transform: 'scale(1.05)',
              },
              '&:focus-visible': {
                outline: '2px solid #1976D2',
                outlineOffset: '2px',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ShareIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* MOBILE ACTIONS: [ซื้อทันที] \n [เพิ่มลงตะกร้า] \n [Wishlist] [Share] */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: 1.5,
          mb: 3.5,
        }}
      >
        {/* Row 1: ซื้อทันที (Full Width Primary) */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onBuyNow}
          aria-label={`ซื้อ ${book.title} ทันที`}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: '#0F2D4A',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(15, 45, 74, 0.2)',
            '&:hover': { bgcolor: '#1976D2' },
            '&:focus-visible': { outline: '2px solid #1976D2' },
          }}
        >
          ซื้อทันที
        </Button>

        {/* Row 2: เพิ่มลงตะกร้า (Full Width Secondary) */}
        <Button
          variant="outlined"
          fullWidth
          size="large"
          disabled={addState === 'loading'}
          onClick={handleAddClick}
          aria-label={`เพิ่ม ${book.title} ลงตะกร้า`}
          startIcon={
            addState === 'loading' ? (
              <CircularProgress size={16} color="inherit" />
            ) : addState === 'success' ? (
              <CheckIcon sx={{ fontSize: 18, color: '#2E7D5B' }} />
            ) : (
              <CartIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            py: 1.4,
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 2,
            borderColor: addState === 'success' ? '#2E7D5B' : '#D9E2EC',
            color: addState === 'success' ? '#2E7D5B' : '#0F2D4A',
            bgcolor: addState === 'success' ? '#E8F5E9' : '#FFFFFF',
            '&:focus-visible': { outline: '2px solid #1976D2' },
          }}
        >
          {addState === 'loading'
            ? 'กำลังเพิ่ม...'
            : addState === 'success'
            ? 'เพิ่มแล้ว'
            : 'เพิ่มลงตะกร้า'}
        </Button>

        {/* Row 3: [Wishlist] [Share] (Tertiary split 50/50) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onToggleWishlist}
            aria-label={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
            startIcon={
              isFavorite ? (
                <FavoriteIcon sx={{ color: '#E1306C' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: '#627D98' }} />
              )
            }
            sx={{
              py: 1.25,
              borderRadius: 2,
              borderColor: isFavorite ? 'rgba(225, 48, 108, 0.3)' : '#D9E2EC',
              color: isFavorite ? '#E1306C' : '#627D98',
              fontWeight: 600,
              fontSize: '0.875rem',
              bgcolor: isFavorite ? 'rgba(225, 48, 108, 0.05)' : '#FFFFFF',
              '&:focus-visible': { outline: '2px solid #1976D2' },
            }}
          >
            {isFavorite ? 'ถูกใจแล้ว' : 'รายการโปรด'}
          </Button>

          <Button
            variant="outlined"
            onClick={onShare}
            aria-label="แชร์หนังสือ"
            startIcon={<ShareIcon sx={{ color: '#627D98' }} />}
            sx={{
              py: 1.25,
              borderRadius: 2,
              borderColor: '#D9E2EC',
              color: '#627D98',
              fontWeight: 600,
              fontSize: '0.875rem',
              bgcolor: '#FFFFFF',
              '&:focus-visible': { outline: '2px solid #1976D2' },
            }}
          >
            แชร์หนังสือ
          </Button>
        </Box>
      </Box>

      {/* 6. Subtle Editorial Seller Story Quote Component */}
      {(book.sellerNote || book.story) && (
        <Box
          component="blockquote"
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: 2.5,
            bgcolor: '#F7F9FC',
            border: '1px solid #D9E2EC',
            borderLeft: '4px solid #1976D2',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <StoryIcon sx={{ fontSize: 18, color: '#1976D2' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#1976D2',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              ข้อความจากผู้ขาย
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              color: '#102A43',
              lineHeight: 1.65,
              fontSize: '0.9rem',
              mb: 1.5,
            }}
          >
            "{book.sellerNote || book.story}"
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={book.seller.avatar}
              alt={book.seller.name}
              sx={{ width: 22, height: 22 }}
            />
            <Typography variant="caption" sx={{ color: '#627D98', fontWeight: 600 }}>
              ส่งต่อโดย {book.seller.name}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
