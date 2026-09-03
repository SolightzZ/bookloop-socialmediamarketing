import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCartOutlined as CartIcon,
  Check as CheckIcon,
  Star as StarIcon,
  PersonOutlineRounded,
  StorefrontOutlined,
  AutoStoriesRounded,
  ShareOutlined,
  BlockOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book } from '../data/books';
import { ConditionBadge } from './ConditionBadge';
import { PriceComparison } from './PriceComparison';
import { SafeImage } from './common/SafeImage';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { LoginRequiredDialog } from './auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../types/authGate';
import { trackEvent } from '../utils/analytics';
import { showToast } from '../utils/alerts';

export interface BookCardProps {
  book: Book;
  priority?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, priority = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [cartState, setCartState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isFavorite = isInWishlist(book.id);

  const handleCardClick = () => {
    trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
    navigate(`/books/${book.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      const action: PendingAction = { type: 'add-to-cart', bookId: book.id };
      savePendingAction(action);
      setLoginModalOpen(true);
      return;
    }

    if (cartState === 'loading') return;

    addToCart(book);
    setCartState('loading');

    setTimeout(() => {
      setCartState('success');
      setTimeout(() => {
        setCartState('idle');
      }, 1400);
    }, 280);
  };

  const handleModalLogin = () => {
    const action: PendingAction = { type: 'add-to-cart', bookId: book.id };
    savePendingAction(action);
    setLoginModalOpen(false);
    navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, {
      state: {
        from: location.pathname + location.search,
        pendingAction: action,
      },
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: book.title,
      text: `${book.title} โดย ${book.author}`,
      url: `${window.location.origin}/books/${book.id}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {/* user cancelled */});
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        showToast('คัดลอกลิงก์แล้ว', undefined, 'success');
      }).catch(() => {
        showToast('ไม่สามารถคัดลอกได้', undefined, 'error');
      });
    }
  };

  return (
    <>
      <Card
      tabIndex={0}
      role="article"
      aria-label={`${book.title} โดย ${book.author} ราคา ${book.price} บาท`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleCardClick();
        }
      }}
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s cubic-bezier(0.2, 0, 0, 1), border-color 0.25s ease',
        boxShadow: '0 2px 8px rgba(15, 41, 66, 0.04)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(15, 41, 66, 0.1)',
          borderColor: '#CBD5E1',
        },
        '&:focus-visible': {
          outline: '2px solid #1565C0',
          outlineOffset: '2px',
        },
      }}
    >
      {/* 3:4 PORTRAIT BOOK COVER CONTAINER */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          pt: '133.33%', // 3:4 Aspect Ratio
          bgcolor: '#F8FAFC',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <SafeImage
            src={book.cover}
            alt={`ปกหนังสือ ${book.title}`}
            fallbackTitle={book.title}
            objectFit="cover"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sx={{
              width: '100%',
              height: '100%',
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          />
        </Box>

        {/* Sold / Out-of-stock overlay */}
        {book.stock === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(15, 41, 66, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: '#0F2942',
                color: '#FFFFFF',
                px: 1.5,
                py: 0.6,
                borderRadius: 2,
                fontWeight: 800,
                fontSize: '0.8125rem',
                letterSpacing: '0.02em',
              }}
            >
              <BlockOutlined sx={{ fontSize: 16 }} />
              ขายแล้ว
            </Box>
          </Box>
        )}

        {/* Category Pill - Clean & Modern */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor: '#0F2942',
            color: '#FFFFFF',
            px: 1,
            py: 0.35,
            borderRadius: 1.5,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <AutoStoriesRounded sx={{ fontSize: 13, color: '#38BDF8' }} />
          {book.category}
        </Box>

        {/* Share Icon Button - top-left */}
        <Tooltip title="แชร์">
          <IconButton
            size="small"
            aria-label={`แชร์ ${book.title}`}
            onClick={handleShare}
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              p: 0.75,
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              zIndex: 2,
              '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'scale(1.08)',
              },
              '&:focus-visible': {
                outline: '2px solid #1565C0',
              },
            }}
          >
            <ShareOutlined sx={{ fontSize: 18, color: '#486581' }} />
          </IconButton>
        </Tooltip>

        {/* Wishlist Icon Button - top-right */}
        <Tooltip title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกในรายการโปรด'}>
          <IconButton
            size="small"
            aria-label={isFavorite ? `นำ ${book.title} ออกจากรายการโปรด` : `บันทึก ${book.title} ในรายการโปรด`}
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              p: 0.75,
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              zIndex: 2,
              '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'scale(1.08)',
              },
              '&:focus-visible': {
                outline: '2px solid #1565C0',
              },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" sx={{ fontSize: 18 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 18, color: '#486581' }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* CARD CONTENT */}
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          '&:last-child': { pb: { xs: 1.5, sm: 2 } },
        }}
      >
        {/* Condition + Rating Line */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            gap: 1,
          }}
        >
          <ConditionBadge condition={book.condition} size="small" />

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <StarIcon sx={{ fontSize: 15, color: '#F59E0B' }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F2942' }}
            >
              {book.rating}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
            >
              ({book.reviewCount})
            </Typography>
          </Box>
        </Box>

        {/* Priority 1: Title */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.35,
            height: '2.7em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#0F2942',
            mb: 0.5,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            letterSpacing: '-0.01em',
          }}
          title={book.title}
        >
          {book.title}
        </Typography>

        {/* Secondary: Author & Seller (Easy to read & clear) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0, flexShrink: 1 }}>
            <PersonOutlineRounded sx={{ fontSize: 13, color: '#94A3B8' }} />
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: '#475569',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              {book.author}
            </Typography>
          </Box>
          <Box component="span" sx={{ color: '#CBD5E1', flexShrink: 0 }}>•</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0, flexShrink: 1 }}>
            <StorefrontOutlined sx={{ fontSize: 13, color: '#94A3B8' }} />
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: '#64748B',
                fontSize: '0.75rem',
              }}
            >
              {book.seller.name}
            </Typography>
          </Box>
        </Box>

        {/* Priority 2: Price Section & Add to Cart (Aligned at bottom) */}
        <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
          <Box sx={{ mb: 1.5 }}>
            <PriceComparison price={book.price} originalPrice={book.originalPrice} size="small" />
          </Box>

          <Button
            variant={cartState === 'success' ? 'contained' : 'outlined'}
            color={cartState === 'success' ? 'success' : 'primary'}
            fullWidth
            size="small"
            disabled={cartState === 'loading'}
            startIcon={
              cartState === 'loading' ? (
                <CircularProgress size={14} color="inherit" />
              ) : cartState === 'success' ? (
                <CheckIcon fontSize="small" />
              ) : (
                <CartIcon fontSize="small" />
              )
            }
            onClick={handleAddToCart}
            aria-label={`เพิ่ม ${book.title} ลงในตะกร้า`}
            sx={{
              py: { xs: 0.65, sm: 0.85 },
              fontWeight: 700,
              fontSize: { xs: '0.78rem', sm: '0.825rem' },
              borderRadius: 2,
              transition: 'all 0.2s ease',
              ...(cartState === 'success'
                ? {
                    bgcolor: '#2E7D5B',
                    color: '#FFFFFF',
                    borderColor: '#2E7D5B',
                  }
                : {
                    borderColor: '#D9E2EC',
                    color: '#0F2942',
                    '&:hover': {
                      bgcolor: '#0F2942',
                      color: '#FFFFFF',
                      borderColor: '#0F2942',
                    },
                  }),
            }}
          >
            {cartState === 'loading' ? 'กำลังเพิ่ม...' : cartState === 'success' ? 'เพิ่มแล้ว' : 'เพิ่มลงตะกร้า'}
          </Button>
        </Box>
      </CardContent>
    </Card>

    {/* Authentication Gate Dialog */}
    <LoginRequiredDialog
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onLogin={handleModalLogin}
      mode="add-to-cart"
    />
  </>
);
};
