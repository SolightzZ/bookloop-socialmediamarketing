import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  ShoppingCartOutlined as BuyIcon,
  MenuBookOutlined as ReadIcon,
  LocalAtmOutlined as SellIcon,
  ShareOutlined as PassOnIcon,
  LoopOutlined as RepeatIcon,
  Sync as LoopBadgeIcon,
} from '@mui/icons-material';
import { AppContainer } from './common/Container';
import { SectionHeader } from './common/SectionHeader';
import { TimelineStep } from './home/TimelineStep';

const loopSteps = [
  {
    stepNumber: '01',
    title: 'ซื้อ',
    subtitle: '(Buy)',
    desc: 'เลือกซื้อหนังสือมือสองสภาพดีในราคาประหยัดกว่า 40-70%',
    icon: <BuyIcon sx={{ fontSize: 24 }} />,
    color: '#0F2D4A',
  },
  {
    stepNumber: '02',
    title: 'อ่าน',
    subtitle: '(Read)',
    desc: 'เพลิดเพลินกับเรื่องราว ความรู้ และแรงบันดาลใจจากเล่มโปรด',
    icon: <ReadIcon sx={{ fontSize: 24 }} />,
    color: '#1976D2',
  },
  {
    stepNumber: '03',
    title: 'ขายต่อ',
    subtitle: '(Resell)',
    desc: 'เมื่ออ่านจบแล้ว เปลี่ยนหนังสือบนชั้นให้กลายเป็นรายได้คืนกลับมา',
    icon: <SellIcon sx={{ fontSize: 24 }} />,
    color: '#2E7D5B',
  },
  {
    stepNumber: '04',
    title: 'ส่งต่อ',
    subtitle: '(Pass on)',
    desc: 'ส่งต่อเรื่องราวและคุณค่าของหนังสือไปยังเพื่อนนักอ่านคนใหม่',
    icon: <PassOnIcon sx={{ fontSize: 24 }} />,
    color: '#B7791F',
  },
  {
    stepNumber: '05',
    title: 'อ่านต่อ',
    subtitle: '(Loop & Repeat)',
    desc: 'เกิดเป็นวงจรการอ่านที่ไม่รู้จบ ลดการตัดต้นไม้และสร้างสังคมแห่งการแบ่งปัน',
    icon: <RepeatIcon sx={{ fontSize: 24 }} />,
    color: '#0F2D4A',
  },
];

export const BookLoopJourney: React.FC = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      aria-labelledby="how-bookloop-works-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#F7F9FC',
        borderTop: '1px solid #D9E2EC',
        borderBottom: '1px solid #D9E2EC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AppContainer>
        <SectionHeader
          id="how-bookloop-works-heading"
          eyebrow="HOW BOOKLOOP WORKS"
          title="วงจรการอ่านที่ไม่สิ้นสุด"
          subtitle="หนังสือทุกเล่มไม่ได้หยุดอยู่ที่คนคนเดียว แต่หมุนเวียนสร้างคุณค่าใหม่ได้ตลอดเวลาใน BookLoop"
          align="center"
        />

        {/* DESKTOP TIMELINE (Visible on md and up) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            mt: 6,
            mb: 4,
          }}
        >
          {/* Connecting Line Running Behind Nodes: 01 ──── 02 ──── 03 ──── 04 ──── 05 */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              top: 28,
              left: '10%',
              right: '10%',
              height: 3,
              background: 'linear-gradient(90deg, #0F2D4A 0%, #1976D2 25%, #2E7D5B 50%, #B7791F 75%, #0F2D4A 100%)',
              zIndex: 1,
              borderRadius: 2,
            }}
          />

          {/* Steps Container */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {loopSteps.map((item, index) => (
              <TimelineStep
                key={item.stepNumber}
                stepNumber={item.stepNumber}
                title={item.title}
                subtitle={item.subtitle}
                desc={item.desc}
                icon={item.icon}
                color={item.color}
                isLast={index === loopSteps.length - 1}
                isDesktop={true}
              />
            ))}
          </Box>

          {/* Visual Continuous Loop Return Curve */}
          <Box
            sx={{
              mt: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              py: 1.5,
              px: 3,
              borderRadius: 50,
              bgcolor: '#FFFFFF',
              border: '1px solid #D9E2EC',
              maxWidth: 480,
              mx: 'auto',
              boxShadow: '0 4px 12px rgba(15, 45, 74, 0.04)',
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                color: '#1976D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LoopBadgeIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#0F2D4A',
                fontSize: '0.85rem',
                letterSpacing: '0.01em',
              }}
            >
              วงจรหมุนเวียนต่อเนื่อง: อ่านต่อ → ส่งต่อ → ค้นพบเล่มใหม่
            </Typography>
          </Box>
        </Box>

        {/* MOBILE & TABLET VERTICAL TIMELINE (Visible on xs & sm) */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            maxWidth: 480,
            mx: 'auto',
            mt: 4,
          }}
        >
          {loopSteps.map((item, index) => (
            <TimelineStep
              key={item.stepNumber}
              stepNumber={item.stepNumber}
              title={item.title}
              subtitle={item.subtitle}
              desc={item.desc}
              icon={item.icon}
              color={item.color}
              isLast={index === loopSteps.length - 1}
              isDesktop={false}
            />
          ))}

          {/* Mobile Loop Return Indicator */}
          <Box
            sx={{
              mt: 2,
              ml: 6,
              p: 2,
              borderRadius: 2.5,
              bgcolor: '#FFFFFF',
              border: '1px solid #D9E2EC',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <LoopBadgeIcon sx={{ color: '#1976D2', fontSize: 20 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.8rem' }}>
              วนกลับสู่การอ่านเล่มใหม่ สร้างวงจรที่ไม่สิ้นสุด
            </Typography>
          </Box>
        </Box>
      </AppContainer>
    </Box>
  );
};
