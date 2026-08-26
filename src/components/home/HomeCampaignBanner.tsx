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
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 1.5 }, minWidth: 0, flex: 1 }}>
            <OfferIcon sx={{ fontSize: { xs: 22, sm: 24 }, color: '#F59E0B', flexShrink: 0, mt: 0.25 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', fontSize: { xs: '0.85rem', sm: '1rem' }, lineHeight: 1.5 }}>
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
                flexShrink: 0,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'initial' } }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#38BDF8', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              ร่วมแคมเปญเลย
            </Typography>
            <ArrowForwardIcon fontSize="small" sx={{ color: '#38BDF8' }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
