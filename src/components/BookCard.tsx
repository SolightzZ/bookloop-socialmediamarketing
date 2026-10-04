import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book } from '../data/books';
import { SafeImage } from './common/SafeImage';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { LoginRequiredDialog } from './auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../types/authGate';
import { trackEvent } from '../utils/analytics';
import { formatCurrency, calculateDiscount } from '../utils/formatCurrency';

export interface BookCardProps {
  book: Book;
  priority?: boolean;
}

const conditionConfig: Record<string, { label: string; bg: string; color: string }> = {
  'Excellent': { label: 'เหมือนใหม่', bg: '#DCFCE7', color: '#15803D' },
  'Very Good': { label: 'สภาพดี', bg: '#E0F2FE', color: '#0369A1' },
  'Good': { label: 'พอใช้', bg: '#FEF3C7', color: '#B45309' },
  'Acceptable': { label: 'มีตำหนิ', bg: '#FFEDD5', color: '#C2410C' },
};

export const BookCard: React.FC<BookCardProps> = ({ book, priority = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [cartState, setCartState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isFavorite = isInWishlist(book.id);

  const { percentage } = calculateDiscount(book.price, book.originalPrice);
  const conditionMeta = conditionConfig[book.condition] || {
    label: book.condition,
    bg: '#F1F5F9',
    color: '#475569',
  };

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
      }, 1200);
    }, 250);
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
          bgcolor: '#FFFFFF',
          border: '1px solid #E5EAF0',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(15, 47, 82, 0.04)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
          '&:hover': {
            '@media (hover: hover)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(15, 47, 82, 0.08)',
              borderColor: '#CBD5E1',
            },
          },
          '&:focus-visible': {
            outline: '2px solid #1976D2',
            outlineOffset: '2px',
          },
        }}
      >
        {/* Book Image Container (Aspect Ratio 2:3) */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '2 / 3',
            bgcolor: '#F1F5F9',
            overflow: 'hidden',
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
              transition: 'transform 0.2s ease',
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              },
            }}
          />

          {/* Out of Stock Overlay */}
          {book.stock === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(15, 23, 42, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  bgcolor: '#0F2F52',
                  color: '#FFFFFF',
                  px: 1.25,
                  py: 0.4,
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                }}
              >
                ขายแล้ว
              </Typography>
            </Box>
          )}

          {/* Favorite Heart Button (Top-Right of Image) */}
          <IconButton
            size="small"
            aria-label={isFavorite ? `นำ ${book.title} ออกจากรายการโปรด` : `เพิ่ม ${book.title} ในรายการโปรด`}
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              bgcolor: 'rgba(255, 255, 255, 0.92)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              p: 0,
              zIndex: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'scale(1.06)',
              },
              '&:focus-visible': {
                outline: '2px solid #1976D2',
              },
            }}
          >
            <Heart
              size={17}
              color={isFavorite ? '#EF4444' : '#64748B'}
              fill={isFavorite ? '#EF4444' : 'none'}
              strokeWidth={2}
            />
          </IconButton>
        </Box>

        {/* Card Content Area */}
        <CardContent
          sx={{
            p: { xs: 1.25, sm: 1.5 },
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            '&:last-child': { pb: { xs: 1.25, sm: 1.5 } },
          }}
        >
          {/* Condition Badge & Rating Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 0.75,
            }}
          >
            <Box
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: conditionMeta.color,
                bgcolor: conditionMeta.bg,
                px: 0.85,
                py: 0.2,
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                letterSpacing: '0.01em',
              }}
            >
              {conditionMeta.label}
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35 }}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#0F2F52',
                }}
              >
                {book.rating}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.7rem',
                }}
              >
                ({book.reviewCount})
              </Typography>
            </Box>
          </Box>

          {/* Book Title (Max 2 lines) */}
          <Typography
            variant="subtitle2"
            component="h2"
            title={book.title}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              lineHeight: 1.35,
              color: '#0F2F52',
              mb: 0.35,
              height: '2.7em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {book.title}
          </Typography>

          {/* Author (1 line with ellipsis) */}
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: '#64748B',
              fontSize: '0.78rem',
              mb: 1.25,
              display: 'block',
            }}
          >
            {book.author}
          </Typography>

          {/* Price Row (Aligned at bottom) */}
          <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid #F1F5F9' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: 0.75,
                mb: 1.25,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: '#0F2F52',
                  lineHeight: 1.2,
                }}
              >
                {formatCurrency(book.price)}
              </Typography>

              {book.originalPrice && book.originalPrice > book.price && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      color: '#94A3B8',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatCurrency(book.originalPrice)}
                  </Typography>

                  {percentage > 0 && (
                    <Box
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#DC2626',
                        bgcolor: '#FEE2E2',
                        px: 0.6,
                        py: 0.15,
                        borderRadius: '4px',
                      }}
                    >
                      -{percentage}%
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* Add to Cart CTA */}
            <Button
              variant="contained"
              fullWidth
              size="small"
              disabled={cartState === 'loading' || book.stock === 0}
              onClick={handleAddToCart}
              aria-label={`เพิ่ม ${book.title} ลงในตะกร้า`}
              startIcon={
                cartState === 'loading' ? (
                  <CircularProgress size={14} color="inherit" />
                ) : cartState === 'success' ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <ShoppingCart size={15} strokeWidth={2} />
                )
              }
              sx={{
                height: 38,
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.825rem' },
                borderRadius: '8px',
                bgcolor: cartState === 'success' ? '#16A34A' : '#1976D2',
                color: '#FFFFFF',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: cartState === 'success' ? '#15803D' : '#1565C0',
                  boxShadow: 'none',
                },
              }}
            >
              {book.stock === 0
                ? 'สินค้าหมด'
                : cartState === 'loading'
                ? 'กำลังเพิ่ม...'
                : cartState === 'success'
                ? 'เพิ่มแล้ว'
                : 'เพิ่มลงตะกร้า'}
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
