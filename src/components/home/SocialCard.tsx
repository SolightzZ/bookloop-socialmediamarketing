import React from 'react';
import { Box, Typography, Avatar, Chip, Tooltip, IconButton } from '@mui/material';
import { Favorite as HeartIcon, FavoriteBorder as HeartBorderIcon, ChatBubbleOutlineRounded as CommentIcon, Share as ShareIcon } from '@mui/icons-material';
import { SafeImage } from '../common/SafeImage';

export interface SocialPostItem {
   id: string;
   platform: 'Instagram' | 'TikTok' | 'Facebook';
   author: string;
   handle: string;
   avatar: string;
   content: string;
   tag: string;
   likes: number;
   comments: string;
   timeAgo: string;
   image?: string;
}

export interface SocialCardProps {
   post: SocialPostItem;
   isLiked: boolean;
   onToggleLike: (postId: string) => void;
   onShare: (post: SocialPostItem) => void;
}

export const SocialCard: React.FC<SocialCardProps> = ({ post, isLiked, onToggleLike, onShare }) => {
   const currentLikes = post.likes + (isLiked ? 1 : 0);

   const getPlatformColors = (platform: SocialPostItem['platform']) => {
      switch (platform) {
         case 'Instagram':
            return { bg: 'rgba(225, 48, 108, 0.08)', text: '#E1306C' };
         case 'TikTok':
            return { bg: 'rgba(15, 23, 42, 0.08)', text: '#0F172A' };
         case 'Facebook':
            return { bg: 'rgba(24, 119, 242, 0.08)', text: '#1877F2' };
      }
   };

   const platformStyle = getPlatformColors(post.platform);

   return (
      <Box
         component="article"
         sx={{
            borderRadius: { xs: 2.5, sm: 3 },
            border: '1px solid #D9E2EC',
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            flex: 1,
            minWidth: 0,
            boxShadow: '0 2px 8px rgba(15, 45, 74, 0.03)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
               transform: 'translateY(-3px)',
               boxShadow: '0 10px 24px rgba(15, 45, 74, 0.07)',
            },
         }}>
         {/* Card Header: Avatar, Name, Platform Badge */}
         <Box
            sx={{
               p: { xs: 1.5, sm: 1.75, md: 2 },
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               gap: 1,
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
               <Avatar
                  src={post.avatar}
                  alt={post.author}
                  sx={{
                     width: { xs: 34, sm: 36, md: 38 },
                     height: { xs: 34, sm: 36, md: 38 },
                     flexShrink: 0,
                  }}
               />
               <Box sx={{ minWidth: 0 }}>
                  <Typography
                     variant="subtitle2"
                     noWrap
                     sx={{
                        fontWeight: 700,
                        color: '#0F2D4A',
                        fontSize: { xs: '0.8125rem', sm: '0.85rem', md: '0.875rem' },
                     }}>
                     {post.author}
                  </Typography>
                  <Typography
                     variant="caption"
                     noWrap
                     sx={{
                        color: '#627D98',
                        display: 'block',
                        fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                     }}>
                     {post.handle}
                  </Typography>
               </Box>
            </Box>

            <Chip
               label={post.platform}
               size="small"
               sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  bgcolor: platformStyle.bg,
                  color: platformStyle.text,
                  height: { xs: 20, sm: 22 },
                  px: 0.5,
               }}
            />
         </Box>

         {/* Post Image — ความสูงปรับให้กระชับบน tablet & mobile */}
         {post.image && (
            <Box
               sx={{
                  width: '100%',
                  aspectRatio: '16/10',
                  maxHeight: { xs: 140, sm: 155, md: 185 },
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: '#F7F9FC',
               }}>
               <SafeImage src={post.image} alt={`รีวิวจาก ${post.author}`} aspectRatio="16/10" objectFit="cover" loading="lazy" sx={{ width: '100%', height: '100%' }} />
            </Box>
         )}

         {/* Short Caption */}
         <Box
            sx={{
               p: { xs: 1.5, sm: 1.75, md: 2 },
               flexGrow: 1,
               display: 'flex',
               flexDirection: 'column',
            }}>
            <Typography
               variant="body2"
               sx={{
                  color: '#0F2D4A',
                  lineHeight: 1.55,
                  fontSize: { xs: '0.8125rem', sm: '0.825rem', md: '0.875rem' },
                  mb: { xs: 1, sm: 1.25 },
                  minHeight: { xs: 'auto', sm: '4.2em', md: '4.4em' }, // ล็อก 3 บรรทัด — แคปชันสั้น/ยาวแค่ไหน tag ก็เริ่มที่ระนาบเดียวกัน
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
               }}>
               {post.content}
            </Typography>

            {/* Tag — บรรทัดเดียวทุกใบ ไม่ดันฟุตเตอร์ */}
            <Typography
               variant="caption"
               noWrap
               sx={{
                  color: '#1976D2',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                  display: 'block',
                  mb: { xs: 1.25, sm: 1.5 },
                  mt: 'auto',
               }}>
               {post.tag}
            </Typography>

            {/* Interaction Bar — 3 โซนกว้างเท่ากัน ไอคอนตรงกันทั้ง 3 ใบ */}
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pt: { xs: 1, sm: 1.25 },
                  borderTop: '1px solid #F1F5F9',
               }}>
               {/* Likes Button */}
               <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
                  <Tooltip title={isLiked ? 'ถูกใจแล้ว' : 'กดถูกใจ'}>
                     <Box
                        component="button"
                        type="button"
                        onClick={() => onToggleLike(post.id)}
                        aria-label={isLiked ? `เลิกถูกใจโพสต์ของ ${post.author}` : `ถูกใจโพสต์ของ ${post.author}`}
                        sx={{
                           display: 'flex',
                           alignItems: 'center',
                           gap: 0.5,
                           background: 'none',
                           border: 'none',
                           cursor: 'pointer',
                           p: { xs: 0.25, sm: 0.5 },
                           borderRadius: 1.5,
                           color: isLiked ? '#E1306C' : '#627D98',
                           transition: 'color 0.15s ease',
                           '&:hover': { color: '#E1306C' },
                           '&:focus-visible': { outline: '2px solid #E1306C' },
                        }}>
                        {isLiked ? <HeartIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 }, color: '#E1306C' }} /> : <HeartBorderIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />}
                        <Typography
                           variant="caption"
                           sx={{
                              fontWeight: 700,
                              fontSize: { xs: '0.75rem', sm: '0.775rem', md: '0.8rem' },
                              fontVariantNumeric: 'tabular-nums',
                           }}>
                           {currentLikes.toLocaleString()}
                        </Typography>
                     </Box>
                  </Tooltip>
               </Box>

               {/* Comments Count — กลางการ์ด */}
               <Box
                  sx={{
                     flex: 1,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: 0.5,
                     color: '#627D98',
                  }}>
                  <CommentIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />
                  <Typography
                     variant="caption"
                     sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.775rem', md: '0.8rem' },
                        fontVariantNumeric: 'tabular-nums',
                     }}>
                     {post.comments}
                  </Typography>
               </Box>

               {/* Share — ชิดขวา */}
               <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
                  <Tooltip title="แชร์โพสต์">
                     <IconButton
                        size="small"
                        aria-label={`แชร์โพสต์ของ ${post.author}`}
                        onClick={() => onShare(post)}
                        sx={{
                           color: '#627D98',
                           p: { xs: 0.25, sm: 0.5 },
                           '&:hover': { color: '#0F2D4A' },
                           '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                        }}>
                        <ShareIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />
                     </IconButton>
                  </Tooltip>
               </Box>
            </Box>
         </Box>
      </Box>
   );
};
