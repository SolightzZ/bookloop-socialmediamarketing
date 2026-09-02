import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'หรือ' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5, width: '100%' }}>
      <Divider sx={{ flexGrow: 1, borderColor: '#E2E8F0' }} />
      <Typography
        variant="caption"
        sx={{
          px: 1.5,
          color: 'text.secondary',
          fontWeight: 500,
          userSelect: 'none',
          fontSize: '0.8rem',
        }}
      >
        {label}
      </Typography>
      <Divider sx={{ flexGrow: 1, borderColor: '#E2E8F0' }} />
    </Box>
  );
};
