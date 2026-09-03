import React from 'react';
import { Box, Typography } from '@mui/material';

export interface TimelineStepProps {
  stepNumber: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  isLast?: boolean;
  isDesktop?: boolean;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  stepNumber,
  title,
  subtitle,
  desc,
  icon,
  color,
  isLast = false,
  isDesktop = true,
}) => {
  if (isDesktop) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          flex: 1,
          px: 1.5,
        }}
      >
        {/* Step Node Circle */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: '#FFFFFF',
            border: `2px solid ${color}`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px ${color}25`,
            mb: 2,
            position: 'relative',
            zIndex: 2,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 6px 20px ${color}40`,
            },
          }}
        >
          {icon}
          {/* Step Number Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: color,
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF',
            }}
          >
            {stepNumber}
          </Box>
        </Box>

        {/* Step Title & Subtitle */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 800,
            color: '#0F2D4A',
            fontSize: '1.05rem',
            lineHeight: 1.25,
            mb: 0.25,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#1976D2',
            fontWeight: 700,
            fontSize: '0.75rem',
            mb: 1,
            display: 'block',
          }}
        >
          {subtitle}
        </Typography>

        {/* Step Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#627D98',
            fontSize: '0.825rem',
            lineHeight: 1.55,
            maxWidth: 200,
          }}
        >
          {desc}
        </Typography>
      </Box>
    );
  }

  // Mobile Vertical Step
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        position: 'relative',
        pb: isLast ? 0 : 4,
      }}
    >
      {/* Node + Vertical Connecting Line */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: '#FFFFFF',
            border: `2px solid ${color}`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${color}20`,
            flexShrink: 0,
            zIndex: 2,
            position: 'relative',
          }}
        >
          {icon}
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              bgcolor: color,
              color: '#FFFFFF',
              fontSize: '0.625rem',
              fontWeight: 800,
              width: 18,
              height: 18,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF',
            }}
          >
            {stepNumber}
          </Box>
        </Box>

        {/* Vertical line connecting to next step */}
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flexGrow: 1,
              bgcolor: '#D9E2EC',
              my: 1,
            }}
          />
        )}
      </Box>

      {/* Step Content */}
      <Box sx={{ pt: 0.5, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 800,
              color: '#0F2D4A',
              fontSize: '1rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#1976D2',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#627D98',
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          {desc}
        </Typography>
      </Box>
    </Box>
  );
};
