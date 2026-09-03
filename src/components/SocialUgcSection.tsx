import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
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
    handle: 'Secondhand Book Club',
    avatar: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=100&q=80',
    content: 'สิ่งที่ชอบที่สุดใน BookLoop คือได้อ่าน "เรื่องราวของหนังสือ" จากเจ้าของเดิม ทำให้หนังสือเล่มนั้นมีความหมายและอบอุ่นขึ้นทันที',
    tag: '#ชุมชนคนรักการอ่าน #ส่งต่อหนังสือ',
    likes: 950,
    comments: '63',
    timeAgo: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
  },
];

export const SocialUgcSection: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

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

  return (
    <Box
      component="section"
      id="social"
      aria-labelledby="social-community-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#FFFFFF',
      }}
    >
      <AppContainer>
        <SectionHeader
          id="social-community-heading"
          eyebrow="SOCIAL COMMUNITY"
          title="BookLoop บน Social Media"
          subtitle="เสียงตอบรับจากเพื่อนนักอ่านทั่วประเทศ ร่วมแชร์โมเมนต์ความประทับใจด้วยแฮชแท็ก #BookLoop"
          align="center"
        />

        {/* 3 Columns Desktop, Stack Responsively on Mobile */}
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
          {mockSocialPosts.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <SocialCard
                post={post}
                isLiked={Boolean(likedPosts[post.id])}
                onToggleLike={handleToggleLike}
                onShare={handleSharePost}
              />
            </Grid>
          ))}
        </Grid>
      </AppContainer>
    </Box>
  );
};
