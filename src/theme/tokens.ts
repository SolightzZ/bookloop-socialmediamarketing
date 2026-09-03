export const tokens = {
  colors: {
    inkNavy: '#0F2D4A',
    deepNavy: '#0A192F',
    actionBlue: '#1976D2',
    softBlue: '#EBF3FA',
    paper: '#FFFFFF',
    warmSurface: '#F7F9FC',
    mutedText: '#627D98',
    border: '#D9E2EC',
    success: '#2E7D5B',
    warning: '#B7791F',
    danger: '#B42318',
    // Text specific semantic tokens
    textDark: '#102A43',
    textMuted: '#627D98',
    textLight: '#F8FAFC',
    footerBg: '#0A192F',
    footerHeading: '#38BDF8',
    footerText: '#E2E8F0',
    footerMuted: '#94A3B8',
    ctaBg: '#0B2545',
    ctaHeading: '#FFFFFF',
    ctaSubtext: '#E2E8F0',
  },
  shape: {
    borderRadius: 12,
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
    xxxl: 80,
    huge: 96,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    fontFamily: '"Noto Sans Thai", "Roboto", "Helvetica", "Arial", sans-serif',
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      display: '2.5rem',// 40px
    },
  },
} as const;

export type ThemeTokens = typeof tokens;
