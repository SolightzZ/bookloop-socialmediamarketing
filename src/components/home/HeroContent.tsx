import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AutoStories as BookIcon,
  LocalOfferOutlined as TagIcon,
  VerifiedUserOutlined as ShieldIcon,
  SyncAltOutlined as LoopIcon,
  FavoriteRounded as HeartIcon,
} from '@mui/icons-material';
import { HeroSearch } from './HeroSearch';
import { HeroActions } from './HeroActions';

export interface HeroContentProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * HeroContent component — QA Final Polish
 * - Strict typography scale: Mobile 36px, Tablet 48px, Desktop 60px (56–64px standard)
 * - Strict spacing scale: 16px, 24px, 32px
 * - Reusable HeroActions CTA & SearchBar components
 * - Editorial Navy primary (#0F2D4A), BookLoop Blue (#1976D2), tiny yellow accents
 */
export const HeroContent: React.FC<HeroContentProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  return (
    <Box sx={{ maxWidth: { md: 540 } }}>
      {/* 1. Eyebrow Pill Badge (16px bottom margin) */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.65,
          borderRadius: 50,
          bgcolor: '#EAF4FF',
          color: '#1976D2',
          mb: 2,
          border: '1px solid rgba(25, 118, 210, 0.15)',
        }}
      >
        <BookIcon sx={{ fontSize: 16, color: '#1976D2' }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.02em',
            fontSize: { xs: '0.78rem', sm: '0.82rem' },
            color: '#1976D2',
          }}
        >
          ตลาดหนังสือมือสองและชุมชนนักอ่าน
        </Typography>
      </Box>

      {/* 2. Large Headline — 36px mobile, 48px tablet, 60px desktop (24px bottom margin) */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 900,
            color: '#0F2D4A',
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3rem', lg: '3.75rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            fontFamily: 'inherit',
          }}
        >
          {/* Line 1: หนังสือทุกเล่ม + Yellow Sparkle Rays */}
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
            <span>หนังสือทุกเล่ม</span>
            {/* Golden Energy Sparkle Rays — tiny decorative accent */}
            <Box
              component="svg"
              viewBox="0 0 32 24"
              aria-hidden="true"
              sx={{
                width: { xs: 22, sm: 28, md: 32 },
                height: { xs: 16, sm: 20, md: 24 },
                flexShrink: 0,
                transform: 'translateY(-4px)',
              }}
            >
              <line x1="6" y1="20" x2="16" y2="4" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="16" y1="22" x2="26" y2="8" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              <line x1="2" y1="14" x2="8" y2="6" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            </Box>
          </Box>
          <br />

          {/* Line 2: มีเรื่องราว (Blue emphasis) + ให้คนถัดไป */}
          <Box
            component="span"
            sx={{
              position: 'relative',
              color: '#1976D2',
              display: 'inline-block',
              mr: 1.2,
            }}
          >
            มีเรื่องราว
            {/* Yellow Curved Underline Swoosh — tiny accent */}
            <Box
              component="svg"
              viewBox="0 0 160 16"
              aria-hidden="true"
              sx={{
                position: 'absolute',
                bottom: { xs: -5, sm: -7, md: -9 },
                left: 0,
                width: '100%',
                height: 12,
                overflow: 'visible',
              }}
            >
              <path
                d="M 2 8 C 45 15, 115 14, 158 4"
                stroke="#F59E0B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </Box>
          </Box>
          <span>ให้คนถัดไป</span>
        </Typography>
      </Box>

      {/* 3. Supporting Description (32px bottom margin) */}
      <Typography
        variant="body1"
        sx={{
          color: '#627D98',
          fontSize: { xs: '0.92rem', sm: '1rem', md: '1.05rem' },
          lineHeight: 1.7,
          mb: 4,
          fontWeight: 400,
        }}
      >
        ซื้อหนังสือมือสองสภาพดีในราคาที่เข้าถึงง่าย หรือส่งต่อหนังสือที่คุณอ่านจบแล้วให้กับเจ้าของคนใหม่ในชุมชน BookLoop ร่วมหมุนเวียนเรื่องราวที่ไม่มีวันสิ้นสุด
        <HeartIcon sx={{ fontSize: 16, color: '#1976D2', verticalAlign: 'text-bottom', ml: 0.5 }} />
      </Typography>

      {/* 4. Pill-Shaped CTAs (24px bottom margin) */}
      <Box sx={{ mb: 3 }}>
        <HeroActions />
      </Box>

      {/* 5. Pill-Shaped Hero Search Field (24px bottom margin) */}
      <Box sx={{ mb: 3 }}>
        <HeroSearch
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onSearchSubmit={onSearchSubmit}
        />
      </Box>

      {/* 6. Micro Trust Benefits Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          flexWrap: 'wrap',
        }}
      >
        {/* Benefit 1: Tag */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <TagIcon sx={{ fontSize: 17, color: '#10B981' }} />
          <Typography variant="caption" sx={{ color: '#627D98', fontWeight: 600, fontSize: '0.8rem' }}>
            ประหยัดสูงสุด 70%
          </Typography>
        </Box>

        {/* Benefit 2: Shield */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <ShieldIcon sx={{ fontSize: 17, color: '#1976D2' }} />
          <Typography variant="caption" sx={{ color: '#627D98', fontWeight: 600, fontSize: '0.8rem' }}>
            คุณภาพแพ็กพัสดุ
          </Typography>
        </Box>

        {/* Benefit 3: Loop */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <LoopIcon sx={{ fontSize: 17, color: '#10B981' }} />
          <Typography variant="caption" sx={{ color: '#627D98', fontWeight: 600, fontSize: '0.8rem' }}>
            ส่งต่อได้ไม่สิ้นสุด
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
