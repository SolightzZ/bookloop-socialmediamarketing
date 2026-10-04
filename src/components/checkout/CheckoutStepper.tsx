import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Check,
  ShoppingCart,
  MapPin,
  Truck,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react';

interface CheckoutStepperProps {
  activeStep: number; // 1: Cart, 2: Address, 3: Shipping, 4: Payment, 5: Confirm
}

const STEPS = [
  { id: 1, label: 'ตะกร้า', sub: 'ตรวจสอบสินค้า', icon: ShoppingCart },
  { id: 2, label: 'ที่อยู่', sub: 'กรอกข้อมูลจัดส่ง', icon: MapPin },
  { id: 3, label: 'การจัดส่ง', sub: 'เลือกวิธีจัดส่ง', icon: Truck },
  { id: 4, label: 'การชำระเงิน', sub: 'เลือกวิธีชำระเงิน', icon: CreditCard },
  { id: 5, label: 'ยืนยัน', sub: 'ตรวจสอบคำสั่งซื้อ', icon: ClipboardCheck },
];

/**
 * CheckoutStepper — 5-step progress.
 *
 * DESKTOP (>768px): unchanged — icon markers, two-line labels, scroll-safe row.
 * MOBILE (<=768px): compact indicator — 5 circles + connectors on one row,
 *   short "01".."05" numerals only, current-step title + description centered
 *   below. Long Thai labels never participate in the horizontal row, so no
 *   character-by-character wrapping can occur.
 */
export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ activeStep }) => {
  const current = STEPS.find((s) => s.id === activeStep) ?? STEPS[0];
  const connectorColor = (nextId: number): string => {
    if (nextId < activeStep) return '#18864B';
    if (nextId === activeStep) return '#1976D2';
    return '#D9E2EC';
  };

  return (
    <Box
      component="nav"
      aria-label="ขั้นตอนการชำระเงิน"
      sx={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        mb: { xs: 3, md: 5 },
        p: { xs: '16px', sm: 2.5, md: 3 },
        bgcolor: '#FFFFFF',
        border: { xs: '1px solid #D9E2EC', md: '1px solid #D6E0EA' },
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(15, 53, 87, 0.04)',
        overflow: 'hidden',
        overflowX: 'hidden',
        '@media (min-width: 769px)': {
          overflowX: 'auto',
          p: 3,
        },
      }}
    >
      {/* ============ MOBILE ONLY (<=768px): compact progress indicator ============ */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          width: '100%',
          boxSizing: 'border-box',
          '@media (min-width: 769px)': { display: 'none' },
        }}
      >
        <Box
          component="ol"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {STEPS.map((step, index) => {
            const isCompleted = step.id < activeStep;
            const isCurrent = step.id === activeStep;
            return (
              <React.Fragment key={step.id}>
                <Box
                  component="li"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`ขั้นตอนที่ ${step.id} ${step.label}`}
                  sx={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    width: 32,
                    minWidth: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      bgcolor: isCompleted ? '#18864B' : isCurrent ? '#102A43' : '#FFFFFF',
                      color: isCompleted || isCurrent ? '#FFFFFF' : '#94A3B8',
                      border: isCompleted || isCurrent ? 'none' : '1px solid #D9E2EC',
                      boxSizing: 'border-box',
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrent ? (
                      String(step.id).padStart(2, '0')
                    ) : (
                      String(step.id).padStart(2, '0')
                    )}
                  </Box>
                  <Typography
                    aria-hidden
                    sx={{
                      fontSize: '0.65rem',
                      lineHeight: 1.2,
                      fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                      color: isCurrent || isCompleted ? '#102A43' : '#94A3B8',
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {String(step.id).padStart(2, '0')}
                  </Typography>
                </Box>
                {index < STEPS.length - 1 && (
                  <Box
                    aria-hidden
                    sx={{
                      flex: 1,
                      flexShrink: 1,
                      flexGrow: 1,
                      minWidth: 4,
                      height: '2px',
                      mt: '13px',
                      mx: '4px',
                      bgcolor: connectorColor(STEPS[index + 1].id),
                      borderRadius: '2px',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
        {/* Current step info — centered below, single line each, never wraps char-by-char */}
        <Box
          sx={{
            mt: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography
            aria-live="polite"
            sx={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#102A43',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {String(current.id).padStart(2, '0')} {current.label}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#62748A',
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            {current.sub}
          </Typography>
        </Box>
      </Box>
      {/* ============ DESKTOP (>768px): unchanged ============ */}
      <Box
        component="ol"
        sx={{
          listStyle: 'none',
          m: 0,
          p: 0,
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          alignItems: 'start',
          width: '100%',
          minWidth: 560,
          '@media (max-width: 768px)': { display: 'none' },
        }}
      >
        {STEPS.map((step, index) => {
          const isCompleted = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          const Icon = step.icon;
          const next = STEPS[index + 1];
          const connector = !next
            ? null
            : next.id < activeStep
              ? '#18864B'
              : next.id === activeStep
                ? '#1976D2'
                : '#D9E2EC';
          return (
            <Box
              key={step.id}
              component="li"
              aria-current={isCurrent ? 'step' : undefined}
              sx={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box
                    aria-hidden
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      bgcolor: isCompleted
                        ? '#18864B'
                        : isCurrent
                          ? { xs: '#0F3557', sm: '#102A43' }
                          : '#FFFFFF',
                      color: isCompleted || isCurrent ? '#FFFFFF' : '#62748A',
                      border: isCompleted || isCurrent ? 'none' : '1px solid #D6E0EA',
                      '@media (max-width: 360px)': {
                        width: 24,
                        height: 24,
                      },
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrent ? (
                      <Icon size={14} strokeWidth={2.4} />
                    ) : (
                      String(step.id).padStart(2, '0')
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: isCurrent ? 800 : isCompleted ? 600 : 500,
                      color: isCurrent ? '#102A43' : isCompleted ? '#102A43' : '#62748A',
                      fontSize: '0.68rem',
                      whiteSpace: 'normal',
                      lineHeight: 1.35,
                      minWidth: 0,
                      '@media (max-width: 360px)': {
                        fontSize: '0.62rem',
                      },
                      '@media (min-width: 769px)': {
                        fontSize: '0.82rem',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    {String(step.id).padStart(2, '0')} {step.label}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    display: 'none',
                    color: isCurrent ? '#1976D2' : '#94A3B8',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.35,
                    pl: '36px',
                    '@media (min-width: 769px)': {
                      display: 'block',
                    },
                  }}
                >
                  {step.sub}
                </Typography>
              </Box>
              {index < STEPS.length - 1 && (
                <Box
                  aria-hidden
                  sx={{
                    flex: 1,
                    height: 1,
                    mx: '12px',
                    mt: '14px',
                    bgcolor: connector,
                    minWidth: 6,
                    '@media (min-width: 769px)': {
                      mx: '12px',
                      minWidth: 16,
                    },
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
