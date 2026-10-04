import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Book } from '../../data/books';
import { SafeImage } from '../common/SafeImage';
import { trackEvent } from '../../utils/analytics';

interface RelatedBooksSectionProps {
  relatedBooks: Book[];
}

/**
 * RelatedBooksSection — 3-column editorial recommendations.
 * Compact cards: thin border, minimal radius, cover-first,
 * hover lift 180ms. Covers share a consistent 3:4 ratio.
 */
export const RelatedBooksSection: React.FC<RelatedBooksSectionProps> = ({ relatedBooks }) => {
  const navigate = useNavigate();

  if (relatedBooks.length === 0) return null;

  const openBook = (book: Book) => {
    trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
    navigate(`/books/${book.id}`);
  };

  return (
    <Box component="section" aria-label="หนังสือที่คุณอาจสนใจ">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 3 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: '#102A43',
            fontSize: { xs: '1.375rem', md: '1.75rem' },
            letterSpacing: '-0.01em',
          }}
        >
          หนังสือที่คุณอาจสนใจ
        </Typography>
        <Typography
          component="button"
          type="button"
          onClick={() => navigate('/books')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#1976D2',
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            p: 1,
            '&:hover': { textDecoration: 'underline' },
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px', borderRadius: '6px' },
          }}
        >
          ดูทั้งหมด <ArrowRight size={16} aria-hidden />
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
        }}
      >
        {relatedBooks.map((relBook) => {
          const discount =
            relBook.originalPrice && relBook.originalPrice > relBook.price
              ? Math.round(((relBook.originalPrice - relBook.price) / relBook.originalPrice) * 100)
              : 0;
          return (
            <Box
              key={relBook.id}
              role="article"
              tabIndex={0}
              aria-label={`${relBook.title} ราคา ${relBook.price} บาท`}
              onClick={() => openBook(relBook)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openBook(relBook);
              }}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #D9E2EC',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 12px rgba(15,53,87,0.06)',
                },
                '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
              }}
            >
              <Box sx={{ aspectRatio: '3 / 4', bgcolor: '#FFFFFF', p: 2 }}>
                <SafeImage
                  src={relBook.cover}
                  alt={`ปกหนังสือ ${relBook.title}`}
                  fallbackTitle={relBook.title}
                  objectFit="contain"
                  loading="lazy"
                  sx={{ width: '100%', height: '100%' }}
                />
              </Box>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 0.75, flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#102A43',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.5em',
                  }}
                >
                  {relBook.title}
                </Typography>
                <Typography sx={{ color: '#62748A', fontSize: '0.78rem' }} noWrap>
                  {relBook.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Rating
                    value={relBook.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                    aria-label={`คะแนน ${relBook.rating} จาก 5`}
                    sx={{ color: '#F5A623', fontSize: '0.9rem', '& .MuiRating-iconEmpty': { color: '#D9E2EC' } }}
                  />
                  <Typography sx={{ color: '#62748A', fontSize: '0.75rem' }}>
                    {relBook.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 'auto', pt: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.05rem' }}>
                    ฿{relBook.price.toLocaleString()}
                  </Typography>
                  {relBook.originalPrice && relBook.originalPrice > relBook.price && (
                    <Typography sx={{ color: '#62748A', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                      ฿{relBook.originalPrice.toLocaleString()}
                    </Typography>
                  )}
                  {discount > 0 && (
                    <Typography sx={{ color: '#D64545', fontSize: '0.75rem', fontWeight: 800 }}>
                      -{discount}%
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
