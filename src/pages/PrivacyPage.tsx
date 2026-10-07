import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
   Security as SecurityIcon,
   LockOutlined as LockIcon,
   CheckCircleOutlined as CheckIcon,
   MailOutlined as MailIcon,
   ShieldOutlined as ShieldIcon,
   VisibilityOutlined as EyeIcon,
} from '@mui/icons-material';
import { AppContainer } from '../components/common/Container';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';

export default function PrivacyPage() {
   const navigate = useNavigate();
   const [activeSection, setActiveSection] = useState('section-1');

   const sections = [
      { id: 'section-1', title: '1. ข้อมูลที่เราเก็บรวบรวม' },
      { id: 'section-2', title: '2. วัตถุประสงค์ในการประมวลผลข้อมูล' },
      { id: 'section-3', title: '3. การเปิดเผยข้อมูลแก่บุคคลภายนอก' },
      { id: 'section-4', title: '4. ความปลอดภัยและการเข้ารหัสข้อมูล' },
      { id: 'section-5', title: '5. คุกกี้และ Local Storage' },
      { id: 'section-6', title: '6. สิทธิของเจ้าของข้อมูลตาม PDPA' },
      { id: 'section-7', title: '7. การเปลี่ยนแปลงนโยบาย' },
      { id: 'section-8', title: '8. ช่องทางติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO)' },
   ];

   const scrollToSection = (id: string) => {
      setActiveSection(id);
      const el = document.getElementById(id);
      if (el) {
         const yOffset = -90;
         const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
         window.scrollTo({ top: y, behavior: 'smooth' });
      }
   };

   return (
      <Box sx={{ bgcolor: '#F8FBFF', minHeight: '100vh', pb: { xs: 8, md: 12 } }}>
         <AppContainer sx={{ pt: { xs: 3, sm: 4, md: 5 } }}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbsNav items={[{ label: 'นโยบายความเป็นส่วนตัว' }]} />

            {/* Editorial Header */}
            <Box sx={{ textAlign: 'center', maxWidth: '820px', mx: 'auto', pt: { xs: 2, sm: 3 }, mb: { xs: 4, sm: 6 } }}>
               <Typography
                  variant="h1"
                  sx={{
                     fontSize: { xs: '1.85rem', sm: '2.5rem', md: '2.85rem' },
                     fontWeight: 800,
                     color: '#0F2D4A',
                     letterSpacing: '-0.025em',
                     lineHeight: 1.25,
                     mb: 1.5,
                  }}>
                  นโยบายความเป็นส่วนตัว
               </Typography>
               <Typography variant="body1" sx={{ color: '#475569', fontSize: { xs: '0.95rem', sm: '1.05rem' }, lineHeight: 1.65 }}>
                  BookLoop มุ่งมั่นปกป้องข้อมูลส่วนบุคคลของนักอ่านและผู้ใช้งานทุกท่าน
                  ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ด้วยความโปร่งใสและปลอดภัยสูงสุด
               </Typography>
               <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.825rem' }}>
                     มีผลบังคับใช้: 1 มีนาคม 2026
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                     •
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.825rem' }}>
                     เวอร์ชัน 1.2 (ล่าสุด)
                  </Typography>
               </Box>
            </Box>

            {/* Three Core Commitments Banner */}
            <Box
               sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  p: { xs: 3, sm: 4 },
                  mb: { xs: 6, sm: 7 },
                  boxShadow: '0 1px 3px rgba(15, 47, 82, 0.04)',
               }}>
               <Grid container spacing={{ xs: 2.5, sm: 3 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <LockIcon sx={{ color: '#1976D2', mt: 0.5, flexShrink: 0 }} />
                        <Box>
                           <Typography sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.95rem', mb: 0.5 }}>
                              ไม่ขายข้อมูลเด็ดขาด
                           </Typography>
                           <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                              เราไม่เคยและจะไม่มีวันขายหรือแลกเปลี่ยนข้อมูลส่วนบุคคลของคุณแก่บุคคลภายนอกเพื่อการโฆษณา
                           </Typography>
                        </Box>
                     </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                     <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <SecurityIcon sx={{ color: '#15803D', mt: 0.5, flexShrink: 0 }} />
                        <Box>
                           <Typography sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.95rem', mb: 0.5 }}>
                              การเข้ารหัสระดับมาตรฐาน
                           </Typography>
                           <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                              ข้อมูลธุรกรรมและการเชื่อมต่อทั้งหมดทำงานผ่าน HTTPS พร้อมระบบเซสชันที่มีการควบคุมสิทธิ์อย่างเข้มงวด
                           </Typography>
                        </Box>
                     </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                     <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <EyeIcon sx={{ color: '#B45309', mt: 0.5, flexShrink: 0 }} />
                        <Box>
                           <Typography sx={{ fontWeight: 700, color: '#0F2D4A', fontSize: '0.95rem', mb: 0.5 }}>
                              สิทธิเต็มที่ในข้อมูลของคุณ
                           </Typography>
                           <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                              คุณสามารถเรียกดู แก้ไข ดาวน์โหลดสำเนา หรือขอลบบัญชีและข้อมูลของคุณได้ตลอดเวลาผ่านระบบหรือทีมงาน
                           </Typography>
                        </Box>
                     </Box>
                  </Grid>
               </Grid>
            </Box>

            {/* Layout: Navigation Index & Main Legal Text */}
            <Grid container spacing={{ xs: 4, md: 5 }}>
               {/* Quick Table of Contents - Desktop Sticky Sidebar */}
               <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
                  <Box
                     sx={{
                        position: { md: 'sticky' },
                        top: { md: '90px' },
                        bgcolor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        p: 3,
                        boxShadow: '0 1px 3px rgba(15, 47, 82, 0.04)',
                     }}>
                     <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F2D4A', mb: 2 }}>
                        สารบัญนโยบาย
                     </Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {sections.map((sec) => {
                           const isCurrent = activeSection === sec.id;
                           return (
                              <Button
                                 key={sec.id}
                                 onClick={() => scrollToSection(sec.id)}
                                 sx={{
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    py: 1,
                                    px: 1.5,
                                    minHeight: { xs: 44, md: 40 },
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: isCurrent ? 700 : 500,
                                    color: isCurrent ? '#1976D2' : '#475569',
                                    bgcolor: isCurrent ? '#EAF4FF' : 'transparent',
                                    textTransform: 'none',
                                    '&:hover': {
                                       bgcolor: isCurrent ? '#EAF4FF' : '#F8FAFC',
                                       color: '#1976D2',
                                    },
                                    '&:focus-visible': {
                                       outline: '2px solid #1976D2',
                                       outlineOffset: '2px',
                                    },
                                 }}>
                                 {sec.title}
                              </Button>
                           );
                        })}
                     </Box>

                     <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                     <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: '10px', mb: 1.5, border: '1px solid #E2E8F0' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, mb: 1.5 }}>
                           ต้องการยื่นคำร้องขอจัดการข้อมูลส่วนบุคคล?
                        </Typography>
                        <Button
                           size="small"
                           variant="outlined"
                           fullWidth
                           onClick={() => navigate('/contact')}
                           sx={{
                              minHeight: { xs: 44, sm: 40 },
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#0F2D4A',
                              borderColor: '#CBD5E1',
                              textTransform: 'none',
                              '&:hover': {
                                 borderColor: '#0F2D4A',
                                 bgcolor: 'rgba(15, 45, 74, 0.04)',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #1976D2',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ยื่นคำร้องกับทีมงาน
                        </Button>
                     </Box>

                     <Box sx={{ bgcolor: '#EAF4FF', p: 2, borderRadius: '10px', border: '1px solid #D6E0EA' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#0F2D4A', fontWeight: 700, lineHeight: 1.5, mb: 1 }}>
                           ความโปร่งใสด้านราคาและค่าธรรมเนียม
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.5, mb: 1.5 }}>
                           BookLoop ไม่มีค่าธรรมเนียมแอบแฝง คอมมิชชั่น 0% ทุกรายการ
                        </Typography>
                        <Button
                           size="small"
                           variant="contained"
                           fullWidth
                           onClick={() => navigate('/pricing')}
                           sx={{
                              minHeight: { xs: 44, sm: 38 },
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              bgcolor: '#1976D2',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              boxShadow: 'none',
                              '&:hover': {
                                 bgcolor: '#1565C0',
                                 boxShadow: 'none',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #1976D2',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ดูนโยบายค่าธรรมเนียม 0%
                        </Button>
                     </Box>
                  </Box>
               </Grid>

               {/* Legal Policy Content */}
               <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
                  <Box
                     sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #E2E8F0',
                        p: { xs: 3.5, sm: 5, md: 6 },
                     }}>
                     {/* Section 1 */}
                     <Box id="section-1" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           1. ข้อมูลที่เราเก็บรวบรวม
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           เพื่อให้ระบบ BookLoop สามารถให้บริการซื้อขาย ส่งต่อหนังสือ และดูแลความปลอดภัยของคุณได้อย่างสมบูรณ์
                           เราจำเป็นต้องจัดเก็บข้อมูลส่วนบุคคลเท่าที่จำเป็นตามวัตถุประสงค์ ดังต่อไปนี้:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li>
                              <strong>ข้อมูลบัญชีผู้ใช้งาน:</strong> ชื่อ-นามสกุล, ที่อยู่อีเมล, รหัสผ่านที่ผ่านการแฮชเข้ารหัส (Hashed Password),
                              รูปประจำตัว (Avatar) และประวัติความสนใจในการอ่านหนังสือ
                           </li>
                           <li>
                              <strong>ข้อมูลการสั่งซื้อและการจัดส่ง:</strong> ชื่อผู้รับ, ที่อยู่จัดส่ง, หมายเลขโทรศัพท์ติดต่อ, รายการหนังสือที่สั่งซื้อ,
                              และหมายเลขติดตามพัสดุ
                           </li>
                           <li>
                              <strong>ข้อมูลการชำระเงินและความโปร่งใส:</strong> ภาพหลักฐานการโอนเงิน (สลิปโอนเงิน PromptPay) ที่ผู้ซื้ออัปโหลดเพื่อยืนยันรายการคำสั่งซื้อ
                              โดย BookLoop ประมวลผลภาพเพื่อตรวจสอบยอดเงินและเวลาเท่านั้น <em>ไม่มีการจัดเก็บหมายเลขบัตรเครดิต รหัส CVV หรือข้อมูลบัญชีธนาคารส่วนตัวของผู้ซื้อ</em>
                              (ดูรายละเอียดโมเดล 0% ค่าคอมมิชชั่นได้ที่{' '}
                              <Box
                                 component="button"
                                 type="button"
                                 onClick={() => navigate('/pricing')}
                                 sx={{
                                    all: 'unset',
                                    color: '#1976D2',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    display: 'inline',
                                    '&:hover': { color: '#1565C0' },
                                    '&:focus-visible': {
                                       outline: '2px solid #1976D2',
                                       outlineOffset: '2px',
                                       borderRadius: '2px',
                                    },
                                 }}>
                                 หน้านโยบายค่าธรรมเนียมและความโปร่งใส
                              </Box>
                              )
                           </li>
                           <li>
                              <strong>ข้อมูลการลงขายหนังสือ:</strong> รายละเอียดหนังสือ, ภาพถ่ายสภาพจริง, บันทึกเรื่องราวความประทับใจของผู้ขาย
                           </li>
                           <li>
                              <strong>ข้อมูลทางเทคนิค:</strong> ไอพีแอดเดรส (IP Address), ชนิดของเบราว์เซอร์, บันทึกการเข้าสู่ระบบ (Access Log)
                              เพื่อความปลอดภัยในการป้องกันการโจมตีระบบ
                           </li>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 2 */}
                     <Box id="section-2" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           2. วัตถุประสงค์ในการประมวลผลข้อมูล
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           เรานำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li>ดำเนินการตามคำสั่งซื้อ การจัดส่งสินค้า และการประสานงานระหว่างผู้ซื้อและผู้ขาย</li>
                           <li>ยืนยันตัวตนและรักษาความปลอดภัยของบัญชีผู้ใช้งาน</li>
                           <li>ส่งการแจ้งเตือนสถานะคำสั่งซื้อ การจัดส่ง หรือการเปลี่ยนแปลงข้อมูลสำคัญ</li>
                           <li>แนะนำหนังสือที่ตรงกับความสนใจของคุณผ่านระบบ Personalized Recommendation</li>
                           <li>ตรวจสอบและป้องกันการทุจริต การฉ้อโกง หรือการลงขายหนังสือที่ไม่เป็นไปตามเงื่อนไขชุมชน</li>
                           <li>ปรับปรุงประสิทธิภาพ ประสบการณ์ใช้งาน และพัฒนาฟีเจอร์ใหม่ๆ บนแพลตฟอร์ม</li>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 3 */}
                     <Box id="section-3" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           3. การเปิดเผยข้อมูลแก่บุคคลภายนอก
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           BookLoop ยึดถือนโยบายไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลภายนอก เว้นแต่ในกรณีที่จำเป็นเพื่อการให้บริการเท่านั้น:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li>
                              <strong>ผู้ขายและผู้ให้บริการขนส่ง:</strong> ข้อมูลชื่อ ที่อยู่ และเบอร์โทรศัพท์ของผู้ซื้อจะถูกแสดงแก่ผู้ขาย
                              และบริษัทขนส่งพัสดุเพื่อการจัดส่งหนังสือเท่านั้น
                           </li>
                           <li>
                              <strong>ผู้ให้บริการโครงสร้างพื้นฐานระบบ:</strong> เช่น บริการเซิร์ฟเวอร์คลาวด์และการส่งอีเมลแจ้งเตือน
                              ซึ่งมีสัญญาการรักษาความลับและความปลอดภัยข้อมูลตามมาตรฐาน PDPA
                           </li>
                           <li>
                              <strong>หน่วยงานภาครัฐหรือกฎหมาย:</strong> เมื่อมีคำสั่งศาล หรือหมายเรียกจากหน่วยงานราชการที่มีอำนาจตามกฎหมาย
                           </li>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 4 */}
                     <Box id="section-4" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           4. ความปลอดภัยและการเข้ารหัสข้อมูล
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           เราใช้มาตรการทางเทคนิคและการบริหารจัดการที่มีมาตรฐานสูงในการปกป้องข้อมูลของคุณ:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li>รหัสผ่านทุกบัญชีถูกแปลงด้วยอัลกอริทึม One-Way Hashing ปลอดภัย ไม่มีใครสามารถอ่านรหัสผ่านจริงได้แม้แต่ทีมงาน</li>
                           <li>การรับส่งข้อมูลผ่านเครือข่ายอินเทอร์เน็ตได้รับการเข้ารหัสด้วยโปรโตคอล TLS/SSL (HTTPS) ตลอดเส้นทาง</li>
                           <li>
                              การยืนยันตัวตนใช้ Session Token ที่ปลอดภัย พร้อมกำหนดระยะเวลาหมดอายุ (7 วัน)
                              และจัดเก็บในหน่วยความจำเบราว์เซอร์อย่างรัดกุม
                           </li>
                           <li>
                              <strong>การปกป้องภาพหลักฐานการชำระเงิน:</strong> ภาพสลิปโอนเงิน PromptPay ที่อัปโหลดผ่านระบบจะถูกตรวจสอบประเภทไฟล์อย่างรัดกุม (Bitmap & Polyglot inspection) จัดเก็บอย่างปลอดภัย และจำกัดสิทธิ์เข้าถึงเฉพาะคู่สัญญาในออเดอร์นั้นๆ และผู้ดูแลระบบเท่านั้น โดยไม่มีการเปิดเผยต่อสาธารณะ
                           </li>
                           <li>ไฟล์ข้อมูลในเซิร์ฟเวอร์ได้รับการจำกัดสิทธิ์การเข้าถึง (Access Control) เพื่อป้องกันบุคคลภายนอกเข้าถึงโดยไม่ได้รับอนุญาต</li>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 5 */}
                     <Box id="section-5" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           5. คุกกี้และ Local Storage
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           BookLoop ใช้ Local Storage และคุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์ (Essential Storage):
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li><strong>เซสชันเข้าสู่ระบบ:</strong> เพื่อให้คุณสามารถใช้งานบัญชีได้อย่างต่อเนื่องโดยไม่ต้องล็อกอินซ้ำทุกหน้า</li>
                           <li><strong>ตะกร้าสินค้าและรายการโปรด:</strong> เพื่อจดจำหนังสือที่คุณเลือกไว้ แม้ในขณะที่ยังไม่ได้เข้าสู่ระบบ</li>
                           <li><strong>การตั้งค่าการใช้งาน:</strong> เช่น ตัวเลือกการคัดกรอง หรือหนังสือที่เปิดดูล่าสุด</li>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', mt: 1.5 }}>
                           คุณสามารถล้างข้อมูล Local Storage หรือคุกกี้ได้ตลอดเวลาผ่านการตั้งค่าเบราว์เซอร์ของคุณ
                        </Typography>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 6 */}
                     <Box id="section-6" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           6. สิทธิของเจ้าของข้อมูลตาม PDPA
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 2 }}>
                           ในฐานะเจ้าของข้อมูลส่วนบุคคล คุณมีสิทธิตามกฎหมายดังต่อไปนี้:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, color: '#334155', fontSize: '0.925rem', lineHeight: 1.8 }}>
                           <li><strong>สิทธิขอเข้าถึงและขอรับสำเนา:</strong> คุณสามารถขอตรวจสอบหรือขอรับสำเนาข้อมูลส่วนบุคคลของคุณที่อยู่ในระบบ</li>
                           <li><strong>สิทธิขอแก้ไขข้อมูล:</strong> คุณสามารถแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง เป็นปัจจุบัน ผ่านหน้าตั้งค่าบัญชี</li>
                           <li><strong>สิทธิขอลบหรือทำลายข้อมูล:</strong> คุณสามารถร้องขอให้ลบบัญชีและทำลายข้อมูลส่วนบุคคลของคุณออกจากระบบได้</li>
                           <li><strong>สิทธิขอระงับหรือคัดค้าน:</strong> คุณมีสิทธิคัดค้านการประมวลผลข้อมูลในบางกรณีตามที่กฎหมายกำหนด</li>
                           <li><strong>สิทธิเพิกถอนความยินยอม:</strong> คุณสามารถเพิกถอนความยินยอมในการรับข่าวสารหรือข้อมูลประชาสัมพันธ์ได้ตลอดเวลา</li>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 7 */}
                     <Box id="section-7" sx={{ mb: 6, scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           7. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem' }}>
                           เราอาจปรับปรุงหรือแก้ไขนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว เพื่อให้สอดคล้องกับการพัฒนาบริการหรือการเปลี่ยนแปลงทางกฎหมาย
                           หากมีการเปลี่ยนแปลงสาระสำคัญ เราจะแจ้งให้ทราบผ่านหน้าเว็บไซต์หรือทางอีเมล โดยการใช้งานบริการต่อไปหลังการประกาศ
                           ถือว่าท่านรับทราบและยอมรับนโยบายฉบับปรับปรุงแล้ว
                        </Typography>
                     </Box>

                     <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                     {/* Section 8 */}
                     <Box id="section-8" sx={{ scrollMarginTop: '100px' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F2D4A', mb: 2 }}>
                           8. ช่องทางติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO)
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '0.925rem', mb: 3 }}>
                           หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการใช้สิทธิตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                           สามารถติดต่อทีมงานหรือเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลได้ทาง:
                        </Typography>

                        <Box
                           sx={{
                              bgcolor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              p: 3,
                           }}>
                           <Typography sx={{ fontWeight: 700, color: '#0F2D4A', mb: 1 }}>
                              เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer - DPO)
                           </Typography>
                           <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.7, fontSize: '0.875rem' }}>
                              ทีมงาน BookLoop ประเทศไทย
                              <br />
                              อีเมลสำหรับเรื่องข้อมูลส่วนบุคคล: <strong>privacy@bookloop.co</strong>
                              <br />
                              อีเมลสำหรับฝ่ายสนับสนุนทั่วไป: <strong>support@bookloop.co</strong>
                              <br />
                              เวลาทำการ DPO: จันทร์ - ศุกร์ 09:00 - 18:00 น. (ฝ่ายสนับสนุนทั่วไป: จันทร์ - เสาร์ 09:00 - 18:00 น.)
                           </Typography>
                        </Box>
                     </Box>
                  </Box>
               </Grid>
            </Grid>
         </AppContainer>
      </Box>
   );
}
