import React from 'react';
import { Box, Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material';

export interface AppContainerProps extends MuiContainerProps {
  children: React.ReactNode;
  className?: string;
  noGutter?: boolean;
}

/**
 * Standardized responsive application container.
 * Enforces 1200-1280px max-width, consistent padding (16px mobile, 24px tablet, 32px desktop),
 * and prevents horizontal overflow.
 */
export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  noGutter = false,
  sx,
  ...rest
}) => {
  return (
    <MuiContainer
      maxWidth={maxWidth}
      disableGutters={noGutter}
      className={`w-full mx-auto ${className}`}
      sx={{
        px: noGutter ? 0 : { xs: 2, sm: 3, md: 4 },
        maxWidth: { lg: '1280px' },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiContainer>
  );
};
