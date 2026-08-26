import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AutoStories as NovelIcon,
  Palette as ComicIcon,
  Science as ScienceIcon,
  SelfImprovement as GrowthIcon,
  BusinessCenter as BusinessIcon,
  ChildCare as KidsIcon,
  School as EducationIcon,
  AutoAwesome as RareBookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { trackEvent } from '../../utils/analytics';

export const categoryList = [
  { name: 'นิยาย', desc: 'วรรณกรรม นิยายแปล โรแมนติก สืบสวน แฟนตาซี', icon: <NovelIcon fontSize="large" />, color: '#1769AA', bgColor: '#E8F1F8' },
  { name: 'การ์ตูน', desc: 'มังงะ คอมมิคส์ หนังสือภาพ การ์ตูนความรู้', icon: <ComicIcon fontSize="large" />, color: '#B7791F', bgColor: '#FEF3C7' },
  { name: 'ความรู้', desc: 'วิทยาศาสตร์ ประวัติศาสตร์ สังคม ปรัชญา', icon: <ScienceIcon fontSize="large" />, color: '#2E7D5B', bgColor: '#DCFCE7' },
  { name: 'พัฒนาตนเอง', desc: 'จิตวิทยา การใช้ชีวิต สุขภาพ การทำงาน', icon: <GrowthIcon fontSize="large" />, color: '#6366F1', bgColor: '#EEF2FF' },
  { name: 'ธุรกิจ', desc: 'การลงทุน การเงิน การตลาด สตาร์ทอัพ', icon: <BusinessIcon fontSize="large" />, color: '#0F766E', bgColor: '#CCFBF1' },
  { name: 'เด็ก', desc: 'นิทาน หนังสือเด็ก เสริมทักษะการเรียนรู้', icon: <KidsIcon fontSize="large" />, color: '#EA580C', bgColor: '#FFEDD5' },
  { name: 'การศึกษา', desc: 'ตำราเรียน ภาษา คู่มือสอบ เตรียมสอบ', icon: <EducationIcon fontSize="large" />, color: '#0284C7', bgColor: '#E0F2FE' },
  { name: 'หนังสือสะสม', desc: 'ฉบับพิมพ์ครั้งแรก หนังสือหายาก ปกแข็ง', icon: <RareBookIcon fontSize="large" />, color: '#7C3AED', bgColor: '#F3E8FF' },
];

export const HomeCategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'secondary.main',
            fontWeight: 'bold',
            letterSpacing: 1.5,
            display: 'block',
          }}
        >
          EXPLORE CATEGORIES
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
          ค้นหาหนังสือในหมวดที่คุณชอบ
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 'normal' }}>
          เลือกหมวดหมู่ที่ใช่ แล้วเริ่มต้นค้นพบหนังสือเล่มถัดไปของคุณ
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {categoryList.map((cat) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={cat.name}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 3,
                border: '1px solid #D9E2EC',
                bgcolor: '#FFFFFF',
                transition: 'all 0.25s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 28px rgba(16, 42, 67, 0.1)',
                  borderColor: cat.color,
                },
              }}
              onClick={() => {
                trackEvent('view_category', { category: cat.name });
                navigate(`/books?category=${encodeURIComponent(cat.name)}`);
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3.5, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: cat.bgColor,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'transform 0.25s ease',
                    '&:hover': {
                      transform: 'scale(1.08)',
                    },
                  }}
                >
                  {cat.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5, fontSize: '1.05rem' }}>
                  {cat.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 36,
                    lineHeight: 1.4,
                    fontSize: '0.8rem',
                    mb: 1.5,
                  }}
                >
                  {cat.desc}
                </Typography>
                <Chip
                  label={`${books.filter((b) => b.category === cat.name).length} เล่ม`}
                  size="small"
                  sx={{
                    mt: 'auto',
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #D9E2EC',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
