import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircleOutlined as SuccessIcon } from '@mui/icons-material';

interface SuccessPanelProps {
  title: string;
  message?: string;
  /** Extra content rendered between message and primary action (e.g. demo reset-token shortcut) */
  children?: React.ReactNode;
  primaryAction: {
    label: string;
    /** Internal route (renders MUI Link/RouterLink). Mutually exclusive with onClick */
    to?: string;
    /** Click handler for a plain button. Mutually exclusive with `to` */
    onClick?: () => void;
    /** Defaults to 'outlined' for links, 'contained' for buttons */
    variant?: 'contained' | 'outlined' | 'text';
  };
}

/**
 * Reusable success panel for auth flows (forgot/reset password).
 * Green check icon + title + message + primary action (internal link or button).
 */
export const SuccessPanel: React.FC<SuccessPanelProps> = ({
  title,
  message,
  children,
  primaryAction: { label, to, onClick, variant },
}) => {
  const isLink = Boolean(to);
  const buttonVariant = variant ?? (isLink ? 'outlined' : 'contained');

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'rgba(46, 125, 91, 0.1)',
          color: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <SuccessIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
        {title}
      </Typography>

      {message && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}
        >
          {message}
        </Typography>
      )}

      {children}

      <Button
        {...(isLink
          ? { component: RouterLink, to }
          : { onClick })}
        variant={buttonVariant}
        fullWidth
        sx={{ borderRadius: 2, py: 1.25, fontWeight: 700 }}
      >
        {label}
      </Button>
    </Box>
  );
};
