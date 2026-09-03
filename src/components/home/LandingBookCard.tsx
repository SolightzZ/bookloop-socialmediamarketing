import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';
import { SafeImage } from '../common/SafeImage';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';

export interface LandingBookCardProps {
  book: Book;
}

/**
 * Editorial Lightweight Product Card for the Landing Page.
 * Displays only: Image, Category, Condition, Title, Rating, Price, and Wishlist.
 * Excludes dense catalog metadata (seller avatars, heavy add-to-cart buttons) to keep the landing page airy.
 */
export const LandingBookCard: React.FC<LandingBookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(book.id);

  const handleCardClick = () => {
    trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
    navigate(`/books/${book.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <Card
      tabIndex={0}
      role="article"
      aria-label={`${book.title} ราคา ${book.price} บาท สภาพ ${book.condition}`}
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
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        boxShadow: '0 2px 8px rgba(15, 45, 74, 0.04)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 24px rgba(15, 45, 74, 0.08)',
          borderColor: '#CBD5E1',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
      }}
    >
      {/* 3:4 Portrait Book Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          pt: '133.33%', // 3:4 Aspect Ratio
          bgcolor: '#F7F9FC',
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
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              transition: 'transform 300ms ease',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          />
        </Box>

        {/* Category Pill */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor: '#0F2D4A',
            color: '#FFFFFF',
            px: 1,
            py: 0.35,
            borderRadius: 1.5,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          {book.category}
        </Box>

        {/* Wishlist Button: Outline -> Filled with smooth hover */}
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
              transition: 'transform 150ms ease, background-color 150ms ease',
              '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'scale(1.08)',
              },
              '&:focus-visible': {
                outline: '2px solid #1976D2',
              },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" sx={{ fontSize: 18 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 18, color: '#627D98' }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Card Body */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, sm: 2.25 },
          '&:last-child': { pb: { xs: 1.5, sm: 2.25 } },
        }}
      >
        {/* Condition + Rating */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <ConditionBadge condition={book.condition} size="small" />

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <StarIcon sx={{ fontSize: 15, color: '#F59E0B' }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#102A43' }}
            >
              {book.rating}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
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
            color: '#0F2D4A',
            mb: 1.5,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            letterSpacing: '-0.01em',
          }}
          title={book.title}
        >
          {book.title}
        </Typography>

        {/* Price Row (Clean, uncluttered, bottom-aligned) */}
        <Box
          sx={{
            mt: 'auto',
            pt: 1.25,
            borderTop: '1px solid #F0F4F8',
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 800,
              color: '#0F2D4A',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              lineHeight: 1,
            }}
          >
            ฿{book.price.toLocaleString()}
          </Typography>

          {book.originalPrice && book.originalPrice > book.price && (
            <Typography
              variant="caption"
              component="span"
              sx={{
                color: '#627D98',
                textDecoration: 'line-through',
                fontSize: '0.8rem',
              }}
            >
              ฿{book.originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
