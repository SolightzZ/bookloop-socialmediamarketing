import React, { useState } from 'react';
import {
   Box,
   Typography,
   Grid,
   TextField,
   InputAdornment,
   Chip,
   Paper,
   Slider,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Button,
} from '@mui/material';
import {
   CheckCircleRounded as CheckIcon,
   RemoveCircleOutlineRounded as RemoveIcon,
   CalculateOutlined as CalcIcon,
   AutorenewOutlined as CircularIcon,
   SellOutlined as SellIcon,
   StorefrontOutlined as StoreIcon,
   PercentOutlined as PercentIcon,
   QrCode2Outlined as QrIcon,
   LocalShippingOutlined as ShippingIcon,
   ShieldOutlined as ShieldIcon,
   ShoppingBagOutlined as BuyerIcon,
   ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '../components/common/Container';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';

export default function PricingPage() {
   const navigate = useNavigate();
   const [calcPrice, setCalcPrice] = useState<number>(250);
   const [activeMobilePlan, setActiveMobilePlan] = useState<string>('seller');

   // 4 เปรียบเทียบได้จริง (ตัด "ค่าบริการระบบ" ที่ทุกแผน ฿0 เหมือนกันออก)
   const planCriteria = [
      { key: 0, label: 'ค่าคอมมิชชั่นการขาย', icon: PercentIcon },
      { key: 1, label: 'ช่องทางชำระเงิน / รับเงิน', icon: QrIcon },
      { key: 2, label: 'ความคุ้มครอง & ความปลอดภัย', icon: ShieldIcon },
      { key: 3, label: 'ระบบส่งต่อ (Circular Loop)', icon: CircularIcon },
   ];

   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
      setCalcPrice(Math.min(Math.max(val, 0), 5000));
   };

   // Calculations
   const sellerPayout = calcPrice;
   const competitorFeePercent = 0.15; // Average 15% marketplace commission
   const competitorPayout = Math.round(calcPrice * (1 - competitorFeePercent));
   const savedMoney = calcPrice - competitorPayout;

   const valuePillars = [
      {
         value: '0%',
         title: 'ค่าคอมมิชชั่นการขาย',
         description: 'ลงขายฟรี ไม่หักส่วนแบ่งรายได้จากการส่งต่อ',
      },
      {
         value: '100%',
         title: 'รายได้เข้ากระเป๋าผู้ส่งต่อ',
         description: 'ขายได้เท่าไหร่ รับเต็มจำนวนผ่าน PromptPay QR',
      },
      {
         value: '40–70%',
         title: 'ประหยัดกว่าซื้อมือหนึ่ง',
         description: 'หนังสือคุณภาพดีในราคาที่เข้าถึงได้',
      },
   ];

   const comparisonRows = [
      {
         feature: 'ค่าลงทะเบียน / เปิดบัญชีขาย',
         bookloop: 'ฟรี ไม่มีค่าใช้จ่าย',
         bookloopSub: 'ไม่คิดค่าแรกเข้าหรือค่าดูแลระบบ',
         other: 'ฟรี หรือมีค่าบริการร้านค้า',
         otherSub: 'บางที่มีแพ็กเกจร้านค้าทางการ',
         icon: StoreIcon,
      },
      {
         feature: 'ค่าธรรมเนียมคอมมิชชั่นการขาย',
         bookloop: '0% (ฟรีตลอดชีพ)',
         bookloopSub: 'ขายได้เท่าไหร่รับเงินเต็มจำนวน',
         other: '10% – 18% ต่อรายการ',
         otherSub: 'หักเปอร์เซ็นต์ทุกออเดอร์',
         icon: PercentIcon,
      },
      {
         feature: 'ค่าธรรมเนียมระบบการชำระเงิน PromptPay QR',
         bookloop: '฿0 (ไม่มีหัก)',
         bookloopSub: 'สแกนจ่ายตรง ไร้ค่าธรรมเนียมรูดบัตรแฝง',
         other: '2% – 3% + VAT',
         otherSub: 'หักค่า Payment Gateway เพิ่มเติม',
         icon: QrIcon,
      },
      {
         feature: 'ค่าจัดส่งพัสดุ',
         bookloop: 'คิดตามจริงจากขนส่ง',
         bookloopSub: 'ผู้ซื้อจ่ายตามเรตจริง Flash / Kerry / ปณ.ไทย',
         other: 'มักมีบวกค่าบริการแพลตฟอร์ม',
         otherSub: 'มีส่วนต่างค่าขนส่งและค่าเข้ารับพัสดุ',
         icon: ShippingIcon,
      },
      {
         feature: 'การันตีคุ้มครองสภาพหนังสือไม่ตรงปก',
         bookloop: 'คืนเงินเต็มจำนวนภายใน 48 ชม.',
         bookloopSub: 'อนุมัติไว คุ้มครองผู้ซื้อตรงไปตรงมา',
         other: 'ขั้นตอนซับซ้อน',
         otherSub: 'ต้องรอส่งเรื่องและมีเงื่อนไขเยอะ',
         icon: ShieldIcon,
      },
      {
         feature: 'ระบบส่งต่อหนังสือเล่มเดิมหลังอ่านจบ (Circular Loop)',
         bookloop: 'ลงขายต่อได้ใน 1 คลิก',
         bookloopSub: 'ดึงข้อมูลและรูปเดิมทันที ไม่ต้องพิมพ์ซ้ำ',
         other: 'ไม่มีระบบบันทึกความทรงจำ',
         otherSub: 'ต้องพิมพ์ข้อมูลและถ่ายรูปใหม่ทั้งหมด',
         icon: CircularIcon,
      },
   ];

   const pricingPlans = [
      {
         id: 'buyer',
         name: 'นักอ่านผู้ซื้อ',
         role: 'ค้นพบและสะสมหนังสือ',
         badge: 'สำหรับผู้ซื้อ',
          price: '฿0',
          period: 'ฟรีตลอดชีพ ไม่มีค่าบริการแฝง',
          description: 'จ่ายเฉพาะค่าหนังสือและค่าจัดส่งจริงตามขนส่ง',
          specs: [
             {
                criterion: 'ค่าคอมมิชชั่นการขาย',
                value: 'ไม่มี (ผู้ซื้อไม่ต้องจ่าย)',
                detail: 'จ่ายเฉพาะค่าหนังสือและค่าจัดส่งจริง',
                highlight: false,
             },
             {
                criterion: 'ช่องทางชำระเงิน / รับเงิน',
               value: 'PromptPay QR ไร้ค่าตัดบัตร',
               detail: 'สแกนจ่ายตรง ไม่มีบวกเปอร์เซ็นต์แฝง',
               highlight: false,
            },
            {
               criterion: 'ความคุ้มครอง & ความปลอดภัย',
               value: 'การันตีคืนเงินใน 48 ชม.',
               detail: 'คุ้มครองเต็มจำนวนหากสภาพไม่ตรงปก',
               highlight: false,
            },
            {
               criterion: 'ระบบส่งต่อ (Circular Loop)',
               value: 'ขายต่อใน 1 คลิกหลังอ่านจบ',
               detail: 'ดึงข้อมูลและรูปเดิมทันที ไม่ต้องพิมพ์ซ้ำ',
               highlight: false,
            },
         ],
         ctaText: 'เริ่มค้นหาหนังสือ',
         ctaLink: '/books',
         highlighted: false,
         icon: BuyerIcon,
      },
      {
         id: 'seller',
         name: 'นักอ่านผู้ส่งต่อ',
         role: 'ส่งต่อหนังสือและเคลียร์ชั้น',
         badge: 'แนะนำ • ผู้ส่งต่อ',
          price: '0%',
          period: 'ค่าคอมมิชชั่นตลอดชีพ (ฟรี 100%)',
          description: 'ขายได้เท่าไหร่ รับเงินเต็มจำนวน ไม่มีค่าแรกเข้า',
          specs: [
             {
                criterion: 'ค่าคอมมิชชั่นการขาย',
                value: '0% ตลอดชีพ ไม่หักส่วนแบ่ง',
                detail: 'รับเงินเต็ม 100% โอนตรงเข้าบัญชี',
                highlight: true,
             },
             {
                criterion: 'ช่องทางชำระเงิน / รับเงิน',
               value: 'โอนตรงเข้าบัญชีผ่าน PromptPay',
               detail: 'รับเงินเต็มจำนวน ไร้ค่าธรรมเนียมโอน',
               highlight: true,
            },
            {
               criterion: 'ความคุ้มครอง & ความปลอดภัย',
               value: 'คุ้มครองผู้ขาย ไร้ Chargeback',
               detail: 'ระบบยืนยันสลิปถูกต้องก่อนส่งพัสดุ',
               highlight: false,
            },
            {
               criterion: 'ระบบส่งต่อ (Circular Loop)',
               value: 'ลงขายใน 3 นาที + แนบเรื่องราว',
               detail: 'ระบบช่วยตั้งราคาและส่งต่อความทรงจำ',
               highlight: false,
            },
         ],
         ctaText: 'เริ่มลงขายหนังสือ ฟรี 0%',
         ctaLink: '/sell',
         highlighted: true,
         icon: SellIcon,
      },
      {
         id: 'partner',
         name: 'ร้านค้าและพาร์ทเนอร์',
         role: 'ร้านหนังสืออิสระและผู้สะสม',
         badge: 'ร้านค้า & ชุมชน',
          price: '฿0',
          period: 'ไม่มีค่าบริการแพลตฟอร์มรายเดือน',
          description: 'กระจายหนังสือสู่มือนักอ่านรุ่นใหม่ ไร้สัญญาล็อค',
          specs: [
             {
                criterion: 'ค่าคอมมิชชั่นการขาย',
                value: '0% เท่าเทียมกับนักอ่านทั่วไป',
                detail: 'ไร้สัญญาผูกมัดหรือส่วนแบ่งแอบแฝง',
                highlight: false,
             },
             {
                criterion: 'ช่องทางชำระเงิน / รับเงิน',
               value: 'PromptPay QR & สรุปยอดบัญชี',
               detail: 'ระบบรายงานและสรุปยอดขายโปร่งใส',
               highlight: false,
            },
            {
               criterion: 'ความคุ้มครอง & ความปลอดภัย',
               value: 'ทีมงานช่วยดูแลประสานงาน',
               detail: 'ตรวจสอบความโปร่งใสและดูแลทุกออร์เดอร์',
               highlight: false,
            },
            {
               criterion: 'ระบบส่งต่อ (Circular Loop)',
               value: 'ปักหมุดร้าน & สต็อกหลายเล่ม',
               detail: 'เชื่อมโยงนักอ่านในพื้นที่และจัดการสต็อกง่าย',
               highlight: false,
            },
         ],
         ctaText: 'ติดต่อร่วมเป็นพาร์ทเนอร์',
         ctaLink: '/contact',
         highlighted: false,
         icon: StoreIcon,
      },
   ];

    const presetPrices = [150, 350, 850, 1500];

    return (
       <Box sx={{ bgcolor: '#F8FBFF', minHeight: '100vh', pb: { xs: 8, md: 14 } }}>
          <AppContainer sx={{ pt: { xs: 2.5, sm: 3.5, md: 5 } }}>
             {/* Breadcrumb Navigation */}
             <BreadcrumbsNav items={[{ label: 'ค่าธรรมเนียมและความโปร่งใส' }]} />

             {/* Hero — single column, one message, one action */}
             <Box sx={{ pt: { xs: 2, sm: 3.5, md: 5 }, pb: { xs: 5, sm: 7, md: 8 }, maxWidth: '72ch' }}>
                <Typography
                   variant="h1"
                   sx={{
                      fontSize: { xs: '2rem', sm: '2.5rem', md: 'clamp(2.25rem, 5vw, 3.5rem)' },
                      fontWeight: 800,
                      color: '#0F2D4A',
                      letterSpacing: '-0.025em',
                      lineHeight: { xs: 1.2, md: 1.15 },
                      mb: { xs: 2, sm: 2.5 },
                   }}>
                   โปร่งใส ชัดเจน ไร้ค่าธรรมเนียมแอบแฝง
                </Typography>

                <Typography
                   variant="body1"
                   sx={{
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      color: '#334155',
                      lineHeight: 1.75,
                      maxWidth: '65ch',
                      mb: { xs: 3.5, sm: 4 },
                   }}>
                   ผู้ขายรับเงินเต็ม 100% ไม่หักเปอร์เซ็นต์ ผู้ซื้อประหยัดกว่า 40–70% ไม่มีค่าบริการแฝงตอนจ่ายเงิน
                </Typography>

                <Button
                   variant="contained"
                   startIcon={<SellIcon />}
                   onClick={() => navigate('/sell')}
                   sx={{
                      minHeight: 48,
                      px: 3.5,
                      borderRadius: '8px',
                      bgcolor: '#0F2D4A',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                         bgcolor: '#102A43',
                         boxShadow: 'none',
                      },
                      '&:focus-visible': {
                         outline: '2px solid #1976D2',
                         outlineOffset: '2px',
                      },
                   }}>
                   เริ่มลงขายหนังสือ — ฟรี 0%
                </Button>
             </Box>

             {/* Plan Choices — one view, one secondary action */}
             <Box sx={{ mb: { xs: 8, sm: 10, md: 12 } }}>
                <Box
                   sx={{
                      mb: { xs: 3.5, sm: 4.5 },
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'flex-end' },
                      justifyContent: 'space-between',
                      gap: 2,
                   }}>
                   <Box>
                      <Typography
                         variant="h2"
                         sx={{
                            fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.9rem' },
                            fontWeight: 800,
                            color: '#0F2D4A',
                            letterSpacing: '-0.015em',
                            mb: 0.75,
                         }}>
                         ทางเลือกการใช้งานสำหรับทุกคน
                      </Typography>
                      <Typography
                         variant="body2"
                         sx={{
                            color: '#64748B',
                            fontSize: { xs: '0.875rem', sm: '0.925rem' },
                            maxWidth: '65ch',
                         }}>
                         ทุกบทบาทฟรี ไม่มีค่าธรรมเนียมแฝง — เลือกฝั่งของคุณแล้วเริ่มได้เลย
                      </Typography>
                   </Box>

                   <Button
                      size="small"
                      onClick={() => {
                         const el = document.getElementById('fee-comparison-table');
                         el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                         color: '#1976D2',
                         fontWeight: 700,
                         fontSize: '0.825rem',
                         textTransform: 'none',
                         p: 0,
                         minHeight: { xs: 44, md: 32 },
                         '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                         '&:focus-visible': {
                            outline: '2px solid #1976D2',
                            outlineOffset: '2px',
                         },
                      }}>
                      ดูตารางเทียบแพลตฟอร์มอื่น
                   </Button>
                </Box>

                {/* Single comparable card grid */}
                <Box>
                     {/* Mobile Plan Selector Tabs (Single-touch comparison on mobile) */}
                     <Box
                        sx={{
                           display: { xs: 'flex', md: 'none' },
                           mb: 2.5,
                           bgcolor: '#FFFFFF',
                           p: 0.5,
                           borderRadius: '8px',
                           border: '1px solid #E2E8F0',
                           gap: 0.5,
                        }}>
                        {pricingPlans.map((p) => {
                           const isSelected = activeMobilePlan === p.id;
                           return (
                              <Button
                                 key={p.id}
                                 onClick={() => setActiveMobilePlan(p.id)}
                                 sx={{
                                    flex: 1,
                                    minHeight: 44,
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: isSelected ? 800 : 600,
                                    bgcolor: isSelected ? (p.highlighted ? '#1976D2' : '#0F2D4A') : 'transparent',
                                    color: isSelected ? '#FFFFFF' : '#64748B',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                       bgcolor: isSelected ? (p.highlighted ? '#1565C0' : '#102A43') : '#F1F5F9',
                                    },
                                    '&:focus-visible': {
                                       outline: '2px solid #1976D2',
                                       outlineOffset: '2px',
                                    },
                                 }}>
                                 {p.id === 'seller' ? 'ผู้ส่งต่อ (0%)' : p.name.replace('นักอ่าน', '')}
                              </Button>
                           );
                        })}
                     </Box>

                     {/* 3 Quiet Pricing Cards Grid */}
                     <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ alignItems: 'stretch' }}>
                        {pricingPlans.map((plan) => {
                           const PlanIcon = plan.icon;
                           return (
                              <Grid
                                 key={plan.id}
                                 size={{ xs: 12, md: 4 }}
                                 sx={{
                                    display: {
                                       xs: activeMobilePlan === plan.id ? 'block' : 'none',
                                       md: 'block',
                                    },
                                 }}>
                                 <Box
                                    sx={{
                                       bgcolor: '#FFFFFF',
                                       borderRadius: '12px',
                                       border: plan.highlighted ? '1.5px solid #1976D2' : '1px solid #E2E8F0',
                                       p: { xs: 2.75, sm: 3.25, md: 3.5 },
                                       display: 'flex',
                                       flexDirection: 'column',
                                       justifyContent: 'space-between',
                                       height: '100%',
                                       boxShadow: plan.highlighted
                                          ? '0 4px 16px rgba(25, 118, 210, 0.08)'
                                          : '0 1px 3px rgba(15, 45, 74, 0.03)',
                                       transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                       '&:hover': {
                                          borderColor: plan.highlighted ? '#1565C0' : '#CBD5E1',
                                          boxShadow: '0 6px 20px rgba(15, 45, 74, 0.06)',
                                       },
                                    }}>
                                    {/* Card Top: Role Tag & Header */}
                                    <Box>
                                       <Box sx={{ minHeight: 28, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <Chip
                                             label={plan.badge || plan.role}
                                             size="small"
                                             sx={{
                                                bgcolor: plan.highlighted ? '#EAF4FF' : '#F1F5F9',
                                                color: plan.highlighted ? '#1976D2' : '#475569',
                                                fontWeight: plan.highlighted ? 700 : 600,
                                                fontSize: '0.72rem',
                                                height: 24,
                                                borderRadius: '999px',
                                                border: plan.highlighted ? '1px solid rgba(25, 118, 210, 0.22)' : '1px solid #E2E8F0',
                                             }}
                                          />
                                          <Box
                                             sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '8px',
                                                bgcolor: plan.highlighted ? '#EAF4FF' : '#F8FAFC',
                                                color: plan.highlighted ? '#1976D2' : '#64748B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                             }}>
                                             <PlanIcon sx={{ fontSize: 18 }} />
                                          </Box>
                                       </Box>

                                       <Typography
                                          variant="h3"
                                          sx={{
                                             fontSize: { xs: '1.25rem', sm: '1.35rem' },
                                             fontWeight: 800,
                                             color: '#0F2D4A',
                                             mb: 0.5,
                                          }}>
                                          {plan.name}
                                       </Typography>

                                       <Typography
                                          variant="body2"
                                          sx={{
                                             color: '#64748B',
                                             fontSize: '0.825rem',
                                             lineHeight: 1.55,
                                             mb: 2.5,
                                             minHeight: { sm: 40 },
                                          }}>
                                          {plan.description}
                                       </Typography>

                                       {/* Price Block */}
                                       <Box
                                          sx={{
                                             pt: 1.75,
                                             pb: 2,
                                             borderTop: '1px solid #F1F5F9',
                                             borderBottom: '1px solid #F1F5F9',
                                             mb: 2.5,
                                          }}>
                                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.25 }}>
                                             <Typography
                                                sx={{
                                                   fontSize: { xs: '2.35rem', sm: '2.5rem' },
                                                   fontWeight: 800,
                                                   color: plan.highlighted ? '#1976D2' : '#0F2D4A',
                                                   lineHeight: 1,
                                                   letterSpacing: '-0.03em',
                                                   fontVariantNumeric: 'tabular-nums',
                                                }}>
                                                {plan.price}
                                             </Typography>
                                          </Box>
                                          <Typography
                                             sx={{
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                color: '#64748B',
                                             }}>
                                             {plan.period}
                                          </Typography>
                                       </Box>

                                       {/* Synchronized 5 Comparative Spec Rows (Borderless hairline elegance) */}
                                       <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                                          {plan.specs.map((spec, sIdx) => {
                                             const CriterionIcon = planCriteria[sIdx].icon;
                                             return (
                                                <Box
                                                   key={sIdx}
                                                   sx={{
                                                      py: 1.5,
                                                      borderTop: sIdx > 0 ? '1px solid #F1F5F9' : 'none',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      justifyContent: 'center',
                                                      minHeight: { sm: 76 },
                                                   }}>
                                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.35 }}>
                                                      <CriterionIcon
                                                         sx={{
                                                            fontSize: 14,
                                                            color: spec.highlight ? '#1976D2' : '#64748B',
                                                         }}
                                                      />
                                                      <Typography
                                                         sx={{
                                                            fontSize: '0.72rem',
                                                            fontWeight: 700,
                                                            color: spec.highlight ? '#1976D2' : '#64748B',
                                                            letterSpacing: '0.01em',
                                                         }}>
                                                         {spec.criterion}
                                                      </Typography>
                                                   </Box>
                                                   <Typography
                                                      sx={{
                                                         fontSize: '0.875rem',
                                                         fontWeight: 700,
                                                         color: spec.highlight ? '#1976D2' : '#0F2D4A',
                                                         lineHeight: 1.35,
                                                         fontVariantNumeric: 'tabular-nums',
                                                      }}>
                                                      {spec.value}
                                                   </Typography>
                                                   <Typography
                                                      sx={{
                                                         fontSize: '0.75rem',
                                                         color: '#64748B',
                                                         lineHeight: 1.35,
                                                         mt: 0.25,
                                                      }}>
                                                      {spec.detail}
                                                   </Typography>
                                                </Box>
                                             );
                                          })}
                                       </Box>
                                    </Box>

                                    {/* Card Bottom CTA */}
                                    <Button
                                       fullWidth
                                       variant={plan.highlighted ? 'contained' : 'outlined'}
                                       onClick={() => navigate(plan.ctaLink)}
                                       sx={{
                                          minHeight: 46,
                                          borderRadius: '8px',
                                          textTransform: 'none',
                                          fontWeight: 700,
                                          fontSize: '0.9rem',
                                          bgcolor: plan.highlighted ? '#1976D2' : '#FFFFFF',
                                          color: plan.highlighted ? '#FFFFFF' : '#0F2D4A',
                                          borderColor: plan.highlighted ? '#1976D2' : '#CBD5E1',
                                          boxShadow: 'none',
                                          '&:hover': {
                                             bgcolor: plan.highlighted ? '#1565C0' : '#F8FAFC',
                                             borderColor: plan.highlighted ? '#1565C0' : '#94A3B8',
                                             boxShadow: 'none',
                                          },
                                          '&:focus-visible': {
                                             outline: '2px solid #1976D2',
                                             outlineOffset: '2px',
                                          },
                                       }}>
                                       {plan.ctaText}
                                    </Button>
                                 </Box>
                              </Grid>
                           );
                        })}
                     </Grid>
                   </Box>
             </Box>

             {/* Value Pillars — one ink voice, no competing colors */}
            <Box
               sx={{
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  mb: { xs: 7, sm: 9, md: 11 },
               }}>
               <Grid container>
                  {valuePillars.map((pillar, index) => {
                     const isLast = index === valuePillars.length - 1;
                     return (
                        <Grid
                           size={{ xs: 12, sm: 4 }}
                           key={index}
                           sx={{
                              p: { xs: 3, sm: 3.5, md: 4 },
                              borderRight: { sm: isLast ? 'none' : '1px solid #E2E8F0' },
                              borderBottom: { xs: isLast ? 'none' : '1px solid #E2E8F0', sm: 'none' },
                           }}>
                           <Typography
                              sx={{
                                 fontSize: { xs: '2.25rem', sm: '2.5rem', md: '2.85rem' },
                                 fontWeight: 800,
                                 color: '#0F2D4A',
                                 lineHeight: 1.1,
                                 mb: 1,
                                 fontVariantNumeric: 'tabular-nums',
                                 letterSpacing: '-0.03em',
                              }}>
                              {pillar.value}
                           </Typography>
                           <Typography
                              sx={{
                                 fontWeight: 800,
                                 color: '#0F2D4A',
                                 fontSize: { xs: '0.95rem', sm: '1rem' },
                                 mb: 0.5,
                              }}>
                              {pillar.title}
                           </Typography>
                           <Typography
                              variant="body2"
                              sx={{
                                 color: '#64748B',
                                 lineHeight: 1.6,
                                 fontSize: '0.84rem',
                                 maxWidth: '38ch',
                              }}>
                              {pillar.description}
                           </Typography>
                        </Grid>
                     );
                  })}
               </Grid>
            </Box>

            {/* Interactive Seller Payout Engine (Disciplined 2-Column Swiss Workshop) */}
            <Box sx={{ mb: { xs: 7, sm: 9, md: 11 } }}>
               <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.75 }}>
                     <CalcIcon sx={{ color: '#1976D2', fontSize: 24 }} />
                     <Typography
                        variant="h2"
                        sx={{
                           fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.9rem' },
                           fontWeight: 800,
                           color: '#0F2D4A',
                           letterSpacing: '-0.015em',
                        }}>
                        เครื่องคำนวณรายได้จากการส่งต่อหนังสือ
                     </Typography>
                  </Box>
                  <Typography
                     variant="body2"
                     sx={{
                        color: '#64748B',
                        fontSize: { xs: '0.875rem', sm: '0.925rem' },
                     }}>
                     ทดลองใส่ราคาขาย — ดูเงินที่คุณได้รับจริงเทียบกับแพลตฟอร์มทั่วไป
                  </Typography>
               </Box>

               <Box
                  sx={{
                     borderTop: '2px solid #0F2D4A',
                     borderBottom: '1px solid #E2E8F0',
                     bgcolor: '#FFFFFF',
                  }}>
                  <Grid container>
                     {/* Left Column: Direct Price Controls (6 cols) */}
                     <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                           p: { xs: 3, sm: 4, md: 5 },
                           borderRight: { md: '1px solid #E2E8F0' },
                           borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
                        }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.95rem', mb: 2 }}>
                           กำหนดราคาขายที่คุณต้องการ (บาท)
                        </Typography>

                        {/* Numeric Input */}
                        <Box sx={{ mb: 3 }}>
                           <TextField
                              fullWidth
                              value={calcPrice || ''}
                              onChange={handlePriceChange}
                              slotProps={{
                                 input: {
                                    startAdornment: (
                                       <InputAdornment position="start" sx={{ fontWeight: 800, color: '#1976D2', fontSize: '1.25rem' }}>
                                          ฿
                                       </InputAdornment>
                                    ),
                                    inputMode: 'numeric',
                                 },
                              }}
                              sx={{
                                 bgcolor: '#F8FBFF',
                                 borderRadius: '8px',
                                 '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    minHeight: 52,
                                    fontWeight: 800,
                                    fontSize: '1.45rem',
                                    fontVariantNumeric: 'tabular-nums',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2', borderWidth: '1.5px' },
                                 },
                              }}
                           />
                        </Box>

                        {/* Presets Grid */}
                        <Box sx={{ mb: 3.5 }}>
                           <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', mb: 1.25, textTransform: 'uppercase' }}>
                              ราคาตัวอย่างยอดนิยม:
                           </Typography>
                           <Box
                              sx={{
                                 display: 'grid',
                                 gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                                 gap: 1,
                              }}>
                              {presetPrices.map((preset) => (
                                 <Chip
                                    key={preset}
                                    label={`฿${preset}`}
                                    clickable
                                    onClick={() => setCalcPrice(preset)}
                                    sx={{
                                       minHeight: 44,
                                       fontWeight: calcPrice === preset ? 800 : 600,
                                       fontSize: '0.85rem',
                                       fontVariantNumeric: 'tabular-nums',
                                       bgcolor: calcPrice === preset ? '#1976D2' : '#FFFFFF',
                                       color: calcPrice === preset ? '#FFFFFF' : '#334155',
                                       border: calcPrice === preset ? '1px solid #1976D2' : '1px solid #E2E8F0',
                                       borderRadius: '6px',
                                       '&:hover': {
                                          bgcolor: calcPrice === preset ? '#1565C0' : '#F1F5F9',
                                       },
                                       '&:focus-visible': {
                                          outline: '2px solid #1976D2',
                                          outlineOffset: '2px',
                                       },
                                    }}
                                 />
                              ))}
                           </Box>
                        </Box>

                        {/* Synchronized Slider: Scales 50 to 5000 */}
                        <Box sx={{ px: 0.5 }}>
                           <Slider
                              value={calcPrice}
                              min={50}
                              max={5000}
                              step={25}
                              onChange={(_, val) => setCalcPrice(val as number)}
                              sx={{
                                 color: '#1976D2',
                                 height: 6,
                                 '& .MuiSlider-thumb': {
                                    width: { xs: 26, sm: 22 },
                                    height: { xs: 26, sm: 22 },
                                    boxShadow: 'none',
                                    border: '2px solid #FFFFFF',
                                    '&:focus-visible': {
                                       outline: '2px solid #0F2D4A',
                                       outlineOffset: '2px',
                                    },
                                 },
                              }}
                           />
                           <Box
                              sx={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 color: '#64748B',
                                 fontSize: '0.75rem',
                                 fontVariantNumeric: 'tabular-nums',
                                 mt: 0.5,
                              }}>
                              <span>฿50</span>
                              <span>฿5,000</span>
                           </Box>
                        </Box>
                     </Grid>

                     {/* Right Column: Comparative Payout Ledger (6 cols) */}
                     <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                           p: { xs: 3, sm: 4, md: 5 },
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'center',
                        }}>
                        {/* BookLoop Outcome */}
                        <Box
                           sx={{
                              p: { xs: 2.5, sm: 3 },
                              bgcolor: '#FFFFFF',
                              border: '1px solid #B7E8CA',
                              borderRadius: '12px',
                              boxShadow: '0 2px 10px rgba(22, 138, 74, 0.05)',
                              mb: 2,
                           }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography sx={{ color: '#0F2D4A', fontWeight: 800, fontSize: '0.875rem' }}>
                                 บน BookLoop (0% คอมมิชชั่น)
                              </Typography>
                              <Chip
                                 label="รับเงินเต็ม 100%"
                                 size="small"
                                 sx={{
                                    bgcolor: '#DDF7E7',
                                    color: '#137A40',
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    borderRadius: '999px',
                                    border: '1px solid #B7E8CA',
                                    height: 24,
                                 }}
                              />
                           </Box>
                           <Typography
                              sx={{
                                 fontSize: { xs: '2.4rem', sm: '2.85rem' },
                                 fontWeight: 800,
                                 color: '#0F2D4A',
                                 fontVariantNumeric: 'tabular-nums',
                                 letterSpacing: '-0.03em',
                                 lineHeight: 1,
                                 mb: 0.75,
                              }}>
                              ฿{sellerPayout.toLocaleString()}
                           </Typography>
                           <Typography sx={{ color: '#64748B', fontSize: '0.825rem' }}>
                              หักค่าธรรมเนียมแพลตฟอร์ม ฿0 โอนตรงถึงบัญชีของคุณ
                           </Typography>
                        </Box>

                        {/* Competitor Deductions */}
                        <Box
                           sx={{
                              p: 2.25,
                              bgcolor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                           }}>
                           <Box>
                              <Typography sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, mb: 0.25 }}>
                                 มาร์เก็ตเพลสทั่วไป (หักเฉลี่ย ~15%)
                              </Typography>
                              <Typography
                                 sx={{
                                    fontSize: '1.35rem',
                                    fontWeight: 800,
                                    color: '#64748B',
                                    fontVariantNumeric: 'tabular-nums',
                                 }}>
                                 ฿{competitorPayout.toLocaleString()}
                              </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ color: '#E11D48', fontSize: '0.8rem', fontWeight: 700, mb: 0.25 }}>
                                 ส่วนต่างที่ถูกหัก
                              </Typography>
                              <Typography
                                 sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    color: '#E11D48',
                                    fontVariantNumeric: 'tabular-nums',
                                 }}>
                                 -฿{savedMoney.toLocaleString()}
                              </Typography>
                           </Box>
                        </Box>
                     </Grid>
                  </Grid>
               </Box>
            </Box>

            {/* Feature Comparison Section */}
            <Box id="fee-comparison-table" sx={{ mb: { xs: 7, sm: 9, md: 11 }, scrollMarginTop: { xs: '72px', md: '84px' } }}>
               <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
                  <Typography
                     variant="h2"
                     sx={{
                        fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.9rem' },
                        fontWeight: 800,
                        color: '#0F2D4A',
                        letterSpacing: '-0.015em',
                        mb: 0.5,
                     }}>
                     ตารางเปรียบเทียบโครงสร้างค่าธรรมเนียม
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                     เปรียบเทียบความคุ้มค่าระหว่าง BookLoop และแพลตฟอร์มอื่น
                  </Typography>
               </Box>

               {/* Comparison table — always visible */}
               <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                     border: '1px solid #E2E8F0',
                     borderRadius: '10px',
                     overflowX: 'auto',
                     WebkitOverflowScrolling: 'touch',
                     bgcolor: '#FFFFFF',
                     boxShadow: '0 1px 3px rgba(15, 45, 74, 0.04)',
                  }}>
                  <Table sx={{ width: '100%', minWidth: { xs: 440, sm: 600 } }}>
                     <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                           {/* Column 1: Feature Title (Sticky Left on Mobile) */}
                           <TableCell
                              sx={{
                                 fontWeight: 800,
                                 color: '#0F2D4A',
                                 fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9rem' },
                                 py: { xs: 1.5, sm: 2 },
                                 px: { xs: 1.5, sm: 2, md: 3 },
                                 width: { xs: 140, sm: '38%', md: '40%' },
                                 minWidth: { xs: 135, sm: 'auto' },
                                 position: 'sticky',
                                 left: 0,
                                 bgcolor: '#F8FAFC',
                                 zIndex: 2,
                                 boxShadow: { xs: '2px 0 6px -2px rgba(15, 45, 74, 0.1)', sm: 'none' },
                                 borderRight: { xs: '1px solid #E2E8F0', sm: 'none' },
                              }}>
                              รายการ / ฟีเจอร์
                           </TableCell>

                           {/* Column 2: BookLoop (Hero Green Column) */}
                           <TableCell
                              sx={{
                                 fontWeight: 800,
                                 color: '#168A4A',
                                 fontSize: { xs: '0.825rem', sm: '0.9rem', md: '0.95rem' },
                                 py: { xs: 1.5, sm: 2 },
                                 px: { xs: 1.5, sm: 2, md: 3 },
                                 bgcolor: '#ECFDF3',
                                 width: { xs: 155, sm: '34%', md: '35%' },
                                 minWidth: { xs: 150, sm: 'auto' },
                                 borderLeft: '1px solid #B7E8CA',
                                 borderRight: '1px solid #B7E8CA',
                                 borderBottom: '1px solid #B7E8CA',
                              }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                 <span>BookLoop</span>
                                 <Chip
                                    label="แนะนำ"
                                    size="small"
                                    sx={{
                                       height: 20,
                                       fontSize: '0.65rem',
                                       bgcolor: '#168A4A',
                                       color: '#FFFFFF',
                                       fontWeight: 700,
                                       borderRadius: '4px',
                                       transition: 'background-color 0.15s ease',
                                       '&:hover': {
                                          bgcolor: '#137A40',
                                       },
                                    }}
                                 />
                              </Box>
                           </TableCell>

                           {/* Column 3: General Marketplace */}
                           <TableCell
                              sx={{
                                 fontWeight: 700,
                                 color: '#64748B',
                                 fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9rem' },
                                 py: { xs: 1.5, sm: 2 },
                                 px: { xs: 1.5, sm: 2, md: 3 },
                                 width: { xs: 145, sm: '28%', md: '25%' },
                                 minWidth: { xs: 140, sm: 'auto' },
                              }}>
                              มาร์เก็ตเพลสทั่วไป
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {comparisonRows.map((row, idx) => {
                           const RowIcon = row.icon;
                           const isLast = idx === comparisonRows.length - 1;
                           return (
                              <TableRow
                                 key={idx}
                                 sx={{
                                    bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                                    transition: 'background-color 0.15s ease',
                                    '&:hover': {
                                       bgcolor: '#F1F7FF',
                                       '& .bookloop-cell': {
                                          bgcolor: '#DDF7E7',
                                       },
                                       '& .bookloop-check': {
                                          color: '#137A40',
                                       },
                                       '& .bookloop-val': {
                                          color: '#137A40',
                                       },
                                    },
                                 }}>
                                 {/* Col 1: Sticky Left Feature Cell */}
                                 <TableCell
                                    sx={{
                                       fontWeight: 600,
                                       color: '#0F2D4A',
                                       py: { xs: 1.5, sm: 2 },
                                       px: { xs: 1.5, sm: 2, md: 3 },
                                       position: 'sticky',
                                       left: 0,
                                       bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                                       zIndex: 1,
                                       boxShadow: { xs: '2px 0 6px -2px rgba(15, 45, 74, 0.1)', sm: 'none' },
                                       borderRight: { xs: '1px solid #E2E8F0', sm: 'none' },
                                       borderBottom: isLast ? 0 : '1px solid #E2E8F0',
                                    }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 1.25 } }}>
                                       <Box
                                          sx={{
                                             width: { xs: 26, sm: 30 },
                                             height: { xs: 26, sm: 30 },
                                             borderRadius: '6px',
                                             bgcolor: '#EAF4FF',
                                             color: '#1677D2',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             flexShrink: 0,
                                             mt: 0.2,
                                          }}>
                                          <RowIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
                                       </Box>
                                       <Box>
                                          <Typography
                                             sx={{
                                                fontWeight: 700,
                                                color: '#0F2D4A',
                                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
                                                lineHeight: 1.35,
                                             }}>
                                             {row.feature}
                                          </Typography>
                                       </Box>
                                    </Box>
                                 </TableCell>

                                 {/* Col 2: BookLoop Winner Cell */}
                                 <TableCell
                                    className="bookloop-cell"
                                    sx={{
                                       color: '#168A4A',
                                       py: { xs: 1.5, sm: 2 },
                                       px: { xs: 1.5, sm: 2, md: 3 },
                                       bgcolor: '#ECFDF3',
                                       borderLeft: '1px solid #B7E8CA',
                                       borderRight: '1px solid #B7E8CA',
                                       borderBottom: isLast ? 0 : '1px solid #B7E8CA',
                                       verticalAlign: 'top',
                                       transition: 'background-color 0.15s ease',
                                    }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                       <CheckIcon
                                          className="bookloop-check"
                                          sx={{
                                             fontSize: { xs: 16, sm: 18 },
                                             color: '#168A4A',
                                             flexShrink: 0,
                                             mt: 0.2,
                                             transition: 'color 0.15s ease',
                                          }}
                                       />
                                       <Box>
                                          <Typography
                                             className="bookloop-val"
                                             sx={{
                                                color: '#168A4A',
                                                fontWeight: 800,
                                                fontSize: { xs: '0.825rem', sm: '0.875rem', md: '0.9rem' },
                                                lineHeight: 1.35,
                                                fontVariantNumeric: 'tabular-nums',
                                                transition: 'color 0.15s ease',
                                             }}>
                                             {row.bookloop}
                                          </Typography>
                                          <Typography
                                             sx={{
                                                color: '#137A40',
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                mt: 0.25,
                                                lineHeight: 1.35,
                                                fontWeight: 500,
                                             }}>
                                             {row.bookloopSub}
                                          </Typography>
                                       </Box>
                                    </Box>
                                 </TableCell>

                                 {/* Col 3: Competitor Cell */}
                                 <TableCell
                                    sx={{
                                       py: { xs: 1.5, sm: 2 },
                                       px: { xs: 1.5, sm: 2, md: 3 },
                                       borderBottom: isLast ? 0 : '1px solid #E2E8F0',
                                       verticalAlign: 'top',
                                    }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                       <RemoveIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: '#94A3B8', flexShrink: 0, mt: 0.2 }} />
                                       <Box>
                                          <Typography
                                             sx={{
                                                color: '#475569',
                                                fontWeight: 600,
                                                fontSize: { xs: '0.8rem', sm: '0.825rem', md: '0.85rem' },
                                                lineHeight: 1.35,
                                                fontVariantNumeric: 'tabular-nums',
                                             }}>
                                             {row.other}
                                          </Typography>
                                          <Typography
                                             sx={{
                                                color: '#64748B',
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                mt: 0.25,
                                                lineHeight: 1.35,
                                             }}>
                                             {row.otherSub}
                                          </Typography>
                                       </Box>
                                    </Box>
                                 </TableCell>
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Box>

            {/* Bottom CTA — same voice and action as hero */}
            <Box
               sx={{
                  borderTop: '1px solid #E2E8F0',
                  pt: { xs: 4, sm: 6 },
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
               }}>
               <Box>
                  <Typography sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: { xs: '1.15rem', sm: '1.25rem' }, mb: 0.5 }}>
                     พร้อมส่งต่อหนังสือของคุณแล้วหรือยัง?
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                     ลงขายง่ายใน 3 นาที รับเงินเต็ม 100% ไม่มีหักส่วนแบ่ง
                  </Typography>
               </Box>
               <Button
                  variant="contained"
                  startIcon={<SellIcon />}
                  onClick={() => navigate('/sell')}
                  sx={{
                     minHeight: 48,
                     px: 3.5,
                     borderRadius: '8px',
                     bgcolor: '#0F2D4A',
                     color: '#FFFFFF',
                     fontWeight: 700,
                     fontSize: '0.9375rem',
                     textTransform: 'none',
                     boxShadow: 'none',
                     width: { xs: '100%', sm: 'auto' },
                     '&:hover': {
                        bgcolor: '#102A43',
                        boxShadow: 'none',
                     },
                     '&:focus-visible': {
                        outline: '2px solid #1976D2',
                        outlineOffset: '2px',
                     },
                  }}>
                  เริ่มลงขายหนังสือ — ฟรี 0%
               </Button>
            </Box>
         </AppContainer>
      </Box>
   );
}
