import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  Loop as LoopIcon,
  MenuBook as BookIcon,
  Favorite as HeartIcon,
  Recycling as EcoIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';

export const AboutValueCards: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 1.2 }}>
          MUTUAL VALUE
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          คุณค่าที่ส่งถึงทุกคนในคอมมูนิตี้
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* For Buyers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <SavingsIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                สำหรับผู้ซื้อ (For Readers)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
              • <strong>ประหยัดค่าใช้จ่าย 40-70%:</strong> อ่านหนังสือคุณภาพดีได้มากขึ้นโดยไม่ต้องจ่ายราคาเต็ม
              <br />
              • <strong>ความโปร่งใสในสภาพหนังสือ:</strong> ระบบรูปถ่ายจริงและการระบุเกณฑ์สภาพอย่างชัดเจน
              <br />
              • <strong>สัมผัสคุณค่าทางใจ:</strong> ได้อ่านเรื่องราวและแรงบันดาลใจจากเจ้าของคนเดิมก่อนหน้า
            </Typography>
          </Paper>
        </Grid>

        {/* For Sellers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <LoopIcon sx={{ fontSize: 32, color: 'success.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                สำหรับผู้ขาย (For Pass-on Sellers)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
              • <strong>เปลี่ยนหนังสือเป็นเงินทุน:</strong> คืนพื้นที่บนชั้นหนังสือและนำเงินไปหมุนเวียนซื้อเล่มใหม่
              <br />
              • <strong>ลงขายสะดวกรวดเร็ว:</strong> ระบบแนะนำหมวดหมู่และกรอกข้อมูลง่ายใน 5 ขั้นตอน
              <br />
              • <strong>ส่งต่อคุณค่า:</strong> มั่นใจว่าหนังสือของคุณจะได้ไปอยู่ในมือของคนที่สนใจและพร้อมดูแลต่อ
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 3 Pillars of Impact */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <BookIcon sx={{ fontSize: 44, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ส่งเสริมการอ่านทั่วถึง
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              ลดช่องว่างทางงบประมาณ เพื่อให้ทุกคนสามารถเข้าถึงหนังสือและความรู้ได้อย่างเท่าเทียม
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <EcoIcon sx={{ fontSize: 44, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ยั่งยืนและลดขยะ (Sustainability)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              ยืดอายุการใช้งานของกระดาษและทรัพยากรธรรมชาติผ่านการหมุนเวียนหนังสือซ้ำ
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <HeartIcon sx={{ fontSize: 44, color: '#E11D48', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ชุมชนส่งต่อความรู้สึก (Community)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              เชื่อมโยงผู้คนผ่านเรื่องราวเบื้องหลัง ความทรงจำ และความประทับใจในหนังสือแต่ละเล่ม
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
