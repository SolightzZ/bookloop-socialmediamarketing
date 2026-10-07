import {
   CheckCircleOutlined as CheckIcon,
   ShoppingBagOutlined as BuyerIcon,
   Autorenew as CircularIcon,
   ExploreOutlined as ExploreIcon,
   Forest as ForestIcon,
   FormatQuote as QuoteIcon,
   SavingsOutlined as SavingsIcon,
   SellOutlined as SellIcon,
   StorefrontOutlined as SellerIcon,
   Verified as VerifiedIcon,
   ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import {
   Box,
   Button,
   Chip,
   Grid,
   Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';
import { AppContainer } from '../components/common/Container';

export default function AboutPage() {
   const navigate = useNavigate();

   const impactStats = [
      {
         value: '40–70%',
         label: 'ประหยัดกว่าซื้อมือหนึ่ง',
         detail: 'อ่านได้อย่างคุ้มค่าในราคาที่เป็นมิตร พร้อมส่งต่อได้ไม่รู้จบ',
         color: '#B45309',
         bgColor: '#FEF3C7',
         borderColor: 'rgba(180, 83, 9, 0.20)',
         icon: SavingsIcon,
      },
      {
         value: '100%',
         label: 'ภาพถ่ายจากเล่มจริง',
         detail: 'เกณฑ์ตรวจสภาพ 4 ระดับโปร่งใส ไร้ภาพสต็อกตกแต่ง',
         color: '#0369A1',
         bgColor: '#E0F2FE',
         borderColor: 'rgba(3, 105, 161, 0.20)',
         icon: VerifiedIcon,
      },
      {
         value: '0% ฟรี',
         label: 'ค่าคอมมิชชั่นการขาย',
         detail: 'ผู้ส่งต่อรับเงินเต็มจำนวน ไม่มีหักส่วนแบ่งแพลตฟอร์ม',
         color: '#15803D',
         bgColor: '#DCFCE7',
         borderColor: 'rgba(21, 128, 61, 0.20)',
         icon: CircularIcon,
      },
   ];

   const pillars = [
      {
         icon: CircularIcon,
         title: 'วงจรการส่งต่อไม่รู้จบ',
         subtitle: 'The Circular Loop',
         description:
            'หนังสือไม่ได้มีไว้แค่อ่านครั้งเดียวแล้วเก็บเข้ามุมมืด เมื่ออ่านจบ สามารถเปลี่ยนหนังสือบนชั้นให้กลายเป็นมูลค่า พร้อมส่งมอบแรงบันดาลใจให้นักอ่านคนถัดไปได้ทันที',
         badge: 'ลดการผลิตซ้ำ',
         themeColor: '#1976D2',
         badgeBg: '#EAF4FF',
         badgeBorder: 'rgba(25, 118, 210, 0.20)',
      },
      {
         icon: VerifiedIcon,
         title: 'ความจริงใจในสภาพหนังสือ',
         subtitle: 'Condition Truth',
         description:
            'เรายึดมั่นในความโปร่งใส ทุกเล่มถ่ายทอดจากสภาพจริง ไร้ภาพสต็อกตกแต่ง พร้อมเกณฑ์ตรวจสภาพ 4 ระดับที่ชัดเจน เพื่อให้ผู้ซื้อมั่นใจว่าจะได้รับหนังสือตรงตามความคาดหวัง',
         badge: 'ภาพถ่ายจริง 100%',
         themeColor: '#15803D',
         badgeBg: '#DCFCE7',
         badgeBorder: 'rgba(21, 128, 61, 0.20)',
      },
      {
         icon: QuoteIcon,
         title: 'เรื่องราวที่เดินทางไปด้วย',
         subtitle: 'Story Continuity',
         description:
            'เสน่ห์ของหนังสือมือสองคือรอยความทรงจำ BookLoop เปิดพื้นที่ให้เจ้าของเดิมบันทึกความรู้สึกและเหตุผลที่อยากส่งต่อ เชื่อมโยงความผูกพันระหว่างนักอ่านรุ่นสู่รุ่น',
         badge: 'สายใยความทรงจำ',
         themeColor: '#B45309',
         badgeBg: '#FEF3C7',
         badgeBorder: 'rgba(180, 83, 9, 0.20)',
      },
   ];

   const buyerPoints = [
      'ประหยัดงบการอ่าน 40–70% เข้าถึงหนังสือดีโดยไม่ต้องจ่ายราคาเต็ม',
      'เห็นภาพถ่ายจากเล่มจริงทุกมุม พร้อมเกณฑ์ประเมิน 4 ระดับโปร่งใส',
      'รับประกันคุ้มครองสภาพไม่ตรงปก 48 ชั่วโมง พร้อมทีมงานประสานงานช่วยเหลือ',
      'อ่านจบแล้วนำกลับมาลงขายต่อได้ทันทีจากประวัติการซื้อเพียงคลิกเดียว',
   ];

   const sellerPoints = [
      'ค่าคอมมิชชั่น 0% ตลอดชีพ ขายได้เท่าไหร่ รับเงินเต็มจำนวน 100%',
      'ลงขายง่ายใน 3 นาที ระบบช่วยแนะนำราคาและจัดการสต็อกอัตโนมัติ',
      'เคลียร์ชั้นหนังสือให้กลายเป็นรายได้ เพื่อต่อยอดเป็นงบซื้อหนังสือเล่มใหม่',
      'ส่งต่อความทรงจำสู่คนรักหนังสือ ด้วยการบันทึกข้อความถึงเจ้าของคนใหม่',
   ];

   const steps = [
      {
         number: '01',
         title: 'ค้นพบหนังสือ',
         detail: 'เลือกดูหนังสือคุณภาพดีจากเพื่อนนักอ่าน คัดกรองตามหมวดหมู่ สภาพจริง และราคาที่ประหยัดกว่า',
         color: '#0369A1',
      },
      {
         number: '02',
         title: 'ชำระเงินปลอดภัย',
         detail: 'ชำระสะดวกผ่าน PromptPay QR พร้อมระบบตรวจสอบสถานะและการคุ้มครองสภาพหนังสือ',
         color: '#1976D2',
      },
      {
         number: '03',
         title: 'จัดส่งตรงถึงมือ',
         detail: 'ผู้ขายแพ็คหนังสืออย่างทะนุถนอม พร้อมเลขพัสดุสำหรับติดตามสถานะการจัดส่งได้แบบเรียลไทม์',
         color: '#B45309',
      },
      {
         number: '04',
         title: 'อ่านจบแล้วส่งต่อ',
         detail: 'เมื่ออ่านจบ สามารถนำกลับมาลงขายส่งต่อให้เพื่อนนักอ่านคนถัดไปได้ในคลิกเดียว',
         color: '#15803D',
      },
   ];

   const manifestoItems = [
      { label: 'โมเดลแพลตฟอร์ม', value: 'C2C Circular Marketplace' },
      { label: 'ค่าคอมมิชชั่นผู้ขาย', value: '0% (ฟรีตลอดชีพ)' },
      { label: 'การันตีภาพถ่าย', value: 'สภาพจริง 100% ไร้ภาพสต็อก' },
      { label: 'ระบบชำระเงิน', value: 'PromptPay QR & Bank Transfer' },
   ];

   return (
      <Box
         sx={{
            bgcolor: '#F8FBFF',
            minHeight: '100vh',
            pb: { xs: 8, md: 14 },
            position: 'relative',
         }}>
         <AppContainer sx={{ pt: { xs: 2.5, sm: 3.5, md: 5 } }}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbsNav items={[{ label: 'เกี่ยวกับเรา' }]} />

            {/* Swiss Asymmetric Hero Section */}
            <Box sx={{ pt: { xs: 2, sm: 3.5, md: 5 }, pb: { xs: 5, sm: 7, md: 8 } }}>
               <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: 'flex-start' }}>
                  {/* Left Column: Flush-Left Display Typography & Action Deck (7 cols) */}
                  <Grid size={{ xs: 12, md: 7 }}>
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
                        หนังสือทุกเล่ม มีเรื่องราวให้
                        <Box component="span" sx={{ color: '#1976D2', ml: 1.25 }}>
                           คนถัดไป
                        </Box>
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
                        BookLoop คือพื้นที่เชื่อมโยงนักอ่านชาวไทยเพื่อส่งต่อหนังสือมือสองอย่างโปร่งใส
                        ให้หนังสือได้เดินทางต่อในราคาที่เข้าถึงง่าย ตรวจสอบสภาพจริงได้ทุกมุม
                        และเปิดโอกาสให้ผู้ขายรับเงินเต็มจำนวนโดยไร้ค่าคอมมิชชั่นแอบแฝง
                     </Typography>

                     {/* Action Row: Flush-left alignment */}
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: { xs: 'column', sm: 'row' },
                           gap: 1.5,
                           alignItems: { xs: 'stretch', sm: 'center' },
                        }}>
                        <Button
                           variant="contained"
                           size="large"
                           startIcon={<ExploreIcon />}
                           onClick={() => navigate('/books')}
                           sx={{
                              minHeight: 48,
                              px: 3.5,
                              borderRadius: '8px',
                              backgroundColor: '#1976D2',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.9375rem',
                              textTransform: 'none',
                              boxShadow: 'none',
                              '&:hover': {
                                 backgroundColor: '#1565C0',
                                 boxShadow: 'none',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #1976D2',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ค้นหาหนังสือในคลัง
                        </Button>
                        <Button
                           variant="outlined"
                           size="large"
                           startIcon={<SellIcon />}
                           onClick={() => navigate('/sell')}
                           sx={{
                              minHeight: 48,
                              px: 3.5,
                              borderRadius: '8px',
                              borderColor: '#CBD5E1',
                              bgcolor: '#FFFFFF',
                              color: '#0F2D4A',
                              fontWeight: 700,
                              fontSize: '0.9375rem',
                              textTransform: 'none',
                              '&:hover': {
                                 borderColor: '#0F2D4A',
                                 backgroundColor: '#F8FAFC',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #0F2D4A',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ส่งต่อหนังสือของคุณ
                        </Button>
                     </Box>
                  </Grid>

                  {/* Right Column: Swiss Typographic Broadsheet Ledger (5 cols) */}
                  <Grid size={{ xs: 12, md: 5 }}>
                     <Box
                        sx={{
                           borderLeft: { md: '1px solid #E2E8F0' },
                           pl: { md: 4 },
                           pt: { md: 0.5 },
                        }}>
                        <Typography
                           sx={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: '#64748B',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              mb: 2,
                           }}>
                           BookLoop Operating Ledger
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                           {manifestoItems.map((item, idx) => (
                              <Box
                                 key={idx}
                                 sx={{
                                    py: 1.75,
                                    borderTop: '1px solid #E2E8F0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.25,
                                 }}>
                                 <Typography sx={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>
                                    {item.label}
                                 </Typography>
                                 <Typography
                                    sx={{
                                       color: '#0F2D4A',
                                       fontSize: '0.95rem',
                                       fontWeight: 700,
                                       fontVariantNumeric: 'tabular-nums',
                                    }}>
                                    {item.value}
                                 </Typography>
                              </Box>
                           ))}
                        </Box>

                        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                           <Button
                              variant="text"
                              onClick={() => navigate('/pricing')}
                              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                 p: 0,
                                 minHeight: 44,
                                 color: '#1976D2',
                                 fontWeight: 700,
                                 fontSize: '0.875rem',
                                 textTransform: 'none',
                                 '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                 '&:focus-visible': {
                                    outline: '2px solid #1976D2',
                                    outlineOffset: '2px',
                                 },
                              }}>
                              ตรวจสอบโครงสร้างค่าธรรมเนียมและความโปร่งใส
                           </Button>
                        </Box>
                     </Box>
                  </Grid>
               </Grid>
            </Box>

            {/* Swiss Broadsheet Metric Band (Replaces floating box-cards) */}
            <Box
               sx={{
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  mb: { xs: 7, sm: 9, md: 11 },
               }}>
               <Grid container>
                  {impactStats.map((item, index) => {
                     const isLast = index === impactStats.length - 1;
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
                                 color: item.color,
                                 letterSpacing: '-0.03em',
                                 fontVariantNumeric: 'tabular-nums',
                                 lineHeight: 1.1,
                                 mb: 1,
                              }}>
                              {item.value}
                           </Typography>
                           <Typography
                              sx={{
                                 color: '#0F2D4A',
                                 fontSize: { xs: '0.9375rem', sm: '1rem' },
                                 fontWeight: 800,
                                 mb: 0.5,
                              }}>
                              {item.label}
                           </Typography>
                           <Typography
                              sx={{
                                 color: '#64748B',
                                 fontSize: '0.84rem',
                                 lineHeight: 1.6,
                                 maxWidth: '38ch',
                              }}>
                              {item.detail}
                           </Typography>
                        </Grid>
                     );
                  })}
               </Grid>
            </Box>

            {/* Core Pillars: Asymmetric Layout (4 cols Intro / 8 cols Stack) */}
            <Box sx={{ mb: { xs: 7, sm: 9, md: 11 } }}>
               <Grid container spacing={{ xs: 3, md: 6 }}>
                  {/* Left Column: Section Title & Context (4 cols) */}
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Typography
                        variant="h2"
                        sx={{
                           fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.1rem' },
                           fontWeight: 800,
                           color: '#0F2D4A',
                           lineHeight: 1.25,
                           letterSpacing: '-0.02em',
                           mb: 1.5,
                        }}>
                        คุณค่าหลักที่เรายึดมั่น
                     </Typography>
                     <Typography
                        sx={{
                           color: '#64748B',
                           fontSize: { xs: '0.9rem', sm: '0.95rem' },
                           lineHeight: 1.7,
                           maxWidth: '36ch',
                        }}>
                        มาตรฐานความโปร่งใส ความอบอุ่น และการหมุนเวียนอย่างยั่งยืนเพื่อชุมชนคนรักหนังสือทั่วประเทศไทย
                     </Typography>
                  </Grid>

                  {/* Right Column: Stacked Typographic Entries with Hairline Rules (8 cols) */}
                  <Grid size={{ xs: 12, md: 8 }}>
                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {pillars.map((pillar, idx) => (
                           <Box
                              key={idx}
                              sx={{
                                 py: { xs: 3, sm: 3.5 },
                                 borderTop: '1px solid #E2E8F0',
                                 display: 'flex',
                                 flexDirection: { xs: 'column', sm: 'row' },
                                 alignItems: { xs: 'flex-start', sm: 'baseline' },
                                 gap: { xs: 1.5, sm: 3 },
                              }}>
                              <Box sx={{ minWidth: { sm: '220px' } }}>
                                 <Typography
                                    variant="h3"
                                    sx={{
                                       fontSize: '1.15rem',
                                       fontWeight: 800,
                                       color: '#0F2D4A',
                                       lineHeight: 1.35,
                                       mb: 0.5,
                                    }}>
                                    {pillar.title}
                                 </Typography>
                                 <Chip
                                    label={pillar.badge}
                                    size="small"
                                    sx={{
                                       bgcolor: pillar.badgeBg,
                                       color: pillar.themeColor,
                                       fontWeight: 700,
                                       fontSize: '0.72rem',
                                       borderRadius: '4px',
                                       border: `1px solid ${pillar.badgeBorder}`,
                                    }}
                                 />
                              </Box>

                              <Typography
                                 sx={{
                                    color: '#334155',
                                    lineHeight: 1.7,
                                    fontSize: { xs: '0.875rem', sm: '0.925rem' },
                                    flexGrow: 1,
                                 }}>
                                 {pillar.description}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  </Grid>
               </Grid>
            </Box>

            {/* The 4-Step Circulation Flow: Horizontal Process Track */}
            <Box sx={{ mb: { xs: 7, sm: 9, md: 11 } }}>
               <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Typography
                     variant="h2"
                     sx={{
                        fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.9rem' },
                        fontWeight: 800,
                        color: '#0F2D4A',
                        lineHeight: 1.25,
                        letterSpacing: '-0.015em',
                        mb: 0.75,
                     }}>
                     วงจรการส่งต่อทำงานอย่างไร
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '0.925rem' } }}>
                     เรียบง่าย ตรงไปตรงมา เพื่อความสุขของทั้งผู้ซื้อและผู้ส่งต่อ
                  </Typography>
               </Box>

               <Box
                  sx={{
                     borderTop: '2px solid #0F2D4A',
                     bgcolor: '#FFFFFF',
                     borderBottom: '1px solid #E2E8F0',
                  }}>
                  <Grid container>
                     {steps.map((step, idx) => {
                        const isLast = idx === steps.length - 1;
                        return (
                           <Grid
                              size={{ xs: 12, sm: 6, md: 3 }}
                              key={idx}
                              sx={{
                                 p: { xs: 3, sm: 3.5 },
                                 borderRight: { md: isLast ? 'none' : '1px solid #E2E8F0' },
                                 borderBottom: { xs: isLast ? 'none' : '1px solid #E2E8F0', md: 'none' },
                              }}>
                              <Typography
                                 sx={{
                                    fontSize: { xs: '2rem', sm: '2.25rem' },
                                    fontWeight: 800,
                                    color: '#0F2D4A',
                                    lineHeight: 1,
                                    fontVariantNumeric: 'tabular-nums',
                                    letterSpacing: '-0.03em',
                                    mb: 1.75,
                                 }}>
                                 {step.number}
                              </Typography>
                              <Typography
                                 variant="h3"
                                 sx={{
                                    fontSize: '1.05rem',
                                    fontWeight: 800,
                                    color: '#0F2D4A',
                                    lineHeight: 1.4,
                                    mb: 0.75,
                                 }}>
                                 {step.title}
                              </Typography>
                              <Typography
                                 sx={{
                                    color: '#475569',
                                    lineHeight: 1.65,
                                    fontSize: '0.85rem',
                                 }}>
                                 {step.detail}
                              </Typography>
                           </Grid>
                        );
                     })}
                  </Grid>
               </Box>
            </Box>

            {/* Dual Marketplace Value: Buyer vs Seller Side-by-Side Broadsheet */}
            <Box sx={{ mb: { xs: 7, sm: 9, md: 11 } }}>
               <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Typography
                     variant="h2"
                     sx={{
                        fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.9rem' },
                        fontWeight: 800,
                        color: '#0F2D4A',
                        lineHeight: 1.25,
                        letterSpacing: '-0.015em',
                        mb: 0.75,
                     }}>
                     ความคุ้มค่าที่ตอบโจทย์ทั้งสองฝ่าย
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '0.925rem' } }}>
                     ระบบเศรษฐกิจหมุนเวียนที่แฟร์ โปร่งใส และเปิดโอกาสให้ทุกคนมีส่วนร่วม
                  </Typography>
               </Box>

               <Box
                  sx={{
                     borderTop: '1px solid #E2E8F0',
                     borderBottom: '1px solid #E2E8F0',
                     bgcolor: '#FFFFFF',
                  }}>
                  <Grid container>
                     {/* Buyer Column */}
                     <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                           p: { xs: 3, sm: 4, md: 5 },
                           borderRight: { md: '1px solid #E2E8F0' },
                           borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <BuyerIcon sx={{ fontSize: 24, color: '#1976D2' }} />
                              <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F2D4A' }}>
                                 สำหรับผู้ซื้อ (Buyer)
                              </Typography>
                           </Box>
                           <Chip
                              label="คุ้มค่า & ปลอดภัย"
                              size="small"
                              sx={{
                                 bgcolor: '#EAF4FF',
                                 color: '#1976D2',
                                 fontWeight: 700,
                                 fontSize: '0.72rem',
                                 borderRadius: '4px',
                                 border: '1px solid rgba(25, 118, 210, 0.20)',
                              }}
                           />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                           {buyerPoints.map((point, i) => (
                              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                 <CheckIcon sx={{ fontSize: 18, color: '#1976D2', mt: 0.35, flexShrink: 0 }} />
                                 <Typography sx={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
                                    {point}
                                 </Typography>
                              </Box>
                           ))}
                        </Box>
                     </Grid>

                     {/* Seller Column */}
                     <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                           p: { xs: 3, sm: 4, md: 5 },
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <SellerIcon sx={{ fontSize: 24, color: '#15803D' }} />
                              <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F2D4A' }}>
                                 สำหรับผู้ส่งต่อ (Seller)
                              </Typography>
                           </Box>
                           <Chip
                              label="รับเงินเต็ม 100%"
                              size="small"
                              sx={{
                                 bgcolor: '#DCFCE7',
                                 color: '#15803D',
                                 fontWeight: 700,
                                 fontSize: '0.72rem',
                                 borderRadius: '4px',
                                 border: '1px solid rgba(21, 128, 61, 0.20)',
                              }}
                           />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                           {sellerPoints.map((point, i) => (
                              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                 <CheckIcon sx={{ fontSize: 18, color: '#15803D', mt: 0.35, flexShrink: 0 }} />
                                 <Typography sx={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
                                    {point}
                                 </Typography>
                              </Box>
                           ))}
                        </Box>
                     </Grid>
                  </Grid>
               </Box>
            </Box>

            {/* Environmental Mission & Eco Callout (Integrated Swiss Band) */}
            <Box
               sx={{
                  borderTop: '1px solid #BBF7D0',
                  borderBottom: '1px solid #BBF7D0',
                  bgcolor: '#F0FDF4',
                  p: { xs: 3, sm: 4.5, md: 5 },
               }}>
               <Box
                  sx={{
                     display: 'flex',
                     flexDirection: { xs: 'column', md: 'row' },
                     alignItems: { xs: 'flex-start', md: 'center' },
                     gap: { xs: 2.5, md: 4 },
                     justifyContent: 'space-between',
                  }}>
                  <Box sx={{ maxWidth: '740px' }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                        <ForestIcon sx={{ fontSize: 20, color: '#15803D' }} />
                        <Typography
                           sx={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#15803D',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                           }}>
                           หมุนเวียนเพื่อธรรมชาติและสิ่งแวดล้อม
                        </Typography>
                     </Box>
                     <Typography
                        variant="h2"
                        sx={{
                           fontSize: { xs: '1.3rem', sm: '1.55rem', md: '1.8rem' },
                           fontWeight: 800,
                           color: '#0F2D4A',
                           lineHeight: 1.3,
                           letterSpacing: '-0.015em',
                           mb: 1,
                        }}>
                        หนึ่งเล่มที่หมุนเวียน เท่ากับการรักษาธรรมชาติและลดขยะกระดาษ
                     </Typography>
                     <Typography sx={{ color: '#334155', lineHeight: 1.7, fontSize: { xs: '0.875rem', sm: '0.925rem' } }}>
                        หนังสือเล่มหนึ่งใช้ต้นไม้และพลังงานในการพิมพ์ การส่งต่อให้เพื่อนนักอ่านช่วยยืดอายุการใช้งาน
                        ลดภาระทางสิ่งแวดล้อม และทำให้องค์ความรู้กระจายสู่วงกว้างในราคาที่ทุกคนเข้าถึงได้
                     </Typography>
                  </Box>

                  <Button
                     variant="contained"
                     onClick={() => navigate('/pricing')}
                     sx={{
                        minHeight: 44,
                        px: 3,
                        borderRadius: '8px',
                        bgcolor: '#0F2D4A',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        flexShrink: 0,
                        width: { xs: '100%', md: 'auto' },
                        boxShadow: 'none',
                        '&:hover': {
                           bgcolor: '#07101E',
                           boxShadow: 'none',
                        },
                        '&:focus-visible': {
                           outline: '2px solid #15803D',
                           outlineOffset: '2px',
                        },
                     }}>
                     ดูโมเดลค่าธรรมเนียม 0%
                  </Button>
               </Box>
            </Box>
         </AppContainer>
      </Box>
   );
}
