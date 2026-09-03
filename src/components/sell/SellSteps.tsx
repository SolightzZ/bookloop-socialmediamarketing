import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircleRounded as CompletedIcon,
  CameraAltRounded,
  MenuBookRounded,
  VerifiedRounded,
  LocalOfferRounded,
  RocketLaunchRounded,
  HelpOutlineRounded as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  GroupsRounded,
  ShieldOutlined,
  ParkRounded,
} from '@mui/icons-material';

export interface ConditionGuideItem {
  value: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
}

export const SELL_CONDITIONS: ConditionGuideItem[] = [
  {
    value: 'Excellent',
    label: 'สภาพดีเยี่ยม (95%+)',
    desc: 'สภาพใกล้เคียงหนังสือใหม่ ไม่มีรอยขีดเขียน สันปกตรงสวย',
    color: '#16A34A',
    bg: '#DCFCE7',
  },
  {
    value: 'Very Good',
    label: 'สภาพดีมาก (85-94%)',
    desc: 'มีร่องรอยการอ่านเล็กน้อย ขอบไม่เหลือง ไม่มีหน้าขาด',
    color: '#1D4ED8',
    bg: '#DBEAFE',
  },
  {
    value: 'Good',
    label: 'สภาพปานกลาง (70-84%)',
    desc: 'มีรอยพับหรือรอยขีดเขียนเล็กน้อย เนื้อหาอ่านได้สมบูรณ์',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    value: 'Acceptable',
    label: 'สภาพพอใช้ (50-69%)',
    desc: 'มีรอยไฮไลต์ ชัดเจน สันหนังสือผ่านการใช้งาน แต่ครบทุกหน้า',
    color: '#EA580C',
    bg: '#FFEDD5',
  },
];

interface SellStepsProps {
  currentStepIndex: number; // 0 to 4
  completedStepIndices: number[];
}

export const SellSteps: React.FC<SellStepsProps> = ({
  currentStepIndex,
  completedStepIndices,
}) => {
  const stepLabels = [
    { title: 'รูปภาพหนังสือ', desc: 'ถ่ายรูปปกและตำหนิ', icon: <CameraAltRounded sx={{ fontSize: 18 }} /> },
    { title: 'ข้อมูลพื้นฐาน', desc: 'ชื่อ ผู้เขียน หมวดหมู่', icon: <MenuBookRounded sx={{ fontSize: 18 }} /> },
    { title: 'ประเมินสภาพ', desc: 'ระบุสภาพตามจริง', icon: <VerifiedRounded sx={{ fontSize: 18 }} /> },
    { title: 'ตั้งราคาขาย', desc: 'กำหนดราคาที่คุ้มค่า', icon: <LocalOfferRounded sx={{ fontSize: 18 }} /> },
    { title: 'ตรวจสอบ & ส่งต่อ', desc: 'พร้อมขึ้นระบบ BookLoop', icon: <RocketLaunchRounded sx={{ fontSize: 18 }} /> },
  ];

  const progressPercent = Math.round((completedStepIndices.length / stepLabels.length) * 100);

  return (
    <Box
      component="aside"
      aria-label="ขั้นตอนการส่งต่อหนังสือ"
      sx={{ position: { md: 'sticky' }, top: 88 }}
    >
      {/* 5 Steps Interactive Progression Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3.5,
          border: '1.5px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          mb: 2.5,
          boxShadow: '0 2px 10px rgba(15, 45, 74, 0.04)',
        }}
      >
        {/* Header & Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.95rem' }}
            >
              ขั้นตอนการส่งต่อ
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: '#1976D2', fontSize: '0.8rem' }}
            >
              {progressPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                bgcolor: progressPercent === 100 ? '#16A34A' : '#1976D2',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Steps List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {stepLabels.map((step, idx) => {
            const isCompleted = completedStepIndices.includes(idx);
            const isCurrent = currentStepIndex === idx && !isCompleted;

            return (
              <Box
                key={step.title}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: 2.5,
                  bgcolor: isCurrent ? '#F0F7FF' : isCompleted ? '#F8FAFC' : 'transparent',
                  border: isCurrent ? '1px solid #BFDBFE' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Step Icon Badge */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: isCompleted ? '#DCFCE7' : isCurrent ? '#1976D2' : '#F1F5F9',
                    color: isCompleted ? '#16A34A' : isCurrent ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  {isCompleted ? <CompletedIcon sx={{ fontSize: 18 }} /> : step.icon}
                </Box>

                {/* Step Text */}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isCurrent ? 800 : isCompleted ? 700 : 600,
                      color: isCurrent ? '#1976D2' : isCompleted ? '#0F2D4A' : '#64748B',
                      fontSize: '0.85rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isCurrent ? '#2563EB' : '#94A3B8',
                      fontSize: '0.725rem',
                      display: 'block',
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Condition Guide Accordion */}
      <Accordion
        elevation={0}
        sx={{
          borderRadius: '14px !important',
          border: '1.5px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          mb: 2.5,
          boxShadow: '0 2px 8px rgba(15, 45, 74, 0.03)',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#64748B' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpIcon sx={{ fontSize: 18, color: '#1976D2' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.85rem' }}>
              เกณฑ์สภาพหนังสือ
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
          {SELL_CONDITIONS.map((c) => (
            <Box
              key={c.value}
              sx={{
                mb: 1.2,
                pb: 1,
                borderBottom: '1px solid #F1F5F9',
                '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    bgcolor: c.bg,
                    color: c.color,
                    fontWeight: 800,
                    fontSize: '0.72rem',
                  }}
                >
                  {c.value}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2D4A' }}>
                  {c.label}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.75rem', lineHeight: 1.4 }}>
                {c.desc}
              </Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Why Sell on BookLoop Modern Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          bgcolor: '#F8FAFC',
          borderRadius: 3.5,
          border: '1.5px solid #E2E8F0',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A', mb: 1.5, fontSize: '0.85rem' }}>
          ทำไมต้องส่งต่อบน BookLoop?
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <GroupsRounded sx={{ fontSize: 18, color: '#1976D2', mt: 0.2 }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.4 }}>
              <strong className="text-slate-800">ชุมชนคนรักหนังสือ:</strong> เข้าถึงผู้ซื้อที่รักและเห็นคุณค่าของหนังสือจริง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <ShieldOutlined sx={{ fontSize: 18, color: '#16A34A', mt: 0.2 }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.4 }}>
              <strong className="text-slate-800">ปลอดภัย โปร่งใส:</strong> ซื้อขายผ่านระบบ ไม่หักค่าธรรมเนียมแอบแฝง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <ParkRounded sx={{ fontSize: 18, color: '#059669', mt: 0.2 }} />
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.4 }}>
              <strong className="text-slate-800">หมุนเวียนคุณค่า:</strong> ร่วมลดขยะกระดาษและส่งต่อเรื่องราวดีๆ สู่สังคม
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
