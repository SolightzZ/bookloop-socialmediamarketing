import React from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';

interface FloatingBooksProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
}

export const FloatingBooks: React.FC<FloatingBooksProps> = ({ shouldAnimate, getDur }) => {
  const fb = motionConfig.floatingBooks;
  const pp = motionConfig.paperPlane;
  const bi = motionConfig.bookIcon;

  return (
    <g id="hero-layer-floating">
      {/* ── Floating Book A (upper right) ── */}
      <motion.g
        style={{ transformOrigin: '442px 58px' }}
        animate={shouldAnimate ? { y: kf(fb.bookA.y), rotate: kf(fb.bookA.rotate) } : undefined}
        transition={shouldAnimate ? { duration: getDur(fb.bookA.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* Open book shape */}
        <path d="M 422 48 Q 442 40 462 48 L 462 70 Q 442 62 422 70 Z" fill="#E8913A" opacity={0.8} />
        <path d="M 424 50 Q 442 44 442 50 L 442 68 Q 442 62 424 68 Z" fill="#FFFBEB" opacity={0.9} />
        <path d="M 442 50 Q 442 44 460 50 L 460 68 Q 442 62 442 68 Z" fill="#FEF3C7" opacity={0.9} />
        <line x1="442" y1="48" x2="442" y2="69" stroke="#D07828" strokeWidth="1" />
        {/* Small page detail */}
        <path d="M 447 48 L 447 56 L 450 53 L 453 56 L 453 48" fill="#EF4444" opacity={0.6} />
        {/* Soft glow */}
        <circle cx="442" cy="58" r="16" fill="#E8913A" opacity={0.06} />
      </motion.g>

      {/* ── Floating Book B (left side) ── */}
      <motion.g
        style={{ transformOrigin: '48px 198px' }}
        animate={shouldAnimate ? { x: kf(fb.bookB.x), rotate: kf(fb.bookB.rotate) } : undefined}
        transition={shouldAnimate ? { duration: getDur(fb.bookB.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <rect x="33" y="183" width="30" height="38" rx="2" fill="#1976D2" opacity={0.75} />
        <rect x="35" y="185" width="26" height="34" rx="1" fill="#E3F2FD" opacity={0.8} />
        <line x1="48" y1="183" x2="48" y2="221" stroke="#1976D2" strokeWidth="1.5" />
        <line x1="39" y1="193" x2="54" y2="193" stroke="#90CAF9" strokeWidth="0.8" />
        <line x1="39" y1="198" x2="50" y2="198" stroke="#90CAF9" strokeWidth="0.8" />
        <circle cx="48" cy="202" r="14" fill="#1976D2" opacity={0.05} />
      </motion.g>

      {/* ── Floating Book C (lower left) ── */}
      <motion.g
        style={{ transformOrigin: '68px 382px' }}
        animate={shouldAnimate ? { x: kf(fb.bookC.x), y: kf(fb.bookC.y), rotate: kf(fb.bookC.rotate) } : undefined}
        transition={shouldAnimate ? { duration: getDur(fb.bookC.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <rect x="53" y="368" width="25" height="32" rx="2" fill="#388E3C" opacity={0.65} transform="rotate(-8, 65, 384)" />
        <rect x="55" y="370" width="21" height="28" rx="1" fill="#E8F5E9" opacity={0.8} transform="rotate(-8, 65, 384)" />
      </motion.g>

      {/* ── Paper plane (gentle drift) ── */}
      <motion.g
        style={{ transformOrigin: '102px 138px' }}
        animate={shouldAnimate ? { x: kf(pp.x), y: kf(pp.y), rotate: kf(pp.rotate) } : undefined}
        transition={shouldAnimate ? { duration: getDur(pp.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <polygon points="87,138 122,126 107,146" fill="#FDE047" opacity={0.8} />
        <polygon points="122,126 107,146 114,134" fill="#FACC15" opacity={0.8} />
        <polygon points="87,138 122,126 114,134" fill="#FEF9C3" opacity={0.9} />
        {/* Trail */}
        <line x1="84" y1="139" x2="72" y2="143" stroke="#FDE047" strokeWidth="0.8" opacity={0.3} strokeDasharray="2 2" />
      </motion.g>

      {/* ── Book icon (orange floating, organic) ── */}
      <motion.g
        style={{ transformOrigin: '472px 98px' }}
        animate={shouldAnimate ? { y: kf(bi.float.y), rotate: kf(bi.float.rotate) } : undefined}
        transition={shouldAnimate ? { duration: getDur(bi.float.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <rect x="460" y="86" width="24" height="30" rx="3" fill="none" stroke="#E8913A" strokeWidth="2" opacity={0.65} />
        <line x1="472" y1="86" x2="472" y2="116" stroke="#E8913A" strokeWidth="1.5" opacity={0.45} />
        <circle cx="472" cy="101" r="18" fill="#E8913A" opacity={0.05} />
      </motion.g>
    </g>
  );
};
