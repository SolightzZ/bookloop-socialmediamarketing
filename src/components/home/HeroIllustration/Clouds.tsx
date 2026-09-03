import React from 'react';
import { motion } from 'motion/react';
import { motionConfig } from './motionConfig';

interface CloudProps {
  cx: number;
  cy: number;
  width: number;
  opacity: number;
  duration: number;
  delay?: number;
}

const Cloud: React.FC<CloudProps> = ({ cx, cy, width, opacity, duration, delay = 0 }) => {
  const hw = width * 0.5;
  return (
    <motion.g
      style={{ opacity }}
      animate={{ x: [-10, 10, -10] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <ellipse cx={cx} cy={cy} rx={hw * 0.5} ry={hw * 0.28} fill="#D6E8F5" />
      <ellipse cx={cx - hw * 0.32} cy={cy + hw * 0.06} rx={hw * 0.38} ry={hw * 0.22} fill="#D6E8F5" />
      <ellipse cx={cx + hw * 0.35} cy={cy + hw * 0.08} rx={hw * 0.3} ry={hw * 0.2} fill="#D6E8F5" />
    </motion.g>
  );
};

interface CloudsProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
}

export const Clouds: React.FC<CloudsProps> = ({ shouldAnimate, getDur }) => {
  const { cloudA, cloudB, cloudC } = motionConfig.clouds;

  if (!shouldAnimate) {
    return (
      <g opacity={0.4}>
        <ellipse cx="90" cy="52" rx="40" ry="20" fill="#D6E8F5" />
        <ellipse cx="65" cy="57" rx="30" ry="16" fill="#D6E8F5" />
        <ellipse cx="115" cy="60" rx="26" ry="15" fill="#D6E8F5" />
        <ellipse cx="290" cy="42" rx="35" ry="18" fill="#D6E8F5" />
        <ellipse cx="420" cy="65" rx="30" ry="15" fill="#D6E8F5" />
      </g>
    );
  }

  return (
    <g>
      <Cloud cx={90} cy={52} width={100} opacity={cloudA.opacity} duration={getDur(cloudA.duration)} delay={0} />
      <Cloud cx={290} cy={42} width={80} opacity={cloudB.opacity} duration={getDur(cloudB.duration)} delay={4} />
      <Cloud cx={420} cy={65} width={90} opacity={cloudC.opacity} duration={getDur(cloudC.duration)} delay={8} />
      <Cloud cx={185} cy={85} width={55} opacity={0.2} duration={getDur(55)} delay={12} />
    </g>
  );
};
