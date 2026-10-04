import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  FavoriteRounded as HeartIcon,
} from '@mui/icons-material';
import { HeroSearch } from './HeroSearch';
import { HeroActions } from './HeroActions';
import { motion } from 'motion/react';

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
            {/* Yellow Curved Underline Swoosh — tiny accent with SVG Path Drawing */}
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
              <motion.path
                d="M 2 8 C 45 15, 115 14, 158 4"
                stroke="#F59E0B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
        ซื้อหนังสือมือสองสภาพดีในราคาที่เข้าถึงง่าย หรือส่งต่อหนังสือที่คุณอ่านจบแล้วให้เจ้าของคนใหม่ในชุมชน BookLoop
        <HeartIcon sx={{ fontSize: 16, color: '#1976D2', verticalAlign: 'text-bottom', ml: 0.5 }} />
      </Typography>

      {/* 4. Pill-Shaped CTAs (24px bottom margin) */}
      <Box sx={{ mb: 3 }}>
        <HeroActions />
      </Box>

      {/* 5. Pill-Shaped Hero Search Field */}
      <Box>
        <HeroSearch
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onSearchSubmit={onSearchSubmit}
        />
      </Box>
    </Box>
  );
};
