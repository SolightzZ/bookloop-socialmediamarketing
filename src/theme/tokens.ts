export const tokens = {
  colors: {
    inkNavy: '#0F2942',
    deepNavy: '#0A192F',
    actionBlue: '#1565C0',
    softBlue: '#EBF3FA',
    paper: '#FFFFFF',
    warmSurface: '#F7F9FB',
    mutedText: '#486581',
    border: '#D9E2EC',
    success: '#2E7D5B',
    warning: '#B7791F',
    danger: '#B42318',
    // Text specific semantic tokens
    textDark: '#0F2942',
    textMuted: '#486581',
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
  typography: {
    fontFamily: '"Noto Sans Thai", "Roboto", "Helvetica", "Arial", sans-serif',
  },
} as const;

export type ThemeTokens = typeof tokens;
