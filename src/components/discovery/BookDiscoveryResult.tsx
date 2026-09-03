import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Rating,
  Chip,
} from '@mui/material';
import {
  FavoriteRounded,
  FavoriteBorderRounded,
  ShoppingCartOutlined,
  CheckRounded,
  ArrowForwardRounded,
  RefreshRounded,
  AutoAwesomeRounded,
  StarRounded,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookDiscoveryResultProps } from './bookDiscovery.types';
import { SafeImage } from '../common/SafeImage';
import { ConditionBadge } from '../ConditionBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequiredDialog } from '../auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../../types/authGate';
import { trackEvent } from '../../utils/analytics';

export const BookDiscoveryResult: React.FC<BookDiscoveryResultProps> = ({
  book,
  onRollAgain,
  isReducedMotion = false,
  className = '',
  mood,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [cartState, setCartState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isFavorite = isInWishlist(book.id);

  const handleViewDetails = () => {
    trackEvent('view_product', {
      bookId: book.id,
      title: book.title,
      price: book.price,
      source: 'discovery_playground',
      mood: mood || 'surprise',
    });
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
    trackEvent('add_to_cart', {
      bookId: book.id,
      title: book.title,
      price: book.price,
      source: 'discovery_playground',
    });

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

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: { xs: 'calc(100% - 32px)', sm: '100%' },
          maxWidth: '580px', // Target 520–640px
          mx: 'auto',
          borderRadius: 3.5,
          border: '1.5px solid #CBD5E1',
          bgcolor: '#FFFFFF',
          p: { xs: 2, sm: 2.5 },
          boxShadow: '0 4px 16px rgba(15, 45, 74, 0.08)', // Clean subtle shadow, NO GLOW
          transform: isReducedMotion ? 'none' : 'translateY(0) scale(1)',
          opacity: 1,
          animation: isReducedMotion ? 'none' : 'cleanSpringReveal 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          '@keyframes cleanSpringReveal': {
            '0%': {
              opacity: 0,
              transform: 'translateY(16px) scale(0.92)',
            },
            '70%': {
              opacity: 1,
              transform: 'translateY(-3px) scale(1.02)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
        className={`relative select-none ${className}`}
      >
        {/* Header Tag */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <AutoAwesomeRounded sx={{ fontSize: 16, color: '#D97706' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#B45309',
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
              }}
            >
              หนังสือที่ BookLoop เลือกให้คุณ
            </Typography>
          </Box>

          <Tooltip title={isFavorite ? 'นำออกจากที่บันทึกไว้' : 'บันทึกเข้า Wishlist'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(book);
              }}
              aria-label={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
              size="small"
              sx={{
                p: 0.5,
                color: isFavorite ? '#EF4444' : '#64748B',
              }}
            >
              {isFavorite ? <FavoriteRounded fontSize="small" /> : <FavoriteBorderRounded fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Compact Content: Cover + Info */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '85px 1fr', sm: '95px 1fr' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* Cover */}
          <Box
            onClick={handleViewDetails}
            sx={{
              width: { xs: 85, sm: 95 },
              aspectRatio: '3 / 4',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 45, 74, 0.1)',
            }}
          >
            <SafeImage
              src={book.cover}
              alt={book.title}
              fallbackTitle={book.title}
              objectFit="cover"
              loading="eager"
              fetchPriority="high"
            />
          </Box>

          {/* Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Chip
                label={book.category}
                size="small"
                sx={{
                  bgcolor: '#EAF4FF',
                  color: '#1976D2',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
              <ConditionBadge condition={book.condition} size="small" />
            </Box>

            <Typography
              variant="subtitle1"
              onClick={handleViewDetails}
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                color: '#0F2D4A',
                lineHeight: 1.3,
                cursor: 'pointer',
                '&:hover': { color: '#1976D2' },
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {book.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.8rem' }}
            >
              โดย {book.author}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.2 }}>
              <Rating
                value={book.rating}
                precision={0.1}
                size="small"
                readOnly
                icon={<StarRounded fontSize="inherit" sx={{ color: '#F59E0B' }} />}
                emptyIcon={<StarRounded fontSize="inherit" sx={{ opacity: 0.3 }} />}
                sx={{ fontSize: '0.95rem' }}
              />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.75rem' }}>
                {book.rating.toFixed(1)}
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: '#1976D2', fontSize: '1.1rem', mt: 0.2 }}
            >
              {formatCurrency(book.price)}
            </Typography>

            {/* Short Recommendation Quote */}
            <Typography
              variant="caption"
              sx={{
                color: '#475569',
                display: 'block',
                fontSize: '0.75rem',
                lineHeight: 1.4,
                bgcolor: '#F8FAFC',
                px: 1,
                py: 0.4,
                borderRadius: 1,
                borderLeft: '2px solid #1976D2',
              }}
            >
              {book.story ? book.story.slice(0, 60) + '...' : 'เรื่องราวทรงคุณค่าที่พร้อมส่งต่อให้คุณ'}
            </Typography>
          </Box>
        </Box>

        {/* Action Toolbar */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 1fr' },
            gap: 1,
            mt: 2,
            pt: 1.5,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {/* Primary: View Details */}
          <Button
            variant="contained"
            onClick={handleViewDetails}
            endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
            sx={{
              height: 38,
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1565C0',
              },
            }}
          >
            ดูรายละเอียด
          </Button>

          {/* Add to Cart (Subject to Auth Gate) */}
          <Button
            variant="outlined"
            onClick={handleAddToCart}
            disabled={cartState === 'loading'}
            startIcon={
              cartState === 'success' ? (
                <CheckRounded sx={{ color: '#16A34A', fontSize: 16 }} />
              ) : (
                <ShoppingCartOutlined sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              height: 38,
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: 2,
              textTransform: 'none',
              color: cartState === 'success' ? '#16A34A' : '#0F2D4A',
              borderColor: cartState === 'success' ? '#86EFAC' : '#CBD5E1',
              bgcolor: cartState === 'success' ? '#DCFCE7' : 'transparent',
              '&:hover': {
                borderColor: '#0F2D4A',
                bgcolor: '#F8FAFC',
              },
            }}
          >
            {cartState === 'success' ? 'เพิ่มแล้ว' : 'เพิ่มลงตะกร้า'}
          </Button>

          {/* Secondary: Roll Again */}
          <Button
            variant="text"
            onClick={onRollAgain}
            startIcon={<RefreshRounded sx={{ fontSize: 16 }} />}
            sx={{
              height: 38,
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: 2,
              textTransform: 'none',
              color: '#64748B',
              '&:hover': {
                color: '#1976D2',
                bgcolor: '#EAF4FF',
              },
            }}
          >
            สุ่มอีกครั้ง
          </Button>
        </Box>
      </Card>

      {/* Login Gate Dialog */}
      <LoginRequiredDialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleModalLogin}
        mode="add-to-cart"
        customMessage="กรุณาเข้าสู่ระบบเพื่อเพิ่มหนังสือเล่มที่สุ่มได้ลงในตะกร้า"
      />
    </>
  );
};
