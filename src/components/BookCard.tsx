import React from 'react';
import { Card, CardContent, Box, Typography, IconButton, Button, Tooltip } from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../data/books';
import { ConditionBadge } from './ConditionBadge';
import { PriceComparison } from './PriceComparison';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(book.id);

  const handleCardClick = () => {
    trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
    navigate(`/books/${book.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.25s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(16, 42, 67, 0.12)',
        },
      }}
      onClick={handleCardClick}
    >
      {/* Cover Image Container */}
      <Box sx={{ position: 'relative', width: '100%', pt: { xs: '26%', sm: '130%' }, overflow: 'hidden', bgcolor: '#F0F4F8' }}>
        <Box
          component="img"
          src={book.cover}
          alt={book.title}
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.04)',
            },
          }}
        />

        {/* Favorite Button on Image */}
        <Tooltip title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกในรายการโปรด'}>
          <IconButton
            size="small"
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: '#ffffff' },
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            {isFavorite ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Category Pill on Image */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'rgba(16, 42, 67, 0.85)',
            color: '#ffffff',
            px: 1.2,
            py: 0.3,
            borderRadius: 1,
            fontSize: '0.72rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}
        >
          {book.category}
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Condition Tag */}
        <Box sx={{ mb: 1 }}>
          <ConditionBadge condition={book.condition} size="small" />
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.3,
            height: '2.6em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'primary.main',
            mb: 0.5,
          }}
          title={book.title}
        >
          {book.title}
        </Typography>

        {/* Author */}
        <Typography variant="body2" noWrap sx={{ color: 'text.secondary', mb: 1 }}>
          {book.author}
        </Typography>

        {/* Rating and Reviews */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {book.rating}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({book.reviewCount})
          </Typography>
          <Box sx={{ mx: 0.5, color: 'divider' }}>•</Box>
          <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
            {book.seller.name}
          </Typography>
        </Box>

        {/* Price Section */}
        <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ mb: 1.5 }}>
            <PriceComparison price={book.price} originalPrice={book.originalPrice} size="small" />
          </Box>

          {/* Action Button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="small"
            startIcon={<CartIcon fontSize="small" />}
            onClick={handleAddToCart}
            sx={{
              py: 0.75,
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: 1.5,
              '&:hover': {
                bgcolor: 'primary.main',
                color: '#ffffff',
              },
            }}
          >
            เพิ่มลงตะกร้า
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
