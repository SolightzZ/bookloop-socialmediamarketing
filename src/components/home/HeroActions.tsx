import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Search as SearchIcon,
  SyncAlt as ShareForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';

export interface HeroActionsProps {
  onSearchClick?: () => void;
  onSellClick?: () => void;
  disabled?: boolean;
}

/**
 * HeroActions component.
 * CTA buttons with clear visual hierarchy, accessible states,
 * and purposeful micro-interactions.
 * - Primary: "ค้นหาหนังสือ" (BookLoop Blue, solid, prominent)
 * - Secondary: "ส่งต่อหนังสือ →" (Clean editorial outline with circulation icon)
 */
export const HeroActions: React.FC<HeroActionsProps> = ({
  onSearchClick,
  onSellClick,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      navigate('/books');
    }
  };

  const handleSell = () => {
    trackEvent('pass_on_book_click', { source: 'hero_cta' });
    if (onSellClick) {
      onSellClick();
    } else {
      navigate('/sell');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
      }}
    >
      {/* Primary CTA: ค้นหาหนังสือ */}
      <Button
        variant="contained"
        size="large"
        disabled={disabled}
        startIcon={<SearchIcon sx={{ fontSize: 20 }} />}
        onClick={handleSearch}
        sx={{
          bgcolor: '#1976D2',
          color: '#FFFFFF',
          px: { xs: 3, sm: 3.75 },
          py: 1.25,
          borderRadius: 50,
          fontWeight: 700,
          fontSize: { xs: '0.93rem', sm: '1rem' },
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#0F2D4A',
            boxShadow: '0 6px 18px rgba(15, 45, 74, 0.25)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: '3px solid #38BDF8',
            outlineOffset: 2,
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        ค้นหาหนังสือ
      </Button>

      {/* Secondary CTA: ส่งต่อหนังสือ → */}
      <Button
        variant="outlined"
        size="large"
        disabled={disabled}
        startIcon={<ShareForwardIcon sx={{ fontSize: 19 }} />}
        onClick={handleSell}
        sx={{
          borderColor: '#CBD5E1',
          color: '#0F2D4A',
          px: { xs: 2.75, sm: 3.5 },
          py: 1.25,
          borderRadius: 50,
          fontWeight: 700,
          fontSize: { xs: '0.93rem', sm: '1rem' },
          bgcolor: '#FFFFFF',
          textTransform: 'none',
          boxShadow: '0 2px 6px rgba(15, 45, 74, 0.03)',
          '&:hover': {
            borderColor: '#1976D2',
            color: '#1976D2',
            bgcolor: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: '3px solid #1976D2',
            outlineOffset: 2,
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        ส่งต่อหนังสือ →
      </Button>
    </Box>
  );
};
