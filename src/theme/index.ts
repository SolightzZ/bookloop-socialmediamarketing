import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

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
         whiteSpace: 'nowrap',
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
               whiteSpace: 'nowrap',
               '&:hover': {
                  boxShadow: 'none',
               },
               '&:focus-visible': {
                  outline: '2px solid rgba(15, 23, 42, 0.2)',
                  outlineOffset: '2px',
               },
            },
            contained: {
               boxShadow: 'none',
               '&:hover': {
                  boxShadow: 'none',
               },
            },
            outlined: {
               borderColor: '#E2E8F0',
               '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: '#F8FAFC',
               },
            },
         },
      },
      MuiIconButton: {
         styleOverrides: {
            root: {
               '&:focus-visible': {
                  outline: '2px solid rgba(15, 23, 42, 0.2)',
                  outlineOffset: '2px',
               },
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
               whiteSpace: 'nowrap',
               '&:focus-visible': {
                  outline: '2px solid rgba(15, 23, 42, 0.2)',
                  outlineOffset: '2px',
               },
            },
         },
      },
      MuiTab: {
         styleOverrides: {
            root: {
               textTransform: 'none',
               whiteSpace: 'nowrap',
               fontWeight: 600,
               '&:focus-visible': {
                  outline: '2px solid rgba(15, 23, 42, 0.2)',
                  outlineOffset: '2px',
               },
            },
         },
      },
      MuiOutlinedInput: {
         styleOverrides: {
            root: {
               borderRadius: '8px',
               backgroundColor: '#FFFFFF',
               transition: 'border-color 140ms ease, box-shadow 140ms ease',
               '& fieldset': {
                  borderColor: '#E2E8F0',
                  transition: 'border-color 140ms ease, box-shadow 140ms ease',
               },
               '&:hover fieldset': {
                  borderColor: '#94A3B8',
               },
               '&.Mui-focused fieldset': {
                  borderColor: '#0F172A',
                  borderWidth: '1px',
               },
               '&.Mui-focused': {
                  boxShadow: '0 0 0 2px rgba(15, 23, 42, 0.08)',
               },
            },
         },
      },
      MuiAccordion: {
         defaultProps: {
            elevation: 0,
            disableGutters: true,
         },
         styleOverrides: {
            root: {
               borderRadius: '8px',
               border: '1px solid #E5E7EB',
               boxShadow: 'none',
               backgroundColor: '#FFFFFF',
               backgroundImage: 'none',
               transition: 'border-color 140ms ease, background-color 140ms ease',
               '&:before': {
                  display: 'none',
               },
               '&.Mui-expanded': {
                  margin: 0,
                  boxShadow: 'none',
                  border: '1px solid #E5E7EB',
               },
               '&:first-of-type': {
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
               },
               '&:last-of-type': {
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
               },
            },
         },
      },
      MuiAccordionSummary: {
         styleOverrides: {
            root: {
               minHeight: '48px',
               padding: '0 16px',
               borderRadius: '8px',
               transition: 'background-color 140ms ease',
               '&:hover': {
                  backgroundColor: '#F8FAFC',
               },
               '&.Mui-focusVisible': {
                  outline: '2px solid rgba(15, 23, 42, 0.16)',
                  outlineOffset: '2px',
               },
               '&.Mui-expanded': {
                  minHeight: '48px',
                  borderBottom: '1px solid #F1F5F9',
               },
            },
            content: {
               margin: '12px 0',
               '&.Mui-expanded': {
                  margin: '12px 0',
               },
            },
         },
      },
      MuiAccordionDetails: {
         styleOverrides: {
            root: {
               padding: '16px',
               backgroundColor: '#FFFFFF',
            },
         },
      },
      MuiMenu: {
         defaultProps: {
            disableScrollLock: true,
         },
      },
      MuiPopover: {
         defaultProps: {
            disableScrollLock: true,
         },
      },
   },
});
