import React from 'react';
import { Box } from '@mui/material';
import {
  ShoppingCartOutlined as BuyIcon,
  MenuBookOutlined as ReadIcon,
  LocalAtmOutlined as SellIcon,
  ShareOutlined as PassOnIcon,
  LoopOutlined as RepeatIcon,
} from '@mui/icons-material';
import { AppContainer } from './common/Container';
import { SectionHeader } from './common/SectionHeader';
import { TimelineStep } from './home/TimelineStep';

const loopSteps = [
  {
    stepNumber: '01',
    title: 'ซื้อ',
    subtitle: '(Buy)',
    desc: 'เลือกซื้อหนังสือมือสองสภาพดีในราคา 40-70% ของราคาปก',
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
    desc: 'อ่านจบแล้วลงประกาศขายต่อในราคาที่คุณตั้งเอง',
    icon: <SellIcon sx={{ fontSize: 24 }} />,
    color: '#2E7D5B',
  },
  {
    stepNumber: '04',
    title: 'ส่งต่อ',
    subtitle: '(Pass on)',
    desc: 'ส่งต่อให้เจ้าของคนใหม่ผ่านชุมชน BookLoop',
    icon: <PassOnIcon sx={{ fontSize: 24 }} />,
    color: '#B7791F',
  },
  {
    stepNumber: '05',
    title: 'อ่านต่อ',
    subtitle: '(Loop & Repeat)',
    desc: 'หนังสือเล่มเดิมถูกอ่านซ้ำและส่งต่อได้หลายรอบ ลดขยะกระดาษ',
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
          title="อ่านจบ ส่งต่อ แล้วเริ่มเล่มใหม่"
          subtitle="หนังสือที่คุณอ่านจบแล้วลงประกาศขายต่อได้ และเมื่อเจ้าของคนใหม่ยังอ่านจบ ก็ส่งต่อให้คนถัดไปได้อีกครั้งในชุมชน BookLoop"
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

        </Box>
      </AppContainer>
    </Box>
  );
};
