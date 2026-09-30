import React, { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRecommendedBooks } from '../../services/onboardingService';
import { getCategoryThaiName } from '../../data/onboarding';
import { AppContainer } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { LandingBookCard } from './LandingBookCard';

/**
 * แนะนำสำหรับคุณ — ใช้หมวดจาก onboarding preferences
 * ผสมหนังสือตรงหมวด + หนังสือยอดนิยม (ไม่แทนที่ discovery ปกติ)
 * Guest / ยังไม่ทำ onboarding → โชว์หนังสือยอดนิยมแทน
 */
export const RecommendedForYou: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectedIds = user?.preferences?.onboardingCompleted ? user.preferences.categories : [];
  const recommended = useMemo(() => getRecommendedBooks(selectedIds, 4), [selectedIds.join(',')]);

  const hasPrefs = selectedIds.length > 0;
  const subtitle = hasPrefs
    ? `คัดจากหมวดที่คุณชอบ: ${selectedIds.map(getCategoryThaiName).join(' · ')}`
    : 'หนังสือเรตติ้งดีที่นักอ่าน BookLoop หยิบกันบ่อยที่สุด — สมัครแล้วเลือกหมวดที่ชอบเพื่อคำแนะนำที่ตรงใจกว่านี้';

  return (
    <Box
      component="section"
      id="recommended-for-you"
      aria-labelledby="recommended-for-you-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#EAF2FE',
        borderBottom: '1px solid #C9DDF7',
      }}
    >
      <AppContainer>
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
        <Grid container spacing={{ xs: 2, sm: 3, md: 3.5 }}>
          {recommended.map((book) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={book.id}>
              <LandingBookCard book={book} />
            </Grid>
          ))}
        </Grid>
      </AppContainer>
    </Box>
  );
};
