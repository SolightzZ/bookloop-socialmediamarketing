import {
   ArrowForward as ArrowForwardIcon,
   ChatBubbleOutlineRounded as ChatIcon,
   CheckCircleOutlined as CheckCircleIcon,
   AccessTimeOutlined as ClockIcon,
   HelpOutlined as HelpIcon,
   InfoOutlined as InfoIcon,
   MailOutlined as MailIcon,
   CalculateOutlined as PricingIcon,
   Send as SendIcon,
   ShieldOutlined as ShieldIcon,
} from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';
import { AppContainer } from '../components/common/Container';
import { apiClient } from '../services/apiClient';
import { showError, showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { logError } from '../utils/logger';

const TOPIC_OPTIONS = [
   { value: 'general', label: 'ข้อมูลทั่วไป / การใช้งาน' },
   { value: 'pricing', label: 'ค่าธรรมเนียม 0% / การรับเงิน' },
   { value: 'orders', label: 'คำสั่งซื้อ / การชำระเงิน' },
   { value: 'selling', label: 'การลงขายหนังสือ' },
   { value: 'shipping', label: 'การจัดส่ง / ติดตามพัสดุ' },
   { value: 'dispute', label: 'สภาพไม่ตรงปก / ขอคืนเงิน' },
   { value: 'feedback', label: 'ข้อเสนอแนะเพื่อการพัฒนา' },
   { value: 'other', label: 'เรื่องอื่นๆ' },
];

export default function ContactPage() {
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      topic: 'general',
      orderId: '',
      message: '',
   });

   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submittedSuccess, setSubmittedSuccess] = useState(false);
   const [isOfflineStored, setIsOfflineStored] = useState(false);

   const validate = () => {
      const newErrors: { [key: string]: string } = {};

      if (!formData.name.trim()) {
         newErrors.name = 'กรุณาระบุชื่อ-นามสกุล';
      } else if (formData.name.trim().length < 2) {
         newErrors.name = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
      }

      if (!formData.email.trim()) {
         newErrors.email = 'กรุณาระบุอีเมลสำหรับติดต่อกลับ';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
         newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      }

      if (!formData.message.trim()) {
         newErrors.message = 'กรุณาระบุรายละเอียดข้อความ';
      } else if (formData.message.trim().length < 10) {
         newErrors.message = 'ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setIsOfflineStored(false);

      try {
         let storedOffline = false;
         try {
            await apiClient.post('contact.php', formData);
         } catch {
            const storedContacts = JSON.parse(localStorage.getItem('bookloop_contact_messages') || '[]');
            storedContacts.push({
               ...formData,
               createdAt: new Date().toISOString(),
            });
            localStorage.setItem('bookloop_contact_messages', JSON.stringify(storedContacts));
            storedOffline = true;
         }

         trackEvent('contact_form_submit', { topic: formData.topic });
         setIsOfflineStored(storedOffline);
         setSubmittedSuccess(true);

         if (storedOffline) {
            showSuccess('บันทึกข้อความเรียบร้อยแล้ว (โหมดทดลองใช้งาน)', 'ระบบได้บันทึกข้อความของคุณไว้ในเครื่องเนื่องจากไม่พบการเชื่อมต่อเซิร์ฟเวอร์');
         } else {
            showSuccess('ส่งข้อความเรียบร้อยแล้ว', 'ทีมงาน BookLoop ได้รับข้อความของคุณแล้ว และจะติดต่อกลับทางอีเมลโดยเร็วที่สุด');
         }

         setFormData({
            name: '',
            email: '',
            topic: 'general',
            orderId: '',
            message: '',
         });
         setErrors({});
      } catch (err: any) {
         logError('Contact form submit error', err);
         showError('ไม่สามารถส่งข้อความได้', 'กรุณาลองใหม่อีกครั้ง หรือส่งอีเมลมาที่ support@bookloop.co');
      } finally {
         setIsSubmitting(false);
      }
   };

   const serviceCommitments = [
      { label: 'เวลาตอบกลับอีเมลเฉลี่ย', value: 'ภายใน 24 ชม. ในวันทำการ' },
      { label: 'ทีมงานฝ่ายบริการลูกค้า', value: 'จันทร์ - เสาร์ 09:00 – 18:00 น.' },
      { label: 'การคุ้มครองข้อพิพาทสภาพหนังสือ', value: 'ประสานงานภายใน 48 ชั่วโมง' },
      { label: 'ช่องทางเร่งด่วน', value: 'LINE Official: @bookloop' },
   ];

   return (
      <Box sx={{ bgcolor: '#F8FBFF', minHeight: '100vh', pb: { xs: 8, md: 14 } }}>
         <AppContainer sx={{ pt: { xs: 2.5, sm: 3.5, md: 5 } }}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbsNav items={[{ label: 'ติดต่อเรา' }]} />

            {/* Swiss Asymmetric Hero Section */}
            <Box sx={{ pt: { xs: 2, sm: 3.5, md: 5 }, pb: { xs: 5, sm: 7, md: 8 } }}>
               <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: 'flex-start' }}>
                  {/* Left Column: Flush-Left Display Title & Narrative (7 cols) */}
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
                        ติดต่อทีมงาน BookLoop
                     </Typography>
                     <Typography
                        variant="body1"
                        sx={{
                           color: '#334155',
                           fontSize: { xs: '0.95rem', sm: '1.05rem' },
                           lineHeight: 1.75,
                           maxWidth: '65ch',
                           mb: 2,
                        }}>
                        มีคำถาม ข้อเสนอแนะ หรือต้องการความช่วยเหลือเรื่องคำสั่งซื้อ? ทีมงาน BookLoop พร้อมดูแลและช่วยเหลือในทุกขั้นตอนของการซื้อขายและส่งต่อหนังสือ
                     </Typography>
                  </Grid>
               </Grid>
            </Box>

            {/* Support Channels Broadsheet Row (Hairline Dividers, Flush-Left) */}
            <Box
               sx={{
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  mb: { xs: 7, sm: 9, md: 11 },
               }}>
               <Grid container>
                  {/* Channel 1: Email */}
                  <Grid
                     size={{ xs: 12, md: 4 }}
                     sx={{
                        p: { xs: 3, sm: 3.5, md: 4 },
                        borderRight: { md: '1px solid #E2E8F0' },
                        borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
                     }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                        <MailIcon sx={{ fontSize: 22, color: '#1976D2' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F2D4A' }}>อีเมลฝ่ายสนับสนุน</Typography>
                     </Box>
                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                        ติดต่อเรื่องคำสั่งซื้อ การใช้งาน หรือแจ้งปัญหาทั่วไป
                     </Typography>
                     <Button
                        component="a"
                        href="mailto:support@bookloop.co"
                        variant="text"
                        sx={{
                           minHeight: 44,
                           px: 0,
                           color: '#1976D2',
                           fontWeight: 700,
                           fontSize: '0.95rem',
                           textTransform: 'none',
                           justifyContent: 'flex-start',
                           '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                           '&:focus-visible': {
                              outline: '2px solid #1976D2',
                              outlineOffset: '2px',
                           },
                        }}>
                        support@bookloop.co
                     </Button>
                     <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                        ตอบกลับภายใน 24 ชม. ในวันทำการ
                     </Typography>
                  </Grid>

                  {/* Channel 2: LINE */}
                  <Grid
                     size={{ xs: 12, md: 4 }}
                     sx={{
                        p: { xs: 3, sm: 3.5, md: 4 },
                        borderRight: { md: '1px solid #E2E8F0' },
                        borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
                     }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                        <ChatIcon sx={{ fontSize: 22, color: '#15803D' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F2D4A' }}>LINE Official</Typography>
                     </Box>
                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                        แชทสดกับทีมงาน สอบถามข้อมูลเร่งด่วน
                     </Typography>
                     <Button
                        component="a"
                        href="https://line.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="text"
                        sx={{
                           minHeight: 44,
                           px: 0,
                           color: '#15803D',
                           fontWeight: 700,
                           fontSize: '0.95rem',
                           textTransform: 'none',
                           justifyContent: 'flex-start',
                           '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                           '&:focus-visible': {
                              outline: '2px solid #15803D',
                              outlineOffset: '2px',
                           },
                        }}>
                        @bookloop (มี @ ด้านหน้า)
                     </Button>
                     <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                        จันทร์ - เสาร์ 09:00 – 18:00 น.
                     </Typography>
                  </Grid>

                  {/* Channel 3: Working Hours */}
                  <Grid
                     size={{ xs: 12, md: 4 }}
                     sx={{
                        p: { xs: 3, sm: 3.5, md: 4 },
                     }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                        <ClockIcon sx={{ fontSize: 22, color: '#B45309' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F2D4A' }}>เวลาทำการ</Typography>
                     </Box>
                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                        ฝ่ายบริการลูกค้าและประสานงานข้อพิพาท
                     </Typography>
                     <Typography
                        sx={{
                           color: '#0F2D4A',
                           fontWeight: 700,
                           fontSize: '0.95rem',
                           fontVariantNumeric: 'tabular-nums',
                           minHeight: 44,
                           display: 'flex',
                           alignItems: 'center',
                        }}>
                        จันทร์ - เสาร์: 09:00 – 18:00 น.
                     </Typography>
                     <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                        (หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์)
                     </Typography>
                  </Grid>
               </Grid>
            </Box>

            {/* Main Interactive Workspace: Distilled Single-Topic Form + Sidebar */}
            <Grid container spacing={{ xs: 4, md: 6 }}>
               {/* Contact Form: Clean, Open, Flush-Left (7.5 cols) */}
               <Grid size={{ xs: 12, md: 7.5 }}>
                  <Box
                     component="form"
                     onSubmit={handleSubmit}
                     noValidate
                     sx={{
                        bgcolor: '#FFFFFF',
                        borderTop: '2px solid #0F2D4A',
                        borderBottom: '1px solid #E2E8F0',
                        p: { xs: 3, sm: 4, md: 5 },
                     }}>
                     <Typography
                        variant="h2"
                        sx={{
                           fontSize: { xs: '1.35rem', sm: '1.55rem' },
                           fontWeight: 800,
                           color: '#0F2D4A',
                           mb: 0.75,
                        }}>
                        ส่งข้อความถึงทีมงาน
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, mb: 4 }}>
                        กรอกข้อมูลด้านล่าง ทีมงานจะตอบกลับไปยังอีเมลที่คุณระบุไว้โดยเร็วที่สุด
                     </Typography>

                     {submittedSuccess && (
                        <Alert
                           icon={isOfflineStored ? <InfoIcon fontSize="inherit" /> : <CheckCircleIcon fontSize="inherit" />}
                           severity={isOfflineStored ? 'info' : 'success'}
                           onClose={() => setSubmittedSuccess(false)}
                           sx={{ mb: 4, borderRadius: '8px', fontSize: '0.875rem' }}>
                           {isOfflineStored
                              ? 'โหมดทดลองใช้งาน: บันทึกข้อความไว้ในเบราว์เซอร์ของคุณเรียบร้อยแล้ว ทีมงานจะติดต่อกลับเมื่อเชื่อมต่อระบบ'
                              : 'ส่งข้อความเรียบร้อยแล้ว ทีมงาน BookLoop ได้รับข้อมูลของคุณแล้วและจะติดต่อกลับโดยเร็วที่สุด'}
                        </Alert>
                     )}

                     <Grid container spacing={2.5}>
                        {/* หัวข้อเรื่องที่ต้องการติดต่อ (Select) */}
                        <Grid size={{ xs: 12 }}>
                           <Typography
                              component="label"
                              htmlFor="contact-topic-select"
                              id="contact-topic-label"
                              sx={{
                                 fontWeight: 800,
                                 color: '#0F2D4A',
                                 mb: 0.75,
                                 fontSize: '0.875rem',
                                 display: 'block',
                              }}>
                              หัวข้อเรื่องที่ต้องการติดต่อ{' '}
                              <Box component="span" sx={{ color: '#EF4444' }}>
                                 *
                              </Box>
                           </Typography>
                           <FormControl fullWidth>
                              <Select
                                 labelId="contact-topic-label"
                                 id="contact-topic-select"
                                 value={formData.topic}
                                 onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                                 sx={{
                                    borderRadius: '8px',
                                    minHeight: 48,
                                    bgcolor: '#F8FAFC',
                                    fontSize: '0.9375rem',
                                    color: '#0F2D4A',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2' },
                                    '& .MuiSelect-select': {
                                       py: 1.5,
                                       display: 'flex',
                                       alignItems: 'center',
                                    },
                                 }}
                                 MenuProps={{
                                    slotProps: {
                                       paper: {
                                          sx: {
                                             borderRadius: '8px',
                                             boxShadow: '0 4px 20px rgba(15, 45, 74, 0.1)',
                                             mt: 0.5,
                                             border: '1px solid #E2E8F0',
                                          },
                                       },
                                    },
                                 }}>
                                 {TOPIC_OPTIONS.map((opt) => (
                                    <MenuItem
                                       key={opt.value}
                                       value={opt.value}
                                       sx={{
                                          fontSize: '0.875rem',
                                          py: 1.25,
                                          minHeight: 44,
                                          '&.Mui-selected': {
                                             bgcolor: '#EAF4FF',
                                             color: '#1976D2',
                                             fontWeight: 700,
                                             '&:hover': {
                                                bgcolor: '#EAF4FF',
                                             },
                                          },
                                       }}>
                                       {opt.label}
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                        </Grid>
                        {/* Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                           <Typography sx={{ fontWeight: 800, color: '#0F2D4A', mb: 0.75, fontSize: '0.875rem' }}>
                              ชื่อ-นามสกุล{' '}
                              <Box component="span" sx={{ color: '#EF4444' }}>
                                 *
                              </Box>
                           </Typography>
                           <TextField
                              fullWidth
                              placeholder="เช่น นภาพร สมใจ"
                              value={formData.name}
                              onChange={(e) => {
                                 setFormData({ ...formData, name: e.target.value });
                                 if (errors.name) setErrors({ ...errors, name: '' });
                              }}
                              error={Boolean(errors.name)}
                              helperText={errors.name}
                              variant="outlined"
                              sx={{
                                 '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    minHeight: 48,
                                    bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2' },
                                 },
                              }}
                           />
                        </Grid>

                        {/* Email */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                           <Typography sx={{ fontWeight: 800, color: '#0F2D4A', mb: 0.75, fontSize: '0.875rem' }}>
                              อีเมลติดต่อกลับ{' '}
                              <Box component="span" sx={{ color: '#EF4444' }}>
                                 *
                              </Box>
                           </Typography>
                           <TextField
                              fullWidth
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => {
                                 setFormData({ ...formData, email: e.target.value });
                                 if (errors.email) setErrors({ ...errors, email: '' });
                              }}
                              error={Boolean(errors.email)}
                              helperText={errors.email}
                              variant="outlined"
                              sx={{
                                 '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    minHeight: 48,
                                    bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2' },
                                 },
                              }}
                           />
                        </Grid>

                        {/* Order ID (Optional) */}
                        <Grid size={{ xs: 12 }}>
                           <Typography sx={{ fontWeight: 800, color: '#0F2D4A', mb: 0.75, fontSize: '0.875rem' }}>
                              หมายเลขคำสั่งซื้อ{' '}
                              <Typography component="span" sx={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                                 (ถ้ามี เช่น ORD-1710000000)
                              </Typography>
                           </Typography>
                           <TextField
                              fullWidth
                              placeholder="เช่น ORD-1710000000"
                              value={formData.orderId}
                              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                              variant="outlined"
                              slotProps={{
                                 htmlInput: {
                                    style: { fontVariantNumeric: 'tabular-nums' },
                                 },
                              }}
                              sx={{
                                 '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    minHeight: 48,
                                    bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2' },
                                 },
                              }}
                           />
                        </Grid>

                        {/* Message */}
                        <Grid size={{ xs: 12 }}>
                           <Typography sx={{ fontWeight: 800, color: '#0F2D4A', mb: 0.75, fontSize: '0.875rem' }}>
                              รายละเอียดข้อความ{' '}
                              <Box component="span" sx={{ color: '#EF4444' }}>
                                 *
                              </Box>
                           </Typography>
                           <TextField
                              fullWidth
                              multiline
                              rows={5}
                              placeholder="ระบุรายละเอียดข้อความของคุณอย่างชัดเจน เพื่อให้ทีมงานช่วยเหลือได้อย่างตรงจุด..."
                              value={formData.message}
                              onChange={(e) => {
                                 setFormData({ ...formData, message: e.target.value });
                                 if (errors.message) setErrors({ ...errors, message: '' });
                              }}
                              error={Boolean(errors.message)}
                              helperText={errors.message}
                              variant="outlined"
                              sx={{
                                 '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976D2' },
                                 },
                              }}
                           />
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                           <Button
                              type="submit"
                              variant="contained"
                              disabled={isSubmitting}
                              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                              sx={{
                                 minHeight: 48,
                                 px: 4,
                                 borderRadius: '8px',
                                 bgcolor: '#1976D2',
                                 color: '#FFFFFF',
                                 fontWeight: 700,
                                 fontSize: '0.9375rem',
                                 textTransform: 'none',
                                 boxShadow: 'none',
                                 width: { xs: '100%', sm: 'auto' },
                                 '&:hover': {
                                    bgcolor: '#0F2D4A',
                                    boxShadow: 'none',
                                 },
                                 '&:focus-visible': {
                                    outline: '2px solid #1976D2',
                                    outlineOffset: '2px',
                                 },
                              }}>
                              {isSubmitting ? 'กำลังส่งข้อความ...' : 'ส่งข้อความถึงทีมงาน'}
                           </Button>
                        </Grid>
                     </Grid>
                  </Box>
               </Grid>

               {/* Right Side: Direct Self-Service Bridge (4.5 cols) */}
               <Grid size={{ xs: 12, md: 4.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                     {/* FAQ Quick Link Panel */}
                     <Box
                        sx={{
                           borderTop: '1px solid #E2E8F0',
                           pt: 3,
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                           <HelpIcon sx={{ color: '#1976D2', fontSize: 22 }} />
                           <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2D4A' }}>ศูนย์ช่วยเหลือและคำถามที่พบบ่อย (FAQ)</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.65, fontSize: '0.85rem', mb: 2 }}>
                           คำตอบยอดนิยมเรื่องการชำระเงิน PromptPay, ขั้นตอนการส่งต่อหนังสือ, เกณฑ์สภาพหนังสือ 4 ระดับ และวิธีติดตามพัสดุ
                        </Typography>
                        <Button
                           variant="outlined"
                           fullWidth
                           endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                           onClick={() => navigate('/help')}
                           sx={{
                              minHeight: 44,
                              borderRadius: '8px',
                              borderColor: '#CBD5E1',
                              color: '#0F2D4A',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              textTransform: 'none',
                              '&:hover': {
                                 borderColor: '#1976D2',
                                 bgcolor: '#F8FBFF',
                                 color: '#1976D2',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #1976D2',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ไปยังศูนย์ช่วยเหลือ (FAQ)
                        </Button>
                     </Box>

                     {/* Fee & Pricing Transparency Bridge */}
                     <Box
                        sx={{
                           borderTop: '1px solid #E2E8F0',
                           pt: 3,
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                           <PricingIcon sx={{ color: '#15803D', fontSize: 22 }} />
                           <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F2D4A' }}>ตรวจสอบค่าธรรมเนียม 0%</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.65, fontSize: '0.85rem', mb: 2 }}>
                           BookLoop ไม่มีหักส่วนแบ่งแพลตฟอร์ม ผู้ส่งต่อรับเงินเต็มจำนวน ทดลองคำนวณรายได้สุทธิได้ฟรีก่อนลงขาย
                        </Typography>
                        <Button
                           variant="outlined"
                           fullWidth
                           endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                           onClick={() => navigate('/pricing')}
                           sx={{
                              minHeight: 44,
                              borderRadius: '8px',
                              borderColor: '#CBD5E1',
                              color: '#0F2D4A',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              textTransform: 'none',
                              '&:hover': {
                                 borderColor: '#15803D',
                                 bgcolor: '#F0FDF4',
                                 color: '#15803D',
                              },
                              '&:focus-visible': {
                                 outline: '2px solid #15803D',
                                 outlineOffset: '2px',
                              },
                           }}>
                           ดูเครื่องคำนวณและค่าธรรมเนียม
                        </Button>
                     </Box>

                     {/* Buyer & Seller Protection Guarantee */}
                     <Box
                        sx={{
                           borderTop: '1px solid #E2E8F0',
                           pt: 3,
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                           <ShieldIcon sx={{ color: '#1976D2', fontSize: 20 }} />
                           <Typography sx={{ fontWeight: 800, fontSize: '0.925rem', color: '#0F2D4A' }}>คุ้มครองสภาพไม่ตรงปก 48 ชม.</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.825rem', lineHeight: 1.6 }}>
                           หากหนังสือมีตำหนิไม่ตรงตามที่ผู้ขายแจ้งไว้ มีระบบประสานงานช่วยเหลือและคืนเงินอย่างเป็นธรรม
                        </Typography>
                     </Box>
                  </Box>
               </Grid>
            </Grid>
         </AppContainer>
      </Box>
   );
}
