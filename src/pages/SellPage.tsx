import { Box, Container, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SellBookForm, SellFormData } from '../components/sell/SellBookForm';
import { SellHero } from '../components/sell/SellHero';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/apiClient';
import { authService, getStoredSession } from '../services/authService';
import { showError, showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { logWarn } from '../utils/logger';

export default function SellPage() {
   const navigate = useNavigate();
   const { user } = useAuth();
   const hasTrackedRef = React.useRef(false);

   useEffect(() => {
      if (!hasTrackedRef.current) {
         hasTrackedRef.current = true;
         trackEvent('sell_book_click', { page: 'sell' });
      }
   }, []);

   const handleFormSubmit = async (data: SellFormData, image: string): Promise<void> => {
      trackEvent('sell_book_submit_demo', {
         title: data.title,
         category: data.category,
         condition: data.condition,
         price: Number(data.price),
      });

      // บันทึกลง backend
      let listingId: string;
      let cover = image;
      try {
         const result = await apiClient.post<{
            success: boolean;
            listing: { id: string; image: string };
         }>('listings_create.php', {
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            category: data.category,
            condition: data.condition,
            price: Number(data.price),
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            defects: data.defects,
            story: data.story || data.defects,
            image,
         });
         if (!result.listing) {
            throw new Error('เซิร์ฟเวอร์ตอบกลับไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
         }
         listingId = result.listing.id;
      } catch (err: any) {
         showError('ลงขายไม่สำเร็จ', err?.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง', true);
         return;
      }

      // Mirror ลงโปรไฟล์บนเครื่อง (แท็บ "หนังสือของฉัน" ใน Account)
      try {
         const session = getStoredSession();
         const ownerId = user?.id ?? session?.userId;
         if (ownerId) {
            authService.addListedBook(ownerId, {
               id: listingId,
               title: data.title,
               author: data.author,
               price: Number(data.price),
               originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
               condition: data.condition,
               category: data.category,
               cover,
               dateListed: new Date().toISOString().split('T')[0],
               status: 'active',
               views: 0,
               defects: data.defects,
               story: data.story,
               isbn: data.isbn,
            });
         }
      } catch (e) {
         logWarn('SellPage: profile mirror (addListedBook) failed', e);
      }

      await showSuccess('ส่งต่อหนังสือสำเร็จ!', `หนังสือ "${data.title}" ได้รับการบันทึกขึ้นระบบเรียบร้อย ขอบคุณที่ร่วมส่งต่อหนังสือในชุมชน BookLoop`);

      navigate('/books');
   };

   return (
      <Box sx={{ bgcolor: '#F7FAFD', minHeight: '100vh', pb: { xs: 6, sm: 8, md: 10 } }}>
         {/* 1. Compact Light Hero */}
         <SellHero />

         {/* 2. Main Centered Form Card (No sidebar, max-width ~1040px) */}
         <Container
            maxWidth="lg"
            sx={{
               maxWidth: '1040px !important',
               px: { xs: 2, sm: 3, md: 4 },
               my: { xs: 3, sm: 4, md: 5 },
               position: 'relative',
               zIndex: 2,
            }}>
            <Paper
               elevation={0}
               sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E5EEF8',
                  borderRadius: { xs: '16px', sm: '20px' },
                  boxShadow: '0 4px 24px rgba(15, 47, 82, 0.04)',
                  p: { xs: 2.5, sm: 4, md: 5 },
               }}>
               <SellBookForm onSubmit={handleFormSubmit} />
            </Paper>
         </Container>
      </Box>
   );
}
