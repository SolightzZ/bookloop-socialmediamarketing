import React from 'react';
import { Box, Container, Typography, Chip } from '@mui/material';
import { LocalOffer as OfferIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { trackEvent } from '../../utils/analytics';

export const HomeCampaignBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: tokens.colors.ctaBg,
        color: 'white',
        py: 2.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        '&:hover': { bgcolor: '#0d2d54' },
      }}
      onClick={() => {
        trackEvent('campaign_click', { campaign: 'read-share-repeat' });
        navigate('/campaign/read-share-repeat');
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <OfferIcon sx={{ fontSize: 24, color: '#F59E0B' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Box component="span" sx={{ color: '#FCD34D', fontWeight: 800 }}>
                แคมเปญพิเศษ:
              </Box>
              <Box component="span" sx={{ color: '#FFFFFF' }}>
                อ่านจบ ส่งต่อ วนต่อไป ✨
              </Box>
            </Typography>
            <Chip
              label="#BookLoop"
              size="small"
              sx={{
                bgcolor: 'rgba(254, 243, 199, 0.15)',
                color: '#FDE68A',
                fontWeight: 700,
                border: '1px solid rgba(253, 230, 138, 0.3)',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#38BDF8' }}>
              ร่วมแคมเปญเลย
            </Typography>
            <ArrowForwardIcon fontSize="small" sx={{ color: '#38BDF8' }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
