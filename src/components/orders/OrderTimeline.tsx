import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  RadioButtonChecked as CurrentIcon,
  RadioButtonUnchecked as FutureIcon,
  ReceiptLongOutlined as CreatedIcon,
  PaidOutlined as PaidIcon,
  Inventory2Outlined as PreparingIcon,
  LocalShippingOutlined as ShippedIcon,
  TwoWheelerOutlined as DeliveryIcon,
  CheckCircleOutlined as DeliveredIcon,
} from '@mui/icons-material';
import { OrderStatus, PaymentStatus } from '../../types/order';

interface OrderTimelineProps {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

interface StepDef {
  key: string;
  label: string;
  icon: React.ElementType;
}

const TIMELINE_STEPS: StepDef[] = [
  { key: 'created', label: 'สั่งซื้อสำเร็จ', icon: CreatedIcon },
  { key: 'paid', label: 'ชำระเงิน', icon: PaidIcon },
  { key: 'processing', label: 'กำลังเตรียมจัดส่ง', icon: PreparingIcon },
  { key: 'shipped', label: 'จัดส่งแล้ว', icon: ShippedIcon },
  { key: 'out_for_delivery', label: 'นำจ่าย', icon: DeliveryIcon },
  { key: 'delivered', label: 'จัดส่งสำเร็จ', icon: DeliveredIcon },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, paymentStatus }) => {
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
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, borderRadius: 3, bgcolor: '#FFF5F5', border: '1px solid #FED7D7' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main' }}>
          ❌ คำสั่งซื้อนี้ถูกยกเลิกแล้ว
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        mb: 3.5,
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 3, fontSize: '1.1rem' }}>
        สถานะคำสั่งซื้อ (Order Timeline)
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          overflowX: 'auto',
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || (idx === 0 && currentStepIndex >= 0);
          const isCurrent = idx === currentStepIndex;
          const isFuture = idx > currentStepIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: { xs: 70, sm: 90 },
                  zIndex: 2,
                  position: 'relative',
                }}
              >
                {/* Node icon / indicator */}
                <Box
                  sx={{
                    width: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    bgcolor: isCompleted && !isCurrent
                      ? 'success.main'
                      : isCurrent
                      ? 'primary.main'
                      : '#F1F5F9',
                    color: isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8',
                    boxShadow: isCurrent ? '0 4px 14px rgba(16, 42, 67, 0.28)' : 'none',
                    border: isCurrent ? '3px solid #FFFFFF' : 'none',
                    outline: isCurrent ? '2px solid #102A43' : 'none',
                  }}
                >
                  {isCompleted && !isCurrent ? (
                    <CompletedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  ) : (
                    <StepIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  )}
                </Box>

                {/* Status Indicator text */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1.2,
                    fontWeight: isCurrent ? 800 : isCompleted ? 600 : 500,
                    color: isCurrent
                      ? 'primary.main'
                      : isCompleted
                      ? 'text.primary'
                      : '#94A3B8',
                    fontSize: { xs: '0.72rem', sm: '0.8rem' },
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </Typography>

                {/* Bullet state marker */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.7rem',
                    color: isCompleted && !isCurrent ? 'success.main' : isCurrent ? 'primary.main' : '#CBD5E1',
                  }}
                >
                  {isCompleted && !isCurrent ? '✓ สำเร็จ' : isCurrent ? '● กำลังดำเนิน' : '○ รอดำเนิน'}
                </Typography>
              </Box>

              {/* Connecting line */}
              {idx < TIMELINE_STEPS.length - 1 && (
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 3,
                    mx: { xs: 0.5, sm: 1 },
                    mt: { xs: 2.2, sm: 2.7 },
                    bgcolor: idx < currentStepIndex ? 'success.main' : '#E2E8F0',
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
