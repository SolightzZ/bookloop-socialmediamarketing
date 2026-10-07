import { ExpandMore as ExpandMoreIcon, MailOutlined as MailIcon } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';
import { AppContainer } from '../components/common/Container';

interface FaqItem {
   id: string;
   category: 'pricing' | 'orders' | 'selling' | 'shipping' | 'condition' | 'account';
   categoryLabel: string;
   question: string;
   answer: string;
}

export default function HelpPage() {
   const navigate = useNavigate();
   const [expandedId, setExpandedId] = useState<string | false>('faq-pricing-1');

   const faqs: FaqItem[] = [
      // Pricing & Fees
      {
         id: 'faq-pricing-1',
         category: 'pricing',
         categoryLabel: 'ราคาและค่าธรรมเนียม',
         question: 'BookLoop มีการคิดค่าธรรมเนียมหรือส่วนแบ่งการขาย (คอมมิชชั่น) หรือไม่?',
         answer:
            'ไม่มี! การลงขายหนังสือใน BookLoop ฟรี 100% ไม่มีค่าธรรมเนียมแรกเข้า และไม่หักเปอร์เซ็นต์ส่วนแบ่งการขายใดๆ ทั้งสิ้น ผู้ขายได้รับเงินเต็มจำนวนที่ตั้งไว้ (เทียบกับมาร์เก็ตเพลสทั่วไปที่มักหัก 10–18%) คุณสามารถตรวจสอบรายละเอียดและลองคำนวณรายได้สุทธิได้ที่หน้า "ค่าธรรมเนียมและความโปร่งใส"',
      },
      {
         id: 'faq-pricing-2',
         category: 'pricing',
         categoryLabel: 'ราคาและค่าธรรมเนียม',
         question: 'ผู้ซื้อต้องเสียค่าบริการระบบหรือค่าธรรมเนียมใดๆ เพิ่มเติมหรือไม่?',
         answer:
            'ผู้ซื้อไม่ต้องจ่ายค่าธรรมเนียมระบบใดๆ คุณจ่ายเฉพาะค่าหนังสือตามราคาจริงที่ผู้ขายกำหนด และค่าจัดส่งจริงตามที่ระบุไว้เท่านั้น ไม่มีบวกค่าธรรมเนียมแพลตฟอร์มหรือค่าบริการแอบแฝงในขั้นตอนชำระเงิน',
      },
      {
         id: 'faq-pricing-3',
         category: 'pricing',
         categoryLabel: 'ราคาและค่าธรรมเนียม',
         question: 'ค่าจัดส่งพัสดุคิดอย่างไรและใครเป็นผู้กำหนด?',
         answer:
            'ผู้ขายเป็นผู้กำหนดค่าจัดส่งตามจริง โดยทั่วไปเริ่มต้นที่ประมาณ 30–50 บาท ขึ้นอยู่กับน้ำหนักหนังสือและบริษัทขนส่งที่เลือกใช้ (เช่น Flash Express, ไปรษณีย์ไทย) ค่าจัดส่งจะแสดงชัดเจนในหน้าหนังสือและในสรุปตะกร้าสินค้าก่อนชำระเงิน',
      },

      // Orders
      {
         id: 'faq-1',
         category: 'orders',
         categoryLabel: 'การสั่งซื้อและชำระเงิน',
         question: 'ชำระเงินผ่านช่องทางใดได้บ้าง?',
         answer:
            'BookLoop รองรับการชำระเงินหลากหลายรูปแบบเพื่อความสะดวกของคุณ ได้แก่ PromptPay QR Code (สแกนจ่ายทันทีไม่มีค่าธรรมเนียม), การโอนเงินผ่านบัญชีธนาคาร พร้อมระบบอัปโหลดสลิปยืนยัน และบริการเก็บเงินปลายทาง (COD) ในบางพื้นที่ที่ผู้ขายเปิดให้บริการ',
      },
      {
         id: 'faq-2',
         category: 'orders',
         categoryLabel: 'การสั่งซื้อและชำระเงิน',
         question: 'เมื่อโอนเงินแล้ว ต้องแจ้งการชำระเงินอย่างไร?',
         answer:
            'หากเลือกวิธี PromptPay หรือโอนผ่านธนาคาร ในหน้าสรุปคำสั่งซื้อจะมีปุ่มให้อัปโหลดภาพสลิปการโอนเงิน ระบบจะทำการประมวลผลและส่งการแจ้งเตือนไปยังผู้ขายโดยอัตโนมัติ คุณสามารถตรวจสอบสถานะได้ตลอดเวลาในหน้า "คำสั่งซื้อของฉัน"',
      },
      {
         id: 'faq-3',
         category: 'orders',
         categoryLabel: 'การสั่งซื้อและชำระเงิน',
         question: 'หนังสือในตะกร้าจะถูกล็อคไว้ให้หรือไม่?',
         answer:
            'เนื่องจากหนังสือมือสองใน BookLoop ส่วนใหญ่มีเพียง 1 เล่มต่อรายการ หนังสือจะไม่ถูกตัดสต็อกจนกว่าคุณจะเข้าสู่ขั้นตอนชำระเงินและกดยืนยันคำสั่งซื้อ แนะนำให้ทำรายการสั่งซื้อทันทีที่เลือกหนังสือเสร็จเพื่อไม่ให้พลาดเล่มที่คุณถูกใจ',
      },

      // Selling
      {
         id: 'faq-4',
         category: 'selling',
         categoryLabel: 'การลงขายหนังสือ',
         question: 'การลงขายหนังสือมีค่าธรรมเนียมแรกเข้าหรือไม่?',
         answer:
            'ไม่มีค่าธรรมเนียมแรกเข้า! คุณสามารถลงขายหนังสือได้ฟรีทันที เพียงสมัครสมาชิกและเข้าสู่ระบบ จากนั้นไปที่เมนู "ส่งต่อหนังสือ" กรอกรายละเอียดหนังสือ สภาพจริง ถ่ายรูป และตั้งราคาที่ต้องการขายได้ในไม่กี่ขั้นตอน',
      },
      {
         id: 'faq-5',
         category: 'selling',
         categoryLabel: 'การลงขายหนังสือ',
         question: 'ควรตั้งราคาหนังสือมือสองอย่างไร?',
         answer:
            'เราแนะนำให้ตั้งราคาที่ประมาณ 40–70% ของราคาปก โดยอิงตามสภาพจริงของหนังสือ เช่น หนังสือสภาพเหมือนใหม่ (Mint) อาจตั้งที่ 60–75% ส่วนหนังสือสภาพดีหรือมีรอยอ่านเล็กน้อยอาจตั้งที่ 40–55% เพื่อให้หนังสือหมุนเวียนสู่ผู้ซื้อได้เร็วขึ้น',
      },
      {
         id: 'faq-6',
         category: 'selling',
         categoryLabel: 'การลงขายหนังสือ',
         question: 'รูปถ่ายหนังสือต้องเป็นอย่างไรบ้าง?',
         answer:
            'รูปถ่ายต้องเป็นภาพถ่ายจริงจากหนังสือเล่มที่จะส่งมอบ ห้ามใช้รูปปกทางการหรือรูปสต็อกอินเทอร์เน็ต แนะนำให้ถ่ายหน้าปก ปกหลัง สันหนังสือ และมุมหรือหน้าที่มีตำหนิ (หากมี) เพื่อความโปร่งใสและสร้างความไว้วางใจให้กับผู้ซื้อ',
      },

      // Shipping
      {
         id: 'faq-7',
         category: 'shipping',
         categoryLabel: 'การจัดส่งและติดตามพัสดุ',
         question: 'ผู้ขายจัดส่งผ่านขนส่งใดและใช้เวลากี่วัน?',
         answer:
            'ผู้ขายจะจัดส่งผ่านผู้ให้บริการขนส่งชั้นนำ เช่น Flash Express, Kerry Express, ไปรษณีย์ไทย (EMS) โดยทั่วไปผู้ขายจะจัดส่งภายใน 1–2 วันทำการหลังจากได้รับยืนยันคำสั่งซื้อ และพัสดุจะถึงมือคุณภายใน 2–4 วันทำการ',
      },
      {
         id: 'faq-8',
         category: 'shipping',
         categoryLabel: 'การจัดส่งและติดตามพัสดุ',
         question: 'จะตรวจสอบหมายเลขติดตามพัสดุ (Tracking Number) ได้จากที่ไหน?',
         answer:
            'เมื่อผู้ขายจัดส่งพัสดุแล้ว จะทำการบันทึกหมายเลขพัสดุเข้าระบบ คุณสามารถเข้าไปที่เมนู "บัญชีของฉัน" > "คำสั่งซื้อของฉัน" จากนั้นกดดูรายละเอียดคำสั่งซื้อเพื่อดูหมายเลขพัสดุและลิงก์ตรวจสอบสถานะได้ทันที',
      },

      // Condition & Returns
      {
         id: 'faq-9',
         category: 'condition',
         categoryLabel: 'เกณฑ์สภาพและการคืนเงิน',
         question: 'เกณฑ์การแบ่งสภาพหนังสือ 4 ระดับของ BookLoop เป็นอย่างไร?',
         answer:
            'เราแบ่งสภาพหนังสือออกเป็น 4 ระดับชัดเจน:\n1. เหมือนใหม่ (Excellent / Mint): ไม่มีรอยยับ ไม่มีรอยขีดเขียน สันคม กระดาษขาวสะอาด\n2. ดีมาก (Very Good): มีรอยเปิดอ่านเบาบาง ไม่มีรอยขีดเขียน สภาพสมบูรณ์\n3. ดี (Good): อาจมีจุดเหลืองตามกาลเวลาหรือรอยพับมุมเล็กน้อย แต่เนื้อหาครบถ้วนแข็งแรง\n4. พอใช้ (Acceptable): มีร่องรอยการใช้งานชัดเจน เช่น ไฮไลท์ รอยคราบ หรือสันหนังสือถลอกเล็กน้อย แต่เปิดอ่านได้ครบทุกหน้า',
      },
      {
         id: 'faq-10',
         category: 'condition',
         categoryLabel: 'เกณฑ์สภาพและการคืนเงิน',
         question: 'หากได้รับหนังสือแล้วสภาพไม่ตรงกับที่ระบุ ทำอย่างไรได้บ้าง?',
         answer:
            'BookLoop มีนโยบายคุ้มครองผู้ซื้อ หากพบว่าหนังสือชำรุดร้ายแรงหรือสภาพไม่ตรงกับที่ระบุไว้อย่างชัดเจน คุณสามารถติดต่อทีมงานผ่านหน้า "ติดต่อเรา" ภายใน 48 ชั่วโมงหลังจากได้รับพัสดุ พร้อมแนบภาพถ่ายจุดที่มีปัญหา ทีมงานจะช่วยประสานงานตรวจสอบและดำเนินการคืนเงินให้ตามนโยบาย',
      },

      // Account & Security
      {
         id: 'faq-11',
         category: 'account',
         categoryLabel: 'บัญชีและความปลอดภัย',
         question: 'หากลืมรหัสผ่านต้องทำอย่างไร?',
         answer: 'คุณสามารถไปที่หน้า "เข้าสู่ระบบ" แล้วคลิก "ลืมรหัสผ่าน" จากนั้นกรอกอีเมลที่ลงทะเบียนไว้ ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังกล่องข้อความอีเมลของคุณ',
      },
      {
         id: 'faq-12',
         category: 'account',
         categoryLabel: 'บัญชีและความปลอดภัย',
         question: 'ข้อมูลส่วนตัวและที่อยู่จัดส่งปลอดภัยหรือไม่?',
         answer:
            'ปลอดภัยสูงสุดตามมาตรฐาน PDPA ข้อมูลของคุณถูกจัดเก็บด้วยการเข้ารหัส และจะถูกนำมาใช้เฉพาะการดำเนินการตามคำสั่งซื้อเท่านั้น เราไม่มีนโยบายส่งต่อหรือจำหน่ายข้อมูลส่วนบุคคลให้แก่บุคคลภายนอกโดยเด็ดขาด',
      },
   ];

   const getCategoryBadgeStyles = (category: FaqItem['category']) => {
      switch (category) {
         case 'pricing':
            return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
         case 'orders':
            return { bg: '#EAF4FF', text: '#1976D2', border: 'rgba(25, 118, 210, 0.20)' };
         case 'selling':
            return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
         case 'shipping':
            return { bg: '#E0F2FE', text: '#0369A1', border: 'rgba(3, 105, 161, 0.20)' };
         case 'condition':
            return { bg: '#FEF3C7', text: '#B45309', border: 'rgba(180, 83, 9, 0.20)' };
         case 'account':
            return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
         default:
            return { bg: '#EAF4FF', text: '#1976D2', border: 'rgba(25, 118, 210, 0.20)' };
      }
   };

   const handleAccordionChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedId(isExpanded ? panelId : false);
   };

   return (
      <Box sx={{ bgcolor: '#F8FBFF', minHeight: '100vh', pb: { xs: 8, md: 12 } }}>
         <AppContainer sx={{ pt: { xs: 2.5, sm: 3.5, md: 5 } }}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbsNav items={[{ label: 'ช่วยเหลือและคำถามที่พบบ่อย' }]} />

            {/* Central Master Container: All elements flow straight down with equal width */}
            <Box sx={{ maxWidth: '860px', mx: 'auto', width: '100%' }}>
               {/* 1. Editorial Hero Header */}
               <Box
                  sx={{
                     pt: { xs: 2, sm: 3, md: 4 },
                     pb: { xs: 3, sm: 4.5 },
                     textAlign: 'center',
                     width: '100%',
                  }}>
                  <Typography
                     variant="h1"
                     sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        fontWeight: 800,
                        color: '#0F2D4A',
                        letterSpacing: '-0.025em',
                        lineHeight: { xs: 1.25, sm: 1.3 },
                        mb: { xs: 1, sm: 1.25 },
                     }}>
                     ศูนย์ช่วยเหลือและคำถามที่พบบ่อย
                  </Typography>
                  <Typography
                     variant="body1"
                     sx={{
                        color: '#64748B',
                        fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                        lineHeight: { xs: 1.6, sm: 1.65 },
                        maxWidth: '620px',
                        mx: 'auto',
                     }}>
                     รวมคำถามที่พบบ่อยเกี่ยวกับการซื้อ การขาย การจัดส่ง และการชำระเงินใน BookLoop
                  </Typography>
               </Box>

               {/* 2. FAQ Accordions: Mobile-optimized responsive Grid container */}
               <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {faqs.map((faq) => {
                     const isExpanded = expandedId === faq.id;
                     const badgeStyle = getCategoryBadgeStyles(faq.category);
                     return (
                        <Grid key={faq.id} size={{ xs: 12 }}>
                           <Accordion
                              expanded={isExpanded}
                              onChange={handleAccordionChange(faq.id)}
                              disableGutters
                              elevation={0}
                              sx={{
                                 bgcolor: '#FFFFFF',
                                 borderRadius: '12px !important',
                                 border: isExpanded ? '1.5px solid #1976D2' : '1px solid #E2E8F0',
                                 overflow: 'hidden',
                                 width: '100%',
                                 transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                 boxShadow: isExpanded ? '0 4px 16px rgba(15, 47, 82, 0.06)' : '0 1px 3px rgba(15, 47, 82, 0.02)',
                                 '&:before': { display: 'none' },
                              }}>
                              <AccordionSummary
                                 expandIcon={
                                    <ExpandMoreIcon
                                       sx={{
                                          color: isExpanded ? '#1976D2' : '#64748B',
                                          fontSize: { xs: 22, sm: 24 },
                                          transition: 'color 0.2s ease',
                                       }}
                                    />
                                 }
                                 sx={{
                                    px: { xs: 2, sm: 2.75 },
                                    py: { xs: 1.25, sm: 1.5 },
                                    minHeight: { xs: 52, sm: 56 },
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    whiteSpace: 'normal',
                                    '& .MuiAccordionSummary-content': {
                                       display: 'flex',
                                       flexDirection: 'column',
                                       alignItems: 'flex-start',
                                       gap: 0.75,
                                       my: { xs: 0.75, sm: 1 },
                                       minWidth: 0,
                                       width: '100%',
                                       whiteSpace: 'normal',
                                    },
                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                       flexShrink: 0,
                                       ml: { xs: 1.5, sm: 2 },
                                    },
                                    '&:focus-visible': {
                                       outline: '2px solid #1976D2',
                                       outlineOffset: '-2px',
                                    },
                                 }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
                                    <Chip
                                       label={faq.categoryLabel}
                                       size="small"
                                       sx={{
                                          height: 20,
                                          fontSize: '0.6875rem',
                                          fontWeight: 700,
                                          bgcolor: badgeStyle.bg,
                                          color: badgeStyle.text,
                                          border: `1px solid ${badgeStyle.border}`,
                                          borderRadius: '999px',
                                          whiteSpace: 'nowrap',
                                          flexShrink: 0,
                                       }}
                                    />
                                 </Box>
                                 <Typography
                                    variant="h3"
                                    sx={{
                                       fontSize: { xs: '0.925rem', sm: '1rem' },
                                       fontWeight: 700,
                                       color: isExpanded ? '#1976D2' : '#0F2D4A',
                                       lineHeight: 1.45,
                                       whiteSpace: 'normal',
                                       wordBreak: 'break-word',
                                       overflowWrap: 'break-word',
                                       width: '100%',
                                       transition: 'color 0.2s ease',
                                    }}>
                                    {faq.question}
                                 </Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                 sx={{
                                    px: { xs: 2, sm: 2.75 },
                                    pb: { xs: 2.25, sm: 2.75 },
                                    pt: 0,
                                    borderTop: '1px solid #F1F5F9',
                                 }}>
                                 <Typography
                                    variant="body2"
                                    sx={{
                                       color: '#334155',
                                       fontSize: { xs: '0.85rem', sm: '0.925rem' },
                                       lineHeight: 1.7,
                                       whiteSpace: 'pre-line',
                                       wordBreak: 'break-word',
                                       overflowWrap: 'break-word',
                                       pt: 1.5,
                                    }}>
                                    {faq.answer}
                                 </Typography>
                              </AccordionDetails>
                           </Accordion>
                        </Grid>
                     );
                  })}
               </Grid>

               {/* 3. Direct Contact Support Bridge: Full-width banner matching exact container width */}
               <Box
                  sx={{
                     bgcolor: '#FFFFFF',
                     borderRadius: '16px',
                     border: '1px solid #E2E8F0',
                     p: { xs: 2.5, sm: 3.5, md: 4 },
                     mt: { xs: 3.5, sm: 5, md: 6 },
                     display: 'flex',
                     flexDirection: { xs: 'column', sm: 'row' },
                     alignItems: { xs: 'stretch', sm: 'center' },
                     justifyContent: 'space-between',
                     gap: { xs: 2, sm: 3 },
                     textAlign: { xs: 'center', sm: 'left' },
                     boxShadow: '0 1px 3px rgba(15, 47, 82, 0.03)',
                     width: '100%',
                  }}>
                  <Box>
                     <Typography variant="h3" sx={{ fontSize: { xs: '1.05rem', sm: '1.2rem' }, fontWeight: 800, color: '#0F2D4A', mb: 0.5 }}>
                        ยังไม่พบคำตอบที่คุณต้องการ?
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.6 }}>
                        ทีมงาน BookLoop พร้อมช่วยเหลือและตอบคำถามของคุณตลอดทุกวันทำการ
                     </Typography>
                  </Box>
                  <Button
                     variant="contained"
                     startIcon={<MailIcon />}
                     onClick={() => navigate('/contact')}
                     sx={{
                        minHeight: 48,
                        px: 3.5,
                        borderRadius: '8px',
                        bgcolor: '#0F2D4A',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        flexShrink: 0,
                        width: { xs: '100%', sm: 'auto' },
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
                     ติดต่อทีมงาน Support
                  </Button>
               </Box>
            </Box>
         </AppContainer>
      </Box>
   );
}
