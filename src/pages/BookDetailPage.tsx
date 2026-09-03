import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { books } from '../data/books';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { SellerCard } from '../components/SellerCard';
import { ReviewList } from '../components/ReviewList';
import { showConfirm, showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { BookGallery } from '../components/bookdetail/BookGallery';
import { BookPurchaseBox } from '../components/bookdetail/BookPurchaseBox';
import { BookStoryCard } from '../components/bookdetail/BookStoryCard';
import { BookSpecsTable } from '../components/bookdetail/BookSpecsTable';
import { RelatedBooksSection } from '../components/bookdetail/RelatedBooksSection';

import { useAuth } from '../hooks/useAuth';
import { LoginRequiredDialog } from '../components/auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../types/authGate';
import { ErrorState } from '../components/common/ErrorState';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { PriceAlertButton } from '../components/bookdetail/PriceAlertButton';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { trackView } = useRecentlyViewed();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authGateMode, setAuthGateMode] = useState<'add-to-cart' | 'buy-now'>('add-to-cart');

  const book = books.find((b) => b.id === id);
  const [selectedImg, setSelectedImg] = useState<string>(book?.images?.[0] || book?.cover || '');

  useEffect(() => {
    if (book) {
      setSelectedImg(book.images?.[0] || book.cover);
      window.scrollTo(0, 0);
      trackEvent('view_product', {
        bookId: book.id,
        title: book.title,
        price: book.price,
      });
    }
  }, [book, id]);

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3 } }}>
        <ErrorState
          title="ไม่พบหนังสือที่คุณต้องการ"
          description="หนังสือเล่มนี้อาจถูกส่งต่อไปยังเจ้าของใหม่แล้ว หรือรหัสหนังสือไม่ถูกต้องในระบบ"
          actionText="ลองค้นหาใหม่"
          onRetry={() => navigate('/books')}
          secondaryAction={
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2, px: 3, fontWeight: 700, borderColor: '#CBD5E1', color: '#0F2D4A' }}
            >
              กลับสู่หน้าหลัก
            </Button>
          }
        />
      </Container>
    );
  }

  const isFavorite = isInWishlist(book.id);

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleBuyNow = () => {
    trackEvent('begin_checkout', { bookId: book.id, title: book.title, price: book.price });
    addToCart(book);
    navigate('/checkout');
  };

  const handleModalLogin = () => {
    const action: PendingAction = { type: authGateMode, bookId: book.id };
    savePendingAction(action);
    setLoginModalOpen(false);
    navigate(`/login?redirect=${encodeURIComponent(`/books/${book.id}`)}`, {
      state: {
        from: `/books/${book.id}`,
        pendingAction: action,
      },
    });
  };

  const handleShare = () => {
    trackEvent('share_product', { bookId: book.id, title: book.title });
    if (navigator.share) {
      navigator
        .share({
          title: `${book.title} - BookLoop`,
          text: `พบหนังสือ "${book.title}" สภาพ ${book.condition} ราคา ฿${book.price} บน BookLoop`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('คัดลอกลิงก์สำเร็จ', 'คุณสามารถนำลิงก์ไปส่งต่อให้เพื่อนได้เลย');
    }
  };

  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.category === book.category || b.seller.id === book.seller.id))
    .slice(0, 3);

  return (
    <Box sx={{ py: { xs: 3, sm: 4, md: 6 }, bgcolor: '#F7F9FC', minHeight: '100vh', overflowX: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumb: Desktop & Mobile intelligent truncation */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            '& .MuiBreadcrumbs-separator': {
              color: '#CBD5E1',
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ color: '#627D98', '&:hover': { color: '#1976D2' } }}
          >
            หน้าหลัก
          </Link>
          <Link
            component={RouterLink}
            to="/books"
            underline="hover"
            sx={{ color: '#627D98', '&:hover': { color: '#1976D2' } }}
          >
            หนังสือทั้งหมด
          </Link>
          <Link
            component={RouterLink}
            to={`/books?category=${encodeURIComponent(book.category)}`}
            underline="hover"
            sx={{ color: '#627D98', '&:hover': { color: '#1976D2' } }}
          >
            {book.category}
          </Link>
          <Typography
            component="span"
            sx={{
              color: '#0F2D4A',
              fontWeight: 700,
              maxWidth: { xs: 130, sm: 240, md: 380, lg: 500 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              verticalAlign: 'bottom',
            }}
          >
            {book.title}
          </Typography>
        </Breadcrumbs>

        {/* Main Product Section: Gallery (Left) | Product Info (Right) */}
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 5 }} sx={{ mb: { xs: 4, md: 8 } }}>
          {/* Left: Images Gallery */}
          <Grid size={{ xs: 12, md: 5 }}>
            <BookGallery
              title={book.title}
              images={book.images}
              selectedImg={selectedImg}
              onSelectImage={setSelectedImg}
            />
          </Grid>

          {/* Right: Book Details & Actions */}
          <Grid size={{ xs: 12, md: 7 }}>
            <BookPurchaseBox
              book={book}
              isFavorite={isFavorite}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onToggleWishlist={() => {
                toggleWishlist(book);
                trackEvent('favorite_book', { bookId: book.id, isFavorite: !isFavorite });
              }}
              onShare={handleShare}
            />
          </Grid>
        </Grid>

        {/* Story of the Book section */}
        {book.story && (
          <BookStoryCard story={book.story} sellerName={book.seller.name} />
        )}

        {/* Specifications & Seller Section */}
        <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ mb: { xs: 4, md: 8 } }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <BookSpecsTable book={book} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <SellerCard seller={book.seller} />
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 8, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF', boxShadow: '0 2px 10px rgba(15, 45, 74, 0.03)' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 3 }}>
            รีวิวจากผู้อ่านและผู้ซื้อในชุมชน
          </Typography>
          <ReviewList
            reviews={book.reviews}
            overallRating={book.rating}
            totalReviews={book.reviewCount}
            bookTitle={book.title}
          />
        </Paper>

        {/* Related Books */}
        <RelatedBooksSection relatedBooks={relatedBooks} />
      </Container>

      {/* Mandatory Authentication Gate Modal */}
      <LoginRequiredDialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleModalLogin}
        mode={authGateMode}
      />
    </Box>
  );
}
