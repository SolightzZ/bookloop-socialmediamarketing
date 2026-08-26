import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export { tokens };

export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.inkNavy,
      dark: tokens.colors.deepNavy,
      light: tokens.colors.actionBlue,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.colors.actionBlue,
      light: tokens.colors.softBlue,
      contrastText: '#FFFFFF',
    },
    success: {
      main: tokens.colors.success,
    },
    warning: {
      main: tokens.colors.warning,
    },
    error: {
      main: tokens.colors.danger,
    },
    info: {
      main: tokens.colors.actionBlue,
    },
    background: {
      default: tokens.colors.warmSurface,
      paper: tokens.colors.paper,
    },
    text: {
      primary: tokens.colors.inkNavy,
      secondary: tokens.colors.mutedText,
    },
    divider: tokens.colors.border,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      fontWeight: 800,
      color: tokens.colors.inkNavy,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      color: tokens.colors.inkNavy,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      color: tokens.colors.inkNavy,
    },
    h4: {
      fontWeight: 700,
      color: tokens.colors.inkNavy,
    },
    h5: {
      fontWeight: 600,
      color: tokens.colors.inkNavy,
    },
    h6: {
      fontWeight: 600,
      color: tokens.colors.inkNavy,
    },
    body1: {
      color: tokens.colors.inkNavy,
      lineHeight: 1.65,
    },
    body2: {
      color: tokens.colors.mutedText,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: tokens.shape.borderRadius,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.colors.warmSurface,
          color: tokens.colors.inkNavy,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: tokens.colors.border,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: '0 4px 12px rgba(16, 42, 67, 0.04)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: tokens.colors.border,
          },
          '&:hover fieldset': {
            borderColor: tokens.colors.actionBlue,
          },
          '&.Mui-focused fieldset': {
            borderColor: tokens.colors.actionBlue,
          },
        },
      },
    },
  },
});
