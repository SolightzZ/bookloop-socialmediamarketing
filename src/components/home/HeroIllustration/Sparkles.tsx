import React from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';

interface SparkleProps {
  cx: number; cy: number; size: number;
  duration: number; delay: number; color: string;
  variant?: 'star' | 'dot' | 'diamond';
}

const Sparkle: React.FC<SparkleProps> = ({ cx, cy, size, duration, delay, color, variant = 'star' }) => {
  const render = () => {
    switch (variant) {
      case 'star':
        return (
          <path
            d={`M ${cx} ${cy - size} L ${cx + size * 0.3} ${cy - size * 0.3} L ${cx + size} ${cy} L ${cx + size * 0.3} ${cy + size * 0.3} L ${cx} ${cy + size} L ${cx - size * 0.3} ${cy + size * 0.3} L ${cx - size} ${cy} L ${cx - size * 0.3} ${cy - size * 0.3} Z`}
            fill={color}
          />
        );
      case 'diamond':
        return (
          <path
            d={`M ${cx} ${cy - size} L ${cx + size * 0.6} ${cy} L ${cx} ${cy + size} L ${cx - size * 0.6} ${cy} Z`}
            fill={color}
          />
        );
      default:
        return <circle cx={cx} cy={cy} r={size * 0.5} fill={color} />;
    }
  };

  return (
    <motion.g
      animate={{ opacity: kf([0, 1, 0]), scale: kf([0.8, 1.1, 0.8]) }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {render()}
    </motion.g>
  );
};

interface SparklesProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
  isHovered: boolean;
}

export const Sparkles: React.FC<SparklesProps> = ({ shouldAnimate, getDur, isHovered }) => {
  const baseOpacity = isHovered ? 1 : 0.85;
  const { pulse } = motionConfig.sparkles;
  const dur = getDur(pulse.duration);

  if (!shouldAnimate) {
    return (
      <g id="hero-layer-sparkles" opacity={0.45}>
        <circle cx="102" cy="118" r="2.5" fill="#F59E0B" />
        <circle cx="462" cy="148" r="2" fill="#38BDF8" />
        <circle cx="78" cy="348" r="2" fill="#FBBF24" />
        <path d="M 482 198 L 484 194 L 486 198 L 482 198" fill="#F59E0B" />
        <circle cx="152" cy="48" r="1.5" fill="#FDE68A" />
      </g>
    );
  }

  return (
    <g id="hero-layer-sparkles" opacity={baseOpacity}>
      <Sparkle cx={102} cy={118} size={5} duration={dur} delay={0} color="#F59E0B" variant="star" />
      <Sparkle cx={462} cy={148} size={3.5} duration={dur} delay={1.2} color="#38BDF8" variant="dot" />
      <Sparkle cx={78} cy={348} size={4} duration={dur} delay={2.5} color="#FBBF24" variant="diamond" />
      <Sparkle cx={482} cy={198} size={3} duration={dur} delay={0.8} color="#FDE68A" variant="star" />
      <Sparkle cx={152} cy={48} size={2.5} duration={dur} delay={3.2} color="#FDE68A" variant="dot" />

      {/* Particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`p${i}`}
          cx={120 + i * 160} cy={60 + i * 130} r={1.5} fill="#FDE68A"
          animate={{ y: kf([0, -4, 0]), opacity: kf([0.2, 0.6, 0.2]) }}
          transition={{ duration: 5 + i, delay: i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
};
