import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { colorTokens } from './techStackData';

export const DesignTokensSection: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          Design Tokens & Thai Typography Hierarchy
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
          ระบบชุดสีและข้อกำหนดด้านการแสดงผลตัวอักษรภาษาไทยที่กำหนดไว้ใน <code>src/theme/tokens.ts</code> เพื่อให้ความรู้สึกน่าเชื่อถือ สบายตา และมีอัตลักษณ์แบบ Modern Marketplace
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {colorTokens.map((token, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  height: 60,
                  bgcolor: token.hex,
                  borderRadius: 1.5,
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: token.darkText ? '#102A43' : '#FFFFFF',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                {token.hex}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {token.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mt: 0.5, lineHeight: 1.5 }}>
                  {token.usage}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Typography Specs */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Typography Hierarchy สำหรับภาษาไทยและภาษาอังกฤษ
        </Typography>
        <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2, bgcolor: '#F8FAFC' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            หัวข้อหลัก Display H3: ตลาดหนังสือมือสอง BookLoop
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main', mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
            หัวข้อย่อย H5: ส่งต่อหนังสือที่คุณรัก ให้กลายเป็นแรงบันดาลใจของคนต่อไป
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8, mb: 2 }}>
            <strong>Body 1 (16px / Line-height 1.7):</strong> ขนาดฟอนต์มาตรฐานสำหรับเนื้อหาหลัก คำอธิบายรายละเอียดหนังสือ และเรื่องราวการส่งต่อของผู้ขาย ออกแบบให้อ่านสบายตา มีช่องไฟที่พอเหมาะ และรองรับภาษาไทยอย่างสมบูรณ์แบบ
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
            <strong>Body 2 & Caption (14px / 12px):</strong> สำหรับ Metadata, แท็กหมวดหมู่, รหัส ISBN, วันที่ลงขาย, ราคาเดิม และป้ายบอกสภาพสินค้า
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
