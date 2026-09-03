import React from 'react';

/**
 * LoginBackground component.
 * Provides a calm, editorial, atmospheric background for the BookLoop Login Page.
 * - Layered at z-index: 0 with pointer-events: none so it never blocks input, buttons, or links.
 * - Contains 2 soft ambient orbs, 2-3 floating book/page shapes, a subtle paper dot matrix,
 *   and an optional delicate curved page flow line.
 * - Strictly respects prefers-reduced-motion.
 */
export const LoginBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* --------------------------------------------------
          1. SUBTLE EDITORIAL DOT PATTERN
          Barely visible texture (opacity ~0.03) for tactile paper feel
          -------------------------------------------------- */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="bookloop-login-dots"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#0F2D4A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bookloop-login-dots)" />
      </svg>

      {/* --------------------------------------------------
          2. DELICATE PAGE FLOW LINE (Read → Share → Repeat)
          Very subtle, low opacity organic curve
          -------------------------------------------------- */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] hidden md:block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <path
          d="M-100,200 C300,100 500,450 720,380 C940,310 1100,600 1600,450"
          stroke="#1976D2"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
      </svg>

      {/* --------------------------------------------------
          3. AMBIENT ORBS (Calm, slow drifting gradients)
          -------------------------------------------------- */}

      {/* Orb A: BookLoop Blue (#1976D2) - Upper Left */}
      <div
        className="bl-animate-drift-1 absolute -top-[12%] -left-[8%] sm:left-[2%] h-[340px] w-[340px] sm:h-[460px] sm:w-[460px] md:h-[540px] md:w-[540px] rounded-full opacity-[0.05] sm:opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #1976D2 0%, rgba(25, 118, 210, 0) 70%)',
        }}
      />

      {/* Orb B: Soft Sky (#EAF4FF / Cyan tint) - Lower Right */}
      <div
        className="bl-animate-drift-2 absolute -bottom-[10%] -right-[6%] sm:right-[3%] h-[320px] w-[320px] sm:h-[440px] sm:w-[440px] md:h-[500px] md:w-[500px] rounded-full opacity-[0.05] sm:opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, rgba(234, 244, 255, 0) 70%)',
        }}
      />

      {/* --------------------------------------------------
          4. FLOATING BOOK & PAGE SHAPES (Gentle 5-10px float)
          -------------------------------------------------- */}

      {/* Shape 1: Floating Open Book (Upper Right, desktop/tablet only) */}
      <div
        className="bl-animate-float-1 absolute top-[16%] right-[8%] sm:right-[14%] opacity-[0.07] hidden sm:block"
        style={{ transform: 'rotate(-6deg)' }}
      >
        <svg
          width="40"
          height="30"
          viewBox="0 0 44 32"
          fill="none"
          stroke="#1976D2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 26C16 23 8 23 2 26V6C8 3 16 3 22 6V26Z" />
          <path d="M22 26C28 23 36 23 42 26V6C36 3 28 3 22 6V26Z" />
        </svg>
      </div>

      {/* Shape 2: Floating Standing Book (Lower Left) */}
      <div
        className="bl-animate-float-2 absolute bottom-[20%] left-[6%] sm:left-[12%] opacity-[0.06] hidden sm:block"
        style={{ transform: 'rotate(8deg)' }}
      >
        <svg
          width="28"
          height="38"
          viewBox="0 0 32 42"
          fill="none"
          stroke="#0F2D4A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="3" width="24" height="36" rx="2.5" />
          <line x1="10" y1="3" x2="10" y2="39" />
          <line x1="14" y1="12" x2="22" y2="12" />
          <line x1="14" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Shape 3: Gentle Story Spark (Upper Mid, Desktop only) */}
      <div
        className="bl-animate-float-3 absolute top-[28%] left-[28%] opacity-[0.05] hidden lg:block"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1976D2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>
    </div>
  );
};
