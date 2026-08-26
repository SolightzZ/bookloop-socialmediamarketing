import React from 'react';
import { Container, Grid, Paper, Box, Typography, Button } from '@mui/material';
import {
  LocalOffer as OfferIcon,
  Autorenew as LoopIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../data/books';
import { BookCard } from '../BookCard';

interface CampaignPerksSectionProps {
  topBooks: Book[];
}

export const CampaignPerksSection: React.FC<CampaignPerksSectionProps> = ({ topBooks }) => {
  const navigate = useNavigate();

  const perks = [
    {
      title: 'ส่งต่อ 1 เล่ม รับแต้มแลกอ่านเล่มถัดไป',
      desc: 'ทุกการส่งต่อหนังสือสำเร็จ คุณจะได้รับเครดิตสำหรับการซื้อหนังสือเล่มใหม่ในราคาลดพิเศษ',
      icon: LoopIcon,
      color: '#2E7D5B',
    },
    {
      title: 'แคมเปญส่งฟรีทั่วประเทศ (Demo)',
      desc: 'ไม่มีค่าจัดส่งแอบแฝง เพื่อสนับสนุนให้ทุกคนเข้าถึงการอ่านได้อย่างเท่าเทียม',
      icon: OfferIcon,
      color: '#1769AA',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Perks Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {perks.map((perk, idx) => {
          const IconComponent = perk.icon;
          return (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #D9E2EC',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    bgcolor: `${perk.color}15`,
                    color: perk.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {perk.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {perk.desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Top Circulating Books */}
      <Box sx={{ mb: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 1.2 }}>
              TRENDING IN CAMPAIGN
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              หนังสือที่ถูกส่งต่อมากที่สุดในสัปดาห์นี้
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/books')}
            sx={{ fontWeight: 'bold' }}
          >
            ดูทั้งหมด
          </Button>
        </Box>

        <Grid container spacing={3}>
          {topBooks.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
