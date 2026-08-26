import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import { SocialUgcSection } from '../components/SocialUgcSection';
import { CampaignPerksSection } from '../components/campaign/CampaignPerksSection';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { tokens } from '../theme';

export default function CampaignPage() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('campaign_view', { campaign: 'read-share-repeat' });
  }, []);

  const handleShare = () => {
    trackEvent('social_share', { campaign: 'read-share-repeat' });
    if (navigator.share) {
      navigator
        .share({
          title: 'BookLoop - อ่านจบ ส่งต่อ วนต่อไป ✨',
          text: 'หนังสือเล่มโปรดของคุณ อาจกำลังเป็นเล่มโปรดของใครอีกคน มาร่วมส่งต่อหนังสือบน BookLoop กัน!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('คัดลอกลิงก์สำเร็จ', 'นำลิงก์ไปแชร์บนโซเชียลมีเดียพร้อมติดแฮชแท็ก #BookLoop ได้เลย!');
    }
  };

  const topCirculatingBooks = books.slice(0, 3);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Campaign Hero Banner */}
      <Box
        sx={{
          bgcolor: tokens.colors.ctaBg,
          color: 'white',
          py: 11,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label="SPECIAL CAMPAIGN"
              sx={{
                bgcolor: 'rgba(254, 243, 199, 0.15)',
                color: '#FDE68A',
                fontWeight: 800,
                letterSpacing: 1,
                border: '1px solid rgba(253, 230, 138, 0.3)',
              }}
            />
            <Chip
              label="#BookLoop #อ่านจบส่งต่อวนต่อไป"
              sx={{
                bgcolor: 'rgba(56, 189, 248, 0.15)',
                color: '#7DD3FC',
                fontWeight: 700,
                border: '1px solid rgba(125, 211, 252, 0.3)',
              }}
            />
          </Box>

          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '2.2rem', md: '3.3rem' },
              letterSpacing: '-0.5px',
            }}
          >
            อ่านจบ ส่งต่อ วนต่อไป
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              mb: 4.5,
              lineHeight: 1.85,
              fontWeight: 400,
              maxWidth: 720,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            "หนังสือเล่มโปรดของคุณ อาจกำลังเป็นเล่มโปรดของใครอีกคน" อย่าปล่อยให้หนังสือดีๆ จมอยู่บนชั้น นำมาส่งต่อให้เกิดแรงบันดาลใจใหม่ในสังคม
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={() => {
                trackEvent('sell_book_click', { source: 'campaign' });
                navigate('/sell');
              }}
            >
              เริ่มส่งต่อหนังสือของคุณ
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              size="large"
              onClick={handleShare}
              startIcon={<ShareIcon />}
            >
              แชร์แคมเปญให้เพื่อน
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Special Campaign Perks & Trending Books */}
      <CampaignPerksSection topBooks={topCirculatingBooks} />

      {/* Social UGC Section */}
      <SocialUgcSection />

      {/* Final Campaign CTA */}
      <Box sx={{ bgcolor: tokens.colors.ctaBg, color: tokens.colors.ctaHeading, py: 10, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: tokens.colors.ctaHeading, letterSpacing: '-0.5px' }}>
            พร้อมเป็นส่วนหนึ่งของลูปการอ่านหรือยัง?
          </Typography>
          <Typography variant="h6" sx={{ color: tokens.colors.ctaSubtext, mb: 4, fontWeight: 400, lineHeight: 1.7 }}>
            เปิดตู้หนังสือของคุณ แล้วเลือก 1 เล่มที่อยากส่งต่อให้เพื่อนนักอ่านวันนี้
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/sell')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            เริ่มส่งต่อหนังสือตอนนี้
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
