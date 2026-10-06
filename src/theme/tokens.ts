export const tokens = {
   colors: {
      // Primary Swiss palette — restrained, editorial
      inkNavy: '#0A1628',
      deepNavy: '#07101E',
      actionBlue: '#0F6CF0',
      // Legacy brand blue (MUI default #1976D2) — ยังพบ hardcoded ใน focus rings หลายไฟล์
      // ของใหม่ให้ใช้ actionBlue; ห้ามเพิ่ม hex นอกไฟล์นี้
      brandBlue: '#1976D2',
      softBlue: '#EFF4FF',
      paper: '#FFFFFF',
      warmSurface: '#F7F9FC',
      mutedText: '#6B7A90',
      border: '#E6E8EB',
      borderStrong: '#D1D5DB',
      success: '#1A7A4C',
      warning: '#8C6A1A',
      danger: '#B42318',
      // Semantic
      textDark: '#0A1628',
      textMuted: '#6B7A90',
      textLight: '#F8F7F5',
      footerBg: '#0A1628',
      footerHeading: '#E6E8EB',
      footerText: '#A8B3C7',
      footerMuted: '#6B7A90',
      ctaBg: '#0A1628',
      ctaHeading: '#FFFFFF',
      ctaSubtext: '#A8B3C7',
      // Swiss accents
      rule: '#E6E8EB',
      eyebrow: '#0F6CF0',
      surfaceMuted: '#F2F3F5',
   },
   shape: {
      borderRadius: 6,
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
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
   },
   layout: {
      maxWidth: 1280,
      gutter: 24,
      gutterMobile: 16,
      columns: 12,
   },
   typography: {
      fontFamily: '"Noto Sans Thai", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontFamilyDisplay: '"Noto Sans Thai", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      sizes: {
         xs: '0.6875rem', // 11px — eyebrow / metadata
         sm: '0.8125rem', // 13px
         md: '0.9375rem', // 15px
         lg: '1rem', // 16px
         xl: '1.125rem', // 18px
         display: '3rem', // 48px desktop display
         displayMobile: '2.125rem',
      },
   },
} as const;
