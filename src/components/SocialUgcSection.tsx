import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { AppContainer } from './common/Container';
import { SectionHeader } from './common/SectionHeader';
import { SocialCard, SocialPostItem } from './home/SocialCard';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

const mockSocialPosts: SocialPostItem[] = [
   {
      id: 'p1',
      platform: 'Instagram',
      author: 'แพรว อ่านไปเรื่อย',
      handle: '@praew_reads',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      content: 'จัดชั้นหนังสือรอบครึ่งปี ส่งต่อเล่มที่อ่านจบแล้วใน BookLoop ได้ 8 เล่ม ได้เงินมาช้อปเล่มใหม่ต่อเพียบ สภาพหนังสือดีงามมาก',
      tag: '#BookLoop #อ่านจบส่งต่อ',
      likes: 1240,
      comments: '48',
      timeAgo: '2 ชม. ที่แล้ว',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
   },
   {
      id: 'p2',
      platform: 'TikTok',
      author: 'BookTok Thailand',
      handle: '@booktok_th',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      content: 'Unbox หนังสือมือสองจาก BookLoop สภาพ 95% แต่ราคาลดไปเกินครึ่ง คุ้มมากสำหรับสายอ่านที่อยากประหยัดงบ',
      tag: '#BookTok #รีวิวหนังสือ',
      likes: 4820,
      comments: '124',
      timeAgo: '5 ชม. ที่แล้ว',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
   },
   {
      id: 'p3',
      platform: 'Facebook',
      author: 'ชมรมคนรักหนังสือมือสอง',
      handle: '@SecondhandBookClub',
      avatar: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=100&q=80',
      content: 'สิ่งที่ชอบที่สุดใน BookLoop คือได้อ่าน "เรื่องราวของหนังสือ" จากเจ้าของเดิม ทำให้หนังสือเล่มนั้นมีความหมายและอบอุ่นขึ้นทันที',
      tag: '#BookLoop #ส่งต่อหนังสือ',
      likes: 950,
      comments: '63',
      timeAgo: '1 วันที่แล้ว',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
   },
];

export const SocialUgcSection: React.FC = () => {
   const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
   const [activeSlide, setActiveSlide] = useState(0);
   const scrollRef = useRef<HTMLDivElement>(null);

   const handleToggleLike = (postId: string) => {
      setLikedPosts((prev) => {
         const isLiked = !prev[postId];
         trackEvent('ugc_like', { postId, isLiked });
         return { ...prev, [postId]: isLiked };
      });
   };

   const handleSharePost = (post: SocialPostItem) => {
      trackEvent('ugc_share', { postId: post.id });
      if (navigator.clipboard) {
         navigator.clipboard.writeText(window.location.href);
         showSuccess('คัดลอกลิงก์แล้ว', 'ร่วมแชร์เรื่องราวความประทับใจของ BookLoop ได้เลย');
      }
   };

   const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth > 0) {
         const index = Math.round(scrollLeft / (clientWidth * 0.78));
         setActiveSlide(Math.min(Math.max(index, 0), mockSocialPosts.length - 1));
      }
   };

   const scrollToSlide = (index: number) => {
      if (!scrollRef.current) return;
      const cards = scrollRef.current.children;
      if (cards[index]) {
         (cards[index] as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
         });
         setActiveSlide(index);
      }
   };

   return (
      <Box
         component="section"
         id="social"
         aria-labelledby="social-community-heading"
         sx={{
            py: { xs: 4.5, sm: 6, md: 8.5 },
            bgcolor: '#FFFFFF',
         }}>
         <AppContainer>
            <SectionHeader id="social-community-heading" title="BookLoop บน Social Media" subtitle="ตัวอย่างโพสต์จากชุมชน BookLoop แชร์หนังสือที่ส่งต่อด้วยแฮชแท็ก #BookLoop" align="center" />

            {/* 
          - Mobile (xs): Horizontal snap carousel track with peek & dots — กระชับ ไม่กินความสูง 3 จอ
          - Tablet (sm) & Desktop (md): 3 col เท่ากันในแถวเดียว — สมมาตรเป๊ะทั้ง 3 การ์ด (รวม Facebook ใบที่ 3)
        */}
            <Box
               ref={scrollRef}
               onScroll={handleScroll}
               sx={{
                  display: { xs: 'flex', sm: 'grid' },
                  gridTemplateColumns: { sm: 'repeat(3, 1fr)' },
                  gap: { xs: 2, sm: 2, md: 3 },
                  overflowX: { xs: 'auto', sm: 'visible' },
                  scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                  pb: { xs: 1, sm: 0 },
                  px: { xs: 2, sm: 0 },
                  mx: { xs: -2, sm: 0 },
                  alignItems: 'stretch',
               }}>
               {mockSocialPosts.map((post) => (
                  <Box
                     key={post.id}
                     sx={{
                        flex: { xs: '0 0 calc(84vw - 24px)', sm: '1 1 0%' },
                        maxWidth: { xs: 300, sm: 'none' },
                        minWidth: 0,
                        scrollSnapAlign: 'center',
                        display: 'flex',
                        alignItems: 'stretch',
                     }}>
                     <SocialCard post={post} isLiked={Boolean(likedPosts[post.id])} onToggleLike={handleToggleLike} onShare={handleSharePost} />
                  </Box>
               ))}
            </Box>

            {/* Mobile pagination dots indicator */}
            <Box
               sx={{
                  display: { xs: 'flex', sm: 'none' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2,
               }}
               aria-label="ตัวเลือกดูโพสต์">
               {mockSocialPosts.map((post, idx) => (
                  <Box
                     key={post.id}
                     component="button"
                     type="button"
                     onClick={() => scrollToSlide(idx)}
                     aria-label={`ดูโพสต์ของ ${post.author}`}
                     sx={{
                        width: activeSlide === idx ? 22 : 7,
                        height: 7,
                        borderRadius: 4,
                        bgcolor: activeSlide === idx ? '#1976D2' : '#CBD5E1',
                        border: 'none',
                        p: 0,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                     }}
                  />
               ))}
            </Box>
         </AppContainer>
      </Box>
   );
};
