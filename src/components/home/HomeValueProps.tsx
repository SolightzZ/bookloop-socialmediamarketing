import React from 'react';
import { Box, Grid } from '@mui/material';
import {
  SavingsOutlined as SavingsIcon,
  CategoryOutlined as CategoryIcon,
  LocalOfferOutlined as OfferIcon,
  VerifiedUserOutlined as ShieldIcon,
} from '@mui/icons-material';
import { AppContainer } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { ValueCard } from './ValueCard';

const valueProps = [
  {
    number: '01',
    icon: <SavingsIcon sx={{ fontSize: 26 }} />,
    title: 'ราคาที่เข้าถึงง่าย',
    desc: 'หนังสือคุณภาพดีในราคาประหยัดกว่า 40-70% ช่วยให้คุณอ่านหนังสือได้มากขึ้นในงบประมาณที่คุ้มค่า',
    color: '#2E7D5B',
    accentBg: '#E8F5E9',
  },
  {
    number: '02',
    icon: <CategoryIcon sx={{ fontSize: 26 }} />,
    title: 'หนังสือหลากหลายหมวด',
    desc: 'รวบรวมหนังสือหายาก เล่มที่เลิกพิมพ์ และหนังสือยอดนิยมจากเพื่อนนักอ่านทั่วประเทศในที่เดียว',
    color: '#1976D2',
    accentBg: '#EBF3FA',
  },
  {
    number: '03',
    icon: <OfferIcon sx={{ fontSize: 26 }} />,
    title: 'ขายต่อง่าย ได้เงินคืน',
    desc: 'เมื่ออ่านจบแล้ว เปลี่ยนหนังสือบนชั้นให้กลายเป็นทุนสำหรับซื้อเล่มต่อไปได้ทันที ไม่มีขั้นตอนยุ่งยาก',
    color: '#B7791F',
    accentBg: '#FEF3C7',
  },
  {
    number: '04',
    icon: <ShieldIcon sx={{ fontSize: 26 }} />,
    title: 'ซื้อขายอย่างมั่นใจ',
    desc: 'ระบบระบุสภาพอย่างละเอียด มีรูปถ่ายจากเล่มจริง พร้อมระบบตรวจสอบผู้ขายที่โปร่งใสและปลอดภัย',
    color: '#0F2D4A',
    accentBg: '#E2E8F0',
  },
];

export const HomeValueProps: React.FC = () => {
  return (
    <Box
      component="section"
      id="why-bookloop"
      aria-labelledby="why-bookloop-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#FFFFFF',
      }}
    >
      <AppContainer>
        <SectionHeader
          id="why-bookloop-heading"
          eyebrow="WHY BOOKLOOP"
          title="คุณค่าที่เรามุ่งมั่นส่งมอบ"
          subtitle="ไม่ใช่แค่มาร์เก็ตเพลส แต่เป็นวิถีชีวิตของนักอ่านที่รักการเรียนรู้และเชื่อในการแบ่งปัน"
          align="center"
        />

        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
          {valueProps.map((vp) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={vp.number}>
              <ValueCard
                number={vp.number}
                icon={vp.icon}
                title={vp.title}
                desc={vp.desc}
                color={vp.color}
                accentBg={vp.accentBg}
              />
            </Grid>
          ))}
        </Grid>
      </AppContainer>
    </Box>
  );
};
