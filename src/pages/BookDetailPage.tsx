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
} from '@mui/material';
import { books, Book } from '../data/books';
import { listingService } from '../services/listingService';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { SellerCard } from '../components/SellerCard';
import { ReviewList } from '../components/ReviewList';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { logWarn } from '../utils/logger';
import { BookGallery } from '../components/bookdetail/BookGallery';
import { BookPurchaseBox } from '../components/bookdetail/BookPurchaseBox';
import { BookStoryCard } from '../components/bookdetail/BookStoryCard';
import { BookSpecsTable } from '../components/bookdetail/BookSpecsTable';
import { ConditionStrip } from '../components/bookdetail/ConditionStrip';
import { MobilePurchaseBar } from '../components/bookdetail/MobilePurchaseBar';
import { RelatedBooksSection } from '../components/bookdetail/RelatedBooksSection';

import { useAuth } from '../hooks/useAuth';
import { LoginRequiredDialog } from '../components/auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../types/authGate';
import { ErrorState } from '../components/common/ErrorState';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { trackView } = useRecentlyViewed();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authGateMode, setAuthGateMode] = useState<'add-to-cart' | 'buy-now'>('add-to-cart');

  const [book, setBook] = useState<Book | null>(() => books.find((b) => b.id === id) || null);
  const [selectedImg, setSelectedImg] = useState<string>(book?.images?.[0] || book?.cover || '');
  const [isLoading, setIsLoading] = useState<boolean>(!book && !!id);

  useEffect(() => {
    const staticBook = books.find((b) => b.id === id);
    if (staticBook) {
      setBook(staticBook);
      setIsLoading(false);
      return;
    }

    if (id) {
      setIsLoading(true);
      listingService.getListingById(id).then((found) => {
        setBook(found);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

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
  }, [book]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography sx={{ color: '#64748B' }}>กำลังโหลดข้อมูลหนังสือ…</Typography>
      </Container>
    );
  }

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
    if (!user) {
      setAuthGateMode('add-to-cart');
      setLoginModalOpen(true);
      return;
    }
    addToCart(book);
  };

  const handleBuyNow = () => {
    if (!user) {
      setAuthGateMode('buy-now');
      setLoginModalOpen(true);
      return;
    }
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
      navigator.clipboard
        .writeText(window.location.href)
        .catch((e) => logWarn('handleShare: clipboard copy failed', e));
      showSuccess('คัดลอกลิงก์สำเร็จ', 'คุณสามารถนำลิงก์ไปส่งต่อให้เพื่อนได้เลย');
    }
  };

  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.category === book.category || b.seller.id === book.seller.id))
    .slice(0, 3);

  return (
    <Box
      sx={{
        py: { xs: 2.5, md: 4 },
        pb: { xs: 4, md: 8 },
        bgcolor: '#F5F7FA',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumb — plain, quiet, no card */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            py: { xs: 1.5, md: 2 },
            mb: { xs: 2, md: 3 },
            fontSize: '0.8125rem',
            color: '#62748A',
            '& .MuiBreadcrumbs-separator': { color: '#B9C6D4' },
            '& a': { color: '#62748A', textDecoration: 'none', '&:hover': { color: '#1976D2' } },
          }}
        >
          <Link component={RouterLink} to="/">
            หน้าหลัก
          </Link>
          <Link component={RouterLink} to="/books">
            หนังสือมือสอง
          </Link>
          <Link component={RouterLink} to={`/books?category=${encodeURIComponent(book.category)}`}>
            {book.category}
          </Link>
          <Typography
            component="span"
            sx={{
              color: '#102A43',
              fontWeight: 600,
              maxWidth: { xs: 140, sm: 280, md: 420 },
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

        {/* Product hero — 5/12 gallery, 7/12 info */}
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ mb: { xs: 6, md: 10 } }}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <BookGallery
              title={book.title}
              images={book.images}
              selectedImg={selectedImg}
              onSelectImage={setSelectedImg}
            />
          </Grid>
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
              conditionSlot={
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
                  <ConditionStrip book={book} />
                </Box>
              }
            />
          </Grid>
        </Grid>

        {/* Book story — editorial pull-quote, no card */}
        {book.story && (
          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            <BookStoryCard story={book.story} sellerName={book.seller.name} />
          </Box>
        )}

        {/* Condition — desktop full-width strip (mobile renders inside hero) */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: { md: 10 } }}>
          <ConditionStrip book={book} />
        </Box>

        {/* Book information + seller — 6/12 each, seller first on mobile */}
        <Grid
          container
          spacing={{ xs: 5, md: 6 }}
          sx={{ mb: { xs: 6, md: 10 } }}
        >
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <BookSpecsTable book={book} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <SellerCard seller={book.seller} />
          </Grid>
        </Grid>

        {/* Reviews — full width editorial */}
        <Box
          id="reviews"
          component="section"
          aria-label="รีวิวจากผู้ซื้อและชุมชน"
          sx={{ mb: { xs: 6, md: 10 }, scrollMarginTop: 88 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#102A43',
              fontSize: { xs: '1.375rem', md: '1.75rem' },
              letterSpacing: '-0.01em',
              mb: 3,
            }}
          >
            รีวิวจากผู้ซื้อและชุมชน
          </Typography>
          <ReviewList
            reviews={book.reviews}
            overallRating={book.rating}
            totalReviews={book.reviewCount}
            bookTitle={book.title}
          />
        </Box>

        {/* Recommendations */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <RelatedBooksSection relatedBooks={relatedBooks} />
        </Box>

        {/* Spacer so the sticky mobile bar never covers content */}
        <Box aria-hidden sx={{ display: { xs: 'block', md: 'none' }, height: 96 }} />
      </Container>

      {/* Sticky mobile purchase bar */}
      <MobilePurchaseBar book={book} onBuyNow={handleBuyNow} />

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
