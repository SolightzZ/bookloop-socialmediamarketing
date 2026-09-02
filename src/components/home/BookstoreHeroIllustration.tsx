import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar, AvatarGroup } from '@mui/material';
import {
  Sync as LoopIcon,
  AutoStories as BookStoryIcon,
  Star as StarIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';

export const BookstoreHeroIllustration: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // High-performance pointer parallax using CSS Custom Properties without React re-renders
  useEffect(() => {
    // Only enable parallax on desktop fine-pointer devices and when reduced motion is not requested
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || isReducedMotion) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Only track when cursor is within reasonable proximity
      if (
        clientX >= -60 &&
        clientX <= rect.width + 60 &&
        clientY >= -60 &&
        clientY <= rect.height + 60
      ) {
        const xPercent = (clientX / rect.width - 0.5) * 2; // -1 to 1
        const yPercent = (clientY / rect.height - 0.5) * 2; // -1 to 1

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!container) return;
          const clampedX = Math.max(-1, Math.min(1, xPercent));
          const clampedY = Math.max(-1, Math.min(1, yPercent));
          container.style.setProperty('--bl-mx', clampedX.toFixed(3));
          container.style.setProperty('--bl-my', clampedY.toFixed(3));
        });
      }
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!container) return;
        container.style.setProperty('--bl-mx', '0');
        container.style.setProperty('--bl-my', '0');
      });
    };

    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      id="bookstore-hero-illustration-container"
      className="bl-hero-anim"
      sx={{
        '--bl-mx': 0,
        '--bl-my': 0,
        position: 'relative',
        width: '100%',
        maxWidth: 580,
        mx: 'auto',
        aspectRatio: { xs: '4 / 3.1', sm: '16 / 12', md: '1.24 / 1' },
        minHeight: { xs: 260, sm: 340, md: 390 },
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 48px -12px rgba(15, 41, 66, 0.16), 0 4px 16px rgba(15, 41, 66, 0.06)',
        border: '1px solid rgba(217, 226, 236, 0.85)',
        background: 'linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 50%, #E2E8F0 100%)',
        userSelect: 'none',
        contain: 'layout style paint',
        '@media (prefers-reduced-motion: reduce)': {
          '& *': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      }}
    >
      {/* --- SVG SCENE LAYERS --- */}
      <svg
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <style>{`
            /* Parallax Layer Styles (Hardware-Accelerated CSS Transitions) */
            .bl-layer-bg {
              transform: translate3d(calc(var(--bl-mx, 0) * -1px), calc(var(--bl-my, 0) * -1px), 0);
              transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .bl-layer-shelf {
              transform: translate3d(calc(var(--bl-mx, 0) * 2.2px), calc(var(--bl-my, 0) * 1.8px), 0);
              transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .bl-layer-reader {
              transform: translate3d(calc(var(--bl-mx, 0) * 4.5px), calc(var(--bl-my, 0) * 3.5px), 0);
              transition: transform 0.32s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .bl-layer-book {
              transform: translate3d(calc(var(--bl-mx, 0) * 7px), calc(var(--bl-my, 0) * 5.5px), 0);
              transition: transform 0.28s cubic-bezier(0.25, 1, 0.5, 1);
            }

            /* Calm & Subtle Editorial Animations */
            @keyframes bl-float-slow {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-5px) rotate(1.2deg); }
            }
            @keyframes bl-page-flip {
              0%, 100% { transform: scaleX(1) skewY(0deg); }
              50% { transform: scaleX(0.78) skewY(-1.5deg); }
            }
            @keyframes bl-dash-cycle {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes bl-sparkle-1 {
              0%, 100% { opacity: 0.25; transform: scale(0.9); }
              50% { opacity: 0.95; transform: scale(1.15); }
            }
            @keyframes bl-sparkle-2 {
              0%, 100% { opacity: 0.2; transform: scale(0.85); }
              50% { opacity: 0.9; transform: scale(1.2); }
            }
            @keyframes bl-reader-breath {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-1.2px) rotate(-0.3deg); }
            }
            @keyframes bl-shelf-book-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-2px); }
            }
            @keyframes bl-badge-pulse {
              0%, 100% { transform: scale(1); opacity: 0.95; }
              50% { transform: scale(1.05); opacity: 1; }
            }

            .bl-anim-float-slow {
              animation: bl-float-slow 5.5s ease-in-out infinite;
              transform-origin: center center;
            }
            .bl-anim-page-flip {
              animation: bl-page-flip 6.5s ease-in-out infinite;
              transform-origin: 28px 20px;
            }
            .bl-anim-dash {
              animation: bl-dash-cycle 6.5s linear infinite;
            }
            .bl-anim-sparkle-1 {
              animation: bl-sparkle-1 3.5s ease-in-out infinite;
              transform-origin: center;
            }
            .bl-anim-sparkle-2 {
              animation: bl-sparkle-2 4.2s ease-in-out infinite 1.2s;
              transform-origin: center;
            }
            .bl-anim-sparkle-3 {
              animation: bl-sparkle-1 3.8s ease-in-out infinite 0.7s;
              transform-origin: center;
            }
            .bl-anim-reader {
              animation: bl-reader-breath 5s ease-in-out infinite;
              transform-origin: 50% 85%;
            }
            .bl-anim-shelf-book {
              animation: bl-shelf-book-float 4.8s ease-in-out infinite;
            }
            .bl-anim-loop-badge {
              animation: bl-badge-pulse 4s ease-in-out infinite;
              transform-origin: center center;
            }

            @media (prefers-reduced-motion: reduce) {
              .bl-anim-float-slow,
              .bl-anim-page-flip,
              .bl-anim-dash,
              .bl-anim-sparkle-1,
              .bl-anim-sparkle-2,
              .bl-anim-sparkle-3,
              .bl-anim-reader,
              .bl-anim-shelf-book,
              .bl-anim-loop-badge,
              .bl-layer-bg,
              .bl-layer-shelf,
              .bl-layer-reader,
              .bl-layer-book {
                animation: none !important;
                transform: none !important;
                transition: none !important;
              }
            }
          `}</style>

          {/* Background Gradients */}
          <linearGradient id="wallGradient" x1="0" y1="0" x2="600" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F4F8FC" />
            <stop offset="55%" stopColor="#EBF3FA" />
            <stop offset="100%" stopColor="#E2ECF7" />
          </linearGradient>

          <linearGradient id="windowGlow" x1="420" y1="50" x2="520" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="lampCone" x1="280" y1="20" x2="280" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="bookloopGradient" x1="120" y1="280" x2="480" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="bookCoverAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="chairGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F2942" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Soft Shadow Filters */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F2942" floodOpacity="0.14" />
          </filter>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* LAYER 1: BACKGROUND & ARCHITECTURAL ELEMENTS (STATIC)    */}
        {/* ======================================================== */}
        <g className="bl-layer-bg">
          {/* Wall Background */}
          <rect width="600" height="480" fill="url(#wallGradient)" />

          {/* Editorial Parquet Floor */}
          <path d="M 0 380 L 600 380 L 600 480 L 0 480 Z" fill="#E2E8F0" />
          <path d="M 0 380 L 600 380" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M 80 380 L 40 480" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.6" />
          <path d="M 200 380 L 160 480" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.6" />
          <path d="M 320 380 L 280 480" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.6" />
          <path d="M 440 380 L 400 480" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.6" />
          <path d="M 560 380 L 520 480" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Arched Architectural Window (Right Side Backdrop) */}
          <g transform="translate(370, 40)">
            <path
              d="M 0 100 C 0 44.77 44.77 0 100 0 C 155.23 0 200 44.77 200 100 L 200 280 L 0 280 Z"
              fill="url(#windowGlow)"
              stroke="#D9E2EC"
              strokeWidth="2"
            />
            {/* Window Grid Lines */}
            <path d="M 100 0 L 100 280" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.8" />
            <path d="M 0 100 L 200 100" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.8" />
            <path d="M 0 180 L 200 180" stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.8" />

            {/* Subtle foliage outside window */}
            <circle cx="160" cy="140" r="32" fill="#93C5FD" fillOpacity="0.3" />
            <circle cx="180" cy="180" r="24" fill="#6EE7B7" fillOpacity="0.25" />
          </g>

          {/* Warm Hanging Pendant Lamp */}
          <g transform="translate(260, 0)">
            <line x1="20" y1="0" x2="20" y2="70" stroke="#0F2942" strokeWidth="2.5" />
            {/* Lamp Shade */}
            <path d="M 0 95 L 40 95 L 30 70 L 10 70 Z" fill="#0F2942" />
            {/* Lamp Bulb */}
            <circle cx="20" cy="97" r="5" fill="#F59E0B" />
            {/* Warm Light Cone */}
            <polygon points="20,98 -30,320 70,320" fill="url(#lampCone)" />
          </g>

          {/* Background Plant (Left Corner) */}
          <g transform="translate(32, 280)">
            {/* Plant Pot */}
            <path d="M 12 60 L 38 60 L 44 100 L 6 100 Z" fill="#EA580C" />
            <ellipse cx="25" cy="60" rx="14" ry="4" fill="#C2410C" />
            {/* Leaves */}
            <path d="M 25 60 Q 10 30 -5 35 Q 12 48 25 60" fill="#059669" />
            <path d="M 25 60 Q 30 20 48 22 Q 38 42 25 60" fill="#10B981" />
            <path d="M 25 60 Q 15 15 24 5 Q 30 30 25 60" fill="#34D399" />
            <path d="M 25 60 Q 40 40 58 46 Q 42 58 25 60" fill="#059669" />
          </g>
        </g>

        {/* ======================================================== */}
        {/* LAYER 2: BOOKSTORE BOOKSHELF & CURATED BOOKS (STATIC)    */}
        {/* ======================================================== */}
        <g className="bl-layer-shelf">
          {/* Main Wooden Bookshelf (Left to Center) */}
          <g transform="translate(75, 70)">
            {/* Bookshelf Frame Shadow */}
            <rect x="2" y="4" width="176" height="310" rx="6" fill="#0F2942" fillOpacity="0.08" />
            {/* Bookshelf Outer Frame */}
            <rect x="0" y="0" width="176" height="310" rx="6" fill="#0F2942" />
            <rect x="4" y="4" width="168" height="302" rx="4" fill="#1E293B" />

            {/* Shelf Dividers */}
            <rect x="4" y="96" width="168" height="8" fill="#334E68" />
            <rect x="4" y="196" width="168" height="8" fill="#334E68" />
            <rect x="4" y="296" width="168" height="8" fill="#334E68" />

            {/* --- TOP SHELF BOOKS (Row 1) --- */}
            <g transform="translate(14, 24)">
              {/* Book 1 - Indigo */}
              <rect x="0" y="8" width="16" height="64" rx="2" fill="#38BDF8" />
              <rect x="2" y="12" width="12" height="4" fill="#FFFFFF" fillOpacity="0.7" />
              {/* Book 2 - Navy */}
              <rect x="18" y="0" width="18" height="72" rx="2" fill="#0284C7" />
              <line x1="27" y1="8" x2="27" y2="64" stroke="#BAE6FD" strokeWidth="1.5" />
              {/* Book 3 - Amber (Subtle Shelf Float) */}
              <g className="bl-anim-shelf-book">
                <rect x="38" y="12" width="14" height="60" rx="2" fill="#F59E0B" />
              </g>
              {/* Book 4 - Terracotta */}
              <rect x="54" y="4" width="20" height="68" rx="2" fill="#EA580C" />
              <rect x="58" y="16" width="12" height="3" fill="#FED7AA" />
              {/* Slanted Book 5 */}
              <g transform="translate(86, 12) rotate(14)">
                <rect x="0" y="0" width="14" height="62" rx="2" fill="#10B981" />
              </g>
              {/* Mini succulent decorative plant on top shelf */}
              <g transform="translate(126, 44)">
                <rect x="0" y="14" width="18" height="14" rx="2" fill="#FEF3C7" />
                <path d="M 9 14 Q 4 4 2 2 Q 8 8 9 14" fill="#34D399" />
                <path d="M 9 14 Q 14 4 16 2 Q 10 8 9 14" fill="#059669" />
              </g>
            </g>

            {/* --- MIDDLE SHELF BOOKS (Row 2) --- */}
            <g transform="translate(14, 120)">
              {/* Stack of horizontal books */}
              <rect x="2" y="58" width="54" height="14" rx="2" fill="#E2E8F0" />
              <rect x="6" y="44" width="46" height="14" rx="2" fill="#38BDF8" />
              <rect x="10" y="32" width="38" height="12" rx="2" fill="#F59E0B" />
              <rect x="14" y="22" width="30" height="10" rx="2" fill="#059669" />

              {/* Vertical books right of stack */}
              <rect x="64" y="4" width="16" height="68" rx="2" fill="#6366F1" />
              <rect x="82" y="10" width="14" height="62" rx="2" fill="#EC4899" />
              <rect x="98" y="0" width="22" height="72" rx="2" fill="#0F2942" stroke="#486581" strokeWidth="1" />
              <rect x="122" y="8" width="16" height="64" rx="2" fill="#D97706" />
              <rect x="140" y="14" width="12" height="58" rx="2" fill="#14B8A6" />
            </g>

            {/* --- BOTTOM SHELF BOOKS (Row 3) --- */}
            <g transform="translate(14, 218)">
              {/* Series of tall editorial reference books */}
              <rect x="0" y="0" width="18" height="78" rx="2" fill="#0369A1" />
              <line x1="9" y1="12" x2="9" y2="68" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="20" y="0" width="18" height="78" rx="2" fill="#0284C7" />
              <line x1="29" y1="12" x2="29" y2="68" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="40" y="0" width="18" height="78" rx="2" fill="#0EA5E9" />
              <line x1="49" y1="12" x2="49" y2="68" stroke="#E0F2FE" strokeWidth="1.5" strokeDasharray="3 3" />

              <rect x="66" y="8" width="15" height="70" rx="2" fill="#EA580C" />
              <rect x="83" y="14" width="18" height="64" rx="2" fill="#FBBF24" />
              <rect x="103" y="4" width="14" height="74" rx="2" fill="#10B981" />
              <rect x="119" y="18" width="28" height="60" rx="2" fill="#475569" />
            </g>
          </g>
        </g>

        {/* ======================================================== */}
        {/* LAYER 3: BRAND STORY "BOOKLOOP" PASSING PATH & PARTICLES */}
        {/* ======================================================== */}
        <g>
          {/* Animated Glowing Continuous BookLoop Path */}
          <path
            className="bl-anim-dash"
            d="M 230 210 C 270 140, 360 120, 420 180 C 470 230, 440 310, 370 330 C 300 350, 240 290, 270 230"
            stroke="url(#bookloopGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="8 8"
            fill="none"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.4))',
            }}
          />

          {/* Sparkles / Twinkle Stars (Gentle Opacity Cycle) */}
          <g transform="translate(280, 140)" className="bl-anim-sparkle-1">
            <path
              d="M 10 0 L 12 7 L 19 10 L 12 13 L 10 20 L 8 13 L 1 10 L 8 7 Z"
              fill="#F59E0B"
            />
          </g>

          <g transform="translate(470, 150)" className="bl-anim-sparkle-2">
            <path
              d="M 8 0 L 10 5 L 15 8 L 10 11 L 8 16 L 6 11 L 1 8 L 6 5 Z"
              fill="#38BDF8"
            />
          </g>

          <g transform="translate(210, 330)" className="bl-anim-sparkle-3">
            <path
              d="M 6 0 L 8 4 L 12 6 L 8 8 L 6 12 L 4 8 L 0 6 L 4 4 Z"
              fill="#10B981"
            />
          </g>
        </g>

        {/* ======================================================== */}
        {/* LAYER 4: READER CHARACTER (EDITORIAL MINIMALIST STYLE)    */}
        {/* ======================================================== */}
        <g className="bl-layer-reader">
          {/* Reader on Comfortable Modern Armchair */}
          <g transform="translate(360, 210)">
            {/* Armchair Shadow */}
            <ellipse cx="65" cy="185" rx="60" ry="14" fill="#0F2942" fillOpacity="0.12" />

            {/* Armchair Base & Backrest */}
            <path
              d="M 20 70 C 20 30, 45 10, 85 10 C 120 10, 140 35, 140 70 L 140 130 C 140 150, 125 165, 105 165 L 45 165 C 25 165, 20 150, 20 130 Z"
              fill="url(#chairGradient)"
              filter="url(#softShadow)"
            />
            {/* Chair Accent Cushion */}
            <path d="M 32 105 C 32 90, 48 80, 80 80 C 112 80, 128 90, 128 105 L 128 140 L 32 140 Z" fill="#F8FAFC" fillOpacity="0.95" />
            {/* Chair Wooden Legs */}
            <line x1="30" y1="165" x2="18" y2="190" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            <line x1="120" y1="165" x2="132" y2="190" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

            {/* Side Table with Hot Coffee Mug */}
            <g transform="translate(130, 115)">
              <rect x="0" y="45" width="36" height="6" rx="2" fill="#334E68" />
              <line x1="18" y1="51" x2="18" y2="78" stroke="#1E293B" strokeWidth="3" />
              <line x1="6" y1="78" x2="30" y2="78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              {/* Ceramic Mug */}
              <rect x="12" y="32" width="12" height="13" rx="2" fill="#F59E0B" />
              <path d="M 24 35 C 27 35, 28 38, 28 41 C 28 44, 27 45, 24 45" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              {/* Mug Steam */}
              <path d="M 16 28 Q 14 24 16 20" stroke="#CBD5E1" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 20 29 Q 22 25 20 21" stroke="#CBD5E1" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </g>

            {/* Reader Figure (Editorial 2D Illustrated Persona) */}
            <g transform="translate(42, 22)" className="bl-anim-reader">
              {/* Reader Legs / Relaxed Pants */}
              <path d="M 32 108 L 22 135 L 5 145" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 46 108 L 40 138 L 26 150" stroke="#0F172A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Cozy Shoes */}
              <ellipse cx="2" cy="146" rx="6" ry="4" fill="#EA580C" />
              <ellipse cx="23" cy="151" rx="6" ry="4" fill="#EA580C" />

              {/* Reader Torso / Warm Terracotta Sweater */}
              <path
                d="M 20 54 C 20 44, 34 38, 48 38 C 62 38, 72 44, 68 62 L 62 108 C 62 112, 22 112, 20 108 Z"
                fill="#C2410C"
              />
              {/* Sweater Collar */}
              <ellipse cx="45" cy="40" rx="9" ry="4" fill="#9A3412" />

              {/* Reader Head & Stylized Hair */}
              {/* Neck */}
              <rect x="42" y="32" width="7" height="9" fill="#FED7AA" />
              {/* Head */}
              <circle cx="45" cy="24" r="11" fill="#FED7AA" />
              {/* Stylized Modern Editorial Hair (Deep Navy/Black) */}
              <path
                d="M 36 22 C 34 12, 45 10, 54 12 C 58 13, 60 18, 57 24 C 54 22, 50 18, 44 18 C 39 18, 37 20, 36 22 Z"
                fill="#0F172A"
              />
              {/* Hair bun */}
              <circle cx="37" cy="14" r="6" fill="#0F172A" />
              {/* Glasses */}
              <circle cx="48" cy="23" r="3.2" stroke="#0F172A" strokeWidth="1" fill="none" />
              <line x1="45" y1="23" x2="43" y2="23" stroke="#0F172A" strokeWidth="1" />

              {/* Reader Arms holding Book */}
              <path d="M 30 58 Q 24 75 36 86" stroke="#C2410C" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 58 58 Q 58 75 48 86" stroke="#9A3412" strokeWidth="8" strokeLinecap="round" fill="none" />

              {/* Book being read in hands */}
              <g transform="translate(24, 78)">
                {/* Book Cover (Navy Blue) */}
                <path d="M 0 6 L 16 12 L 32 6 L 32 24 L 16 30 L 0 24 Z" fill="#0369A1" />
                {/* Book Pages Open */}
                <path d="M 2 5 L 16 10 L 30 5 L 30 22 L 16 27 L 2 22 Z" fill="#FFFFFF" />
                {/* Page center fold */}
                <line x1="16" y1="10" x2="16" y2="27" stroke="#CBD5E1" strokeWidth="1" />
                {/* Text Lines Impression */}
                <line x1="5" y1="10" x2="13" y2="12" stroke="#94A3B8" strokeWidth="1" />
                <line x1="5" y1="14" x2="13" y2="16" stroke="#94A3B8" strokeWidth="1" />
                <line x1="19" y1="12" x2="27" y2="10" stroke="#94A3B8" strokeWidth="1" />
                <line x1="19" y1="16" x2="27" y2="14" stroke="#94A3B8" strokeWidth="1" />
              </g>
            </g>
          </g>
        </g>

        {/* ======================================================== */}
        {/* LAYER 5: THE FLOATING / PASSING BOOK (BOOKLOOP IN ACTION) */}
        {/* ======================================================== */}
        <g className="bl-layer-book">
          {/* Floating book passing gracefully in the air */}
          <g transform="translate(262, 175)" className="bl-anim-float-slow">
            {/* Book Glow Aura */}
            <circle cx="28" cy="20" r="36" fill="#38BDF8" fillOpacity="0.2" filter="url(#glowFilter)" />

            {/* Hardcover Open Book Floating with slow flip effect */}
            <g className="bl-anim-page-flip">
              {/* Back Cover / Spine */}
              <path
                d="M 4 8 Q 28 2 52 8 L 52 38 Q 28 32 4 38 Z"
                fill="url(#bookCoverAmber)"
                filter="url(#softShadow)"
              />
              {/* Left Page */}
              <path
                d="M 6 9 Q 28 4 28 10 L 28 36 Q 28 31 6 36 Z"
                fill="#FFFDF7"
              />
              {/* Right Page (Turning) */}
              <path
                d="M 28 10 Q 28 4 50 9 L 50 36 Q 28 31 28 36 Z"
                fill="#FFFFFF"
              />
              {/* Page Spine Shadow */}
              <line x1="28" y1="8" x2="28" y2="37" stroke="#D97706" strokeWidth="1.5" />
              {/* Subtle gold ribbon bookmark dangling */}
              <path d="M 28 36 Q 26 46 32 50 Q 34 46 32 42" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* Mini Passing Arrow Loop Badge over Book */}
            <g transform="translate(18, -14)" className="bl-anim-loop-badge">
              <rect x="0" y="0" width="20" height="20" rx="10" fill="#0284C7" />
              <g transform="translate(10, 10)">
                <path
                  d="M -5 0 A 5 5 0 1 1 5 0 A 5 5 0 0 1 0 5"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* ======================================================== */}
      {/* LAYER 6: EDITORIAL FLOATING UI MICRO-BADGES              */}
      {/* ======================================================== */}

      {/* Top-Right Badge: Active BookLoop Community Counter */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 14, md: 16 },
          right: { xs: 8, sm: 14, md: 16 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.75, sm: 1 },
          px: { xs: 1, sm: 1.5, md: 1.75 },
          py: { xs: 0.4, sm: 0.65, md: 0.8 },
          borderRadius: 50,
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px -4px rgba(15, 41, 66, 0.12), 0 2px 6px rgba(15, 41, 66, 0.04)',
          border: '1px solid rgba(217, 226, 236, 0.9)',
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            width: { xs: 6, sm: 8 },
            height: { xs: 6, sm: 8 },
            borderRadius: '50%',
            bgcolor: '#10B981',
            boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '0.65rem', sm: '0.74rem', md: '0.78rem' },
            color: '#0F2942',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <BookStoryIcon sx={{ fontSize: { xs: 12, sm: 14, md: 15 }, color: '#0284C7' }} />
          ส่งต่อเรื่องราวสู่ผู้อ่านคนถัดไป
        </Typography>
      </Box>

      {/* Bottom-Left Overlay Card: Book Passing Story Card */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 8, sm: 12, md: 16 },
          left: { xs: 8, sm: 12, md: 16 },
          p: { xs: 1, sm: 1.25, md: 1.5 },
          maxWidth: { xs: 200, sm: 250, md: 280 },
          borderRadius: 2.5,
          bgcolor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 16px 32px -8px rgba(15, 41, 66, 0.18), 0 4px 12px rgba(15, 41, 66, 0.06)',
          border: '1px solid rgba(217, 226, 236, 0.9)',
          zIndex: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 0.25, sm: 0.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box
              sx={{
                width: { xs: 18, sm: 20 },
                height: { xs: 18, sm: 20 },
                borderRadius: '50%',
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
              }}
            >
              <LoopIcon sx={{ fontSize: { xs: 11, sm: 13 } }} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#0F2942',
                fontSize: { xs: '0.68rem', sm: '0.74rem', md: '0.78rem' },
                whiteSpace: 'nowrap',
              }}
            >
              เรื่องราวเล่มที่ #2,450
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: { xs: '0.65rem', sm: '0.68rem' }, color: '#B45309' }}>
              4.9
            </Typography>
          </Box>
        </Box>

        {/* Story Quote (Shown on Tablet & Desktop, hidden on XS to keep mobile view super clean) */}
        <Typography
          variant="caption"
          sx={{
            color: '#486581',
            display: { xs: 'none', sm: '-webkit-box' },
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: { sm: '0.68rem', md: '0.72rem' },
            lineHeight: 1.4,
            mb: 0.6,
            fontStyle: 'italic',
          }}
        >
          "อ่านจบแล้วประทับใจมาก ส่งต่อให้เพื่อนนักอ่านคนต่อไปได้เพลิดเพลินเหมือนกัน"
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: { xs: 0.25, sm: 0.5 }, borderTop: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 } }}>
            <AvatarGroup
              max={3}
              sx={{
                '& .MuiAvatar-root': {
                  width: { xs: 16, sm: 18, md: 20 },
                  height: { xs: 16, sm: 18, md: 20 },
                  fontSize: '0.55rem',
                  border: '1.5px solid #FFFFFF',
                },
              }}
            >
              <Avatar alt="Karn" sx={{ bgcolor: '#0284C7' }}>K</Avatar>
              <Avatar alt="Ploy" sx={{ bgcolor: '#EA580C' }}>P</Avatar>
              <Avatar alt="Mint" sx={{ bgcolor: '#10B981' }}>M</Avatar>
            </AvatarGroup>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.68rem' }, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>
              ส่งต่อแล้ว 3 รอบ
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: '#EA580C' }}>
            <HeartIcon sx={{ fontSize: 11 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, fontWeight: 700 }}>
              38
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
