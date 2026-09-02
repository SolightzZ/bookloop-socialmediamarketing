import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocalShippingOutlined as ShippingIcon,
  CheckCircle as CheckIcon,
  RadioButtonChecked as CurrentIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { Order } from '../../types/order';
import { orderService } from '../../services/orderService';
import { showSuccess } from '../../utils/alerts';

interface OrderTrackingModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  open,
  onClose,
  order,
}) => {
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
            borderRadius: 3.5,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(16, 42, 67, 0.08)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShippingIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.15rem' }}>
              ติดตามสถานะพัสดุ
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ผู้ให้บริการ: {carrier}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Tracking Number Banner */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              เลขพัสดุสำหรับติดตาม (Tracking Number)
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 0.5 }}>
              {trackingNumber}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CopyIcon sx={{ fontSize: 14 }} />}
            onClick={copyTracking}
            sx={{ borderRadius: 1.5, fontSize: '0.78rem' }}
          >
            คัดลอก
          </Button>
        </Box>

        {/* Milestone Steps Timeline */}
        <Box sx={{ position: 'relative', pl: 1 }}>
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
                      top: 30,
                      bottom: 0,
                      width: 2,
                      bgcolor: milestone.completed ? 'success.main' : '#E2E8F0',
                    }}
                  />
                )}

                {/* Milestone Node */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: milestone.current
                      ? 'primary.main'
                      : milestone.completed
                      ? 'success.main'
                      : '#F1F5F9',
                    color: milestone.current || milestone.completed ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    flexShrink: 0,
                    boxShadow: milestone.current ? '0 0 0 4px rgba(16, 42, 67, 0.15)' : 'none',
                  }}
                >
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
                <Box sx={{ ml: 2.5, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: milestone.current ? 800 : 700,
                        color: milestone.current ? 'primary.main' : 'text.primary',
                        fontSize: '0.92rem',
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {milestone.timestamp}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', mt: 0.5 }}>
                    {milestone.description}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                    📍 {milestone.location}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
};
