import React from 'react';
import { Box, Typography, Avatar, Chip, Tooltip, IconButton } from '@mui/material';
import {
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  ChatBubbleOutlineRounded as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
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

export const SocialCard: React.FC<SocialCardProps> = ({
  post,
  isLiked,
  onToggleLike,
  onShare,
}) => {
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
        borderRadius: 3,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 2px 8px rgba(15, 45, 74, 0.03)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 24px rgba(15, 45, 74, 0.07)',
        },
      }}
    >
      {/* Card Header: Avatar, Name, Platform Badge */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.25 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
          <Avatar
            src={post.avatar}
            alt={post.author}
            sx={{ width: 38, height: 38, flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.875rem' }}
            >
              {post.author}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: '#627D98', display: 'block', fontSize: '0.75rem' }}
            >
              {post.handle}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={post.platform}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            bgcolor: platformStyle.bg,
            color: platformStyle.text,
            height: 22,
          }}
        />
      </Box>

      {/* Post Image */}
      {post.image && (
        <Box sx={{ width: '100%', position: 'relative', bgcolor: '#F7F9FC' }}>
          <SafeImage
            src={post.image}
            alt={`รีวิวจาก ${post.author}`}
            aspectRatio="16/10"
            objectFit="cover"
            loading="lazy"
            sx={{ width: '100%', maxHeight: 220 }}
          />
        </Box>
      )}

      {/* Short Caption */}
      <Box sx={{ p: { xs: 2, sm: 2.25 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#0F2D4A',
            lineHeight: 1.6,
            fontSize: '0.875rem',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.content}
        </Typography>

        {/* Tag */}
        <Typography
          variant="caption"
          sx={{
            color: '#1976D2',
            fontWeight: 700,
            fontSize: '0.75rem',
            display: 'block',
            mb: 2,
            mt: 'auto',
          }}
        >
          {post.tag}
        </Typography>

        {/* Interaction Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {/* Likes Button */}
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
                p: 0.5,
                borderRadius: 1.5,
                color: isLiked ? '#E1306C' : '#627D98',
                transition: 'color 0.15s ease',
                '&:hover': { color: '#E1306C' },
                '&:focus-visible': { outline: '2px solid #E1306C' },
              }}
            >
              {isLiked ? (
                <HeartIcon sx={{ fontSize: 18, color: '#E1306C' }} />
              ) : (
                <HeartBorderIcon sx={{ fontSize: 18 }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                {currentLikes.toLocaleString()}
              </Typography>
            </Box>
          </Tooltip>

          {/* Comments Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#627D98' }}>
            <CommentIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              {post.comments}
            </Typography>
          </Box>

          {/* Share */}
          <Tooltip title="แชร์โพสต์">
            <IconButton
              size="small"
              aria-label={`แชร์โพสต์ของ ${post.author}`}
              onClick={() => onShare(post)}
              sx={{
                color: '#627D98',
                p: 0.5,
                '&:hover': { color: '#1976D2' },
                '&:focus-visible': { outline: '2px solid #1976D2' },
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
