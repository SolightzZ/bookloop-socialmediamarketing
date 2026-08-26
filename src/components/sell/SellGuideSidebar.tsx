import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  HelpOutlineRounded as HelpIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export interface ConditionGuideItem {
  value: string;
  label: string;
  desc: string;
}

export const SELL_CONDITIONS: ConditionGuideItem[] = [
  { value: 'Excellent', label: 'Excellent - สภาพดีเยี่ยม (95%+)', desc: 'สภาพใกล้เคียงหนังสือใหม่ ไม่มีรอยขีดเขียน สันปกตรงสวย' },
  { value: 'Very Good', label: 'Very Good - สภาพดีมาก (85-94%)', desc: 'มีร่องรอยการอ่านเล็กน้อย ขอบไม่เหลือง ไม่มีหน้าขาด' },
  { value: 'Good', label: 'Good - สภาพปานกลาง (70-84%)', desc: 'มีรอยพับหรือรอยขีดเขียนเล็กน้อย เนื้อหาอ่านได้สมบูรณ์' },
  { value: 'Acceptable', label: 'Acceptable - สภาพพอใช้ (50-69%)', desc: 'มีรอยไฮไลต์ ชัดเจน สันหนังสือผ่านการใช้งานหนัก แต่ครบทุกหน้า' },
];

export const SellGuideSidebar: React.FC = () => {
  return (
    <Box sx={{ position: { md: 'sticky' }, top: 90 }}>
      {/* 5 Steps to pass on books */}
      <Paper sx={{ p: 3, borderRadius: 2.5, border: '1px solid #D9E2EC', bgcolor: '#FFFFFF', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          5 ขั้นตอนการส่งต่อหนังสือ
        </Typography>
        <Stepper orientation="vertical" sx={{ mt: 3 }}>
          {[
            'ถ่ายรูปหนังสือหน้าปกและตำหนิ',
            'ระบุชื่อ ผู้เขียน และหมวดหมู่',
            'ประเมินสภาพอย่างโปร่งใส',
            'ตั้งราคาและเขียนเรื่องราวส่งต่อ',
            'รอหนังสือเดินทางไปหาเจ้าของใหม่',
          ].map((label) => (
            <Step key={label} active={true}>
              <StepLabel
                icon={<CheckIcon sx={{ color: 'secondary.main', fontSize: 20 }} />}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Condition Guide Accordion */}
      <Accordion sx={{ borderRadius: '10px !important', border: '1px solid #D9E2EC', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              เกณฑ์การประเมินสภาพหนังสือ
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {SELL_CONDITIONS.map((c) => (
            <Box key={c.value} sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'block' }}>
                • {c.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {c.desc}
              </Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Why Sell on BookLoop */}
      <Box sx={{ mt: 3, p: 2.5, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #D9E2EC' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          ทำไมต้องขายบน BookLoop?
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.7 }}>
          ✓ เข้าถึงคนรักการอ่านโดยตรง<br />
          ✓ ระบบไม่มีค่าธรรมเนียมแอบแฝง<br />
          ✓ ร่วมส่งเสริมการลดขยะกระดาษอย่างยั่งยืน
        </Typography>
      </Box>
    </Box>
  );
};
