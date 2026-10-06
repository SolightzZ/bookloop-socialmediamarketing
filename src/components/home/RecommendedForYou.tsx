import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRecommendedBooks } from '../../services/onboardingService';
import { getCategoryThaiName } from '../../data/onboarding';
import { AppContainer } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { PopularVoyageSlider } from './PopularVoyageSlider';
import popularBg from '../../assets/images/POPULAR-RIGHT-NOW.webp';

/**
 * แนะนำสำหรับคุณ — ใช้หมวดจาก onboarding preferences
 * ผสมหนังสือตรงหมวด + หนังสือยอดนิยม (ไม่แทนที่ discovery ปกติ)
 * Guest / ยังไม่ทำ onboarding → โชว์หนังสือยอดนิยมแทน
 */
export const RecommendedForYou: React.FC = () => {
   const navigate = useNavigate();
   const { user } = useAuth();

   const categoriesKey = user?.preferences?.onboardingCompleted ? (user.preferences.categories || []).join(',') : '';
   const recommended = useMemo(() => {
      const ids = categoriesKey ? categoriesKey.split(',') : [];
      return getRecommendedBooks(ids, 4);
   }, [categoriesKey]);

   const hasPrefs = Boolean(categoriesKey);
   const subtitle = useMemo(() => {
      if (!hasPrefs) return 'หนังสือเรตติ้งดีที่นักอ่าน BookLoop หยิบกันบ่อยที่สุด';
      return `คัดจากหมวดที่คุณชอบ: ${categoriesKey.split(',').map(getCategoryThaiName).join(' · ')}`;
   }, [hasPrefs, categoriesKey]);

   return (
      <Box
         component="section"
         id="recommended-for-you"
         aria-labelledby="recommended-for-you-heading"
         sx={{
            py: { xs: 7, sm: 9, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#EAF2FE',
            borderBottom: '1px solid #C9DDF7',
            backgroundImage: `url(${popularBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
         }}>
         {/* Soft light overlay — keeps illustration visible while ensuring text readability */}
         <Box
            aria-hidden
            sx={{
               position: 'absolute',
               inset: 0,
               background: 'linear-gradient(180deg, rgba(234,242,254,0.9) 0%, rgba(234,242,254,0.72) 50%, rgba(234,242,254,0.88) 100%)',
            }}
         />
         <AppContainer sx={{ position: 'relative', zIndex: 1 }}>
            <SectionHeader
               id="recommended-for-you-heading"
               eyebrow={hasPrefs ? 'PERSONALIZED FOR YOU' : 'POPULAR RIGHT NOW'}
               title={hasPrefs ? 'แนะนำสำหรับคุณ' : 'กำลังเป็นที่นิยม'}
               subtitle={subtitle}
               align="left"
               action={{
                  label: 'ดูหนังสือทั้งหมด',
                  onClick: () => navigate('/books'),
               }}
            />
            <PopularVoyageSlider books={recommended} />
         </AppContainer>
      </Box>
   );
};
