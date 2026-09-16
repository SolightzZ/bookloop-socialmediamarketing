import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

interface SubmitButtonProps extends Omit<ButtonProps, 'disabled'> {
  /** Shows spinner and disables the button */
  isLoading: boolean;
  /** Label while loading (defaults to Thai "กำลังดำเนินการ...") */
  loadingLabel?: string;
  /** Label when idle (defaults to children) */
  children: React.ReactNode;
}

/**
 * Reusable submit button with built-in loading spinner.
 * Replaces the duplicated `isLoading ? <CircularProgress/> : <Icon/>` pattern.
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingLabel = 'กำลังดำเนินการ...',
  children,
  startIcon,
  sx,
  ...rest
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        py: 1.25,
        borderRadius: 2,
        fontWeight: 700,
        fontSize: '0.95rem',
        ...sx,
      }}
      {...rest}
    >
      {isLoading ? loadingLabel : children}
    </Button>
  );
};
