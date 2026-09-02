import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  InputBase,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  Savings as SavingsIcon,
  Shield as ShieldIcon,
  AutoStories as StoryIcon,
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';
import { BookstoreHeroIllustration } from './BookstoreHeroIllustration';

const HeroSection = styled('div')(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchForm = styled('form')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 50,
  padding: '6px 10px',
  boxShadow: '0 8px 24px rgba(16, 42, 67, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(3),
  maxWidth: 540,
  width: '100%',
}));

interface HomeHeroBannerProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <HeroSection sx={{ py: { xs: 5, sm: 6, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip
                label="ตลาดหนังสือมือสองและชุมชนนักอ่าน"
                size="small"
                sx={{
                  bgcolor: 'rgba(23, 105, 170, 0.1)',
                  color: 'secondary.main',
                  fontWeight: 700,
                  mb: { xs: 1.5, md: 2 },
                  height: 'auto',
                  '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
                }}
              />
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  lineHeight: { xs: 1.22, sm: 1.18, md: 1.15 },
                  color: 'primary.main',
                  fontSize: { xs: '2.15rem', sm: '2.75rem', md: '3.5rem', lg: '3.85rem' },
                  letterSpacing: { xs: '-0.02em', md: '-0.03em' },
                  wordBreak: 'keep-all',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline-block' }, whiteSpace: { sm: 'nowrap' } }}>
                  หนังสือทุกเล่ม
                </Box>{' '}
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline-block' }, whiteSpace: { sm: 'nowrap' } }}>
                  มีเรื่องราวให้คนถัดไป
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: { xs: 3, md: 4 },
                  fontWeight: 400,
                  lineHeight: 1.65,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  maxWidth: 540,
                }}
              >
                ซื้อหนังสือมือสองสภาพดีในราคาที่เข้าถึงง่าย หรือส่งต่อหนังสือที่คุณอ่านจบแล้วให้กับเจ้าของคนใหม่ในชุมชน BookLoop
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    trackEvent('pass_on_book_click', { source: 'hero_badge' });
                    navigate('/sell');
                  }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 1.75,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(23, 105, 170, 0.08)',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '0.925rem' },
                    border: '1px solid rgba(23, 105, 170, 0.18)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    '&:hover': {
                      bgcolor: 'rgba(23, 105, 170, 0.14)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <StoryIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                  <span>มีหนังสือที่อ่านจบแล้ว? ส่งต่อได้ที่นี่ &rarr;</span>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: { xs: 1.25, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/books')}
                  sx={{ px: 3.5, py: 1.4, borderRadius: 2 }}
                >
                  ค้นหาหนังสือ
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => {
                    trackEvent('pass_on_book_click', { source: 'hero_button' });
                    navigate('/sell');
                  }}
                  sx={{ px: 3.5, py: 1.4, borderRadius: 2, fontWeight: 600 }}
                >
                  ส่งต่อหนังสือ
                </Button>
              </Box>

              {/* Hero Search Box */}
              <SearchForm onSubmit={onSearchSubmit} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: { xs: 1, sm: 0 }, p: { xs: 1, sm: '6px 10px' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <SearchIcon sx={{ ml: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                  <InputBase
                    sx={{ ml: { xs: 0.75, sm: 1.5 }, flex: 1, minWidth: 0, px: { xs: 0.5, sm: 0 } }}
                    placeholder="ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN..."
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    inputProps={{ 'aria-label': 'ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN' }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: 6, px: 3, width: { xs: '100%', sm: 'auto' }, bgcolor: 'secondary.main' }}
                >
                  ค้นหา
                </Button>
              </SearchForm>

              <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 3 }, mt: { xs: 2.5, md: 3 }, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SavingsIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ประหยัดสูงสุด 70%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ระบุสภาพโปร่งใส
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoryIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    เรื่องราวจากเจ้าของเดิม
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <BookstoreHeroIllustration />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
};
