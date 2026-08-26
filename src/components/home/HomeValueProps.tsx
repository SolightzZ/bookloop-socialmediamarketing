import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
} from '@mui/material';
import {
  Savings as SavingsIcon,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const valueProps = [
  {
    icon: SavingsIcon,
    title: 'ราคาที่เข้าถึงง่าย',
    desc: 'หนังสือคุณภาพดีในราคาประหยัด ช่วยให้คุณอ่านหนังสือได้มากขึ้นในงบประมาณที่คุ้มค่า',
    color: '#2E7D5B',
  },
  {
    icon: CategoryIcon,
    title: 'หนังสือหลากหลายหมวด',
    desc: 'รวบรวมหนังสือหายาก เล่มที่เลิกพิมพ์ และหนังสือยอดนิยมจากเพื่อนนักอ่านทั่วประเทศ',
    color: '#1769AA',
  },
  {
    icon: OfferIcon,
    title: 'ขายต่อง่าย เปลี่ยนเป็นเงินทุน',
    desc: 'เมื่ออ่านจบแล้ว เปลี่ยนหนังสือบนชั้นให้กลายเป็นทุนสำหรับเล่มต่อไปได้ทันที',
    color: '#B7791F',
  },
  {
    icon: ShieldIcon,
    title: 'ซื้อขายอย่างมั่นใจ',
    desc: 'ระบบระบุสภาพอย่างละเอียด มีรูปถ่ายจริง และระบบตรวจสอบผู้ขายที่โปร่งใส',
    color: '#102A43',
  },
];

export const HomeValueProps: React.FC = () => {
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
          WHY BOOKLOOP
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
          คุณค่าที่เรามุ่งมั่นส่งมอบ
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {valueProps.map((vp, idx) => {
          const IconComponent = vp.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  borderRadius: 2.5,
                  bgcolor: 'background.default',
                  border: '1px solid #D9E2EC',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: '#FFFFFF',
                    color: vp.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <IconComponent fontSize="medium" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {vp.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {vp.desc}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
