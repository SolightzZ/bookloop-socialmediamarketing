import React from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';
import { Clouds } from './Clouds';

interface BackgroundProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
}

export const Background: React.FC<BackgroundProps> = ({ shouldAnimate, getDur }) => {
  return (
    <g id="hero-layer-background">
      <defs>
        <linearGradient id="bl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4F0FA" />
          <stop offset="35%" stopColor="#FFF6ED" />
          <stop offset="100%" stopColor="#FDE8CE" />
        </linearGradient>
        <radialGradient id="bl-sun" cx="0.7" cy="0.22">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity={0} />
        </radialGradient>
        {/* Soft glow behind girl area — focal point emphasis */}
        <radialGradient id="bl-girl-glow" cx="0.67" cy="0.5">
          <stop offset="0%" stopColor="#FFF0E0" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#FFF0E0" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Sky base */}
      <rect x="0" y="0" width="520" height="440" fill="url(#bl-sky)" />

      {/* Sun glow */}
      <circle cx="390" cy="70" r="130" fill="url(#bl-sun)" />

      {/* Warm glow behind girl — draws eye to focal point */}
      <rect x="0" y="0" width="520" height="440" fill="url(#bl-girl-glow)" />

      {/* Ambient light — subtle warm pulse */}
      <motion.ellipse
        cx="350" cy="180" rx="200" ry="160" fill="#FDE68A"
        animate={shouldAnimate ? { opacity: kf(motionConfig.light.cycle.opacity) } : { opacity: 0.05 }}
        transition={shouldAnimate ? { duration: getDur(motionConfig.light.cycle.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      {/* Window frame — more visible, warm wood tone */}
      <g opacity={0.28}>
        <rect x="28" y="18" width="464" height="305" rx="8" fill="none" stroke="#B8845A" strokeWidth="3.5" />
        <line x1="260" y1="18" x2="260" y2="323" stroke="#B8845A" strokeWidth="2.5" />
        <line x1="28" y1="170" x2="492" y2="170" stroke="#B8845A" strokeWidth="2.5" />
      </g>

      {/* Window light rays — subtle */}
      <path d="M 28 18 L 120 170 L 28 323 Z" fill="#FFF8E8" opacity={0.08} />
      <path d="M 260 18 L 350 170 L 260 323 Z" fill="#FFF8E8" opacity={0.06} />

      {/* Clouds */}
      <Clouds shouldAnimate={shouldAnimate} getDur={getDur} />

      {/* Floor */}
      <rect x="0" y="395" width="520" height="45" fill="#E2D5C4" opacity={0.65} />
      <line x1="0" y1="395" x2="520" y2="395" stroke="#CCBBA8" strokeWidth="1.5" opacity={0.45} />
      {/* Floor texture lines */}
      <line x1="0" y1="410" x2="520" y2="410" stroke="#CCBBA8" strokeWidth="0.5" opacity={0.2} />
      <line x1="0" y1="425" x2="520" y2="425" stroke="#CCBBA8" strokeWidth="0.5" opacity={0.15} />
    </g>
  );
};
