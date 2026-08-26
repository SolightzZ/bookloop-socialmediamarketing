import React from 'react';

export const TypeScriptLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="128" height="128" fill="#3178C6" rx="20" />
    <path d="M72.2 78.4c1.9 3.2 5.1 5.3 9.4 5.3 4 0 6.5-2 6.5-4.8 0-3.3-3.7-4.5-9.8-7.1-8.7-3.7-12.7-8.2-12.7-15.6 0-8.7 6.9-15.2 17.5-15.2 7.7 0 13.3 2.7 16.9 8.9l-7.7 5c-2.1-3.6-4.6-4.8-9.1-4.8-4.2 0-6.4 2.1-6.4 4.5 0 3 3.1 4.1 9.4 6.7 9.5 4 13.2 8.4 13.2 16.1 0 9.7-7.4 15.6-18.4 15.6-10.4 0-17.1-4.9-20.1-12l11.3-2.6zM32.8 52.8H18.5V42.3h40.4v10.5H44.6v48.6H32.8V52.8z" fill="#FFFFFF" />
  </svg>
);

export const ReactLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" style={{ flexShrink: 0, background: '#20232A', borderRadius: 6, padding: '2px' }}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const ViteLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, background: '#1E1E20', borderRadius: 6, padding: '2px' }}>
    <path fill="url(#viteGrad1_comp)" d="M29.5 5.5L16.8 28.2a1.5 1.5 0 01-2.6 0L2.5 5.5a1.5 1.5 0 011.8-2.1l11.7 3.5 11.7-3.5a1.5 1.5 0 011.8 2.1z" />
    <path fill="url(#viteGrad2_comp)" d="M20.5 3.5L16 11.5l3.5 1-6 11.5 9-11.5h-4.5l5.5-7.5l-3.5-1.5z" />
    <defs>
      <linearGradient id="viteGrad1_comp" x1="2.5" y1="3.4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41D1FF" />
        <stop offset="1" stopColor="#BD34FE" />
      </linearGradient>
      <linearGradient id="viteGrad2_comp" x1="13.5" y1="3.5" x2="22.5" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFEA83" />
        <stop offset="0.5" stopColor="#FFDD35" />
        <stop offset="1" stopColor="#FFA800" />
      </linearGradient>
    </defs>
  </svg>
);

export const ReactRouterLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="512" height="512" rx="96" fill="#F44250" />
    <path d="M128 384V128h132.8c70.4 0 119.2 40.8 119.2 101.6 0 44.8-25.6 77.6-67.2 92.8L384 384h-76l-61.6-56H192v56H128zm64-112h64c35.2 0 56.8-17.6 56.8-46.4s-21.6-46.4-56.8-46.4H192v92.8z" fill="#FFFFFF" />
  </svg>
);

export const MuiLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, background: '#001E3C', borderRadius: 6, padding: '3px' }}>
    <path d="M0 2.475v10.39l3 1.733V7.67l6 3.465 6-3.465v6.928L18 16.33V5.94L9 0.75 0 2.475zm24 0l-9 5.195 3 1.732 6-3.465v10.39l-6 3.465-3-1.733v-3.465l-3 1.733v3.464l9 5.196 9-5.196V2.475z" fill="#007FFF" />
    <path d="M9 7.67L3 4.205V.74L9 4.206l6-3.466v3.466L9 7.67z" fill="#00B0FF" />
  </svg>
);

export const MuiIconsLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#0288D1" />
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" fill="#FFFFFF" />
  </svg>
);

export const EmotionLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#D26AC2" />
    <circle cx="8" cy="9" r="1.6" fill="#FFF" />
    <circle cx="16" cy="9" r="1.6" fill="#FFF" />
    <path d="M8 14.5c1.5 2.2 6.5 2.2 8 0" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M14 5.5l3-2" stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const FramerMotionLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#0A0A0A" />
    <path d="M6 4h12l-6 6H6V4zm0 6h6l6 6H6v-6zm6 6l6 6H6l6-6z" fill="url(#fmGrad_comp)" />
    <defs>
      <linearGradient id="fmGrad_comp" x1="6" y1="4" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF0055" />
        <stop offset="0.5" stopColor="#7700FF" />
        <stop offset="1" stopColor="#0055FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const SweetAlert2Logo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#2E7D5B" />
    <circle cx="12" cy="12" r="8" fill="#FFFFFF" />
    <path d="M8.5 12l2.5 2.5 4.8-4.8" stroke="#2E7D5B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const LocalStorageLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#0F172A" />
    <ellipse cx="12" cy="6.5" rx="6" ry="2.2" fill="#38BDF8" />
    <path d="M6 6.5v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-4" stroke="#38BDF8" strokeWidth="1.4" fill="none" />
    <path d="M6 10.5v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-4" stroke="#38BDF8" strokeWidth="1.4" fill="none" />
    <path d="M6 14.5v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-4" stroke="#38BDF8" strokeWidth="1.4" fill="none" />
  </svg>
);

export const TscLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: 6 }}>
    <rect width="24" height="24" rx="6" fill="#1E293B" />
    <path d="M5 8l4 4-4 4M11 16h8" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
