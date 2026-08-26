import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { CheckCircle as CheckIcon, Security as SecurityIcon } from '@mui/icons-material';

export const VerificationChecklist: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          Verification Checklist & แผนงานต่อยอดสู่ Production
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
          ตรวจสอบความพร้อมของระบบและแนวทางการเชื่อมต่อ Backend / Database ในอนาคต
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: '#059669' }} />
              Frontend Verification Checklist
            </Typography>
            <Stack spacing={1.5}>
              {[
                'เปิดทุก Route ได้โดยตรง (Home, Books, Detail, Sell, About, Campaign, Cart, TechStack)',
                'ระบบค้นหา กรองหมวดหมู่ สภาพ และราคา ทำงานสมบูรณ์แบบ',
                'หน้ารายละเอียดหนังสือแสดงรูปภาพ สภาพ ผู้ขาย รีวิว และเรื่องราว',
                'ระบบตะกร้าสินค้า เพิ่ม/ลด/ลบ และคำนวณยอดเงินประหยัดได้จริง',
                'Wishlist บันทึกและโหลดจาก localStorage ได้อย่างถูกต้อง',
                'Responsive Navigation Bar มีระยะห่างที่พอเหมาะ ไม่เบียดกัน',
                'มี Fallback Image เมื่อรูปภาพไม่สามารถโหลดได้',
                'ผ่านการตรวจ Type Check ด้วย TypeScript Compiler ปราศจาก Error',
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <CheckIcon sx={{ color: '#059669', fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.55 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ color: 'secondary.main' }} />
              Roadmap สู่ระบบ Full Production
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ p: 1.75, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  1. Backend REST/GraphQL API
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mt: 0.5, lineHeight: 1.5 }}>
                  จัดการ Catalog, User, Seller, Order และ Review พร้อม Rate Limiting และ JWT Auth
                </Typography>
              </Box>
              <Box sx={{ p: 1.75, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  2. Database & Object Storage
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mt: 0.5, lineHeight: 1.5 }}>
                  PostgreSQL / Cloud SQL พร้อม Cloud Storage สำหรับเก็บรูปถ่ายจริงจากผู้ขาย
                </Typography>
              </Box>
              <Box sx={{ p: 1.75, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  3. Payment Gateway Integration
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mt: 0.5, lineHeight: 1.5 }}>
                  เชื่อมต่อระบบ PromptPay, บัตรเครดิต และระบบ Escrow ปลอดภัยสำหรับผู้ซื้อ/ผู้ขาย
                </Typography>
              </Box>
              <Box sx={{ p: 1.75, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  4. Real-time Chat & Notification
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mt: 0.5, lineHeight: 1.5 }}>
                  ระบบแชตสอบถามสภาพหนังสือระหว่างผู้ซื้อและผู้ขายแบบเรียลไทม์
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
