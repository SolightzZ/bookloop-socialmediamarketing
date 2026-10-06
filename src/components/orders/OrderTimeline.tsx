import React, { useState } from 'react';
import { Box, Typography, Paper, LinearProgress, Button, Collapse } from '@mui/material';
import {
   CheckCircle as CompletedIcon,
   ReceiptLongOutlined as CreatedIcon,
   PaidOutlined as PaidIcon,
   Inventory2Outlined as PreparingIcon,
   LocalShippingOutlined as ShippedIcon,
   TwoWheelerOutlined as DeliveryIcon,
   CheckCircleOutlined as DeliveredIcon,
   CancelOutlined as CancelIcon,
   KeyboardArrowDown as ExpandMoreIcon,
   KeyboardArrowUp as ExpandLessIcon,
} from '@mui/icons-material';
import { OrderStatus, PaymentStatus } from '../../types/order';

interface OrderTimelineProps {
   status: OrderStatus;
   paymentStatus: PaymentStatus;
}

interface StepDef {
   key: string;
   label: string;
   description: string;
   icon: React.ComponentType<any>;
}

const TIMELINE_STEPS: StepDef[] = [
   { key: 'created', label: 'สั่งซื้อสำเร็จ', description: 'ระบบบันทึกรายการคำสั่งซื้อเรียบร้อย', icon: CreatedIcon },
   { key: 'paid', label: 'ชำระเงินเรียบร้อย', description: 'ยืนยันการชำระเงินผ่านระบบ', icon: PaidIcon },
   { key: 'processing', label: 'กำลังเตรียมจัดส่ง', description: 'ผู้ขายกำลังบรรจุหีบห่อหนังสือ', icon: PreparingIcon },
   { key: 'shipped', label: 'ส่งมอบให้ขนส่งแล้ว', description: 'พัสดุเข้าสู่ระบบของบริษัทขนส่ง', icon: ShippedIcon },
   { key: 'out_for_delivery', label: 'พัสดุกำลังนำจ่าย', description: 'เจ้าหน้าที่กำลังนำส่งพัสดุถึงที่อยู่ของคุณ', icon: DeliveryIcon },
   { key: 'delivered', label: 'จัดส่งสำเร็จแล้ว', description: 'ผู้รับได้รับพัสดุเรียบร้อยแล้ว', icon: DeliveredIcon },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, paymentStatus }) => {
   const [mobileExpanded, setMobileExpanded] = useState(false);

   // Map order status to step indices (0 to 5)
   const getActiveStepIndex = (): number => {
      if (status === 'cancelled') return -1;
      if (status === 'delivered') return 5;
      if (status === 'out_for_delivery') return 4;
      if (status === 'shipped') return 3;
      if (status === 'processing') return 2;
      if (status === 'paid' || paymentStatus === 'paid') return 1;
      return 0; // pending_payment / created
   };

   const currentStepIndex = getActiveStepIndex();

   if (status === 'cancelled') {
      return (
         <Paper
            elevation={0}
            sx={{
               p: { xs: 2.5, sm: 3 },
               mb: 3.5,
               borderRadius: '16px',
               bgcolor: '#FEF2F2',
               border: '1px solid #FECACA',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <CancelIcon sx={{ color: '#DC2626', fontSize: 24 }} />
               <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991B1B' }}>
                     คำสั่งซื้อนี้ถูกยกเลิกแล้ว
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B91C1C' }}>
                     หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถติดต่อฝ่ายสนับสนุน BookLoop
                  </Typography>
               </Box>
            </Box>
         </Paper>
      );
   }

   const activeStep = TIMELINE_STEPS[currentStepIndex] || TIMELINE_STEPS[0];
   const ActiveIcon = activeStep.icon;
   const progressPercent = Math.round(((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100);

   return (
      <Paper
         elevation={0}
         sx={{
            p: { xs: 2, sm: 3.5 },
            mb: 3.5,
            borderRadius: { xs: '16px', sm: '20px' },
            border: '1px solid #E5EAF0',
            bgcolor: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(16, 42, 67, 0.03)',
         }}>
         {/* Title & Mobile Step Header */}
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               mb: { xs: 2, sm: 3 },
            }}>
            <Typography
               variant="h6"
               sx={{
                  fontWeight: 800,
                  color: '#0F2D4A',
                  fontSize: { xs: '1rem', sm: '1.15rem' },
               }}>
               สถานะคำสั่งซื้อ (Order Timeline)
            </Typography>

            <Typography
               variant="caption"
               sx={{
                  fontWeight: 700,
                  color: '#1976D2',
                  bgcolor: '#EAF4FF',
                  px: 1.25,
                  py: 0.4,
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
               }}>
               ขั้นตอน {currentStepIndex + 1} จาก {TIMELINE_STEPS.length}
            </Typography>
         </Box>

         {/* =========================================================
          MOBILE VIEW (< sm): Clean, thumb-friendly vertical flow
          ========================================================= */}
         <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {/* Prominent Active Step Card */}
            <Box
               sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#F8FBFF',
                  border: '1.5px solid #E0EDFB',
                  mb: 2,
               }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box
                     sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#1976D2',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.28)',
                     }}>
                     <ActiveIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                     <Typography sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.95rem' }}>{activeStep.label}</Typography>
                     <Typography sx={{ color: '#64748B', fontSize: '0.78rem', lineHeight: 1.4 }}>{activeStep.description}</Typography>
                  </Box>
               </Box>

               {/* Progress bar */}
               <Box sx={{ mt: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                     <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                        ความคืบหน้าการจัดส่ง
                     </Typography>
                     <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976D2', fontSize: '0.72rem' }}>
                        {progressPercent}%
                     </Typography>
                  </Box>
                  <LinearProgress
                     variant="determinate"
                     value={progressPercent}
                     sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': {
                           bgcolor: '#1976D2',
                           borderRadius: 3,
                        },
                     }}
                  />
               </Box>
            </Box>

            {/* Toggle Detailed Steps */}
            <Button
               fullWidth
               size="small"
               onClick={() => setMobileExpanded((prev) => !prev)}
               endIcon={mobileExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
               sx={{
                  py: 1,
                  borderRadius: '10px',
                  color: '#0F2D4A',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  bgcolor: '#F1F5F9',
                  textTransform: 'none',
                  mb: mobileExpanded ? 2 : 0,
                  minHeight: '44px',
                  '&:hover': { bgcolor: '#E2E8F0' },
               }}>
               {mobileExpanded ? 'ซ่อนลำดับขั้นตอนทั้งหมด' : 'ดูประวัติขั้นตอนทั้งหมด'}
            </Button>

            {/* Vertical Step Breakdown */}
            <Collapse in={mobileExpanded}>
               <Box sx={{ pt: 1, pl: 0.5 }}>
                  {TIMELINE_STEPS.map((step, idx) => {
                     const isCompleted = idx < currentStepIndex || (idx === 0 && currentStepIndex >= 0);
                     const isCurrent = idx === currentStepIndex;
                     const isLast = idx === TIMELINE_STEPS.length - 1;
                     const StepIcon = step.icon;

                     return (
                        <Box key={step.key} sx={{ display: 'flex', position: 'relative', pb: isLast ? 0 : 2.5 }}>
                           {/* Vertical connecting line */}
                           {!isLast && (
                              <Box
                                 sx={{
                                    position: 'absolute',
                                    left: 15,
                                    top: 28,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: idx < currentStepIndex ? '#16A34A' : '#E2E8F0',
                                    zIndex: 1,
                                 }}
                              />
                           )}

                           {/* Step node icon */}
                           <Box
                              sx={{
                                 width: 32,
                                 height: 32,
                                 borderRadius: '50%',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 flexShrink: 0,
                                 mr: 1.75,
                                 zIndex: 2,
                                 bgcolor: isCompleted && !isCurrent ? '#16A34A' : isCurrent ? '#1976D2' : '#F1F5F9',
                                 color: isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8',
                                 boxShadow: isCurrent ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
                              }}>
                              {isCompleted && !isCurrent ? <CompletedIcon sx={{ fontSize: 18 }} /> : <StepIcon sx={{ fontSize: 16 }} />}
                           </Box>

                           {/* Step label & detail */}
                           <Box sx={{ minWidth: 0, pt: 0.3 }}>
                              <Typography
                                 sx={{
                                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                                    fontSize: '0.85rem',
                                    color: isCurrent ? '#1976D2' : isCompleted ? '#0F2D4A' : '#94A3B8',
                                 }}>
                                 {step.label}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>{step.description}</Typography>
                           </Box>
                        </Box>
                     );
                  })}
               </Box>
            </Collapse>
         </Box>

         {/* =========================================================
          DESKTOP & TABLET VIEW (>= sm): Horizontal Stepper
          ========================================================= */}
         <Box
            sx={{
               display: { xs: 'none', sm: 'flex' },
               alignItems: 'flex-start',
               justifyContent: 'space-between',
               position: 'relative',
               py: 1,
            }}>
            {TIMELINE_STEPS.map((step, idx) => {
               const isCompleted = idx < currentStepIndex || (idx === 0 && currentStepIndex >= 0);
               const isCurrent = idx === currentStepIndex;
               const StepIcon = step.icon;

               return (
                  <React.Fragment key={step.key}>
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           minWidth: { sm: 80, md: 100 },
                           zIndex: 2,
                           position: 'relative',
                        }}>
                        {/* Node icon */}
                        <Box
                           sx={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                              bgcolor: isCompleted && !isCurrent ? '#16A34A' : isCurrent ? '#1976D2' : '#F1F5F9',
                              color: isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8',
                              boxShadow: isCurrent ? '0 4px 14px rgba(25, 118, 210, 0.28)' : 'none',
                              border: isCurrent ? '3px solid #FFFFFF' : 'none',
                              outline: isCurrent ? '2px solid #0F2D4A' : 'none',
                           }}>
                           {isCompleted && !isCurrent ? <CompletedIcon sx={{ fontSize: 24 }} /> : <StepIcon sx={{ fontSize: 22 }} />}
                        </Box>

                        {/* Status text */}
                        <Typography
                           variant="caption"
                           sx={{
                              mt: 1.2,
                              fontWeight: isCurrent ? 800 : isCompleted ? 600 : 500,
                              color: isCurrent ? '#1976D2' : isCompleted ? '#0F2D4A' : '#94A3B8',
                              fontSize: '0.8rem',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                           }}>
                           {step.label}
                        </Typography>

                        <Typography
                           variant="caption"
                           sx={{
                              fontSize: '0.7rem',
                              color: isCompleted && !isCurrent ? '#16A34A' : isCurrent ? '#1976D2' : '#CBD5E1',
                              fontWeight: 600,
                           }}>
                           {isCompleted && !isCurrent ? 'สำเร็จ' : isCurrent ? 'กำลังดำเนิน' : 'รอดำเนิน'}
                        </Typography>
                     </Box>

                     {/* Connecting line */}
                     {idx < TIMELINE_STEPS.length - 1 && (
                        <Box
                           sx={{
                              flexGrow: 1,
                              height: 3,
                              mx: 1,
                              mt: 2.7,
                              bgcolor: idx < currentStepIndex ? '#16A34A' : '#E2E8F0',
                              transition: 'background-color 0.3s ease',
                           }}
                        />
                     )}
                  </React.Fragment>
               );
            })}
         </Box>
      </Paper>
   );
};
