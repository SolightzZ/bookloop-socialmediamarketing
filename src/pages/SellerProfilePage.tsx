import { CalendarToday as JoinDateIcon, LocationOn as LocationIcon, Store as StoreIcon, VerifiedUser as VerifiedIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Container, Link as MuiLink, Rating, Typography } from '@mui/material';
import { MessageSquareText, ShieldCheck, Undo2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';
import { books } from '../data/books';

export default function SellerProfilePage() {
   const { sellerId } = useParams<{ sellerId: string }>();
   const navigate = useNavigate();

   const sellerBooks = useMemo(() => books.filter((b) => b.seller.id === sellerId), [sellerId]);
   const seller = sellerBooks.length > 0 ? sellerBooks[0].seller : null;

   if (!seller) {
      return (
         <Box sx={{ py: 10, bgcolor: '#F7FAFC', minHeight: '80vh', textAlign: 'center' }}>
            <Container maxWidth="sm">
               <StoreIcon sx={{ fontSize: 64, color: '#E2E8F0', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 1 }}>
                   ไม่พบร้านค้านี้
                </Typography>
                <Typography variant="body2" sx={{ color: '#627D98', mb: 3 }}>
                   ผู้ขายรายนี้อาจไม่มีอยู่แล้ว ถูกลบออก หรือยังไม่มีหนังสือวางขาย
                </Typography>
               <Button variant="contained" onClick={() => navigate('/books')} sx={{ textTransform: 'none', fontWeight: 700 }}>
                  กลับไปเลือกซื้อหนังสือ
               </Button>
            </Container>
         </Box>
      );
   }

   return (
      <Box sx={{ py: { xs: 3, md: 5 }, bgcolor: '#F7FAFC', minHeight: '100vh' }}>
         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <BreadcrumbsNav items={[{ label: 'ค้นหาหนังสือ', path: '/books' }, { label: seller.name }]} />

            {/* Seller Header */}
            <Box
               sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  mb: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  gap: 3,
               }}>
               <Avatar
                  src={seller.avatar}
                  sx={{
                     width: { xs: 72, sm: 88 },
                     height: { xs: 72, sm: 88 },
                     bgcolor: '#EAF4FF',
                     border: '3px solid #FFFFFF',
                     boxShadow: '0 2px 12px rgba(15, 45, 74, 0.1)',
                  }}>
                  <StoreIcon sx={{ fontSize: 36, color: '#1976D2' }} />
               </Avatar>

               <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                     <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: { xs: '1.3rem', sm: '1.5rem' }, overflowWrap: 'anywhere' }}>
                        {seller.name}
                     </Typography>
                     {seller.verified && (
                        <Chip
                           icon={<VerifiedIcon sx={{ fontSize: 14, color: '#1976D2 !important' }} />}
                           label="ยืนยันตัวตนแล้ว"
                           size="small"
                           sx={{ bgcolor: '#EAF4FF', color: '#1976D2', fontWeight: 600, height: 24, fontSize: '0.7rem' }}
                        />
                     )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                     {seller.rating > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                           <Rating value={seller.rating} precision={0.1} readOnly size="small" sx={{ color: '#F59E0B' }} />
                           <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F2D4A' }}>
                              {seller.rating}
                           </Typography>
                        </Box>
                     ) : (
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F2D4A' }}>
                           ผู้ขายใหม่ · ยังไม่มีคะแนนจากผู้ซื้อ
                        </Typography>
                     )}
                     <Typography variant="body2" sx={{ color: '#627D98' }}>
                        ขายแล้ว {seller.itemsSold} เล่ม
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#627D98' }}>
                        อัตราตอบกลับ {seller.responseRate}%
                     </Typography>
                     {seller.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                           <LocationIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                           <Typography variant="body2" sx={{ color: '#627D98' }}>
                              {seller.location}
                           </Typography>
                        </Box>
                     )}
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <JoinDateIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                        <Typography variant="body2" sx={{ color: '#627D98' }}>
                           สมาชิกตั้งแต่ {seller.joinedAt}
                        </Typography>
                     </Box>
                  </Box>

                  {seller.bio && (
                     <Typography variant="body2" sx={{ color: '#627D98', mt: 1.5, lineHeight: 1.6, overflowWrap: 'anywhere' }}>
                        {seller.bio}
                     </Typography>
                  )}
               </Box>
            </Box>

            {/* Buyer-protection band — trust leads, inventory follows */}
            <Box
               component="section"
               aria-label="ความคุ้มครองเมื่อซื้อจากผู้ขายรายนี้"
               sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 3,
                  mb: 4,
                  overflow: 'hidden',
               }}>
               {[
                  {
                     icon: <ShieldCheck size={20} />,
                     title: seller.verified ? 'ยืนยันตัวตนแล้ว' : 'ผู้ขายใหม่',
                     sub: seller.verified ? 'ตรวจสอบโดย BookLoop' : 'อยู่ภายใต้คุ้มครองผู้ซื้อ',
                  },
                  {
                     icon: <Undo2 size={20} />,
                     title: 'คืนเงินได้',
                     sub: 'สภาพไม่ตรงปก แจ้งภายใน 48 ชม.',
                     to: '/help',
                  },
                  {
                     icon: <MessageSquareText size={20} />,
                     title: 'ติดต่อผู้ขาย',
                     sub: 'ผ่านหน้าติดต่อเรา',
                     to: '/contact',
                  },
               ].map((t, i) => {
                  const inner = (
                     <>
                        <Box sx={{ flexShrink: 0, mt: 0.25, color: '#1976D2' }}>{t.icon}</Box>
                        <Box sx={{ minWidth: 0 }}>
                           <Typography sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.85rem', lineHeight: 1.4 }}>
                              {t.title}
                           </Typography>
                           <Typography sx={{ color: '#627D98', fontSize: '0.78rem' }}>{t.sub}</Typography>
                        </Box>
                     </>
                  );
                  const cellSx = {
                     display: 'flex',
                     gap: 1.25,
                     alignItems: 'flex-start',
                     p: 2.5,
                     borderTop: { xs: i === 0 ? 'none' : '1px solid #E2E8F0', sm: 'none' },
                     borderLeft: { sm: i === 0 ? 'none' : '1px solid #E2E8F0' },
                  };
                  return 'to' in t && t.to ? (
                     <MuiLink
                        key={t.title}
                        component={RouterLink}
                        to={t.to}
                        underline="none"
                        aria-label={`${t.title} — ${t.sub}`}
                        sx={{
                           ...cellSx,
                           '&:hover .band-title': { color: '#1976D2', textDecoration: 'underline' },
                           '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '-2px' },
                        }}>
                        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', width: '100%' }}>
                           <Box sx={{ flexShrink: 0, mt: 0.25, color: '#1976D2' }}>{t.icon}</Box>
                           <Box sx={{ minWidth: 0 }}>
                              <Typography className="band-title" sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                 {t.title}
                              </Typography>
                              <Typography sx={{ color: '#627D98', fontSize: '0.78rem' }}>{t.sub}</Typography>
                           </Box>
                        </Box>
                     </MuiLink>
                  ) : (
                     <Box key={t.title} sx={cellSx}>
                        {inner}
                     </Box>
                  );
               })}
            </Box>

            {/* Seller's Books */}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 2.5 }}>
               หนังสือของ {seller.name} ({sellerBooks.length} เล่ม)
            </Typography>

            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: 'repeat(2, 1fr)',
                     sm: 'repeat(3, 1fr)',
                     md: 'repeat(4, 1fr)',
                  },
                  gap: { xs: 2, sm: 2.5 },
               }}>
               {sellerBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
               ))}
            </Box>
         </Container>
      </Box>
   );
}
