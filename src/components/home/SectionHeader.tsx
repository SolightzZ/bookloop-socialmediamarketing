import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {eyebrow && (
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: '#1976D2',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: '#102A43', fontSize: { xs: '1.25rem', md: '1.5rem' } }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#627D98', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    </Box>
  );
};
