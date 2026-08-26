import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  Visibility as AwarenessIcon,
  TouchApp as InterestIcon,
  CompareArrows as ConsiderationIcon,
  CheckCircle as ConversionIcon,
  Repeat as RetentionIcon,
  Campaign as AdvocacyIcon,
} from '@mui/icons-material';

const funnelStages = [
  {
    stage: '1. Awareness',
    title: 'สร้างการรับรู้',
    desc: 'ผ่าน Social Content (TikTok, IG, FB) และแคมเปญ #อ่านจบส่งต่อวนต่อไป',
    icon: AwarenessIcon,
    color: '#102A43',
  },
  {
    stage: '2. Interest',
    title: 'กระตุ้นความสนใจ',
    desc: 'Landing Page เน้นจุดขาย: ประหยัด 40-70%, หนังสือสภาพดี, ค้นหาได้ตรงใจ',
    icon: InterestIcon,
    color: '#1769AA',
  },
  {
    stage: '3. Consideration',
    title: 'ช่วยในการตัดสินใจ',
    desc: 'รายละเอียดสภาพเล่มชัดเจน, รีวิวผู้ขายจริง, เรื่องราวของหนังสือเล่มนี้',
    icon: ConsiderationIcon,
    color: '#2E7D5B',
  },
  {
    stage: '4. Conversion',
    title: 'สั่งซื้อและส่งต่อ',
    desc: 'ระบบสั่งซื้อ Demo รวดเร็ว โปร่งใส ตรวจสอบคำสั่งซื้อได้ทันที',
    icon: ConversionIcon,
    color: '#B7791F',
  },
  {
    stage: '5. Retention',
    title: 'อ่านจบแล้วขายต่อ',
    desc: 'กลับมาลงขายหนังสือเล่มเดิมเพื่อรับเครดิตหรือเงินหมุนเวียนเล่มต่อไป',
    icon: RetentionIcon,
    color: '#102A43',
  },
  {
    stage: '6. Advocacy',
    title: 'บอกต่อในชุมชน',
    desc: 'แชร์รีวิว ชวนเพื่อนเข้าร่วม และส่งต่อหนังสือวนในระบบอย่างยั่งยืน',
    icon: AdvocacyIcon,
    color: '#1769AA',
  },
];

export const MarketingFunnel: React.FC = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
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
            GROWTH & RETENTION FUNNEL
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
            เส้นทางสู่ชุมชนนักอ่าน BookLoop
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', fontWeight: 'normal' }}>
            กลยุทธ์การตลาดและวงจรการเติบโตที่เปลี่ยนผู้อ่านทั่วไปให้กลายเป็นผู้ส่งต่อประจำ
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {funnelStages.map((item) => {
            const IconComponent = item.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.stage}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2.5,
                    border: '1px solid #D9E2EC',
                    bgcolor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(16, 42, 67, 0.06)',
                      borderColor: item.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: `${item.color}15`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block' }}>
                        {item.stage}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mt: 1 }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
