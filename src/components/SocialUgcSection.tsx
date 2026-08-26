import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import {
  Favorite as HeartIcon,
  ChatBubbleOutlineRounded as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface SocialPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook';
  author: string;
  handle: string;
  avatar: string;
  content: string;
  tag: string;
  likes: string;
  comments: string;
  timeAgo: string;
  image?: string;
}

const mockSocialPosts: SocialPost[] = [
  {
    id: 'p1',
    platform: 'Instagram',
    author: 'แพรว อ่านไปเรื่อย',
    handle: '@praew_reads',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    content: 'จัดชั้นหนังสือรอบครึ่งปี ส่งต่อหนังสือที่อ่านจบแล้วใน BookLoop ได้ 8 เล่ม ได้เงินมาช้อปเล่มใหม่ต่อเพียบ! สภาพหนังสือแต่ละคนดีงามมาก 📚✨',
    tag: '#BookLoop #อ่านจบส่งต่อ',
    likes: '1.2K',
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
    content: 'Unbox หนังสือมือสองจาก BookLoop สภาพ 99% แต่ราคาลดไปเกินครึ่ง! คุ้มมากสำหรับสายอ่านที่อยากประหยัดงบ 📦📖',
    tag: '#BookTok #รีวิวหนังสือ #BookLoop',
    likes: '4.8K',
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
    content: 'สิ่งที่ชอบที่สุดใน BookLoop คือได้อ่าน "เรื่องราวของหนังสือ" จากเจ้าของเดิม มันทำให้หนังสือเล่มนั้นมีคุณค่าและมีความหมายขึ้นมาทันที',
    tag: '#ชุมชนคนรักการอ่าน #ส่งต่อหนังสือ',
    likes: '950',
    comments: '63',
    timeAgo: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
  },
];

export const SocialUgcSection: React.FC = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label="SOCIAL COMMUNITY"
              size="small"
              sx={{ bgcolor: 'rgba(23, 105, 170, 0.1)', color: 'secondary.main', fontWeight: 700 }}
            />
            <Chip
              label="Demo Mock"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
            BookLoop บน Social Media
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', fontWeight: 'normal' }}>
            เสียงตอบรับจากนักอ่านทั่วประเทศ ร่วมแชร์โมเมนต์ของคุณด้วยแฮชแท็ก #BookLoop
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {mockSocialPosts.map((post) => (
            <Grid size={{ xs: 12, md: 4 }} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid #D9E2EC',
                  bgcolor: '#FFFFFF',
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={post.avatar} alt={post.author} sx={{ width: 42, height: 42 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {post.author}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {post.handle} • {post.timeAgo}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={post.platform}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        bgcolor:
                          post.platform === 'Instagram'
                            ? 'rgba(225, 48, 108, 0.1)'
                            : post.platform === 'TikTok'
                            ? 'rgba(0, 0, 0, 0.08)'
                            : 'rgba(24, 119, 242, 0.1)',
                        color:
                          post.platform === 'Instagram'
                            ? '#E1306C'
                            : post.platform === 'TikTok'
                            ? '#000000'
                            : '#1877F2',
                      }}
                    />
                  </Box>

                  {/* Post Image (Optional) */}
                  {post.image && (
                    <Box
                      component="img"
                      src={post.image}
                      alt="UGC"
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                  )}

                  {/* Content */}
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, mb: 2, flexGrow: 1 }}>
                    {post.content}
                  </Typography>

                  <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold', display: 'block', mb: 2 }}>
                    {post.tag}
                  </Typography>

                  {/* Footer interaction stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: '1px solid #F0F4F8',
                      color: 'text.secondary',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HeartIcon sx={{ fontSize: 16, color: '#E1306C' }} />
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {post.likes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CommentIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{post.comments}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ShareIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">แชร์</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
