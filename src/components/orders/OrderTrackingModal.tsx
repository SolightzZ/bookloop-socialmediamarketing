import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, IconButton, Chip, Divider } from '@mui/material';
import {
   Close as CloseIcon,
   LocalShippingOutlined as ShippingIcon,
   CheckCircle as CheckIcon,
   RadioButtonChecked as CurrentIcon,
   ContentCopy as CopyIcon,
   LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { Order } from '../../types/order';
import { orderService } from '../../services/orderService';
import { showSuccess } from '../../utils/alerts';

interface OrderTrackingModalProps {
   open: boolean;
   onClose: () => void;
   order: Order;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ open, onClose, order }) => {
   const milestones = orderService.getTrackingMilestones(order);
   const trackingNumber = order.trackingNumber || 'TH7619823462';
   const carrier = order.shippingCarrier || 'Flash Express';

   const copyTracking = () => {
      navigator.clipboard?.writeText(trackingNumber);
      showSuccess('คัดลอกเลขพัสดุแล้ว', trackingNumber);
   };

   return (
      <Dialog
         open={open}
         onClose={onClose}
         maxWidth="sm"
         fullWidth
         slotProps={{
            paper: {
               sx: {
                  borderRadius: { xs: '20px', sm: '24px' },
                  p: { xs: 0, sm: 0.5 },
                  m: { xs: 1.5, sm: 'auto' },
                  maxHeight: { xs: '90vh', sm: '85vh' },
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
               },
            },
         }}>
         {/* Modal Header */}
         <DialogTitle
            sx={{
               m: 0,
               p: { xs: 2, sm: 2.5 },
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               borderBottom: '1px solid #F1F5F9',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box
                  sx={{
                     width: { xs: 38, sm: 42 },
                     height: { xs: 38, sm: 42 },
                     borderRadius: '10px',
                     bgcolor: '#EAF4FF',
                     color: '#1976D2',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     flexShrink: 0,
                  }}>
                  <ShippingIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
               </Box>
               <Box>
                  <Typography
                     variant="h6"
                     sx={{
                        fontWeight: 800,
                        color: '#0F2D4A',
                        fontSize: { xs: '1.05rem', sm: '1.2rem' },
                        lineHeight: 1.2,
                     }}>
                     ติดตามสถานะพัสดุ
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.2 }}>
                     ผู้ให้บริการขนส่ง: <strong>{carrier}</strong>
                  </Typography>
               </Box>
            </Box>

            <IconButton
               onClick={onClose}
               size="small"
               aria-label="ปิดหน้าต่างติดตามพัสดุ"
               sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  color: '#64748B',
                  '&:hover': { bgcolor: '#F1F5F9', color: '#0F2D4A' },
               }}>
               <CloseIcon fontSize="small" />
            </IconButton>
         </DialogTitle>

         <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Tracking Number Banner - Mobile Friendly */}
            <Box
               sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#F8FBFF',
                  border: '1.5px solid #E0EDFB',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 1.5,
                  mb: 3,
               }}>
               <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>
                     เลขพัสดุสำหรับติดตาม (Tracking Number)
                  </Typography>
                  <Typography
                     variant="subtitle1"
                     sx={{
                        fontWeight: 800,
                        color: '#0F2D4A',
                        letterSpacing: 0.5,
                        fontFamily: 'monospace',
                        fontSize: { xs: '1.05rem', sm: '1.15rem' },
                     }}>
                     {trackingNumber}
                  </Typography>
               </Box>

               <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CopyIcon sx={{ fontSize: 16 }} />}
                  onClick={copyTracking}
                  sx={{
                     borderRadius: '8px',
                     fontSize: '0.825rem',
                     fontWeight: 700,
                     minHeight: '44px',
                     borderColor: '#CBD5E1',
                     color: '#0F2D4A',
                     bgcolor: '#FFFFFF',
                     whiteSpace: 'nowrap',
                     '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: '#1976D2',
                        color: '#1976D2',
                     },
                  }}>
                  คัดลอกเลขพัสดุ
               </Button>
            </Box>

            {/* Milestone Steps Timeline */}
            <Box sx={{ position: 'relative', pl: { xs: 0.5, sm: 1 } }}>
               {milestones.map((milestone, idx) => {
                  const isLast = idx === milestones.length - 1;

                  return (
                     <Box key={milestone.step} sx={{ display: 'flex', position: 'relative', pb: isLast ? 0 : 3.5 }}>
                        {/* Connecting Line */}
                        {!isLast && (
                           <Box
                              sx={{
                                 position: 'absolute',
                                 left: 15,
                                 top: 32,
                                 bottom: 0,
                                 width: 2,
                                 bgcolor: milestone.completed ? '#16A34A' : '#E2E8F0',
                              }}
                           />
                        )}

                        {/* Milestone Node */}
                        <Box
                           sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: milestone.current ? '#1976D2' : milestone.completed ? '#16A34A' : '#F1F5F9',
                              color: milestone.current || milestone.completed ? '#FFFFFF' : '#94A3B8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              flexShrink: 0,
                              boxShadow: milestone.current ? '0 0 0 4px rgba(25, 118, 210, 0.2)' : 'none',
                           }}>
                           {milestone.completed && !milestone.current ? (
                              <CheckIcon sx={{ fontSize: 18 }} />
                           ) : milestone.current ? (
                              <CurrentIcon sx={{ fontSize: 18 }} />
                           ) : (
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                 {milestone.step}
                              </Typography>
                           )}
                        </Box>

                        {/* Milestone Content */}
                        <Box sx={{ ml: 2, flexGrow: 1, minWidth: 0 }}>
                           <Box
                              sx={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 alignItems: 'flex-start',
                                 flexWrap: 'wrap',
                                 gap: 0.5,
                              }}>
                              <Typography
                                 variant="subtitle2"
                                 sx={{
                                    fontWeight: milestone.current ? 800 : 700,
                                    color: milestone.current ? '#1976D2' : '#0F2D4A',
                                    fontSize: { xs: '0.875rem', sm: '0.92rem' },
                                    lineHeight: 1.3,
                                 }}>
                                 {milestone.title}
                              </Typography>
                              <Typography
                                 variant="caption"
                                 sx={{
                                    color: '#64748B',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    bgcolor: '#F1F5F9',
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: '4px',
                                 }}>
                                 {milestone.timestamp}
                              </Typography>
                           </Box>

                           <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mt: 0.5, lineHeight: 1.5 }}>
                              {milestone.description}
                           </Typography>

                           {milestone.location && (
                              <Typography
                                 variant="caption"
                                 sx={{
                                    color: '#64748B',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    fontSize: '0.75rem',
                                 }}>
                                 <LocationIcon sx={{ fontSize: 14, mr: 0.4, color: '#1976D2' }} />
                                 <span>{milestone.location}</span>
                              </Typography>
                           )}
                        </Box>
                     </Box>
                  );
               })}
            </Box>
         </DialogContent>

         <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: '#F8FBFF' }}>
            <Button
               fullWidth
               onClick={onClose}
               variant="contained"
               sx={{
                  borderRadius: '10px',
                  minHeight: '46px',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  bgcolor: '#1976D2',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#0F2D4A' },
               }}>
               ปิดหน้าต่าง
            </Button>
         </DialogActions>
      </Dialog>
   );
};
