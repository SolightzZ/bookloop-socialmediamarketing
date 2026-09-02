import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  ShoppingCartOutlined as CartIcon,
  LocationOnOutlined as AddressIcon,
  LocalShippingOutlined as ShippingIcon,
  PaymentOutlined as PaymentIcon,
  AssignmentTurnedInOutlined as ConfirmIcon,
} from '@mui/icons-material';

interface CheckoutStepperProps {
  activeStep: number; // 1: Cart, 2: Address, 3: Shipping, 4: Payment, 5: Confirm
}

const STEPS = [
  { id: 1, label: 'ตะกร้า', icon: CartIcon },
  { id: 2, label: 'ที่อยู่', icon: AddressIcon },
  { id: 3, label: 'การจัดส่ง', icon: ShippingIcon },
  { id: 4, label: 'การชำระเงิน', icon: PaymentIcon },
  { id: 5, label: 'ยืนยัน', icon: ConfirmIcon },
];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ activeStep }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 4,
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflowX: 'auto',
          py: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {STEPS.map((step, index) => {
          const isCompleted = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          const isFuture = step.id > activeStep;
          const IconComponent = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: { xs: 58, sm: 80 },
                  zIndex: 2,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 34, sm: 40 },
                    height: { xs: 34, sm: 40 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    bgcolor: isCompleted
                      ? 'success.main'
                      : isCurrent
                      ? 'primary.main'
                      : '#F1F5F9',
                    color: isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8',
                    boxShadow: isCurrent ? '0 4px 12px rgba(16, 42, 67, 0.25)' : 'none',
                    border: isCurrent ? '2px solid #FFFFFF' : 'none',
                    outline: isCurrent ? '2px solid #102A43' : 'none',
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  ) : (
                    <IconComponent sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
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
                  {step.id} {step.label}
                </Typography>
              </Box>

              {/* Connecting Line */}
              {index < STEPS.length - 1 && (
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 2.5,
                    mx: { xs: 0.5, sm: 1.5 },
                    mt: { xs: -2.5, sm: -2.5 },
                    bgcolor: step.id < activeStep ? 'success.main' : '#E2E8F0',
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
