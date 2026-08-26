import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  ShoppingCart as BuyIcon,
  MenuBook as ReadIcon,
  Sell as SellIcon,
  Share as ShareIcon,
  Autorenew as LoopIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'ซื้อ (Buy)',
    desc: 'เลือกซื้อหนังสือมือสองสภาพดีในราคาประหยัดกว่า 40-70%',
    icon: BuyIcon,
    color: '#102A43',
  },
  {
    step: '02',
    title: 'อ่าน (Read)',
    desc: 'เพลิดเพลินกับเรื่องราว ความรู้ และแรงบันดาลใจจากเล่มโปรด',
    icon: ReadIcon,
    color: '#1769AA',
  },
  {
    step: '03',
    title: 'ขายต่อ (Resell)',
    desc: 'เมื่ออ่านจบแล้ว เปลี่ยนหนังสือบนชั้นให้กลายเป็นรายได้คืนกลับมา',
    icon: SellIcon,
    color: '#2E7D5B',
  },
  {
    step: '04',
    title: 'ส่งต่อ (Pass on)',
    desc: 'ส่งต่อเรื่องราวและคุณค่าของหนังสือไปยังเจ้าของคนใหม่',
    icon: ShareIcon,
    color: '#B7791F',
  },
  {
    step: '05',
    title: 'อ่านต่อ (Loop & Repeat)',
    desc: 'เกิดเป็นวงจรการอ่านที่ไม่รู้จบ ลดการตัดต้นไม้และสร้างสังคมแห่งการแบ่งปัน',
    icon: LoopIcon,
    color: '#102A43',
  },
];

export const BookLoopJourney: React.FC = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
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
            HOW BOOKLOOP WORKS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
            วงจรการอ่านที่ไม่สิ้นสุด
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', fontWeight: 'normal' }}>
            หนังสือทุกเล่มไม่ได้หยุดอยู่ที่คนคนเดียว แต่หมุนเวียนสร้างคุณค่าใหม่ได้ตลอดเวลา
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={item.step}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 3,
                      position: 'relative',
                      border: '1px solid #D9E2EC',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(16, 42, 67, 0.08)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: `${item.color}15`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28 }} />
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        letterSpacing: 1,
                        display: 'block',
                      }}
                    >
                      STEP {item.step}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {item.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
