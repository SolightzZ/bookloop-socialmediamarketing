import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
}

export const SELL_STEPS: StepItem[] = [
  { id: 0, label: 'ข้อมูลหนังสือ' },
  { id: 1, label: 'สภาพหนังสือ' },
  { id: 2, label: 'การส่งต่อ' },
];

interface SellStepIndicatorProps {
  activeStep: number;
  maxStepReached: number;
  onStepClick?: (stepIndex: number) => void;
}

export const SellStepIndicator: React.FC<SellStepIndicatorProps> = ({
  activeStep,
  maxStepReached,
  onStepClick,
}) => {
  return (
    <Box
      component="nav"
      aria-label="ขั้นตอนการลงข้อมูลส่งต่อหนังสือ"
      sx={{
        width: '100%',
        mb: { xs: 3.5, sm: 4.5 },
      }}
    >
      {/* Desktop & Tablet Stepper */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          maxWidth: '680px',
          mx: 'auto',
          px: 2,
        }}
      >
        {SELL_STEPS.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isClickable = index <= maxStepReached && !isActive;

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <Box
                component={isClickable ? 'button' : 'div'}
                type={isClickable ? 'button' : undefined}
                onClick={isClickable && onStepClick ? () => onStepClick(index) : undefined}
                aria-current={isActive ? 'step' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  background: 'none',
                  border: 'none',
                  p: 0,
                  cursor: isClickable ? 'pointer' : 'default',
                  outline: 'none',
                  zIndex: 2,
                  transition: 'transform 0.15s ease',
                  '&:focus-visible': {
                    outline: '2px solid #1976D2',
                    outlineOffset: '4px',
                    borderRadius: '8px',
                  },
                  '&:hover': isClickable
                    ? {
                        transform: 'translateY(-1px)',
                      }
                    : undefined,
                }}
              >
                {/* Step Circle Indicator */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    bgcolor: isActive
                      ? '#1976D2'
                      : isCompleted
                      ? '#EAF4FF'
                      : '#FFFFFF',
                    color: isActive
                      ? '#FFFFFF'
                      : isCompleted
                      ? '#1976D2'
                      : '#94A3B8',
                    border: isActive
                      ? '2px solid #1976D2'
                      : isCompleted
                      ? '2px solid #1976D2'
                      : '2px solid #E2EAF2',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(25, 118, 210, 0.14)'
                      : 'none',
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </Box>

                {/* Step Label */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 800 : isCompleted ? 600 : 500,
                    color: isActive ? '#0F2F52' : isCompleted ? '#334155' : '#94A3B8',
                    fontSize: '0.9375rem',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.label}
                </Typography>
              </Box>

              {/* Connecting line between steps */}
              {index < SELL_STEPS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mx: 2,
                    bgcolor: index < activeStep ? '#1976D2' : '#E2EAF2',
                    transition: 'background-color 0.25s ease',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Mobile Compact Progress Indicator */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          bgcolor: '#F8FAFD',
          p: 2,
          borderRadius: 3,
          border: '1px solid #E2EAF2',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: '#1976D2',
              fontSize: '0.8rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            ขั้นตอนที่ {activeStep + 1} จาก {SELL_STEPS.length}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: '#0F2F52',
              fontSize: '0.875rem',
            }}
          >
            {SELL_STEPS[activeStep].label}
          </Typography>
        </Box>

        {/* 3 Segment Progress Bars */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {SELL_STEPS.map((step, idx) => {
            const isFilled = idx <= activeStep;
            return (
              <Box
                key={step.id}
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: isFilled ? '#1976D2' : '#E2EAF2',
                  transition: 'background-color 0.2s ease',
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
