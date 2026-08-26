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
import { BookImageGallery } from '../components/bookdetail/BookImageGallery';
import { BookPurchaseBox } from '../components/bookdetail/BookPurchaseBox';
import { BookStoryCard } from '../components/bookdetail/BookStoryCard';
import { BookSpecsTable } from '../components/bookdetail/BookSpecsTable';
import { RelatedBooksSection } from '../components/bookdetail/RelatedBooksSection';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const book = books.find((b) => b.id === id);
  const [selectedImg, setSelectedImg] = useState<string>(book?.images?.[0] || book?.cover || '');

  useEffect(() => {
    if (book) {
      setSelectedImg(book.images?.[0] || book.cover);
      window.scrollTo(0, 0);
      trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
    }
  }, [book, id]);

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ไม่พบหนังสือที่คุณต้องการ
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          หนังสือเล่มนี้อาจถูกส่งต่อหรือรหัสสินค้าไม่ถูกต้อง
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/books')}
          sx={{ mt: 2 }}
        >
          กลับไปเลือกซื้อหนังสือ
        </Button>
      </Container>
    );
  }

  const isFavorite = isInWishlist(book.id);

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleBuyNow = () => {
    trackEvent('begin_checkout', { bookId: book.id, title: book.title, price: book.price });
    showConfirm(
      'ยืนยันการสั่งซื้อแบบ Demo หรือไม่?',
      `หนังสือ "${book.title}" ยอดชำระ ฿${book.price} (นี่คือการจำลองการทำงาน ไม่มีการเรียกเก็บเงินจริง)`
    ).then((result) => {
      if (result.isConfirmed) {
        trackEvent('purchase_demo', { bookId: book.id, title: book.title, price: book.price });
        showSuccess(
          'สั่งซื้อแบบ Demo สำเร็จ!',
          'จำลองการสร้างหมายเลขคำสั่งซื้อ: #BK-' + Math.floor(100000 + Math.random() * 900000)
        );
      }
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
    <Box sx={{ py: 6, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            หน้าแรก
          </Link>
          <Link component={RouterLink} to="/books" underline="hover" color="inherit">
            หนังสือทั้งหมด
          </Link>
          <Link
            component={RouterLink}
            to={`/books?category=${encodeURIComponent(book.category)}`}
            underline="hover"
            color="inherit"
          >
            {book.category}
          </Link>
          <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {book.title}
          </Typography>
        </Breadcrumbs>

        {/* Main Product Section */}
        <Grid container spacing={5} sx={{ mb: 8 }}>
          {/* Left: Images Gallery */}
          <Grid size={{ xs: 12, md: 5 }}>
            <BookImageGallery
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
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <BookSpecsTable book={book} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <SellerCard seller={book.seller} />
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 8, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
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
    </Box>
  );
}
