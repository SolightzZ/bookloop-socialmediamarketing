import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';

interface SubmitButtonProps extends Omit<ButtonProps, 'disabled'> {
  /** Shows spinner and disables the button */
  isLoading: boolean;
  /** Label while loading (defaults to Thai "กำลังดำเนินการ...") */
  loadingLabel?: string;
  /** Label when idle (defaults to children) */
  children: React.ReactNode;
}

/**
 * Reusable submit button with built-in loading spinner and motion physics.
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
    <motion.div
      whileHover={!isLoading ? { scale: 1.01 } : undefined}
      whileTap={!isLoading ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ width: rest.fullWidth ? '100%' : 'auto' }}
    >
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isLoading}
        sx={{
          py: 1.25,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '0.95rem',
          overflow: 'hidden',
          ...sx,
        }}
        {...rest}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <CircularProgress size={18} color="inherit" />
              <span>{loadingLabel}</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {startIcon}
              <span>{children}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};
